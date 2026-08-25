import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale } from "@/i18n/config";

// Next 16: middleware.ts가 proxy.ts로 개명됨 (기능 동일).
// 현재 역할: / → 기본 언어로 redirect. (/managed 인증 가드는 PLAN #5에서 여기에 분기 추가)
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
}

export const config = {
  matcher: "/",
};
