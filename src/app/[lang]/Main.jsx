import Hero from './components/Hero'
import AboutIntro from './components/AboutIntro'
import Services from './components/Services'
import Technologies from './components/Technologies'
import Contact from './components/Contact'
import Footer from '../../components/layout/Footer/Footer'

function Main({ currentLocale, languageLabel }) {
  return (
    <main className="main">
      <Hero currentLocale={currentLocale} languageLabel={languageLabel} />
      <AboutIntro />
      <Services />
      <Technologies />
      <Contact />
      <Footer />
    </main>
  )
}

export default Main
