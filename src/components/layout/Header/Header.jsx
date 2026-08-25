import Image from 'next/image'
import { LanguageSwitcher } from '../../language-switcher'
import PillButton from '../../common/PillButton/PillButton'
import logo from '../../../assets/images/common/logo_moohan.svg'
import logoSymbol from '../../../assets/images/common/logo_moohan_symbol.svg'
import userIcon from '../../../assets/images/common/ico_user.svg'

function Header({ currentLocale, languageLabel, dictionary }) {
  const navigation = [
    { label: dictionary.navigation.about, href: '#about' },
    { label: dictionary.navigation.services, href: '#services' },
    { label: dictionary.navigation.technologies, href: '#technologies' },
    { label: dictionary.navigation.contact, href: '#contact' },
  ]
  return (
    <header className="header">
      <a className="header__logo-link" href="#top" aria-label={dictionary.homeLabel}>
        <span className="header__logo" aria-hidden="true">
          <Image className="header__logo-base" src={logo} alt="" width={164} height={34} />
          <Image className="header__logo-symbol" src={logoSymbol} alt="" width={50} height={25} />
        </span>
        <span className="header__sr-only">Moohan</span>
      </a>

      <nav className="header__nav" aria-label={dictionary.primaryNavigation}>
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
        <PillButton href="#login" icon={userIcon}>{dictionary.login}</PillButton>
        <LanguageSwitcher current={currentLocale} label={languageLabel} />
      </div>
    </header>
  )
}

export default Header
