'use client'

import Image from 'next/image'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { A11y, Keyboard, Mousewheel } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import pctBackground from '../../../assets/images/main/bg_service_pct_national_phase.png'
import directFilingBackground from '../../../assets/images/main/bg_service_direct_filing.png'
import officeActionBackground from '../../../assets/images/main/bg_service_office_action.png'
import ipLitigationBackground from '../../../assets/images/main/bg_service_ip_litigation.png'
import 'swiper/css'

gsap.registerPlugin(ScrollTrigger)

const serviceBackgrounds = [pctBackground, directFilingBackground, officeActionBackground, ipLitigationBackground]
const AUTO_SLIDE_DELAY = 5000
const MOBILE_TOUCH_THRESHOLD = 110
const MOBILE_SLIDE_SPEED = 900
const DESKTOP_SLIDE_SPEED = 650

function Services({ dictionary }) {
  const serviceSlides = dictionary.items.map((service, index) => ({ ...service, background: serviceBackgrounds[index] }))
  const sectionRef = useRef(null)
  const swiperRef = useRef(null)
  const autoplayFrameRef = useRef(null)
  const autoplayStartRef = useRef(null)
  const autoplayRunningRef = useRef(false)
  const autoplayProgressRef = useRef(0)
  const desktopScrollExitRef = useRef(false)
  const desktopPinTriggerRef = useRef(null)
  const mobilePinTriggerRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const mobileWheelDeltaRef = useRef(0)
  const mobileWheelLockedRef = useRef(false)
  const mobileSlideReadyRef = useRef(false)
  const desktopSlideReadyRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewportMode, setViewportMode] = useState(null)

  useEffect(() => {
    let resizeFrame = null

    const syncViewportMode = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        const nextMode = window.matchMedia('(max-width: 48rem)').matches
          ? 'mobile'
          : window.matchMedia('(max-width: 64rem)').matches
            ? 'compact'
            : 'desktop'
        setViewportMode((currentMode) => currentMode === nextMode ? currentMode : nextMode)
      })
    }

    syncViewportMode()
    window.addEventListener('resize', syncViewportMode, { passive: true })
    return () => {
      window.removeEventListener('resize', syncViewportMode)
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
    }
  }, [])

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper || !viewportMode) return

    const mobile = viewportMode === 'mobile'
    swiper.params.speed = mobile ? MOBILE_SLIDE_SPEED : DESKTOP_SLIDE_SPEED
    if (swiper.params.mousewheel) {
      swiper.params.mousewheel.thresholdDelta = mobile ? 80 : 260
      swiper.params.mousewheel.thresholdTime = mobile ? 850 : 1500
      swiper.params.mousewheel.sensitivity = mobile ? 0.18 : 0.1
    }
    swiper.update()
    if (viewportMode === 'desktop') swiper.mousewheel?.enable()
    else swiper.mousewheel?.disable()
  }, [viewportMode])

  const updatePagination = (activeSlide, progress) => {
    const paginationItems = sectionRef.current?.querySelectorAll('.services__pagination-item') || []

    paginationItems.forEach((item, index) => {
      const itemProgress = index < activeSlide ? 1 : index === activeSlide ? progress : 0
      item.style.setProperty('--progress', itemProgress)
    })
  }

  const startAutoplay = useCallback(() => {
    if (autoplayRunningRef.current) return

    autoplayRunningRef.current = true
    autoplayStartRef.current = performance.now() - (autoplayProgressRef.current * AUTO_SLIDE_DELAY)

    const tick = (now) => {
      if (!autoplayRunningRef.current) return

      const elapsed = now - autoplayStartRef.current
      const progress = Math.min(elapsed / AUTO_SLIDE_DELAY, 1)
      const swiper = swiperRef.current
      autoplayProgressRef.current = progress

      if (swiper) updatePagination(swiper.activeIndex, progress)

      if (progress >= 1 && swiper && !swiper.animating) {
        const nextIndex = (swiper.activeIndex + 1) % serviceSlides.length
        autoplayStartRef.current = now
        autoplayProgressRef.current = 0
        swiper.slideTo(nextIndex)
      }

      autoplayFrameRef.current = requestAnimationFrame(tick)
    }

    autoplayFrameRef.current = requestAnimationFrame(tick)
  }, [serviceSlides.length])

  const stopAutoplay = useCallback(() => {
    autoplayRunningRef.current = false
    if (autoplayFrameRef.current) cancelAnimationFrame(autoplayFrameRef.current)
    autoplayFrameRef.current = null
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    let unlockTimer = null

    const handleMobileWheel = (event) => {
      if (!window.matchMedia('(max-width: 48rem)').matches || !mobileSlideReadyRef.current) return

      const rect = section.getBoundingClientRect()
      const swiper = swiperRef.current
      if (!swiper || rect.top < -1 || rect.top > 1) return

      const forward = event.deltaY > 0
      const atFirst = swiper.activeIndex === 0
      const atLast = swiper.activeIndex === serviceSlides.length - 1

      if ((atFirst && !forward) || (atLast && forward)) {
        mobileWheelDeltaRef.current = 0
        return
      }

      event.preventDefault()
      if (mobileWheelLockedRef.current) return

      mobileWheelDeltaRef.current += event.deltaY
      if (Math.abs(mobileWheelDeltaRef.current) < 80) return

      mobileWheelLockedRef.current = true
      if (mobileWheelDeltaRef.current > 0) swiper.slideNext()
      else swiper.slidePrev()
      mobileWheelDeltaRef.current = 0

      unlockTimer = window.setTimeout(() => {
        mobileWheelLockedRef.current = false
      }, MOBILE_SLIDE_SPEED + 180)
    }

    window.addEventListener('wheel', handleMobileWheel, { passive: false, capture: true })
    return () => {
      window.removeEventListener('wheel', handleMobileWheel, { capture: true })
      if (unlockTimer) window.clearTimeout(unlockTimer)
      mobileWheelDeltaRef.current = 0
      mobileWheelLockedRef.current = false
    }
  }, [serviceSlides.length])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      const mobile = window.matchMedia('(max-width: 48rem)').matches
      const desktop = window.matchMedia('(min-width: 64.0625rem)').matches
      if (!entry.isIntersecting) stopAutoplay()
      else if (!mobile && !desktop && entry.intersectionRatio >= 0.7) startAutoplay()
    }, { threshold: [0, 0.55] })

    observer.observe(section)
    return () => {
      observer.disconnect()
      stopAutoplay()
    }
  }, [startAutoplay, stopAutoplay])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const leaveLastSlide = (event) => {
      const swiper = swiperRef.current
      const sectionRect = section.getBoundingClientRect()
      const sectionIsCurrent = sectionRect.top <= 1 && sectionRect.bottom >= window.innerHeight - 1
      if (!sectionIsCurrent || !swiper || swiper.activeIndex !== serviceSlides.length - 1 || desktopScrollExitRef.current) return

      if (window.matchMedia('(max-width: 48rem)').matches) {
        if (event.deltaY > 0) {
          mobilePinTriggerRef.current?.kill(true)
          mobilePinTriggerRef.current = null
        }
        return
      }

      if (window.matchMedia('(max-width: 64rem)').matches || event.deltaY <= 0) return

      event.preventDefault()
      desktopScrollExitRef.current = true
      stopAutoplay()
      swiper.mousewheel?.disable()
      const nextSection = section.nextElementSibling
      if (nextSection) {
        const pinTrigger = desktopPinTriggerRef.current
        if (pinTrigger) pinTrigger.scroll(pinTrigger.end + 1)
      }
      window.setTimeout(() => {
        desktopScrollExitRef.current = false
        swiper.mousewheel?.enable()
      }, 900)
    }

    window.addEventListener('wheel', leaveLastSlide, { passive: false, capture: true })
    return () => window.removeEventListener('wheel', leaveLastSlide, { capture: true })
  }, [serviceSlides.length, stopAutoplay])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const isMobile = () => window.matchMedia('(max-width: 48rem)').matches
    const sectionIsPinned = () => {
      const rect = section.getBoundingClientRect()
      return rect.top >= -1 && rect.top <= 1
    }

    const handlePointerDown = (event) => {
      if (!event.isPrimary) return
      if (!isMobile() || !sectionIsPinned() || !mobileSlideReadyRef.current) return
      if (swiperRef.current?.activeIndex === serviceSlides.length - 1) {
        mobilePinTriggerRef.current?.kill(true)
        mobilePinTriggerRef.current = null
        return
      }
      touchStartRef.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerUp = (event) => {
      if (!event.isPrimary) return
      if (!isMobile() || !sectionIsPinned() || !mobileSlideReadyRef.current) return
      const swiper = swiperRef.current
      const deltaY = touchStartRef.current.y - event.clientY
      const deltaX = touchStartRef.current.x - event.clientX
      if (!swiper || swiper.animating || Math.max(Math.abs(deltaX), Math.abs(deltaY)) < MOBILE_TOUCH_THRESHOLD) return

      const forward = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY > 0 : deltaX > 0
      if (forward && swiper.activeIndex < serviceSlides.length - 1) swiper.slideNext()
      else if (!forward && swiper.activeIndex > 0) swiper.slidePrev()
    }

    section.addEventListener('pointerdown', handlePointerDown)
    section.addEventListener('pointerup', handlePointerUp)
    return () => {
      section.removeEventListener('pointerdown', handlePointerDown)
      section.removeEventListener('pointerup', handlePointerUp)
    }
  }, [serviceSlides.length])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compactLayout = viewportMode === 'compact'
    const mobileLayout = viewportMode === 'mobile'
    if (!section || !viewportMode || reduceMotion) return undefined

    desktopPinTriggerRef.current = null
    mobilePinTriggerRef.current = null
    desktopSlideReadyRef.current = false
    mobileSlideReadyRef.current = false
    stopAutoplay()

    if (mobileLayout) {
      const mobileContext = gsap.context(() => {
        const swiper = section.querySelector('.services__swiper')
        const intro = section.querySelector('.services__intro-copy')
        const slideContent = [...section.querySelectorAll('.services__inner')]
        const pagination = section.querySelector('.services__pagination')
        const revealedContent = slideContent

        gsap.set(swiper, { clipPath: 'inset(100% 0 0 0)' })
        gsap.set(intro, { opacity: 1, y: 0 })
        gsap.set(revealedContent, { opacity: 0 })
        gsap.set(pagination, { opacity: 0 })
        mobileSlideReadyRef.current = false

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top top',
            scrub: 1.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const ready = self.progress >= 0.98
              if (ready === mobileSlideReadyRef.current) return
              mobileSlideReadyRef.current = ready
              updatePagination(swiperRef.current?.activeIndex || 0, ready ? 1 : 0)
            },
          },
        })
          .to(intro, { yPercent: -18, opacity: 0, duration: 0.2, ease: 'none' }, 0.5)
          .to(swiper, { clipPath: 'inset(0% 0 0 0)', duration: 0.45, ease: 'none' }, 0.55)
          .to(revealedContent, { opacity: 1, duration: 0.15, ease: 'none' }, 0.85)
          .to(pagination, { opacity: 1, duration: 0.08, ease: 'none' }, 0.92)

        mobilePinTriggerRef.current = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=4600',
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        })
      }, section)

      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        mobilePinTriggerRef.current = null
        mobileSlideReadyRef.current = false
        mobileContext.revert()
        ScrollTrigger.refresh()
      }
    }

    if (compactLayout) {
      gsap.set(section.querySelector('.services__swiper'), { clearProps: 'transform,clipPath' })
      gsap.set(section.querySelectorAll('.services__inner'), { clearProps: 'opacity' })
      gsap.set(section.querySelector('.services__pagination'), { clearProps: 'opacity' })
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => ScrollTrigger.refresh()
    }

    const context = gsap.context(() => {
      const swiper = section.querySelector('.services__swiper')
      const intro = section.querySelector('.services__intro')
      const introCopy = section.querySelector('.services__intro-copy')
      const slideContent = section.querySelectorAll('.services__inner')
      const backgrounds = [...section.querySelectorAll('.services__background')]
      const contents = [...section.querySelectorAll('.services__content')]
      const numbers = [...section.querySelectorAll('.services__number')]
      const pagination = section.querySelector('.services__pagination')
      const animatedContent = [...slideContent]

      gsap.set(swiper, { yPercent: 100 })
      gsap.set(animatedContent, { opacity: 1 })
      gsap.set(pagination, { opacity: 0 })
      gsap.set(backgrounds, { yPercent: 8, scale: 1.2 })
      gsap.set(contents, { y: 40 })
      gsap.set(numbers, { y: 20 })
      updatePagination(0, 0)

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=9000',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.49) gsap.set(swiper, { yPercent: 0 })
            const ready = self.progress >= 0.52
            desktopSlideReadyRef.current = ready
            if (ready) startAutoplay()
            else stopAutoplay()
          },
        },
      })

    desktopPinTriggerRef.current = timeline.scrollTrigger

      timeline
        .to(introCopy, { y: () => -window.innerHeight * 0.177778, duration: 1.4, ease: 'none' }, 0.8)
        .to(swiper, { yPercent: 74.81, duration: 1.4, ease: 'none' }, 0.8)
        .to(swiper, { yPercent: 0, duration: 2.4, ease: 'none' }, 2.2)
        .to(pagination, { opacity: 1, duration: 0.3, ease: 'none' }, 4.6)
        .to(backgrounds, { yPercent: 0, duration: 0.8, ease: 'none' }, 3.8)
        .to(contents, { y: 0, duration: 0.8, ease: 'none' }, 3.8)
        .to(numbers, { y: 0, duration: 0.8, ease: 'none' }, 3.8)
        .to(intro, { opacity: 0, duration: 0.8, ease: 'none' }, 4.1)
        .to({}, { duration: 4.5 })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)

    return () => {
      desktopPinTriggerRef.current = null
      desktopSlideReadyRef.current = false
      context.revert()
      ScrollTrigger.refresh()
    }
  }, [serviceSlides.length, startAutoplay, stopAutoplay, viewportMode])

  return (
    <section
      className={`services${activeIndex === serviceSlides.length - 1 ? ' services--last' : ''}`}
      id="services"
      aria-label={dictionary.label}
      ref={sectionRef}
    >
      <div className="inner services__intro">
        <div className="services__intro-copy">
          <h2 className="services__intro-title">{dictionary.title}</h2>
          <p className="services__intro-description">{dictionary.intro}</p>
        </div>
      </div>

      <Swiper
        className="services__swiper"
        modules={[A11y, Keyboard, Mousewheel]}
        slidesPerView={1}
        speed={DESKTOP_SLIDE_SPEED}
        mousewheel={{
          enabled: true,
          forceToAxis: false,
          releaseOnEdges: true,
          sensitivity: 0.1,
          thresholdDelta: 260,
          thresholdTime: 1500,
        }}
        threshold={10}
        touchAngle={35}
        resistance
        resistanceRatio={0.65}
        longSwipesRatio={0.25}
        breakpoints={{
          0: { allowTouchMove: false },
          769: { allowTouchMove: true },
          1025: { allowTouchMove: false },
        }}
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          const mobile = window.matchMedia('(max-width: 48rem)').matches
          if (mobile || window.matchMedia('(max-width: 64rem)').matches) swiper.mousewheel?.disable()
          else swiper.mousewheel?.enable()
          updatePagination(swiper.activeIndex, 0)
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex)
          autoplayProgressRef.current = 0
          autoplayStartRef.current = performance.now()
          const mobile = window.matchMedia('(max-width: 48rem)').matches
          const ready = mobile ? mobileSlideReadyRef.current : desktopSlideReadyRef.current
          updatePagination(swiper.activeIndex, ready ? 1 : 0)

          if (swiper.activeIndex === serviceSlides.length - 1) {
            stopAutoplay()
          } else if (!mobile) startAutoplay()
        }}
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

      <div className="services__pagination" aria-label={dictionary.slideLabel}>
        {serviceSlides.map((service, index) => (
          <button
            type="button"
            className={`services__pagination-item${index === activeIndex ? ' services__pagination-item--active' : ''}`}
            key={service.number}
            aria-label={`${dictionary.goToSlide} ${index + 1}: ${service.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => {
              autoplayProgressRef.current = 0
              autoplayStartRef.current = performance.now()
              swiperRef.current?.slideTo(index)
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default Services
