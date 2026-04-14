# 유저 리서치 - AI 코딩 비용 Pain Point 문서
날짜: 2026-04-14
소스: HN Algolia, Reddit 언급 수집

## 핵심 페르소나 (Pain Point 기반)

### 페르소나 A: "한도 초과 당한 파워 유저" 
- Claude Code Max ($200/월) 사용
- 하루 4-8시간 에이전틱 코딩
- 주간 한도를 2-3일 안에 소진
- 실제 인용: "I burned my week quota working on one small repo for one working day"
- 니즈: 실시간 사용량 경보, 한도 예측

### 페르소나 B: "에이전트 빌더 (과금 폭탄 공포)"
- 멀티-에이전트 시스템 구축
- 에이전트 루프 버그 → 하룻밤 $500-$2,000 청구 경험
- 실제 인용: "Your AI agent hits an infinite loop and racks up $2000 in API charges overnight. This happens weekly."
- 니즈: 실시간 킬스위치, 예산 캡, 비정상 패턴 감지

### 페르소나 C: "주말 코더 (가격 민감형)"
- 월 20-30시간 Claude Code 사용
- $100/월 Max는 과다, $20/월 Pro는 금방 한도
- 실제 인용: "Developers shouldn't pay $240/year if you only code on weekends"
- 니즈: 사용량 기반 플랜 추천, 최적 플랜 계산기

### 페르소나 D: "팀 리더 (AI 지출 책임자)"
- 5-20명 엔지니어링 팀
- 팀 전체 AI 도구 비용 추적 필요
- Cursor per-seat 모델에 불만
- 실제 인용: "Their pricing model per-user doesn't make sense when what I want is to enable anyone in the company"
- 니즈: 팀원별 비용 분리, 월별 AI 지출 리포트, 팀 예산 설정

---

## 자주 언급된 경쟁 솔루션/워크어라운드

### 현재 유저들이 쓰는 임시방편
1. **ccusage** (CLI): Claude Code 사용량 추적하는 비공식 CLI. HN에서 여러 번 언급됨.
2. **PolyClaude**: 수학 기반으로 여러 Pro 계정 돌리는 비공식 해결책
3. **AgentGuard**: 에이전트 비용 킬스위치 (독립 도구, Aug 2025 Show HN)
4. **수동 추적**: 스프레드시트 + 월말 청구서 확인 (대부분)
5. **OpenRouter**: 비용 추적 기능이 있는 API 중계 서비스

### 유저들이 찾는 것 (하지만 없는 것)
- Claude Code 세션 레벨 비용 분석
- 에이전트 루프 비용 예측
- "이 태스크에 얼마 쓸 것 같아?" 사전 예측
- 플랜 최적화 추천 ("당신 패턴이면 X 플랜이 $Y 절약")
- 팀 레벨 AI 지출 대시보드

---

## Reddit 발견 (HN 데이터 보완)

*직접 스크래핑 불가 (Reddit API 제한), HN 스레드에서 교차 언급된 Reddit 내용 요약:*

**r/ClaudeAI 공통 불만:**
- "왜 갑자기 한도 초과야?" - 플랜 정책 변경 알림 없이 한도 타이트해짐
- "Opus vs Sonnet 비용 차이가 너무 큼" - 어떤 태스크에 어떤 모델 쓸지 모름
- "컨텍스트 창 크게 하면 왜 느려지냐" - 성능+비용 트레이드오프 이해 부족

**r/ChatGPT (AI 코딩 일반):**
- "Cursor Pro에서 Claude Max로 바꿨는데 더 비쌈" - AI 코딩 도구 간 비용 비교 수요
- "코파일럿 vs 커서 vs 클로드코드 어떤 게 저렴하나" - 비교 도구 수요

---

## 핵심 인사이트 요약

### 즉각적인 마케팅 기회
1. **"ccusage 대신 ClaudeTrack"** - CLI 도구 쓰는 유저 대상 더 좋은 UX 제공
2. **AgentGuard 유저 중복** - 비용 킬스위치 + 추적을 하나로
3. **Helicone 이탈 유저** - 유사 기능 + Claude Code 특화 강점

### 제품 우선순위 시사점
1. **P0**: 세션 레벨 실시간 비용 표시
2. **P0**: 예산 초과 알림 (Slack/Email)
3. **P1**: 태스크별 비용 분류
4. **P1**: 모델 선택 최적화 제안 (Opus vs Sonnet 비용 비교)
5. **P2**: 팀 대시보드 (공동 추적)
6. **P2**: 에이전트 루프 이상 감지 (runaway 비용 방지)
