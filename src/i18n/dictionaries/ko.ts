export const ko = {
  meta: { siteName: "무한특허번역", home: { title: "홈", description: "AI 기술을 기반으로 한 특허 전문 번역 서비스" } },
  common: {
    languageSwitcher: { label: "언어 선택" },
    navigation: { home: "홈", about: "회사 소개", services: "서비스", technologies: "기술", contact: "문의하기" },
    homeLabel: "무한 홈", primaryNavigation: "주요 메뉴", footerNavigation: "하단 메뉴", login: "TMS 로그인", backToTop: "맨 위로",
  },
  home: {
    hero: {
      titleLine1: "2006년부터 축적한 특허 번역 전문성.",
      titleLine2: "최첨단 AI 기술로 더욱 강력하게",
      description: "2006년부터 특허 번역 분야에서 깊이 있는 전문성을 쌓아왔으며, 이제 클라우드 기반 번역 관리 시스템(TMS)과 최신 AI 기술을 통해 한 단계 더 발전하고 있습니다. AI 기반 번역 및 검증 도구와 특허 전문가의 협업으로 출원과 심사부터 분쟁 해결까지 특허의 모든 단계에 필요한 정확하고 일관된 번역을 제공합니다.",
      scrollDown: "SCROLL DOWN",
    },
    about: { label: "무한 소개", description: "2006년 설립 이래 특허 출원 명세서, 의견서 및 보정서, 지식재산권과 소송 관련 문서 등 다양한 기술 분야에서 고품질 특허 번역을 제공해 왔습니다. 번역가의 축적된 전문성에만 의존하지 않고 클라우드 기반 번역 관리 시스템(TMS)과 지능형 번역 지원 기술을 업무에 통합하여 더욱 정확하고 일관된 품질을 보장합니다." },
    services: {
      label: "서비스", title: "서비스",
      intro: "특허 번역은 법률적·기술적 정확성과 함께 세계 각국 특허청의 규정을 엄격히 준수해야 하는 고도의 전문 분야입니다. 기술 분야별 전문 번역가의 정밀한 작업과 지능형 번역 지원 기술을 결합하여 출원과 심사부터 분쟁 해결까지 특허 실무의 모든 단계에 최적화된 맞춤형 번역 서비스를 제공합니다.",
      items: [
        { number: "01", title: "PCT 국내단계 진입 번역", description: "세계 각국 특허청의 출원 형식과 규정에 맞는 PCT 국내단계 진입용 번역을 제공합니다." },
        { number: "02", title: "해외 직접출원 번역", description: "우선권 주장 기간 내 각국 특허청에 개별적으로 직접 출원할 수 있도록 해당 국가의 형식에 맞춘 번역을 제공합니다." },
        { number: "03", title: "중간사건 문서 번역", description: "거절이유통지서와 거절결정서 등 중간사건 문서와 이에 대응하는 의견서 및 보정서 번역을 제공합니다." },
        { number: "04", title: "지식재산권 및 소송 번역", description: "지식재산권 관련 법령, 심판 결정문, 법원 판결문, 특허 침해 및 분쟁 자료 등 높은 수준의 법률·기술적 이해가 필요한 전문 문서를 번역합니다." },
      ],
      slideLabel: "서비스 슬라이드", goToSlide: "서비스로 이동",
    },
    technologies: {
      title: "기술",
      items: [
        { title: "규칙 기반 QA", description: "정규표현식 기반 규칙과 표준화된 자동 검수 알고리즘을 통해 숫자, 특수문자, 도면부호, 용어 및 문체 등의 오류를 정밀하게 검토합니다. 번역가는 제출 전 최종 점검에 활용하고 검수자는 검수 단계에서 동일한 시스템으로 재검증하여 전체 번역 과정에 이중 품질 안전장치를 제공합니다." },
        { title: "NMT 기반 기계번역", description: "특허 분야에 특화된 NMT 엔진이 기계번역 초안을 제공하여 전문 번역가가 이를 바탕으로 빠르고 정확하게 작업할 수 있습니다." },
        { title: "LLM 기반 AI 번역", description: "LLM이 고객별 번역 자산(TM/TB)과 특허 번역 스타일 가이드를 참조하여 맞춤형 기계번역을 제공하고, 전문 번역가가 이를 바탕으로 빠르고 정확하게 작업할 수 있습니다." },
        { title: "LLM 기반 AI 포스트에디팅", description: "LLM이 고객별 번역 자산(TM/TB)과 특허 번역 스타일 가이드를 참조해 누락, 오역, 문맥 불일치를 정밀하게 교차 검증하고 수정 번역과 상세 의견을 제공하여 검수자가 빠르고 정확하게 검수를 완료할 수 있도록 지원합니다." },
        { title: "클라우드 기반 번역 플랫폼", description: "프로젝트 설정부터 번역과 검수까지 TM, TB, NMT/LLM을 통합한 클라우드 환경을 제공합니다. 단계별 권한 관리로 번역가와 검수자가 체계적으로 협업할 수 있습니다." },
      ],
      workflowLabel: "번역 기술 워크플로", projectSetup: "프로젝트 설정", connected: "파일·TM·TB·AI 엔진 연결", platform: "클라우드 기반 번역 플랫폼", environment: "통합 TM·TB·NMT/LLM 환경", translator: "번역가", reviewer: "검수자", nmtTranslation: "NMT/LLM 번역", initialDraft: "초벌 번역 생성", ruleQa: "규칙 기반 QA", finalCheck: "제출 전 최종 점검", reviewCheck: "검수 단계 재검증", llmPostEditing: "LLM 포스트에디팅", revision: "교차 검증 및 수정안 제공", complete: "검수 완료 번역",
    },
    contact: {
      title: "문의하기", description: "문의해 주셔서 감사합니다. 담당 팀이 내용을 확인한 후 영업일 기준 1일 이내에 답변드리겠습니다.", firstName: "이름", lastName: "성", company: "회사", email: "이메일", phone: "전화번호", message: "문의 내용", attachment: "첨부파일", dropGuide: "첨부할 파일을 여기에 끌어 놓거나 파일 선택 버튼을 눌러주세요.", uploadGuide: "업로드 가능 파일: JPG, GIF, PDF (파일당 최대 10MB)", noFile: "선택된 파일이 없습니다.", selectedFiles: "{count}개 파일이 선택되었습니다.", chooseFile: "파일 선택", removeFile: "삭제", submit: "보내기", sending: "전송 중…", success: "감사합니다. 문의가 정상적으로 전송되었습니다.", error: "문의를 전송할 수 없습니다. 다시 시도해 주세요.", invalidFile: "JPG, GIF, PDF 파일만 첨부할 수 있으며 파일당 최대 용량은 10MB입니다." },
    footer: { tel: "전화", fax: "팩스", contact: "이메일", address: "주소", addressValue: "서울특별시 금천구 가산디지털2로 169-16, 하우스디 퍼스타 518호", copyright: "©2026 무한특허번역 주식회사" },
  },
};

type DictionaryShape<T> = { [K in keyof T]: T[K] extends string ? string : T[K] extends readonly (infer U)[] ? DictionaryShape<U>[] : DictionaryShape<T[K]> };
export type Dictionary = DictionaryShape<typeof ko>;
