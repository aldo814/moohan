import { spawn } from 'node:child_process'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RECIPIENT_EMAIL = process.env.CONTACT_TO_EMAIL || '0sister16@gmail.com'
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'gif', 'docx', 'pptx', 'md', 'pdf'])

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

function sendMail(message: Buffer) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('/usr/sbin/sendmail', ['-t', '-i'], {
      stdio: ['pipe', 'ignore', 'pipe'],
    })
    let errorOutput = ''

    child.stderr.on('data', (chunk) => {
      errorOutput += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(errorOutput || `sendmail exited with code ${code}`))
    })

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

  if (!firstName || !lastName || !email || !inquiry) {
    return json('Please complete all required fields.', 422)
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json('Please enter a valid email address.', 422)
  }

  const attachments = formData
    .getAll('attachments[]')
    .filter((item): item is File => item instanceof File && item.size > 0)

  for (const attachment of attachments) {
    const extension = attachment.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTENSIONS.has(extension) || attachment.size > MAX_ATTACHMENT_SIZE) {
      return json('Only JPG, JPEG, GIF, DOCX, PPTX, MD, and PDF files up to 10 MB are allowed.', 422)
    }
  }

  const safeEmail = cleanHeader(email)
  const senderName = cleanHeader(`${firstName} ${lastName}`)
  const subject = `[Moohan Website] Contact from ${senderName}`
  const textBody = [
    `Name: ${firstName} ${lastName}`,
    `Company: ${company || '-'}`,
    `Email: ${email}`,
    `Phone: ${phone || '-'}`,
    '',
    'Message:',
    inquiry,
  ].join('\r\n')

  const boundary = `moohan_${crypto.randomUUID().replaceAll('-', '')}`
  const parts: Buffer[] = [
    Buffer.from(
      [
        `To: ${RECIPIENT_EMAIL}`,
        `From: Moohan Website <no-reply@mthome.hankyeul.com>`,
        `Reply-To: ${safeEmail}`,
        `Subject: ${encodeHeader(subject)}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        Buffer.from(textBody).toString('base64').replace(/.{76}/g, '$&\r\n'),
        '',
      ].join('\r\n'),
    ),
  ]

  for (const attachment of attachments) {
    const fileName = cleanFileName(attachment.name)
    const fileBuffer = Buffer.from(await attachment.arrayBuffer())
    const encodedFile = fileBuffer.toString('base64').replace(/.{76}/g, '$&\r\n')
    parts.push(
      Buffer.from(
        [
          `--${boundary}`,
          `Content-Type: ${attachment.type || 'application/octet-stream'}; name="${fileName}"`,
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${fileName}"`,
          '',
          encodedFile,
          '',
        ].join('\r\n'),
      ),
    )
  }

  parts.push(Buffer.from(`--${boundary}--\r\n`))

  try {
    await sendMail(Buffer.concat(parts))
    return json('Your inquiry has been sent successfully.', 200, true)
  } catch (error) {
    console.error('Contact mail failed:', error)
    return json('Unable to send your inquiry. Please try again later.', 500)
  }
}
