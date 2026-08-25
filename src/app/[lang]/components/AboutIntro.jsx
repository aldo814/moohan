'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoAbout from '../../../assets/images/main/logo_about.svg'
import logoAboutSymbol from '../../../assets/images/main/logo_about_symbol.svg'
import aboutImage01 from '../../../assets/images/main/img_about_01.png'
import aboutImage02 from '../../../assets/images/main/img_about_02.png'
import aboutImage03 from '../../../assets/images/main/img_about_03.png'
import aboutImage04 from '../../../assets/images/main/img_about_04.png'

gsap.registerPlugin(ScrollTrigger)

const aboutCopy = `Since our founding in 2006, we have provided high-quality patent translation across diverse technology fields — including patent application specifications, office action documents, and IP and litigation-related materials. Not content to rely solely on our translators' accumulated expertise, we have integrated a cloud-based translation management system (TMS) and intelligent translation support technology into our workflow to ensure more precise and consistent quality.`

function AboutIntro() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const logoRef = useRef(null)
  const logoBaseRef = useRef(null)
  const descriptionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const logo = logoRef.current
    const logoBase = logoBaseRef.current
    const description = descriptionRef.current
    const visuals = gsap.utils.toArray('.about-intro__visual', section)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobileLayout = window.matchMedia('(max-width: 64rem)').matches
    if (!section || !track || !logo || !logoBase || !description || reduceMotion || mobileLayout) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=3600',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .to(logo, { opacity: 0.4, duration: 0.8, ease: 'none' })
        .to(logo, { opacity: 1, duration: 0.8, ease: 'none' })
        .to(track, {
          y: () => -(track.getBoundingClientRect().height * (2313 / 1402) + window.innerHeight * 0.2),
          duration: 7.2,
          ease: 'none',
        }, 0)
        .to(visuals[0], { y: () => -window.innerHeight * 0.12, duration: 7.2, ease: 'none' }, 0)
        .to(visuals[1], { y: () => window.innerHeight * 0.08, duration: 7.2, ease: 'none' }, 0)
        .to(visuals[2], { y: () => -window.innerHeight * 0.18, duration: 7.2, ease: 'none' }, 0)
        .to(visuals[3], { y: () => window.innerHeight * 0.1, duration: 7.2, ease: 'none' }, 0)
        .to(section, { backgroundColor: '#23262c', duration: 1.6, ease: 'none' }, 1.6)
        .to(logoBase, { filter: 'invert(1) brightness(2)', duration: 1.6, ease: 'none' }, 1.6)
        .to(description, { color: '#ffffff', duration: 1.6, ease: 'none' }, 1.6)
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section className="about-intro" id="about" aria-label="About Moohan" ref={sectionRef}>
      <div className="about-intro__stage">
        <div className="about-intro__logo" aria-hidden="true" ref={logoRef}>
          <Image className="about-intro__logo-base" src={logoAbout} alt="" width={219} height={46} ref={logoBaseRef} />
          <Image className="about-intro__logo-symbol" src={logoAboutSymbol} alt="" width={67} height={34} />
        </div>
        <div className="about-intro__track" ref={trackRef}>
          <figure className="about-intro__visual about-intro__visual--one"><Image src={aboutImage01} alt="" width={876} height={611} /></figure>
          <figure className="about-intro__visual about-intro__visual--two"><Image src={aboutImage02} alt="" width={925} height={606} /></figure>
          <figure className="about-intro__visual about-intro__visual--three"><Image src={aboutImage03} alt="" width={812} height={601} /></figure>
          <figure className="about-intro__visual about-intro__visual--four"><Image src={aboutImage04} alt="" width={1072} height={611} /></figure>
        </div>
        <p className="about-intro__description" ref={descriptionRef}>{aboutCopy}</p>
      </div>
    </section>
  )
}

export default AboutIntro
