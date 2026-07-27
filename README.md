# AI Model Index

격주 최고의 AI 모델을 선택하고 이유를 공유하는 다크 모드 설문조사입니다. Supabase를 데이터 저장소로 사용하며 PIN 기반 관리자 콘솔에서 선택지와 실시간 결과를 관리합니다.

## 주요 기능

- 닉네임 → 3D 모델 선택 → 선정 이유 → 5초 처리 → 완료의 5단계 설문
- CSS 3D + GSAP 선택지와 Framer Motion 화면 전환
- 같은 사용자의 재투표 시 최신 내용으로 갱신
- 관리자 PIN 로그인과 선택지 CRUD
- 3초 polling 기반 실시간 3D 가로 막대 및 개별 응답
- 월요일 KST 날짜 경계 필터와 Vercel Cron 기반 주간 투표 초기화
- 홈 화면 설치, 독립 실행, 앱 셸 캐시를 지원하는 PWA

## Supabase 준비

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/migrations/202607270001_initial_vote_schema.sql`을 실행합니다.
3. Project Connect 또는 Settings → API Keys에서 URL, Publishable Key, Secret Key를 복사합니다.
4. `.env.example`을 참고해 `.env.local`과 Vercel 환경변수를 설정합니다.

`options`와 `votes` 테이블은 RLS가 활성화되고 공개 역할의 직접 접근은 차단됩니다. 데이터 작업은 검증된 Next.js Route Handler에서만 서버 전용 Secret Key로 처리합니다.

## 환경변수

| 이름 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 브라우저에 노출 가능한 Publishable Key |
| `SUPABASE_SECRET_KEY` | 서버 전용 Secret Key, 브라우저 노출 금지 |
| `SUPABASE_DB_PASSWORD` | 로컬 마이그레이션용 DB 비밀번호, 배포 런타임에서는 불필요 |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI·MCP 연결용 개인 토큰, 배포 런타임에서는 불필요 |
| `ADMIN_PIN` | 관리자 PIN, 4자 이상 |
| `SESSION_SECRET` | 관리자·투표 쿠키 서명 키, 16자 이상 |
| `CRON_SECRET` | Vercel Cron Bearer 인증 키 |

## 실행

```bash
npm install
npm run dev
```

- 사용자 설문: `http://localhost:3000`
- 관리자 콘솔: `http://localhost:3000/admin`

## PWA

프로덕션 환경에서는 `/sw.js` 서비스 워커가 자동 등록됩니다. 앱 매니페스트와 192px·512px 아이콘, Apple 홈 화면 아이콘, 파비콘이 포함되어 있으며 HTTPS 배포 후 브라우저의 홈 화면 설치 기능을 사용할 수 있습니다. API 응답은 캐시하지 않아 투표 선택지와 관리자 결과는 항상 네트워크의 최신 데이터를 사용합니다.

## 주간 초기화

`vercel.json`은 매주 일요일 `15:00 UTC`에 `/api/cron/reset`을 호출합니다. 이는 월요일 `00:00 KST`입니다. 초기화 API는 `votes` 테이블의 투표 데이터만 삭제하며 `options` 테이블의 투표 항목은 유지합니다. Vercel Cron 실행이 조금 지연되더라도 결과 API는 현재 KST 주의 월요일 이후 데이터만 집계합니다.

로컬에서 Cron을 검증하려면 다음처럼 호출합니다.

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/reset
```
