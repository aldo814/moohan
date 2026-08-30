import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import Services from './components/Services'
import Technologies from './components/Technologies'
import Contact from './components/Contact'
import Footer from '../../components/layout/Footer/Footer'

function Main({ currentLocale, languageLabel, dictionary }) {
  return (
    <main className="main">
      <Hero currentLocale={currentLocale} languageLabel={languageLabel} dictionary={dictionary} />
      <div className="about-services">
        <AboutIntro dictionary={dictionary.home.about} />
        <Services dictionary={dictionary.home.services} />
      </div>
      <Technologies dictionary={dictionary.home.technologies} />
      <Contact dictionary={dictionary.home.contact} />
      <Footer common={dictionary.common} dictionary={dictionary.home.footer} />
    </main>
  )
}

export default Main
