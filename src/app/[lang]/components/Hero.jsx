import Image from 'next/image'
import Header from '../../../components/layout/Header/Header'
import scrollRing from '../../../assets/images/main/bg_scroll_indicator.svg'
import mouseIcon from '../../../assets/images/main/ico_mouse.svg'

function Hero({ currentLocale, languageLabel }) {
  return (
    <section className="hero" id="top">
      <video className="hero__background pc_show" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
        <source src="/videos/main/video_hero_pc.webm" type="video/webm" />
        <source src="/videos/main/video_hero_pc.mp4" type="video/mp4" />
      </video>
      <video className="hero__background m_show" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
        <source src="/videos/main/video_hero_mobile.webm" type="video/webm" />
        <source src="/videos/main/video_hero_mobile.mp4" type="video/mp4" />
      </video>
      <div className="hero__overlay" />
      <Header currentLocale={currentLocale} languageLabel={languageLabel} />

      <div className="inner hero__content">
        <h1 className="hero__title">
          Patent translation expertise since 2006.
          <br />
          Powered by cutting-edge AI
        </h1>
        <p className="hero__description">
          Since 2006, we have built deep expertise in patent translation — now enhanced by a
          cloud-based translation management system (TMS) and the latest AI technology. Our patent
          professionals, supported by AI-driven translation and verification tools, deliver precise,
          consistent translations that accurately support every stage of the patent lifecycle — from
          filing and examination to dispute resolution.
        </p>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to About us">
        <Image className="hero__scroll-ring" src={scrollRing} alt="" width={260} height={260} />
        <span className="hero__scroll-label">SCROLL DOWN</span>
        <Image className="hero__scroll-icon" src={mouseIcon} alt="" width={17} height={22} />
      </a>
    </section>
  )
}

export default Hero
