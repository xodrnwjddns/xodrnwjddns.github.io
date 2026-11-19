# WON 우리카드 AI Renewal — 웹 구현 (과제용)

Figma 프레임 `woori-bank-ai-renewal`(1920 × 5312)을 HTML / CSS / JavaScript로 구현한 정적 웹페이지입니다.
라이브러리 없이 순수 HTML·CSS·JS(Vanilla)로 작성했습니다.

## 폴더 구조
```
woori-ai-renewal/
├─ index.html
├─ css/style.css
├─ js/main.js
└─ assets/
   ├─ icons/   (Figma에서 추출한 SVG 아이콘 28개)
   └─ img/     (마스코트 이미지 3장 — 아래 안내대로 넣어주세요)
```

## 마스코트 이미지 넣기
Figma에서 아래 레이어를 선택 → 오른쪽 Export → PNG(2x)로 내보낸 뒤 `assets/img/`에 같은 이름으로 저장하세요.
이미지가 없으면 파란 원형 "W" 대체 그래픽이 표시됩니다.

| 파일명 | Figma 레이어 |
|---|---|
| `mascot-hero.png` | hero-section › ChatGPT Image … 1 (node 13:27) |
| `mascot-asset.png` | ai-asset-section › ai-character › mascot-image (node 75:329) |
| `mascot-security.png` | security-visual › Rectangle (node 87:19) |

## 구현한 인터랙션
- **스크롤 등장 애니메이션**: 각 섹션의 문구·카드·단계 설명이 순서대로 하나씩 올라옴 (IntersectionObserver)
- **헤더**: 스크롤하면 배경이 진해지고 상단 유틸 메뉴가 접힘, 아래로 스크롤 시 숨김 / 위로 스크롤 시 표시, 현재 섹션 메뉴 하이라이트, 검색 패널, 모바일 햄버거 메뉴
- **상단 진행 바**, **맨 위로 버튼**, 버튼 클릭 **리플 효과**, 안내 **토스트**
- **히어로**: 숫자 카운트업(1,200만+ / 98.7%), 마우스를 따라 움직이는 아이콘 타일(패럴랙스), 떠다니는 캐릭터, 실시간으로 바뀌는 미니 차트, 태그(포트폴리오 분석·소비 리포트·카드 추천) 전환
- **빠른 서비스**: 카드 클릭 시 선택/고정 토글 + 고정 개수 표시
- **AI 자산 대시보드**: 투자성향(안정형·균형형·공격형) 선택 시 막대그래프·추천 비중·예상 수익률이 애니메이션으로 변경, 막대에 마우스를 올리면 비율 표시
- **소비 분석 리포트**: 4·5·6월 탭 전환 시 그래프와 AI 팁 문구 변경
- **카드 추천**: 마우스 위치에 따른 3D 기울기, 카드 선택 강조, 카드 플라스틱 반짝임
- **보안**: 레이더 스캔, 퍼지는 링, 실시간 증가하는 차단 건수, 상태 문구 순환
- `prefers-reduced-motion` 설정 시 애니메이션 최소화, 1280 / 1024 / 640px 반응형

## 실행
`index.html`을 브라우저로 열면 됩니다. GitHub Pages로 배포하려면 저장소 Settings › Pages에서 브랜치를 선택하세요.
폰트는 Pretendard(jsDelivr CDN)를 사용합니다.

※ 학습·과제 제출용 데모이며 실제 금융 서비스와 무관합니다.
