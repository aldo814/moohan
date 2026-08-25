'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import contactDecoration from '../../../assets/images/main/bg_contact_decoration.svg'
import contactUploadIcon from '../../../assets/images/main/ico_upload.svg'
import contactRemoveIcon from '../../../assets/images/main/ico_close.svg'

const initialForm = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  message: '',
}

function Contact() {
  const attachmentInputRef = useRef(null)
  const messageTextareaRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [attachments, setAttachments] = useState([])
  const [isDraggingAttachment, setIsDraggingAttachment] = useState(false)
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleMessageChange = (event) => {
    handleChange(event)
    event.currentTarget.style.height = 'auto'
    event.currentTarget.style.height = `${Math.max(60, event.currentTarget.scrollHeight)}px`
  }

  const addValidatedAttachments = (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return

    const invalidFile = files.find((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return !['jpg', 'jpeg', 'gif', 'pdf'].includes(extension) || file.size > 10 * 1024 * 1024
    })

    if (invalidFile) {
      setStatus('error')
      setFeedback('JPG, GIF, PDF 파일만 첨부할 수 있으며 파일당 최대 용량은 10MB입니다.')
      return
    }

    setAttachments((current) => {
      const existing = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`))
      return [...current, ...files.filter((file) => !existing.has(`${file.name}-${file.size}-${file.lastModified}`))]
    })
    setFeedback('')
    setStatus('idle')
  }

  const handleAttachmentChange = (event) => {
    addValidatedAttachments(event.target.files)
    event.target.value = ''
  }

  const handleAttachmentDrop = (event) => {
    event.preventDefault()
    setIsDraggingAttachment(false)
    addValidatedAttachments(event.dataTransfer.files)
  }

  const handleAttachmentRemove = (indexToRemove) => {
    setAttachments((current) => current.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setStatus('sending')
    setFeedback('')

    const body = new FormData()
    Object.entries(form).forEach(([key, value]) => body.append(key, value))
    attachments.forEach((file) => body.append('attachments[]', file))

    try {
      const response = await fetch('/api/contact.php', { method: 'POST', body })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to send your inquiry.')
      }

      setForm(initialForm)
      setAttachments([])
      if (attachmentInputRef.current) attachmentInputRef.current.value = ''
      if (messageTextareaRef.current) messageTextareaRef.current.style.height = '60px'
      formElement.reset()
      setStatus('success')
      setFeedback('Thank you. Your inquiry has been sent successfully.')
    } catch (error) {
      setStatus('error')
      setFeedback(error.message || 'Unable to send your inquiry. Please try again.')
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <Image className="contact__decoration" src={contactDecoration} alt="" width={540} height={586} />
      <div className="inner contact__inner">
        <div className="contact__intro">
          <h2 className="contact__title" id="contact-title">CONTACT US</h2>
          <p className="contact__description">
            Thank you for contacting us. Our team will review your inquiry and respond within 1 business day.
          </p>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="contact__row">
            <label className="contact__field">
              <span>First Name<b>*</b></span>
              <input name="firstName" value={form.firstName} onChange={handleChange} required autoComplete="given-name" placeholder=" " />
            </label>
            <label className="contact__field">
              <span>Last Name<b>*</b></span>
              <input name="lastName" value={form.lastName} onChange={handleChange} required autoComplete="family-name" placeholder=" " />
            </label>
          </div>

          <label className="contact__field">
            <span>Company</span>
            <input name="company" value={form.company} onChange={handleChange} autoComplete="organization" placeholder=" " />
          </label>

          <div className="contact__row">
            <label className="contact__field">
              <span>Email<b>*</b></span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" placeholder=" " />
            </label>
            <label className="contact__field">
              <span>Phone</span>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" placeholder=" " />
            </label>
          </div>

          <label className="contact__field contact__field--message">
            <span>Message<b>*</b></span>
            <textarea
              ref={messageTextareaRef}
              name="message"
              value={form.message}
              onChange={handleMessageChange}
              required
              rows="1"
              placeholder=" "
            />
          </label>

          <div className="contact__attachment">
            <div className="contact__attachment-header">
              <span className="contact__attachment-title">Attachment</span>
            </div>
            <input
              className="contact__attachment-input"
              id="contact-attachment"
              ref={attachmentInputRef}
              type="file"
              name="attachments[]"
              accept=".jpg,.jpeg,.gif,.pdf"
              multiple
              onChange={handleAttachmentChange}
            />
            <label
              htmlFor="contact-attachment"
              className={`contact__attachment-dropzone${isDraggingAttachment ? ' contact__attachment-dropzone--active' : ''}`}
              role="button"
              tabIndex="0"
              onDragEnter={() => setIsDraggingAttachment(true)}
              onDragLeave={() => setIsDraggingAttachment(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleAttachmentDrop}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  attachmentInputRef.current?.click()
                }
              }}
            >
              <Image className="contact__attachment-upload-icon" src={contactUploadIcon} alt="" width={54} height={49} />
              <div className="contact__attachment-guide">
                <p>첨부할 파일을 여기에 끌어 놓거나, 파일선택 버튼을 선택해주세요</p>
                <p>업로드 가능 파일 : JPG, GIF, PDF (최대 업로드 용량 : 10MB/각파일)</p>
              </div>
            </label>
            <div className="contact__attachment-controls">
              <div className="contact__attachment-status">
                {attachments.length > 0 ? `${attachments.length}개 파일이 선택되었습니다.` : '선택된 파일이 없습니다.'}
              </div>
              <label className="contact__attachment-button" htmlFor="contact-attachment">파일 선택</label>
            </div>
            <div className="contact__attachment-files" aria-live="polite">
              {attachments.map((attachment, index) => (
                <div className="contact__attachment-file" key={`${attachment.name}-${attachment.size}-${attachment.lastModified}`}>
                  <span>{attachment.name}</span>
                  <button type="button" onClick={() => handleAttachmentRemove(index)} aria-label={`${attachment.name} 삭제`}>
                    <Image src={contactRemoveIcon} alt="" width={8} height={8} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="contact__submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Submit'}
          </button>

          {feedback && (
            <p className={`contact__feedback contact__feedback--${status}`} role="status">
              {feedback}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
