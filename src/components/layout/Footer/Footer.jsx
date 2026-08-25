import Image from 'next/image'
import logo from '../../../assets/images/common/logo_moohan.svg'
import logoSymbol from '../../../assets/images/common/logo_moohan_symbol.svg'

function Footer({ common, dictionary }) {
  const navigation = [
    { label: common.navigation.home, href: '#top' },
    { label: common.navigation.about, href: '#about' },
    { label: common.navigation.services, href: '#services' },
    { label: common.navigation.technologies, href: '#technologies' },
    { label: common.navigation.contact, href: '#contact' },
  ]
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__main">
          <a className="footer__logo-link" href="#top" aria-label={common.homeLabel}>
            <span className="footer__logo" aria-hidden="true">
              <Image className="footer__logo-base" src={logo} alt="" width={164} height={34} />
              <Image className="footer__logo-symbol" src={logoSymbol} alt="" width={50} height={25} />
            </span>
          </a>

          <nav className="footer__nav" aria-label={common.footerNavigation}>
            {navigation.map((item) => (
              <a className="footer__nav-link" href={item.href} key={item.label}>{item.label}</a>
            ))}
          </nav>

          <div className="footer__info-column footer__info-column--primary">
          <div className="footer__info">
            <span className="footer__label">{dictionary.tel}</span>
            <a className="footer__value footer__value--large" href="tel:+8225647789">+82-2-564-7789</a>
          </div>
          <div className="footer__info">
            <span className="footer__label">{dictionary.address}</span>
            <address className="footer__value footer__value--address">{dictionary.addressValue}</address>
          </div>
          </div>

          <div className="footer__info-column footer__info-column--secondary">
          <div className="footer__info">
            <span className="footer__label">{dictionary.fax}</span>
            <span className="footer__value footer__value--large">+82-2-6442-0787</span>
          </div>
          <div className="footer__info">
            <span className="footer__label">{dictionary.contact}</span>
            <a className="footer__value footer__value--contact" href="mailto:info@mttrans.co.kr">info@mttrans.co.kr</a>
          </div>
          </div>
        </div>
        <a className="footer__top" href="#top" aria-label={common.backToTop}>↑</a>
        <p className="footer__copyright">{dictionary.copyright}</p>
      </div>
    </footer>
  )
}

export default Footer
