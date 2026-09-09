'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

function LegalModal({ isOpen, title, content, closeLabel, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previouslyFocusedElement = document.activeElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="legal-modal" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="legal-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        tabIndex="-1"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="legal-modal__header">
          <h3 id="legal-modal-title">{title}</h3>
          <button type="button" onClick={onClose} aria-label={closeLabel}>
            <X aria-hidden="true" strokeWidth={1.5} />
          </button>
        </header>
        <div className="legal-modal__content">
          {content.map((paragraph, index) => <p key={`${title}-${index}`}>{paragraph}</p>)}
        </div>
      </section>
    </div>
  )
}

export default LegalModal
