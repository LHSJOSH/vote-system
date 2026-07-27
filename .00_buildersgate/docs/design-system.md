# Vote System Dark Design System

> 생성일: 2026-07-27  
> 기반 시안: [Buildersgate UI Wiki — Toss Design System (TDS)](https://ui.buildersgate.com/styles/toss-design-system)  
> 대상 스택: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4  
> 색상 범위: **다크 모드 전용**. 이 문서에는 라이트 모드 토큰을 정의하지 않는다.

---

## 0. 문서 범위와 추출 근거

참조 페이지와 페이지가 제공하는 Style/Theme API에서 다음 원칙을 확인했다.

- OKLCH 기반의 인지적으로 균일한 컬러 스케일
- APCA 관점에서 별도 보정하는 다크 모드 명도
- Blue 중심의 주요 CTA, 8px 기반 간격, 200ms `ease-in-out` 모션
- 한 개의 산세리프 폰트 패밀리와 명확한 정보 위계
- 둥근 Button, BottomCTA, ListRow, Badge, Tab, flat Card, filled Input
- 장식보다 정보 전달과 접근성을 우선하는 모바일 중심 구조

참조 API는 다크 모드의 정확한 원시 색상표를 공개하지 않는다. 따라서 아래 다크 토큰은 페이지에 명시된 색상 역할과 TDS 원칙을 유지하면서 실제 제품에 적용할 수 있도록 설계한 **프로젝트용 파생안**이다. 파생 컬러는 배경의 단계적 명도, 밝아지는 텍스트 위계, 어두운 면에서 채도가 살아나는 Blue, 색상과 아이콘을 함께 쓰는 상태 표현을 기준으로 했다.

---

## 1. 디자인 원칙 (Design Principles)

- **복잡함을 숨기는 단순함**: 한 화면의 주 행동은 하나로 제한하고 금융·투표 정보를 짧은 문장과 명확한 숫자로 표현한다.
- **콘텐츠 중심의 깊이**: 배경, surface, elevated surface의 미세한 명도 차이로 계층을 만들며 과한 그림자와 장식을 피한다.
- **일관된 의미**: 원시 색상을 컴포넌트에서 직접 사용하지 않고 반드시 시맨틱 토큰을 거친다.
- **편안하지만 분명한 대비**: 순수한 검정과 흰색 대신 완화된 neutral을 사용하되 본문과 CTA는 충분한 대비를 확보한다.
- **확장 가능한 조합**: 8px 간격, 타입 토큰, 공통 상태 토큰을 조합하여 모바일부터 데스크톱까지 같은 언어를 유지한다.

---

## 2. 컬러 시스템 (Color System)

### 2-1. 다크 전용 브랜드 컬러

| 토큰명 | 값 | OKLCH 근사값 | 용도 | Tailwind |
|---|---:|---:|---|---|
| `--brand-blue` | `#286FD8` | `oklch(0.57 0.17 255)` | 주요 CTA, 선택, 링크 | `bg-brand-blue` |
| `--brand-blue-hover` | `#2D73DC` | `oklch(0.59 0.17 255)` | CTA hover | `bg-brand-blue-hover` |
| `--brand-blue-active` | `#2468CF` | `oklch(0.54 0.17 255)` | CTA pressed | `bg-brand-blue-active` |
| `--brand-blue-weak` | `#183153` | `oklch(0.31 0.08 255)` | 선택된 행, subtle badge | `bg-brand-blue-weak` |
| `--brand-blue-weaker` | `#12243E` | `oklch(0.25 0.06 255)` | 매우 약한 강조 면 | `bg-brand-blue-weaker` |
| `--on-brand` | `#FFFFFF` | `oklch(1 0 0)` | Blue 면 위 텍스트/아이콘 | `text-on-brand` |

`--brand-blue`는 어두운 배경과 버튼 내부의 흰색 라벨 모두에서 충분한 대비를 확보하도록 보정한 프로젝트용 다크 컬러다. 브랜드 컬러를 변경할 때는 weak 계열까지 함께 파생하고 텍스트 대비를 다시 검증한다.

### 2-2. 다크 전용 시맨틱 컬러

| 토큰명 | 값 | 용도 |
|---|---:|---|
| `--background` | `#101013` | 앱 최하단 배경 |
| `--surface` | `#17171C` | 기본 섹션, 내비게이션 |
| `--surface-raised` | `#202027` | 카드, 입력, 팝오버 |
| `--surface-elevated` | `#2A2A32` | 드롭다운, 활성 컨트롤 |
| `--surface-overlay` | `rgba(8, 8, 10, 0.72)` | 모달 배경 |
| `--foreground` | `#F2F4F6` | 제목, 핵심 값, 기본 본문 |
| `--foreground-secondary` | `#B0B8C1` | 설명, 보조 레이블 |
| `--foreground-tertiary` | `#7C8794` | 메타 정보, placeholder |
| `--foreground-disabled` | `#535D69` | 비활성 텍스트 |
| `--card` | `#202027` | 카드 배경 |
| `--card-foreground` | `#F2F4F6` | 카드의 기본 텍스트 |
| `--muted` | `#2A2A32` | 비활성/보조 배경 |
| `--muted-foreground` | `#9AA4AF` | 보조 텍스트 |
| `--accent` | `#183153` | 선택/강조 배경 |
| `--accent-foreground` | `#86B9FF` | 강조 배경 위 텍스트 |
| `--border` | `#303039` | 기본 구분선 |
| `--border-strong` | `#454550` | 입력/컨트롤 외곽선 |
| `--ring` | `#5BA0FF` | 키보드 포커스 링 |
| `--destructive` | `#F66570` | 오류, 삭제, 위험 |
| `--destructive-weak` | `#451F25` | 오류/위험의 약한 배경 |
| `--warning` | `#F5B94C` | 경고, 대기 |
| `--warning-weak` | `#453619` | 경고의 약한 배경 |
| `--success` | `#45C98A` | 완료, 성공 |
| `--success-weak` | `#173B2C` | 성공의 약한 배경 |
| `--info` | `#6AA8FF` | 안내 정보 |
| `--info-weak` | `#183153` | 안내의 약한 배경 |

### 2-3. 상태별 컬러 변형

| 역할 | Default | Hover | Active | Disabled | Focus |
|---|---|---|---|---|---|
| Primary CTA | `--brand-blue` | `--brand-blue-hover` | `--brand-blue-active` | `--surface-elevated` | 2px `--ring` + 2px offset |
| Secondary CTA | `--surface-raised` | `--surface-elevated` | `--muted` | `--surface` | 2px `--ring` + 2px offset |
| Text/ghost action | transparent | `--muted` | `--surface-elevated` | transparent | 2px `--ring` |
| Input | `--surface-raised` | `--surface-raised` | `--surface-raised` | `--surface` | border `--ring` |
| List/Card | `--surface-raised` | `--surface-elevated` | `--muted` | 50% opacity | 2px `--ring` |

- hover는 포인터 입력에서만 사용한다.
- disabled 상태는 색상만 낮추지 않고 `cursor: not-allowed`, `aria-disabled` 또는 `disabled`를 함께 적용한다.
- 성공/경고/오류는 색상만으로 구분하지 않고 아이콘과 상태 문구를 병기한다.

### 2-4. CSS 변수 정의

```css
:root {
  color-scheme: dark;

  --brand-blue: #286fd8;
  --brand-blue-hover: #2d73dc;
  --brand-blue-active: #2468cf;
  --brand-blue-weak: #183153;
  --brand-blue-weaker: #12243e;
  --on-brand: #ffffff;

  --background: #101013;
  --surface: #17171c;
  --surface-raised: #202027;
  --surface-elevated: #2a2a32;
  --surface-overlay: rgb(8 8 10 / 72%);

  --foreground: #f2f4f6;
  --foreground-secondary: #b0b8c1;
  --foreground-tertiary: #7c8794;
  --foreground-disabled: #535d69;

  --card: #202027;
  --card-foreground: #f2f4f6;
  --muted: #2a2a32;
  --muted-foreground: #9aa4af;
  --accent: #183153;
  --accent-foreground: #86b9ff;
  --border: #303039;
  --border-strong: #454550;
  --ring: #5ba0ff;

  --destructive: #f66570;
  --destructive-weak: #451f25;
  --warning: #f5b94c;
  --warning-weak: #453619;
  --success: #45c98a;
  --success-weak: #173b2c;
  --info: #6aa8ff;
  --info-weak: #183153;
}
```

---

## 3. 타이포그래피 (Typography)

### 3-1. 폰트 패밀리

| 용도 | 폰트 | 적용 |
|---|---|---|
| 전체 UI/본문 | `Pretendard Variable`, `Inter`, system sans-serif | 한국어·숫자·영문을 한 계열로 운용 |
| 코드/고정폭 값 | `ui-monospace`, `SFMono-Regular`, monospace | 토큰 문서와 개발 도구에서만 제한적으로 사용 |

Toss Product Sans는 공개 배포 폰트가 아니므로 실제 프로젝트에는 Pretendard Variable을 우선한다. `next/font`로 제공되지 않으므로 로컬 파일을 보유한 경우 `next/font/local`을 사용하고, 없으면 system sans-serif fallback을 사용한다.

### 3-2. 타입 스케일

| 레벨 | 크기 | 웨이트 | Line-height | Letter-spacing | 용도 | Tailwind |
|---|---:|---:|---:|---:|---|---|
| Display | 28px | 700 | 38px | `-0.02em` | 핵심 결과, 모바일 히어로 | `text-[28px]/[38px] font-bold` |
| H1 | 24px | 700 | 34px | `-0.02em` | 페이지 제목 | `text-2xl/[34px] font-bold` |
| H2 / Headline | 22px | 700 | 31px | `-0.018em` | 섹션 제목 | `text-[22px]/[31px] font-bold` |
| H3 / Title | 17px | 600 | 25px | `-0.012em` | 카드/행 제목 | `text-[17px]/[25px] font-semibold` |
| H4 | 16px | 600 | 24px | `-0.01em` | 서브 헤딩 | `text-base/6 font-semibold` |
| Body L | 16px | 400 | 26px | `-0.01em` | 긴 설명 | `text-base/[26px]` |
| Body M | 15px | 400 | 23px | `-0.01em` | 기본 본문, 버튼 | `text-[15px]/[23px]` |
| Body S | 14px | 400 | 21px | `-0.006em` | 보조 본문 | `text-sm/5` |
| Caption | 13px | 400 | 19px | `0` | 메타 정보 | `text-[13px]/[19px]` |
| Overline | 12px | 600 | 16px | `0.02em` | Badge, 짧은 레이블 | `text-xs/4 font-semibold` |
| Numeric XL | 32px | 700 | 40px | `-0.025em` | 집계 수치/결과 | `text-[32px]/10 font-bold tabular-nums` |

### 3-3. 텍스트 컬러 계층

| 레벨 | 색상 | 용도 |
|---|---|---|
| Primary | `--foreground` | 제목, 본문, 핵심 수치 |
| Secondary | `--foreground-secondary` | 설명, 보조 레이블 |
| Tertiary | `--foreground-tertiary` | 메타, placeholder |
| Disabled | `--foreground-disabled` | 비활성 |
| Inverse | `--on-brand` | 주요 브랜드 면 위 텍스트 |
| Link | `--accent-foreground` | 본문 링크 |

한 블록 안에서는 가급적 Primary와 Secondary 두 단계만 사용한다. 결과 수치에는 `font-variant-numeric: tabular-nums`를 적용한다.

---

## 4. 간격 시스템 (Spacing)

### 4-1. 8px 기반 간격 스케일

| 토큰 | 값 | 사용처 |
|---|---:|---|
| `--space-0-5` | 4px | 아이콘 내부, 아주 작은 간격 |
| `--space-1` | 8px | 아이콘-텍스트, Badge 간격 |
| `--space-1-5` | 12px | 밀접한 컨트롤 |
| `--space-2` | 16px | 기본 내부 패딩 |
| `--space-3` | 24px | 카드 패딩, 폼 그룹 |
| `--space-4` | 32px | 블록 간격 |
| `--space-5` | 40px | 큰 그룹 |
| `--space-6` | 48px | 모바일 섹션 |
| `--space-8` | 64px | 데스크톱 섹션 |
| `--space-10` | 80px | 페이지 주요 구간 |

4px와 12px는 8px 그리드의 보조 단계이며, 페이지 레이아웃은 8px 배수를 우선한다.

### 4-2. 컴포넌트 내부 패딩

| 컴포넌트 | Padding |
|---|---|
| Button sm | `8px 12px` |
| Button md | `12px 16px` |
| Button lg | `16px 20px` |
| Input | `14px 16px` |
| ListRow | `16px 20px` |
| Card mobile | `20px` |
| Card desktop | `24px` |
| Section | 모바일 `0 20px`, 데스크톱 `0 32px` |
| Navigation | 모바일 `0 20px`, 데스크톱 `0 32px` |

### 4-3. 섹션 간격

| 구간 | 간격 |
|---|---:|
| 섹션 ↔ 섹션 | 모바일 48px / 데스크톱 64px |
| 섹션 제목 ↔ 설명 | 8px |
| 헤더 ↔ 첫 콘텐츠 | 24px |
| 본문 ↔ CTA | 24px |
| 폼 필드 ↔ 필드 | 16px |
| 카드 ↔ 카드 | 12px 또는 16px |

---

## 5. 레이아웃 (Layout)

### 5-1. 컨테이너

| 속성 | 값 |
|---|---|
| 기본 최대 너비 | `1200px` |
| 집중형 투표/폼 최대 너비 | `640px` |
| 모바일 좌우 패딩 | `20px` |
| 태블릿 좌우 패딩 | `24px` |
| 데스크톱 좌우 패딩 | `32px` |
| 정렬 | `margin-inline: auto` |

### 5-2. 그리드 시스템

| 화면 | 컬럼 | Gap | 권장 사용 |
|---|---:|---:|---|
| Mobile | 4 | 16px | 한 열 중심 |
| Tablet | 8 | 20px | 2열 카드 |
| Desktop | 12 | 24px | 3~4열 카드, 사이드 패널 |

### 5-3. 반응형 Breakpoints

| 이름 | 최소 너비 | 동작 |
|---|---:|---|
| mobile | 0px | 단일 열, BottomCTA, 20px gutter |
| tablet (`md`) | 768px | 2열 허용, 24px gutter |
| desktop (`lg`) | 1024px | 12컬럼, 고정 TopNav, 32px gutter |
| wide (`xl`) | 1280px | 컨테이너 최대 1200px 고정 |

### 5-4. 레이아웃 패턴

- 투표 참여 흐름은 `max-width: 640px` 단일 열을 기본으로 한다.
- 리스트는 행 전체를 클릭 가능 영역으로 만들고 최소 높이 64px를 유지한다.
- 모바일의 핵심 행동은 safe-area를 포함한 BottomCTA로 고정할 수 있다.
- 데스크톱의 카드 그리드는 정보 밀도보다 스캔 순서를 우선하며 `auto-fit, minmax(280px, 1fr)`을 권장한다.

---

## 6. 엘리먼트 스타일링 (Primitives)

### 6-1. Border Radius

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--radius-none` | 0 | 구분선 |
| `--radius-sm` | 8px | 작은 Badge, tooltip |
| `--radius-md` | 12px | Button, Input |
| `--radius-lg` | 16px | Card, modal |
| `--radius-xl` | 24px | 큰 CTA 영역 |
| `--radius-full` | 9999px | pill, avatar |

### 6-2. 그림자

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-sm` | `0 2px 8px rgb(0 0 0 / 20%)` | sticky nav |
| `--shadow-md` | `0 8px 24px rgb(0 0 0 / 28%)` | dropdown |
| `--shadow-lg` | `0 16px 40px rgb(0 0 0 / 36%)` | modal |
| `--shadow-focus` | `0 0 0 2px #101013, 0 0 0 4px #5BA0FF` | 키보드 focus |

기본 카드는 flat하게 유지하고 border로 경계를 만든다. 그림자는 부유하는 요소에만 사용한다.

### 6-3. 보더

| 토큰 | 값 | 용도 |
|---|---|---|
| 기본 보더 | `1px solid var(--border)` | 카드, 구분선 |
| 강조 보더 | `1px solid var(--border-strong)` | hover input |
| 선택 보더 | `1px solid var(--brand-blue)` | 선택 카드 |
| 오류 보더 | `1px solid var(--destructive)` | 검증 오류 |

### 6-4. 트랜지션 & 애니메이션

| 토큰 | 값 | 용도 |
|---|---|---|
| `--duration-fast` | 120ms | pressed, 작은 색상 변화 |
| `--duration-default` | 200ms | 일반 hover/focus |
| `--duration-slow` | 320ms | modal, sheet |
| `--ease-default` | `ease-in-out` | 기본 |
| `--ease-enter` | `cubic-bezier(.2,.8,.2,1)` | 등장 |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | 퇴장 |

`prefers-reduced-motion: reduce`에서는 비필수 이동 애니메이션을 제거하고 duration을 1ms로 축소한다. 투표 완료 같은 중요한 변화는 색상 전환과 텍스트 갱신으로도 이해할 수 있어야 한다.

---

## 7. 컴포넌트 스펙 (Component Specifications)

### 7-1. Button

#### 개요

페이지의 행동을 실행한다. 한 화면에는 primary 버튼을 원칙적으로 하나만 둔다.

#### Variants

| Variant | 시각적 특징 | 용도 |
|---|---|---|
| primary | Blue fill, 흰 텍스트 | 다음, 투표하기, 확인 |
| secondary | raised surface, 기본 텍스트 | 취소, 보조 행동 |
| ghost | 투명 배경 | 툴바/행 내부 행동 |
| destructive | Red fill 또는 red weak | 삭제, 투표 취소 |

#### Sizes

| Size | 높이 | 패딩 | 폰트 |
|---|---:|---|---:|
| sm | 36px | 8px 12px | 14px/600 |
| md | 44px | 12px 16px | 15px/600 |
| lg | 56px | 16px 20px | 16px/600 |

#### States

| State | 배경 | 텍스트 | 보더/그림자 | 기타 |
|---|---|---|---|---|
| default | variant 토큰 | variant 토큰 | 없음 | 200ms |
| hover | 한 단계 밝게 | 유지 | 없음 | `translateY(-1px)` 선택 |
| active | 한 단계 어둡게 | 유지 | 없음 | scale 0.98 |
| focus | default | 유지 | `--shadow-focus` | `focus-visible`만 |
| disabled | `--surface-elevated` | `--foreground-disabled` | 없음 | opacity 추가 금지 |
| loading | default | 유지 | 없음 | label 유지 + spinner |

#### 구조 (Anatomy)

`[leading icon] [label] [loading spinner]`

#### Tailwind 참고

```tsx
className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 text-[15px] font-semibold text-on-brand transition-[background,transform] duration-200 hover:bg-brand-blue-hover active:scale-[.98] active:bg-brand-blue-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-surface-elevated disabled:text-foreground-disabled"
```

#### 사용 가이드

- Do: 행동형 동사로 짧게 작성한다.
- Don't: 같은 위계의 primary 버튼을 나란히 반복하지 않는다.

### 7-2. BottomCTA

#### 개요

모바일 투표 흐름의 핵심 행동을 화면 하단에 유지한다.

#### Variants / Sizes / States

| 항목 | 규격 |
|---|---|
| default | surface 92% + 상단 border, full-width lg Button |
| with-secondary | 위 primary, 아래 text action |
| 높이 | 버튼 56px + 상하 12px + safe-area |
| 상태 | 내부 Button 상태를 따름 |

#### 구조

`[optional helper] / [primary full-width button] / [safe-area inset]`

#### Tailwind 참고

```tsx
className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md"
```

#### 사용 가이드

- Do: 콘텐츠 하단에 CTA 높이만큼 padding을 확보한다.
- Don't: 키보드가 열린 입력 화면에서 필드를 가리지 않게 한다.

### 7-3. ListRow

#### 개요

후보, 투표, 계정처럼 반복되는 정보를 한 행에 표시한다.

#### Variants

| Variant | 특징 |
|---|---|
| default | 투명/raised surface |
| selectable | radio/check 영역, 선택 시 blue weak |
| navigational | trailing chevron |
| metric | trailing 숫자와 보조 레이블 |

#### Sizes / States

| 항목 | 규격 |
|---|---|
| compact | min-height 56px, `12px 16px` |
| default | min-height 72px, `16px 20px` |
| roomy | min-height 88px, `20px` |
| hover | `--surface-elevated` |
| selected | `--brand-blue-weak`, brand border |
| disabled | foreground-disabled, action 차단 |

#### 구조

`[leading/avatar] [title + description] [optional badge] [trailing value/chevron]`

#### Tailwind 참고

```tsx
className="grid min-h-18 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-5 py-4 transition-colors hover:bg-surface-elevated focus-visible:ring-2 focus-visible:ring-ring data-[selected=true]:bg-brand-blue-weak"
```

#### 사용 가이드

- Do: 행 전체를 클릭 영역으로 사용한다.
- Don't: 한 행에 두 개 이상의 경쟁 행동을 배치하지 않는다.

### 7-4. Card

#### 개요

관련 정보와 행동을 하나의 surface로 묶는다.

#### Variants

| Variant | 특징 |
|---|---|
| flat | raised surface + border, 기본 |
| interactive | hover 시 elevated surface |
| selected | blue weak + blue border |
| result | 큰 숫자와 progress 포함 |

#### Sizes / States

| 항목 | 규격 |
|---|---|
| padding | 모바일 20px, 데스크톱 24px |
| radius | 16px |
| default | `--card`, `--border` |
| hover | `--surface-elevated` |
| focus | `--shadow-focus` |
| disabled | 50% 콘텐츠 명도, 상호작용 차단 |

#### 구조

`[eyebrow/badge] / [title + optional action] / [content] / [optional footer]`

#### Tailwind 참고

```tsx
className="rounded-2xl border border-border bg-card p-5 text-card-foreground transition-[background,transform] duration-200 md:p-6 data-[interactive=true]:hover:-translate-y-0.5 data-[interactive=true]:hover:bg-surface-elevated"
```

#### 사용 가이드

- Do: 한 카드에 하나의 주제를 담는다.
- Don't: 기본 카드에 큰 drop shadow를 쓰지 않는다.

### 7-5. Badge / Tag

#### 개요

짧은 상태나 분류를 표시한다. 행동을 실행하지 않는다.

#### Variants

| Variant | 배경 | 텍스트 |
|---|---|---|
| neutral | `--muted` | `--muted-foreground` |
| info | `--info-weak` | `--info` |
| success | `--success-weak` | `--success` |
| warning | `--warning-weak` | `--warning` |
| destructive | `--destructive-weak` | `--destructive` |

#### Sizes / States

| Size | 높이 | Padding | 폰트 |
|---|---:|---|---:|
| sm | 22px | 3px 8px | 12px/600 |
| md | 28px | 5px 10px | 13px/600 |

상호작용 상태는 없다. 필터처럼 클릭 가능한 요소는 Badge가 아니라 Tab 또는 ToggleButton으로 구현한다.

#### 구조

`[optional status dot/icon] [label]`

#### Tailwind 참고

```tsx
className="inline-flex h-[22px] items-center gap-1 rounded-full bg-success-weak px-2 text-xs font-semibold text-success"
```

#### 사용 가이드

- Do: “진행 중”, “완료”처럼 1~4어절로 작성한다.
- Don't: 색상만으로 상태를 전달하지 않는다.

### 7-6. Tabs

#### 개요

같은 맥락 안에서 콘텐츠 범주를 전환한다.

#### Variants

| Variant | 특징 |
|---|---|
| underline | 하단 2px indicator, 상단 내비게이션 |
| pill | muted track 안의 active surface, 모바일 필터 |

#### Sizes / States

| 항목 | 규격 |
|---|---|
| 높이 | 44px |
| 최소 폭 | 64px |
| inactive | tertiary text |
| hover | foreground-secondary |
| selected | foreground + brand indicator |
| focus | ring |
| disabled | foreground-disabled |

#### 구조

`tablist > [tab] [tab] [tab]`

#### Tailwind 참고

```tsx
className="h-11 border-b-2 border-transparent px-4 text-sm font-semibold text-foreground-tertiary hover:text-foreground-secondary aria-selected:border-brand-blue aria-selected:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
```

#### 사용 가이드

- Do: `role="tablist"`, `role="tab"`, 방향키 이동을 지원한다.
- Don't: 5개가 넘으면 가로 스크롤 또는 다른 정보 구조를 사용한다.

### 7-7. Input / Form Elements

#### 개요

filled surface 안에서 값을 입력하거나 선택한다.

#### Variants

| Variant | 특징 |
|---|---|
| text | 한 줄 입력 |
| amount | 큰 숫자 + 단위 |
| textarea | 여러 줄 |
| select | trailing chevron |
| checkbox/radio | 선택 시 brand fill |

#### Sizes / States

| 항목 | 규격 |
|---|---|
| sm | 44px |
| md | 52px |
| lg | 60px |
| default | raised surface, transparent border |
| hover | strong border |
| focus | brand/ring border |
| error | destructive border + helper |
| disabled | surface + disabled text |

#### 구조

`[label] / [leading icon] [control] [trailing action] / [helper or error]`

#### Tailwind 참고

```tsx
className="h-[52px] w-full rounded-xl border border-transparent bg-surface-raised px-4 text-[15px] text-foreground outline-none placeholder:text-foreground-tertiary hover:border-border-strong focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-surface disabled:text-foreground-disabled"
```

#### 사용 가이드

- Do: placeholder와 별도로 지속되는 label을 제공한다.
- Don't: 오류를 red border만으로 표시하지 않는다.

### 7-8. Navigation Bar

#### 개요

현재 위치와 전역 행동을 제공한다.

#### Variants

| Variant | 특징 |
|---|---|
| top-mobile | 56px, title + back/action |
| top-desktop | 64px, logo + nav + account |
| bottom-nav | 64px + safe area, 최대 5개 |

#### States

| State | 스타일 |
|---|---|
| default | surface |
| scrolled | bottom border + shadow-sm |
| active item | foreground + brand indicator |
| inactive item | tertiary |
| focus | ring |

#### 구조

`[leading/back/logo] [title/nav items] [actions/profile]`

#### Tailwind 참고

```tsx
className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-surface/95 px-5 backdrop-blur-md md:h-16 md:px-8"
```

#### 사용 가이드

- Do: 현재 위치를 텍스트와 `aria-current`로 표시한다.
- Don't: 반투명 효과가 콘텐츠 가독성을 낮추면 solid surface로 대체한다.

### 7-9. Section Header

#### 개요

섹션의 제목, 설명, 선택 행동을 묶는다.

#### Variants / Sizes / States

| Variant | 제목 | 간격 | 행동 |
|---|---|---:|---|
| page | H1 24px | 하단 24px | 최대 1개 |
| section | H2 22px | 하단 16px | optional link |
| card | H3 17px | 하단 12px | icon button 가능 |

상호작용 상태는 내부 Link/Button이 담당한다.

#### 구조

`[eyebrow] / [title + action] / [description]`

#### Tailwind 참고

```tsx
className="flex items-end justify-between gap-4 [&_p]:mt-2 [&_p]:text-sm [&_p]:text-foreground-secondary"
```

#### 사용 가이드

- Do: 제목만 읽어도 섹션의 목적이 드러나게 한다.
- Don't: 설명에 행동 지시를 길게 섞지 않는다.

### 7-10. Stats / Metric Display

#### 개요

투표 수, 참여율, 순위 같은 핵심 결과를 표시한다.

#### Variants

| Variant | 특징 |
|---|---|
| standalone | Numeric XL + label |
| inline | 17px semibold + 보조 단위 |
| result | progress + count + percentage |

#### States

| State | 스타일 |
|---|---|
| normal | foreground |
| leading | accent-foreground + optional crown |
| updated | 200ms color fade, live text |
| loading | 폭 고정 skeleton |

#### 구조

`[label] / [value + unit] / [delta or progress]`

#### Tailwind 참고

```tsx
className="text-[32px]/10 font-bold tracking-[-0.025em] text-foreground tabular-nums"
```

#### 사용 가이드

- Do: 숫자, 단위, 기준 시점을 함께 제공한다.
- Don't: 순위나 증감을 색상만으로 표현하지 않는다.

### 7-11. Process / Step Indicator

#### 개요

여러 단계의 투표 생성·참여 흐름에서 현재 위치를 표시한다.

#### Variants

| Variant | 특징 |
|---|---|
| dots | 모바일 짧은 흐름 |
| numbered | 단계 이름이 중요한 흐름 |
| progress | 단계가 많고 공간이 좁은 경우 |

#### States

| State | 배경 | 텍스트/아이콘 |
|---|---|---|
| upcoming | muted | tertiary |
| current | brand-blue | on-brand |
| complete | success-weak | success + check |
| error | destructive-weak | destructive |

#### 구조

`[step] — [connector] — [step]`

#### Tailwind 참고

```tsx
className="grid size-8 place-items-center rounded-full bg-brand-blue text-sm font-semibold text-on-brand aria-current:outline aria-current:outline-2 aria-current:outline-offset-2 aria-current:outline-ring"
```

#### 사용 가이드

- Do: `aria-current="step"`을 사용한다.
- Don't: 사용자가 이동할 수 없는 단계를 링크처럼 보이게 하지 않는다.

### 7-12. Footer

#### 개요

법적 정보, 고객지원, 보조 링크를 페이지 끝에 제공한다.

#### Variants / Sizes / States

| 항목 | 규격 |
|---|---|
| compact | 상하 24px, 작은 제품 화면 |
| full | 상하 40px, 링크 그룹 |
| 배경 | `--surface` |
| border | 상단 `--border` |
| 링크 hover/focus | accent-foreground / ring |

#### 구조

`[brand/legal] [link groups] [copyright]`

#### Tailwind 참고

```tsx
className="border-t border-border bg-surface px-5 py-6 text-[13px] text-foreground-tertiary md:px-8 md:py-10"
```

#### 사용 가이드

- Do: 핵심 흐름을 방해하지 않는 보조 위계를 유지한다.
- Don't: 모바일의 BottomCTA와 겹치지 않게 한다.

### 7-13. Link / Anchor

#### 개요

다른 위치로 이동한다. 실행 행동은 Button을 사용한다.

#### Variants / States

| Variant | Default | Hover | Focus | Visited |
|---|---|---|---|---|
| inline | accent-foreground, underline 선택 | underline | ring | 동일 색상 |
| subtle | secondary | foreground | ring | 동일 색상 |
| standalone | accent-foreground + arrow | 더 밝게 | ring | 동일 색상 |

#### 구조

`[label] [optional external/arrow icon]`

#### Tailwind 참고

```tsx
className="rounded-sm text-accent-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
```

#### 사용 가이드

- Do: 링크 텍스트만으로 목적지를 이해할 수 있게 한다.
- Don't: “여기”만을 링크로 사용하지 않는다.

### 7-14. Container / Layout Wrapper

#### 개요

페이지의 폭, gutter, 콘텐츠 정렬을 일관되게 유지한다.

#### Variants

| Variant | 최대 폭 | 용도 |
|---|---:|---|
| default | 1200px | 목록/대시보드 |
| focused | 640px | 투표/폼/설정 |
| full | 없음 | edge-to-edge 배경 |

#### 구조

`full-width section > centered container > grid/content`

#### Tailwind 참고

```tsx
className="mx-auto w-full max-w-[1200px] px-5 md:px-6 lg:px-8"
```

#### 사용 가이드

- Do: 배경은 full-width, 읽는 콘텐츠는 container 안에 둔다.
- Don't: 개별 페이지마다 임의 gutter를 만들지 않는다.

---

## 8. 아이코노그래피 & 미디어

### 8-1. 아이콘 시스템

- 라이브러리: `lucide-react`
- 기본 크기: 24px, 작은 컨트롤 20px, Badge/Caption 16px
- Stroke: 2px, 작은 아이콘은 시각 보정을 위해 2px 유지
- 색상: 주변 텍스트의 `currentColor` 상속
- 아이콘 단독 버튼: 최소 44×44px hit area와 접근 가능한 이름 필수
- 상태 아이콘: 성공 `CircleCheck`, 경고 `TriangleAlert`, 오류 `CircleX`, 정보 `Info`

### 8-2. 이미지 처리

| 유형 | 비율 | 처리 |
|---|---|---|
| Avatar | 1:1 | 원형, `object-fit: cover` |
| 후보/선택지 썸네일 | 4:3 또는 1:1 | radius 12px, cover |
| 카드 배너 | 16:9 | radius 16px, cover |

- 로딩 중에는 `--muted` 기반 skeleton을 사용한다.
- 이미지 위 텍스트는 피한다. 불가피하면 하단 방향의 검정 overlay를 사용하고 대비를 검증한다.
- 장식 이미지는 빈 alt, 정보 이미지는 목적 중심의 alt를 제공한다.

---

## 9. 인터랙션 패턴

### 9-1. Hover

| 대상 | 효과 |
|---|---|
| Button | 배경 한 단계 변화, 선택적으로 -1px |
| Card/ListRow | surface-raised → surface-elevated |
| Link | underline 또는 명도 상승 |
| IconButton | muted 원형/rounded 배경 |

hover 효과는 `@media (hover: hover)` 환경에만 적용한다.

### 9-2. Focus

| 대상 | 스타일 |
|---|---|
| Button/Card/Link | 2px ring + 2px background offset |
| Input | ring border + 20% halo |
| Tab | ring 또는 명확한 indicator |

모든 키보드 상호작용 요소는 `:focus-visible`을 사용하며 outline을 제거한 경우 반드시 ring으로 대체한다.

### 9-3. Loading

| 패턴 | 적용 대상 |
|---|---|
| 16~20px spinner | Button, 짧은 저장 |
| skeleton | Card, ListRow, 결과 수치 |
| progress bar | 투표 제출/파일 처리 |
| optimistic + pending label | 선택/좋아요처럼 되돌릴 수 있는 행동 |

Button 로딩 중에는 폭이 변하지 않도록 기존 label을 시각적으로 유지하거나 최소 폭을 고정한다. 비동기 결과 영역은 `aria-live="polite"`를 사용한다.

### 9-4. Feedback

- 성공: 짧은 toast + 필요한 경우 화면 내 영구 상태
- 오류: 필드 근처 메시지 + 페이지 상단 요약(필드가 여러 개일 때)
- 위험 행동: 되돌릴 수 없을 때만 확인 dialog
- 투표 제출 완료: 결과와 다음 행동을 같은 화면에 명확히 제공

---

## 10. 실제 적용 가이드

### 10-1. Tailwind CSS 4 토큰 매핑

현재 프로젝트는 Tailwind CSS 4이므로 `tailwind.config.js`의 `theme.extend`보다 `globals.css`의 `@theme inline`을 사용한다.

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-surface-elevated: var(--surface-elevated);
  --color-foreground: var(--foreground);
  --color-foreground-secondary: var(--foreground-secondary);
  --color-foreground-tertiary: var(--foreground-tertiary);
  --color-foreground-disabled: var(--foreground-disabled);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-ring: var(--ring);
  --color-brand-blue: var(--brand-blue);
  --color-brand-blue-hover: var(--brand-blue-hover);
  --color-brand-blue-active: var(--brand-blue-active);
  --color-brand-blue-weak: var(--brand-blue-weak);
  --color-on-brand: var(--on-brand);
  --color-destructive: var(--destructive);
  --color-destructive-weak: var(--destructive-weak);
  --color-warning: var(--warning);
  --color-warning-weak: var(--warning-weak);
  --color-success: var(--success);
  --color-success-weak: var(--success-weak);
  --color-info: var(--info);
  --color-info-weak: var(--info-weak);
  --font-sans: "Pretendard Variable", Inter, ui-sans-serif, system-ui, sans-serif;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### 10-2. `globals.css` 다크 전용 전체 코드

```css
@import "tailwindcss";

:root {
  color-scheme: dark;
  --brand-blue: #286fd8;
  --brand-blue-hover: #2d73dc;
  --brand-blue-active: #2468cf;
  --brand-blue-weak: #183153;
  --brand-blue-weaker: #12243e;
  --on-brand: #ffffff;
  --background: #101013;
  --surface: #17171c;
  --surface-raised: #202027;
  --surface-elevated: #2a2a32;
  --surface-overlay: rgb(8 8 10 / 72%);
  --foreground: #f2f4f6;
  --foreground-secondary: #b0b8c1;
  --foreground-tertiary: #7c8794;
  --foreground-disabled: #535d69;
  --card: #202027;
  --card-foreground: #f2f4f6;
  --muted: #2a2a32;
  --muted-foreground: #9aa4af;
  --accent: #183153;
  --accent-foreground: #86b9ff;
  --border: #303039;
  --border-strong: #454550;
  --ring: #5ba0ff;
  --destructive: #f66570;
  --destructive-weak: #451f25;
  --warning: #f5b94c;
  --warning-weak: #453619;
  --success: #45c98a;
  --success-weak: #173b2c;
  --info: #6aa8ff;
  --info-weak: #183153;
  --duration-fast: 120ms;
  --duration-default: 200ms;
  --duration-slow: 320ms;
  --ease-default: ease-in-out;
  --shadow-sm: 0 2px 8px rgb(0 0 0 / 20%);
  --shadow-md: 0 8px 24px rgb(0 0 0 / 28%);
  --shadow-lg: 0 16px 40px rgb(0 0 0 / 36%);
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-surface-elevated: var(--surface-elevated);
  --color-foreground: var(--foreground);
  --color-foreground-secondary: var(--foreground-secondary);
  --color-foreground-tertiary: var(--foreground-tertiary);
  --color-foreground-disabled: var(--foreground-disabled);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-ring: var(--ring);
  --color-brand-blue: var(--brand-blue);
  --color-brand-blue-hover: var(--brand-blue-hover);
  --color-brand-blue-active: var(--brand-blue-active);
  --color-brand-blue-weak: var(--brand-blue-weak);
  --color-on-brand: var(--on-brand);
  --color-destructive: var(--destructive);
  --color-destructive-weak: var(--destructive-weak);
  --color-warning: var(--warning);
  --color-warning-weak: var(--warning-weak);
  --color-success: var(--success);
  --color-success-weak: var(--success-weak);
  --color-info: var(--info);
  --color-info-weak: var(--info-weak);
  --font-sans: "Pretendard Variable", Inter, ui-sans-serif, system-ui, sans-serif;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

* {
  border-color: var(--border);
}

html {
  background: var(--background);
}

body {
  min-height: 100dvh;
  background: var(--background);
  color: var(--foreground);
  font-family: "Pretendard Variable", Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.01em;
  text-rendering: optimizeLegibility;
}

::selection {
  background: var(--brand-blue-weak);
  color: var(--foreground);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

다크 모드 전용이므로 `.dark` 클래스와 `prefers-color-scheme` 분기를 만들지 않는다. 브라우저 기본 컨트롤도 어둡게 렌더링되도록 `color-scheme: dark`를 루트에 고정한다.

### 10-3. shadcn/ui 도입 시 매핑

현재 프로젝트에는 shadcn/ui가 설치되어 있지 않다. 추후 도입한다면 다음처럼 매핑한다.

| shadcn 토큰 | 프로젝트 토큰 |
|---|---|
| `background` | `--background` |
| `foreground` | `--foreground` |
| `card` | `--card` |
| `primary` | `--brand-blue` |
| `primary-foreground` | `--on-brand` |
| `secondary` | `--surface-raised` |
| `secondary-foreground` | `--foreground` |
| `muted` | `--muted` |
| `muted-foreground` | `--muted-foreground` |
| `accent` | `--accent` |
| `accent-foreground` | `--accent-foreground` |
| `destructive` | `--destructive` |
| `border` / `input` | `--border` / `--border-strong` |
| `ring` | `--ring` |

- Button: 기본 radius를 12px, md 높이를 44px, lg 높이를 56px로 조정한다.
- Card: shadow를 제거하고 border + raised surface로 변경한다.
- Input: outline형 대신 filled surface를 기본으로 한다.
- Badge: full radius와 weak semantic 배경을 사용한다.
- Tabs: keyboard roving focus는 유지하고 시각 스타일만 교체한다.
- Dialog/Sheet: overlay는 `--surface-overlay`, content는 `--surface-raised`를 사용한다.

---

## 11. 접근성 체크리스트

- 본문 텍스트와 배경은 WCAG 2.2 AA 이상을 목표로 하고, 출시 전 APCA도 함께 확인한다.
- 14px 이하 텍스트에는 tertiary 색상을 긴 문장으로 사용하지 않는다.
- 모든 클릭/터치 영역은 최소 44×44px를 확보한다.
- focus-visible을 항상 제공하고, 포커스 순서를 시각적 순서와 일치시킨다.
- 상태를 색상만으로 전달하지 않고 텍스트 또는 아이콘을 함께 쓴다.
- 확대 200%와 모바일 가로 320px에서도 핵심 흐름이 손실되지 않아야 한다.
- 로딩/완료/오류 변화는 `aria-live`로 보조기기에 전달한다.
- `prefers-reduced-motion`과 OS 텍스트 확대에 대응한다.

---

## 부록

### A. 전체 토큰 매핑 요약

| CSS 변수 | Tailwind 유틸리티 | 값 |
|---|---|---:|
| `--background` | `bg-background` | `#101013` |
| `--surface` | `bg-surface` | `#17171C` |
| `--surface-raised` | `bg-surface-raised` | `#202027` |
| `--surface-elevated` | `bg-surface-elevated` | `#2A2A32` |
| `--foreground` | `text-foreground` | `#F2F4F6` |
| `--foreground-secondary` | `text-foreground-secondary` | `#B0B8C1` |
| `--foreground-tertiary` | `text-foreground-tertiary` | `#7C8794` |
| `--brand-blue` | `bg-brand-blue` / `text-brand-blue` | `#286FD8` |
| `--brand-blue-weak` | `bg-brand-blue-weak` | `#183153` |
| `--accent-foreground` | `text-accent-foreground` | `#86B9FF` |
| `--border` | `border-border` | `#303039` |
| `--ring` | `ring-ring` | `#5BA0FF` |
| `--destructive` | `text-destructive` | `#F66570` |
| `--warning` | `text-warning` | `#F5B94C` |
| `--success` | `text-success` | `#45C98A` |
| `--info` | `text-info` | `#6AA8FF` |

### B. 다크 전용 원본 팔레트

```text
Neutral: #101013 #17171C #202027 #2A2A32 #303039 #454550
Text:    #F2F4F6 #B0B8C1 #9AA4AF #7C8794 #535D69
Blue:    #12243E #183153 #2468CF #286FD8 #2D73DC #5BA0FF #86B9FF
Red:     #451F25 #F66570
Yellow:  #453619 #F5B94C
Green:   #173B2C #45C98A
```

### C. 검증 결과

- [x] 참조 페이지의 원칙, 8px 간격, radius, motion, typography, component 예시 반영
- [x] 다크 모드만 정의하고 라이트 모드 토큰/분기 제거
- [x] Button, BottomCTA, ListRow, Card, Badge, Tab, Input 등 핵심 패턴 문서화
- [x] 필수 검토 컴포넌트와 상태/구조/구현 참고/사용 가이드 포함
- [x] Tailwind CSS 4의 `@theme inline` 형식에 맞춰 적용 코드 제공
- [x] 복사 가능한 다크 전용 `globals.css` 예시 제공
- [ ] 실제 제품 화면 구현 후 브라우저에서 APCA/WCAG 및 색각 시뮬레이션 재검증

### D. 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-27 | Buildersgate TDS 참조 기반 다크 전용 초안 생성 |
