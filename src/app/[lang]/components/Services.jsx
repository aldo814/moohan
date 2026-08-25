'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { A11y, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import pctBackground from '../../../assets/images/main/bg_service_pct_national_phase.png'
import directFilingBackground from '../../../assets/images/main/bg_service_direct_filing.png'
import officeActionBackground from '../../../assets/images/main/bg_service_office_action.png'
import ipLitigationBackground from '../../../assets/images/main/bg_service_ip_litigation.png'
import 'swiper/css'

gsap.registerPlugin(ScrollTrigger)

const servicesIntro = 'Patent translation is a highly specialized field that demands both legal and technical accuracy, along with strict compliance with the regulations of patent offices around the world. We combine the precise work of translators specialized by technology field with intelligent translation support technology to deliver tailored translation services optimized for every stage of patent practice — from filing and examination to dispute resolution.'

const serviceSlides = [
  {
    number: '01',
    title: 'PCT National Phase Translation',
    description:
      'We provide PCT national phase entry translations that comply with the filing formats and regulations of patent offices worldwide.',
    background: pctBackground,
  },
  {
    number: '02',
    title: 'Direct Filing Translation',
    description:
      'We provide translations formatted appropriately for direct, individual filing with patent offices in each country within the priority claim period.',
    background: directFilingBackground,
  },
  {
    number: '03',
    title: 'Office Action Document Translation',
    description:
      'We provide translations of office action documents — including notices of reasons for refusal and decisions of rejection — as well as the corresponding responses and amendments.',
    background: officeActionBackground,
  },
  {
    number: '04',
    title: 'IP & Litigation Translation',
    description:
      'We provide translations of specialized documents requiring a high level of legal and technical understanding, including IP-related statutes, trial/appeal decisions, court rulings, and patent infringement and dispute materials.',
    background: ipLitigationBackground,
  },
]

function Services() {
  const sectionRef = useRef(null)
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobileLayout = window.matchMedia('(max-width: 64rem)').matches
    if (!section || reduceMotion || mobileLayout) return undefined

    const context = gsap.context(() => {
      const swiper = section.querySelector('.services__swiper')
      const intro = section.querySelector('.services__intro')
      const introCopy = section.querySelector('.services__intro-copy')
      const slideContent = section.querySelectorAll('.services__inner')
      const backgrounds = [...section.querySelectorAll('.services__background')]
      const contents = [...section.querySelectorAll('.services__content')]
      const numbers = [...section.querySelectorAll('.services__number')]
      const pagination = section.querySelector('.services__pagination')
      const animatedContent = [...slideContent, pagination]
      let currentScrollSlide = 0

      gsap.set(swiper, { yPercent: 100 })
      gsap.set(animatedContent, { opacity: 0 })
      gsap.set(backgrounds, { yPercent: 8, scale: 1.2 })
      gsap.set(contents, { y: 40 })
      gsap.set(numbers, { y: 20 })

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=7600',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const swiperInstance = swiperRef.current

            if (self.progress < 0.5) {
              gsap.set(backgrounds, { yPercent: 8 })
              gsap.set(contents, { y: 40 })
              gsap.set(numbers, { y: 20 })

              if (swiperInstance && currentScrollSlide !== 0) {
                currentScrollSlide = 0
                swiperInstance.slideTo(0, 700)
              }
              return
            }

            const slideProgress = gsap.utils.clamp(0, 0.9999, (self.progress - 0.5) / 0.5)
            const distributedProgress = slideProgress * serviceSlides.length
            const nextSlide = Math.floor(distributedProgress)
            const localProgress = distributedProgress - nextSlide

            gsap.set(backgrounds[nextSlide], { yPercent: gsap.utils.interpolate(8, -8, localProgress) })
            gsap.set(contents[nextSlide], { y: gsap.utils.interpolate(40, -40, localProgress) })
            gsap.set(numbers[nextSlide], { y: gsap.utils.interpolate(20, -20, localProgress) })

            if (swiperInstance && nextSlide !== currentScrollSlide) {
              currentScrollSlide = nextSlide
              swiperInstance.slideTo(nextSlide, 700)
            }
          },
        },
      })
        .to(introCopy, { y: () => -window.innerHeight * 0.177778, duration: 1.4, ease: 'none' }, 0.8)
        .to(swiper, { yPercent: 74.81, duration: 1.4, ease: 'none' }, 0.8)
        .to(swiper, { yPercent: 0, duration: 2.4, ease: 'none' }, 2.2)
        .to(animatedContent, { opacity: 1, duration: 0.8, ease: 'none' }, 3.8)
        .to(intro, { opacity: 0, duration: 0.8, ease: 'none' }, 4.1)
        .to({}, { duration: 4.5 })
    }, section)

    return () => context.revert()
  }, [])

  return (
    <section className="services" id="services" aria-label="Services" ref={sectionRef}>
      <div className="inner services__intro">
        <div className="services__intro-copy">
          <h2 className="services__intro-title">SERVICES</h2>
          <p className="services__intro-description">{servicesIntro}</p>
        </div>
      </div>

      <Swiper
        className="services__swiper"
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        speed={650}
        threshold={10}
        touchAngle={35}
        resistance
        resistanceRatio={0.65}
        longSwipesRatio={0.25}
        breakpoints={{
          0: { allowTouchMove: true },
          1025: { allowTouchMove: false },
        }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {serviceSlides.map((service) => (
          <SwiperSlide className="services__slide" key={service.number}>
            <Image className="services__background" src={service.background} alt="" width={1920} height={1080} sizes="100vw" />
            <div className="inner services__inner">
              <span className="services__number">{service.number}</span>
              <div className="services__content">
                <h2 className="services__title">{service.title}</h2>
                <p className="services__description">{service.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="services__pagination" aria-label="Service slides">
        {serviceSlides.map((service, index) => (
          <button
            type="button"
            className={`services__pagination-item${index === activeIndex ? ' services__pagination-item--active' : ''}`}
            key={service.number}
            aria-label={`Go to service ${index + 1}: ${service.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => swiperRef.current?.slideTo(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default Services
