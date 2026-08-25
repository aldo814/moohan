
import Image from 'next/image'

function PillButton({ children, href = '#', icon, trailingIcon, ariaLabel }) {
  return (
    <a className="pill-button" href={href} aria-label={ariaLabel}>
      {icon && <Image className="pill-button__icon" src={icon} alt="" width={16} height={16} />}
      <span className="pill-button__label">{children}</span>
      {trailingIcon && (
        <Image className="pill-button__icon pill-button__icon--small" src={trailingIcon} alt="" width={12} height={12} />
      )}
    </a>
  )
}

export default PillButton
