import DesignText from '../../../components/common/DesignText'
import Image from "next/image";
import Header from "../../../components/layout/Header/Header";
import mouseIcon from "../../../assets/images/main/ico_mouse.svg";

function Hero({ currentLocale, languageLabel, dictionary }) {
  const { hero } = dictionary.home;
  return (
    <section className="hero" id="top">
      <video
        className="hero__background pc_show"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/main/video_hero_pc.webm" type="video/webm" />
        <source src="/videos/main/video_hero_pc.mp4" type="video/mp4" />
      </video>
      <video
        className="hero__background m_show"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/main/video_hero_mobile.webm" type="video/webm" />
        <source src="/videos/main/video_hero_mobile.mp4" type="video/mp4" />
      </video>
      <div className="hero__overlay" />
      <Header
        currentLocale={currentLocale}
        languageLabel={languageLabel}
        dictionary={dictionary.common}
      />

      <div className="inner hero__content">
        <h1 className="hero__title">
          {hero.titleLine1}
          <br />
          {hero.titleLine2}
        </h1>
        <p className="hero__description"><DesignText text={hero.description} /></p>
      </div>

      <a className="hero__scroll" href="#about" aria-label={hero.scrollDown}>
        <span className="hero__scroll-label">{hero.scrollDown}</span>
        <Image
          className="hero__scroll-icon"
          src={mouseIcon}
          alt=""
          width={17}
          height={22}
        />
      </a>
    </section>
  );
}

export default Hero;
