export const ko = {
  meta: { siteName: "무한기술번역", home: { title: "홈", description: "2006년부터 축적된 특허번역 전문성과 최첨단 AI 기술의 결합" } },
  common: {
    languageSwitcher: { label: "Language" },
    navigation: { home: "HOME", about: "ABOUT US", services: "SERVICES", technologies: "TECHNOLOGIES", contact: "CONTACT US" },
    homeLabel: "무한 홈", primaryNavigation: "주요 메뉴", footerNavigation: "하단 메뉴", login: "TMS 로그인", backToTop: "맨 위로",
  },
  home: {
    hero: {
      titleLine1: "2006년부터 축적된 특허번역 전문성과",
      titleLine2: "최첨단 AI 기술의 결합",
      description: "2006년부터 이어온 특허번역 노하우에 클라우드 기반 번역관리시스템(TMS)과 최신 AI 기술을 결합했습니다. 특허 실무 전문가가 AI 기반 번역·검증 기술의 지원을 받아 정교하고 일관된 번역을 완성하며, 출원부터 심사, 분쟁 대응까지 특허 생애주기 전 과정을 정확하게 지원합니다.",
      scrollDown: "SCROLL DOWN",
    },
    about: { label: "ABOUT US", description: "2006년 설립 이래 무한기술번역은 다양한 기술 분야의 특허출원 명세서, 중간사건 서류, IP 및 소송 관련 자료에 대한 고품질 특허번역을 제공해 왔습니다. 무한기술번역은 축적된 번역가의 전문성에 만족하지 않고, 보다 완벽하고 일관된 품질을 보장하기 위해 클라우드 기반 번역관리시스템(TMS)과 지능형 번역 지원 기술을 자체 프로세스에 통합하여 운용하고 있습니다." },
    services: {
      label: "SERVICES", title: "SERVICES",
      intro: "특허번역은 법률적·기술적 정확성과 각국 특허청의 엄격한 규정을 충족해야 하는 고도의 전문 영역입니다. 무한기술번역은 기술 분야별 전문 번역가의 정교한 번역 작업과 지능형 번역 지원 기술을 결합하여, 출원부터 심사, 분쟁 대응까지 특허 실무 전반에 최적화된 맞춤형 번역 서비스를 제공합니다.",
      items: [
        { number: "01", title: "PCT 국내 단계 번역\n(PCT National Phase Translation)", description: "각국 특허청의 출원 형식과 규정에 부합하는 PCT 국내 단계 진입 번역을 제공합니다." },
        { number: "02", title: "일반출원 번역\n(Direct Filing Translation)", description: "우선권 주장 기간 내에 각국 특허청에 개별적으로 직접 출원 시에 이에 적합한 형식으로 번역을 제공합니다." },
        { number: "03", title: "중간사건 서류 번역\n(Office Action Document Translation)", description: "의견제출통지서, 거절결정서 등 중간사건 서류 및 이에 대응하는 의견서, 보정서에 대한 번역을 제공합니다." },
        { number: "04", title: "IP 및 소송 관련 자료 번역\n(IP & Litigation Translation)", description: "IP 관련 법령, 심결문, 판결문 및 특허 침해·분쟁 자료 등 높은 법률적·기술적 이해도를 요구하는 전문 문서에 대한 번역을 제공합니다." },
      ],
      slideLabel: "서비스 슬라이드", goToSlide: "서비스로 이동",
    },
    technologies: {
      title: "TECHNOLOGIES",
      items: [
        { title: "규칙 기반 QA", description: "번역이 완료된 파일을 정규표현식 기반 규칙과 표준화된 자동 검수 알고리즘으로 정밀하게 검수하여, 숫자, 특수기호, 도면 부호, 용어, 형식 등의 오류를 찾아냅니다. 번역가는 제출 전 최종 점검 도구로, 검수자는 검수 단계의 체계적인 재확인 도구로 동일한 시스템을 활용하여, 번역 전 과정에 걸쳐 이중의 품질 안전장치를 제공합니다." },
        { title: "NMT 기반 기계 번역", description: "특허 도메인에 특화된 NMT 엔진이 기계번역을 제공하며, 전문 번역가는 이를 기초로 신속하고 정확하게 번역을 진행할 수 있습니다." },
        { title: "LLM 기반 AI 번역", description: "LLM이 고객별 번역 자산(TM/TB)과 특허번역 스타일 가이드를 참조하여 고객 맞춤형 기계번역을 제공하며, 전문 번역가는 이를 기초로 신속하고 정확하게 번역을 진행할 수 있습니다." },
        { title: "LLM 기반 AI 포스트 에디팅", description: "LLM이 고객별 번역 자산(TM/TB)과 특허번역 스타일 가이드를 참조하여 번역물의 누락, 오역, 문맥 불일치 여부 등을 정밀하게 교차 검증하고 수정 번역문과 상세 코멘트를 제공함으로써, 검수자가 신속하고 정확하게 검수를 완료할 수 있도록 지원합니다." },
        { title: "클라우드 기반 번역 플랫폼", description: "프로젝트 설정부터 번역, 검수까지 전 과정에서 TM, TB, NMT/LLM이 하나로 통합된 클라우드 환경을 제공하며, 단계별 권한 관리를 통해 번역가와 검수자가 체계적으로 협업할 수 있습니다." },
      ],
      workflowLabel: "번역 기술 워크플로", projectSetup: "PM: 프로젝트 설정", connected: "파일·TM·TB·AI 엔진 연결", platform: "클라우드 기반 번역 플랫폼", environment: "TM·TB·NMT/LLM 통합 환경", translator: "번역가", reviewer: "검수자", nmtTranslation: "NMT/LLM 번역", initialDraft: "1차 번역 초안 생성", ruleQa: "규칙 기반 QA", finalCheck: "제출 전 최종 점검", reviewCheck: "검수 단계 재확인", llmPostEditing: "LLM 포스트 에디팅", revision: "교차 검증 및 수정안 제공", complete: "검수 완료 번역물",
    },
    contact: {
      title: "CONTACT US", description: "무한기술번역에 문의해 주셔서 감사합니다.\n담당자가 문의 내용을 검토한 후, 영업일 기준 1일 이내에 회신드리겠습니다.", firstName: "성함", lastName: "성", company: "회사명", email: "이메일", phone: "연락처", message: "문의 내용", attachment: "첨부파일", dropGuide: "첨부할 파일을 여기에 끌어 놓거나 파일 선택 버튼을 눌러주세요.", uploadGuide: "업로드 가능 파일: JPG, GIF, DOCX, PPTX, MD, PDF (파일당 최대 10MB)", noFile: "선택된 파일이 없습니다.", selectedFiles: "{count}개 파일이 선택되었습니다.", chooseFile: "파일 선택", removeFile: "삭제", submit: "문의하기", sending: "전송 중…", success: "감사합니다. 문의가 정상적으로 접수되었습니다.", error: "문의를 접수할 수 없습니다. 다시 시도해 주세요.", invalidFile: "JPG, GIF, DOCX, PPTX, MD, PDF 파일만 첨부할 수 있으며 파일당 최대 용량은 10MB입니다." },
    footer: { tel: "Tel", fax: "Fax", contact: "Email", address: "Address", addressValue: "서울시 금천구 가산디지털2로 169-16, 518호(가산동, 하우스디가산퍼스타)", copyright: "©2026 MOOHAN Technical Translation Services Co., Ltd." },
  },
};

type DictionaryShape<T> = { [K in keyof T]: T[K] extends string ? string : T[K] extends readonly (infer U)[] ? DictionaryShape<U>[] : DictionaryShape<T[K]> };
export type Dictionary = DictionaryShape<typeof ko>;
