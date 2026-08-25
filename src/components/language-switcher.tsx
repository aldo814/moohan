"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import chevronDownIcon from "@/assets/images/common/ico_chevron_down.svg";

// 현재 언어를 pill 버튼으로 표시하고, 펼치면 언어 목록에서 선택하는 드롭다운.
// 선택 시 현재 경로의 [lang] 세그먼트만 치환해 이동 → 같은 페이지에서 언어만 전환된다.
export function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 / Escape로 닫기
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="language-switcher">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="pill-button language-switcher__trigger"
      >
        <span className="pill-button__label">{localeNames[current]}</span>
        <Image
          src={chevronDownIcon}
          alt=""
          width={8}
          height={5}
          className={`pill-button__icon pill-button__icon--small${open ? " language-switcher__icon--open" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="language-switcher__menu"
        >
          {locales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === current}>
              <Link
                href={`/${locale}${rest}`}
                onClick={() => setOpen(false)}
                className={`language-switcher__option${locale === current ? " language-switcher__option--active" : ""}`}
              >
                {localeNames[locale]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
