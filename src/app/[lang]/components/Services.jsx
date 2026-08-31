'use client'

import DesignText from '../../../components/common/DesignText'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
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

const serviceBackgrounds = [pctBackground, directFilingBackground, officeActionBackground, ipLitigationBackground]
const INTRO_HOLD = 0.4
const SLIDES_START = INTRO_HOLD + 1.1
const SLIDE_SCROLL_DURATION = 1.25
const mobileQuery = '(max-width: 768px)'
const subscribeMobile = (listener) => {
  const query = window.matchMedia(mobileQuery)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}
const getMobile = () => window.matchMedia(mobileQuery).matches
const getServerMobile = () => false

function Services({ dictionary }) {
  const serviceSlides = dictionary.items.map((service, index) => ({ ...service, background: serviceBackgrounds[index] }))
  const sectionRef = useRef(null)
  const swiperRef = useRef(null)
  const triggerRef = useRef(null)
  const completionRef = useRef(false)
  const [desktopCompleted, setCompleted] = useState(false)
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, getServerMobile)
  // Mobile always retains its scroll track, including after desktop completion.
  const completed = desktopCompleted && !mobile
  const [activeIndex, setActiveIndex] = useState(0)

  const updatePagination = (activeSlide, progress) => {
    sectionRef.current?.querySelectorAll('.services__pagination-item').forEach((item, index) => {
      item.style.setProperty('--progress', index < activeSlide ? 1 : index === activeSlide ? progress : 0)
    })
  }

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const media = gsap.matchMedia()
    let completionFrame = null
    media.add({
      mobile: '(max-width: 768px)',
      desktop: '(min-width: 769px)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      const swiperElement = section.querySelector('.services__swiper')
      const intro = section.querySelector('.services__intro')
      const pagination = section.querySelector('.services__pagination')
      const content = section.querySelectorAll('.services__inner')
      if (completed || context.conditions.reduce) {
        gsap.set(swiperElement, { yPercent: 0, clipPath: 'inset(0% 0 0 0)' })
        gsap.set(intro, { autoAlpha: 1 })
        gsap.set([content, pagination], { autoAlpha: 1 })
        return
      }

      gsap.set(swiperElement, { yPercent: 100, clipPath: 'inset(0% 0 0 0)' })
      gsap.set(intro, { autoAlpha: 1, yPercent: 0 })
      gsap.set(pagination, { autoAlpha: 0 })
      gsap.set(content, { autoAlpha: 1 })
      const clock = { value: 0 }
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: 'top top',
          end: () => '+=' + Math.max(window.innerHeight * 6, 3600)
            * ((SLIDES_START + serviceSlides.length * SLIDE_SCROLL_DURATION)
              / (1.1 + serviceSlides.length * SLIDE_SCROLL_DURATION)),
          pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
          // Bars track scroll directly; only the entrance animation is smoothed.
          const time = self.progress * (SLIDES_START + serviceSlides.length * SLIDE_SCROLL_DURATION)
          const value = Math.max(0, Math.min((time - SLIDES_START) / SLIDE_SCROLL_DURATION, serviceSlides.length))
          const index = Math.min(Math.floor(value), serviceSlides.length - 1)
          const fraction = value >= serviceSlides.length ? 1 : value - index
          if (swiperRef.current?.activeIndex !== index) swiperRef.current?.slideTo(index, 600)
          updatePagination(index, fraction)
          if (!context.conditions.mobile && value >= serviceSlides.length && !completionRef.current) {
            completionRef.current = true
            completionFrame = requestAnimationFrame(() => setCompleted(true))
          }
          },
        },
      })
      timeline
        .to(intro, { autoAlpha: 0, yPercent: -8, duration: 0.9, ease: 'power1.inOut' }, INTRO_HOLD)
        .to(swiperElement, { yPercent: 0, duration: 1, ease: 'power1.inOut' }, INTRO_HOLD)
        .to(pagination, { autoAlpha: 1, duration: 0.1 }, INTRO_HOLD + 1)
        .to(clock, { value: serviceSlides.length, duration: serviceSlides.length * SLIDE_SCROLL_DURATION, ease: 'none' }, SLIDES_START)
      triggerRef.current = timeline.scrollTrigger
      return () => { triggerRef.current = null }
    })
    const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (completed && completionRef.current) {
        completionRef.current = false
        section.parentElement?.nextElementSibling?.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    })
    return () => {
      cancelAnimationFrame(refreshFrame)
      if (completionFrame) cancelAnimationFrame(completionFrame)
      media.revert()
    }
  }, [completed, serviceSlides.length])

  useEffect(() => {
    if (!completed) return undefined
    // Subsequent visits remain unpinned, but progress still follows page scroll.
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current.querySelector('.services__swiper'),
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const value = self.progress * serviceSlides.length
        const index = Math.min(Math.floor(value), serviceSlides.length - 1)
        if (swiperRef.current?.activeIndex !== index) swiperRef.current?.slideTo(index, 600)
        updatePagination(index, Math.min(value - index, 1))
      },
    })
    return () => trigger.kill()
  }, [completed, serviceSlides.length])

  return (
    <section
      className={`services${completed ? ' services--completed' : ''}`}
      id="services"
      aria-label={dictionary.label}
      ref={sectionRef}
    >
      <div className="inner services__intro">
        <div className="services__intro-copy">
          <h2 className="services__intro-title">{dictionary.title}</h2>
          <p className="services__intro-description"><DesignText text={dictionary.intro} /></p>
        </div>
      </div>

      <Swiper
        className="services__swiper"
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        speed={1150}
        allowTouchMove={completed}
        keyboard={{ enabled: completed, onlyInViewport: true }}
        a11y={{ enabled: true }}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
        }}
      >
        {serviceSlides.map((service) => (
          <SwiperSlide className="services__slide" key={service.number}>
            <Image className="services__background" src={service.background} alt="" width={1920} height={1080} sizes="100vw" />
            <div className="inner services__inner">
              <span className="services__number">{service.number}</span>
              <div className="services__content">
                <h2 className="services__title"><DesignText text={service.title} /></h2>
                <p className="services__description"><DesignText text={service.description} /></p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="services__pagination" aria-label={dictionary.slideLabel}>
        {serviceSlides.map((service, index) => (
          <button
            type="button"
            className={`services__pagination-item${index === activeIndex ? ' services__pagination-item--active' : ''}`}
            key={service.number}
            aria-label={`${dictionary.goToSlide} ${index + 1}: ${service.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => {
              if (!completed && triggerRef.current) {
                const trigger = triggerRef.current
                trigger.scroll(trigger.start + ((SLIDES_START + index * SLIDE_SCROLL_DURATION + 0.01) / (SLIDES_START + serviceSlides.length * SLIDE_SCROLL_DURATION)) * (trigger.end - trigger.start))
              } else {
                swiperRef.current?.slideTo(index)
                updatePagination(index, 0)
              }
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Services
