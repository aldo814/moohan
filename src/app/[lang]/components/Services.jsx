"use client";

import DesignText from "../../../components/common/DesignText";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import pctBackground from "../../../assets/images/main/bg_service_pct_national_phase.png";
import directFilingBackground from "../../../assets/images/main/bg_service_direct_filing.png";
import officeActionBackground from "../../../assets/images/main/bg_service_office_action.png";
import ipLitigationBackground from "../../../assets/images/main/bg_service_ip_litigation.png";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

const serviceBackgrounds = [
  pctBackground,
  directFilingBackground,
  officeActionBackground,
  ipLitigationBackground,
];
const INTRO_HOLD = 0.4;
const SLIDES_START = INTRO_HOLD + 1.1;
const SLIDE_SCROLL_DURATION = 1.25;
const AUTO_SLIDE_MS = 5000;

function Services({ dictionary }) {
  const serviceSlides = dictionary.items.map((service, index) => ({
    ...service,
    background: serviceBackgrounds[index],
  }));
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const swiperRef = useRef(null);
  const triggerRef = useRef(null);
  const completionRef = useRef(false);
  const exitAnchorRef = useRef(null);
  const [completed, setCompleted] = useState(false);
  const autoProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const updatePagination = (activeSlide, progress) => {
    sectionRef.current
      ?.querySelectorAll(".services__pagination-item")
      .forEach((item, index) => {
        item.style.setProperty(
          "--progress",
          index < activeSlide ? 1 : index === activeSlide ? progress : 0
        );
      });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;
    const media = gsap.matchMedia();
    let completionFrame = null;
    media.add(
      {
        mobile: "(max-width: 768px)",
        desktop: "(min-width: 769px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const swiperElement = section.querySelector(".services__swiper");
        const intro = section.querySelector(".services__intro");
        const pagination = section.querySelector(".services__pagination");
        const content = section.querySelectorAll(".services__inner");
        if (completed || context.conditions.reduce) {
          // Completed/reduced-motion content uses its natural document height.
          // Do not leave the sticky scroll runway behind after teardown.
          track.style.removeProperty("height");
          gsap.set(swiperElement, { yPercent: 0, clipPath: "inset(0% 0 0 0)" });
          gsap.set(intro, { autoAlpha: 1, yPercent: 0 });
          gsap.set([content, pagination], { autoAlpha: 1 });
          if (completed && swiperRef.current) {
            // Unpinning may interrupt transitionend; settle without changing slides.
            const swiper = swiperRef.current;
            swiper.slideTo(swiper.activeIndex, 0, false);
            swiper.animating = false;
          }
          return;
        }

        gsap.set(swiperElement, { yPercent: 100, clipPath: "inset(0% 0 0 0)" });
        gsap.set(intro, { autoAlpha: 1, yPercent: 0 });
        gsap.set(pagination, { autoAlpha: 0 });
        gsap.set(content, { autoAlpha: 1 });
        const scrollDistance = () =>
          Math.max(window.innerHeight * 6, 3600) *
          ((SLIDES_START + serviceSlides.length * SLIDE_SCROLL_DURATION) /
            (1.1 + serviceSlides.length * SLIDE_SCROLL_DURATION));
        const sizeTrack = () => {
          if (completionRef.current) return;
          // refreshInit runs outside the GSAP matchMedia context. A gsap.set()
          // here is not reliably reverted and can restore a stale runway height.
          // Own this layout style explicitly, including its cleanup below.
          track.style.height = `${scrollDistance() + section.offsetHeight}px`;
        };
        // Native sticky positioning avoids switching relative/fixed coordinates
        // while the browser's compositor is scrolling the introduction.
        gsap.set(section, { position: "sticky", top: 0 });
        sizeTrack();
        const clock = { value: 0 };
        let timeline;
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: () => "+=" + scrollDistance(),
            scrub: true,
            onRefreshInit: sizeTrack,
            invalidateOnRefresh: true,
            onLeave: () => {
              if (completionRef.current) return;
              completionRef.current = true;
              // A fast gesture can skip the final onUpdate before onLeave fires.
              swiperRef.current?.slideTo(serviceSlides.length - 1, 0, false);
              updatePagination(serviceSlides.length - 1, 1);
              setActiveIndex(serviceSlides.length - 1);
              // Capture the visible layout just before removing the scroll runway.
              completionFrame = requestAnimationFrame(() => {
                const next = section.closest(".about-services")?.nextElementSibling;
                if (next) {
                  exitAnchorRef.current = {
                    element: next,
                    top: next.getBoundingClientRect().top,
                  };
                }
                setCompleted(true);
              });
            },
            onUpdate: (self) => {
              if (completionRef.current) return;
              // Use one scroll clock for entrance, slides and progress bars.
              const time =
                self.progress *
                (SLIDES_START + serviceSlides.length * SLIDE_SCROLL_DURATION);
              const value = Math.max(
                0,
                Math.min(
                  (time - SLIDES_START) / SLIDE_SCROLL_DURATION,
                  serviceSlides.length
                )
              );
              const index = Math.min(
                Math.floor(value),
                serviceSlides.length - 1
              );
              const fraction =
                value >= serviceSlides.length ? 1 : value - index;
              if (swiperRef.current?.activeIndex !== index)
                swiperRef.current?.slideTo(index, 600);
              updatePagination(index, fraction);
            },
          },
        });
        timeline
          .to(
            intro,
            { autoAlpha: 0, duration: 0.9, ease: "power1.inOut" },
            INTRO_HOLD
          )
          .to(
            swiperElement,
            { yPercent: 0, duration: 1, ease: "power1.inOut" },
            INTRO_HOLD
          )
          .to(pagination, { autoAlpha: 1, duration: 0.1 }, INTRO_HOLD + 1)
          .to(
            clock,
            {
              value: serviceSlides.length,
              duration: serviceSlides.length * SLIDE_SCROLL_DURATION,
              ease: "none",
            },
            SLIDES_START
          );
        triggerRef.current = timeline.scrollTrigger;
        return () => {
          triggerRef.current = null;
          track.style.removeProperty("height");
        };
      }
    );
    const refresh = () => {
      // Completion only removes space below the remaining About trigger.
      // A global refresh temporarily scrolls to 0; in Firefox this can leave
      // a pending smooth scroll that runs after our position compensation.
      if (!completed) ScrollTrigger.refresh();
      if (completed && completionRef.current) {
        completionRef.current = false;
        const anchor = exitAnchorRef.current;
        if (anchor) {
          window.scrollBy({
            top: anchor.element.getBoundingClientRect().top - anchor.top,
            behavior: "instant",
          });
          exitAnchorRef.current = null;
          ScrollTrigger.update();
        }
      }
    };
    // Compensate layout changes before paint, keeping the visible section in place.
    if (completed) refresh();
    const refreshFrame = completed ? null : requestAnimationFrame(refresh);
    return () => {
      if (refreshFrame !== null) cancelAnimationFrame(refreshFrame);
      if (completionFrame) cancelAnimationFrame(completionFrame);
      media.revert();
    };
  }, [completed, serviceSlides.length]);

  useEffect(() => {
    if (!completed) return undefined;
    let visible = false;
    let started = false;
    let previous = null;
    let frame;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        previous = null;
        if (visible && !started) {
          started = true;
          autoProgressRef.current = 0;
          // Keep the slide reached by scrolling and give it a full autoplay interval.
          updatePagination(
            swiperRef.current?.activeIndex ?? serviceSlides.length - 1,
            0
          );
        }
      },
      { threshold: [0, 0.5] }
    );
    observer.observe(sectionRef.current.querySelector(".services__swiper"));
    const tick = (now) => {
      const swiper = swiperRef.current;
      if (visible && !document.hidden && !reducedMotion.matches && swiper) {
        if (previous !== null)
          autoProgressRef.current +=
            Math.min(now - previous, 100) / AUTO_SLIDE_MS;
        updatePagination(
          swiper.activeIndex,
          Math.min(autoProgressRef.current, 1)
        );
        if (autoProgressRef.current >= 1) {
          autoProgressRef.current = 0;
          swiper.slideTo((swiper.activeIndex + 1) % serviceSlides.length, 1150);
        }
        previous = now;
      } else {
        previous = null;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [completed, serviceSlides.length]);

  return (
    <div className="services-track" ref={trackRef}>
    <section
      className={`services${completed ? " services--completed" : ""}`}
      id="services"
      aria-label={dictionary.label}
      ref={sectionRef}
    >
      <div className="inner services__intro">
        <div className="services__intro-copy">
          <h2 className="services__intro-title">{dictionary.title}</h2>
          <p className="services__intro-description">
            <DesignText text={dictionary.intro} />
          </p>
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          if (completed) {
            autoProgressRef.current = 0;
            updatePagination(swiper.activeIndex, 0);
          }
        }}
      >
        {serviceSlides.map((service) => (
          <SwiperSlide className="services__slide" key={service.number}>
            <Image
              className="services__background"
              src={service.background}
              alt=""
              width={1920}
              height={1080}
              sizes="100vw"
            />
            <div className="inner services__inner">
              <span className="services__number">{service.number}</span>
              <div className="services__content">
                <h2 className="services__title">
                  <DesignText text={service.title} />
                </h2>
                <p className="services__description">
                  <DesignText text={service.description} />
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="services__pagination" aria-label={dictionary.slideLabel}>
        {serviceSlides.map((service, index) => (
          <button
            type="button"
            className={`services__pagination-item${
              index === activeIndex ? " services__pagination-item--active" : ""
            }`}
            key={service.number}
            aria-label={`${dictionary.goToSlide} ${index + 1}: ${
              service.title
            }`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => {
              if (!completed && triggerRef.current) {
                const trigger = triggerRef.current;
                trigger.scroll(
                  trigger.start +
                    ((SLIDES_START + index * SLIDE_SCROLL_DURATION + 0.01) /
                      (SLIDES_START +
                        serviceSlides.length * SLIDE_SCROLL_DURATION)) *
                      (trigger.end - trigger.start)
                );
              } else {
                swiperRef.current?.slideTo(index);
                updatePagination(index, 0);
              }
            }}
          />
        ))}
      </div>
    </section>
    </div>
  );
}

export default Services;
