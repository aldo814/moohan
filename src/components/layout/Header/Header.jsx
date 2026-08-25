import Image from 'next/image'
import { LanguageSwitcher } from '../../language-switcher'
import PillButton from '../../common/PillButton/PillButton'
import logo from '../../../assets/images/common/logo_moohan.svg'
import logoSymbol from '../../../assets/images/common/logo_moohan_symbol.svg'
import userIcon from '../../../assets/images/common/ico_user.svg'

const navigation = [
  { label: 'ABOUT US', href: '#about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'TECHNOLOGIES', href: '#technologies' },
  { label: 'CONTACT US', href: '#contact' },
]

function Header({ currentLocale, languageLabel }) {
  return (
    <header className="header">
      <a className="header__logo-link" href="#top" aria-label="Moohan home">
        <span className="header__logo" aria-hidden="true">
          <Image className="header__logo-base" src={logo} alt="" width={164} height={34} />
          <Image className="header__logo-symbol" src={logoSymbol} alt="" width={50} height={25} />
        </span>
        <span className="header__sr-only">Moohan</span>
      </a>

      <nav className="header__nav" aria-label="Primary navigation">
        <ul className="header__nav-list">
          {navigation.map((item) => (
            <li className="header__nav-item" key={item.label}>
              <a className="header__nav-link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header__actions">
        <PillButton href="#login" icon={userIcon}>TMS Login</PillButton>
        <LanguageSwitcher current={currentLocale} label={languageLabel} />
      </div>
    </header>
  )
}

export default Header
