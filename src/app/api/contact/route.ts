import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RECIPIENT_EMAIL = process.env.CONTACT_TO_EMAIL || '0sister16@gmail.com'
const SENDER_EMAIL = process.env.CONTACT_FROM_EMAIL || 'moohan@mttrans.co.kr'
const ARCHIVE_EMAIL = process.env.CONTACT_BCC_EMAIL || 'moohan@mttrans.co.kr'
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'gif', 'docx', 'pptx', 'xlsx', 'pdf'])
const SUPPORTED_LOCALES = new Set(['ko', 'en', 'ja', 'zh'])

type Locale = 'ko' | 'en' | 'ja' | 'zh'
type TemplateValues = Record<string, string>
type MailAttachment = { name: string; type: string; content: Buffer }

const CUSTOMER_SUBJECTS: Record<Locale, string> = {
  ko: '[무한기술번역] 문의가 접수되었습니다',
  en: '[MOOHAN] Your Inquiry Has Been Received',
  ja: '[無限技術翻訳] お問い合わせを承りました',
  zh: '[无限技术翻译]您的咨询已受理',
}

const ADMIN_SUBJECT_PREFIXES: Record<Locale, string> = {
  ko: '신규 문의',
  en: 'New Inquiry',
  ja: '新規お問い合わせ',
  zh: '新咨询',
}

function json(message: string, status: number, success = false) {
  return Response.json({ success, message }, { status })
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function cleanFileName(value: string) {
  return value.replace(/[\r\n"\\]/g, '_').trim() || 'attachment'
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value).toString('base64')}?=`
}

function encodeBase64(value: string | Buffer) {
  return Buffer.from(value).toString('base64').replace(/.{76}/g, '$&\r\n')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function htmlValue(value: string, fallback = '-') {
  return escapeHtml(value || fallback).replace(/\r?\n/g, '<br>')
}

function renderTemplate(template: string, values: TemplateValues) {
  return template.replace(/{{([a-z]+)}}/g, (_, key: string) => values[key] ?? '')
}

async function loadTemplate(kind: 'inquiry-received' | 'new-inquiry-admin', locale: Locale) {
  const filePath = path.join(process.cwd(), 'templates', 'email', `${kind}_${locale}.html`)
  return readFile(filePath, 'utf8')
}

function localizedName(locale: Locale, firstName: string, lastName: string) {
  if (locale === 'en') return `${firstName} ${lastName}`
  if (locale === 'zh') return `${lastName}${firstName}`
  return `${lastName} ${firstName}`
}

function buildMail({
  to,
  bcc,
  replyTo,
  subject,
  html,
  attachments = [],
}: {
  to: string
  bcc?: string
  replyTo?: string
  subject: string
  html: string
  attachments?: MailAttachment[]
}) {
  const boundary = `moohan_${crypto.randomUUID().replaceAll('-', '')}`
  const headers = [
    `To: ${cleanHeader(to)}`,
    `From: MOOHAN <${SENDER_EMAIL}>`,
  ]
  if (bcc) headers.push(`Bcc: ${cleanHeader(bcc)}`)
  if (replyTo) headers.push(`Reply-To: ${cleanHeader(replyTo)}`)
  headers.push(
    `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
  )
  const parts: Buffer[] = [
    Buffer.from([
      ...headers,
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      encodeBase64(html),
      '',
    ].join('\r\n')),
  ]

  for (const attachment of attachments) {
    const fileName = cleanFileName(attachment.name)
    parts.push(Buffer.from([
      `--${boundary}`,
      `Content-Type: ${attachment.type || 'application/octet-stream'}; name="${fileName}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${fileName}"`,
      '',
      encodeBase64(attachment.content),
      '',
    ].join('\r\n')))
  }

  parts.push(Buffer.from(`--${boundary}--\r\n`))
  return Buffer.concat(parts)
}

function sendMail(message: Buffer) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('/usr/sbin/sendmail', ['-t', '-i'], { stdio: ['pipe', 'ignore', 'pipe'] })
    let errorOutput = ''
    child.stderr.on('data', (chunk) => { errorOutput += chunk.toString() })
    child.on('error', reject)
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(errorOutput || `sendmail exited with code ${code}`)))
    child.stdin.on('error', reject)
    child.stdin.end(message)
  })
}

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return json('Invalid form data.', 400)
  }

  const firstName = String(formData.get('firstName') || '').trim()
  const lastName = String(formData.get('lastName') || '').trim()
  const company = String(formData.get('company') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const inquiry = String(formData.get('message') || '').trim()
  const requestedLocale = String(formData.get('lang') || 'ko').toLowerCase()
  const locale: Locale = SUPPORTED_LOCALES.has(requestedLocale) ? requestedLocale as Locale : 'ko'

  if (!firstName || !lastName || !email || !inquiry) return json('Please complete all required fields.', 422)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json('Please enter a valid email address.', 422)

  const files = formData.getAll('attachments[]').filter((item): item is File => item instanceof File && item.size > 0)
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.has(extension) || file.size > MAX_ATTACHMENT_SIZE) {
      return json('Only JPG, JPEG, GIF, DOCX, PPTX, XLSX, and PDF files up to 10 MB are allowed.', 422)
    }
  }

  const attachments: MailAttachment[] = await Promise.all(files.map(async (file) => ({
    name: file.name,
    type: file.type,
    content: Buffer.from(await file.arrayBuffer()),
  })))
  const attachmentNames = files.map((file) => file.name).join(', ')
  const customerName = localizedName(locale, firstName, lastName)
  const adminName = locale === 'en' ? `${lastName}, ${firstName}` : customerName
  const values = {
    name: htmlValue(customerName),
    company: htmlValue(company),
    email: htmlValue(email),
    phone: htmlValue(phone),
    inquiry: htmlValue(inquiry),
    attachment: htmlValue(attachmentNames),
  }

  try {
    const [customerTemplate, adminTemplate] = await Promise.all([
      loadTemplate('inquiry-received', locale),
      loadTemplate('new-inquiry-admin', locale),
    ])
    const customerHtml = renderTemplate(customerTemplate, values)
    const adminHtml = renderTemplate(adminTemplate, { ...values, name: htmlValue(adminName) })
    await Promise.all([
      sendMail(buildMail({
        to: email,
        bcc: ARCHIVE_EMAIL,
        subject: CUSTOMER_SUBJECTS[locale],
        html: customerHtml,
      })),
      sendMail(buildMail({
        to: RECIPIENT_EMAIL,
        replyTo: email,
        subject: `[${ADMIN_SUBJECT_PREFIXES[locale]}] ${cleanHeader(company || '-')}`,
        html: adminHtml,
        attachments,
      })),
    ])
    return json('Your inquiry has been sent successfully.', 200, true)
  } catch (error) {
    console.error('Contact mail failed:', error)
    return json('Unable to send your inquiry. Please try again later.', 500)
  }
}
