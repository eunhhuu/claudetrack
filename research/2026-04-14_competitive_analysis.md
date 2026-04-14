# 경쟁사 분석 & ClaudeTrack 차별화 전략
날짜: 2026-04-14

## 경쟁사 현황 요약

### 🟡 Helicone (helicone.ai) — ⚠️ 인수됨 (MAINTENANCE MODE)
- **상태**: 2026-03-03 Mintlify에 인수됨. 보안/버그 수정만. 신규 기능 개발 없음.
- **가격**: Free(10K req/월) → Pro $79/월 → Team $799/월 → Enterprise 커스텀
- **강점**: AI 게이트웨이(프록시 기반), 원라인 통합, OpenAI/Anthropic 지원
- **약점**: ❌ 사실상 죽은 제품. ~16K 조직이 대안을 찾는 중. 신규 기능 없음.
- **ClaudeTrack 기회**: 헬리콘 이탈 유저 직접 타겟팅 가능

### 🟢 Langfuse (langfuse.com) — ✅ 가장 강한 경쟁자
- **상태**: v4 론칭(2026-03). 활발한 개발. 25K GitHub stars.
- **가격**: Free(50K units/월) → Core $29/월 → Pro $199/월 → Enterprise $2,499/월
- **강점**: 오픈소스, 강력한 평가 기능, LangChain/LlamaIndex 통합, EU/US 클라우드
- **약점**: AI 게이트웨이 없음(LiteLLM 의존), $29→$199 가격 점프 급격함, Claude Code 특화 기능 없음
- **ClaudeTrack 기회**: Claude Code 특화 + 더 단순한 UX + 저렴한 가격

### 🔵 LangSmith (smith.langchain.com) — ✅ 엔터프라이즈 타겟
- **상태**: 활발한 개발. Deployment/Fleet 기능 추가로 올인원 플랫폼화.
- **가격**: Free(5K traces/월) → Plus $39/seat/월 → Enterprise 커스텀
- **강점**: 가장 풍부한 기능셋, eval+deployment+observability 올인원
- **약점**: LangChain 브랜드 연상, 복잡한 가격 구조, 오픈소스 없음, 개인/소팀에 비쌈
- **ClaudeTrack 기회**: 개인 개발자/소팀용 더 단순하고 저렴한 솔루션

### 🟠 Portkey (portkey.ai) — ✅ 게이트웨이 집중
- **가격**: Free(10K logs/월) → Production $49/월 → Enterprise 커스텀
- **강점**: AI 게이트웨이 기능(폴백, 로드밸런싱, 캐싱, 가상 키 관리)
- **약점**: 관측성이 게이트웨이에 종속, eval 워크플로우 약함
- **ClaudeTrack 기회**: 순수 비용 추적 + 인사이트에 집중

### 🆕 신규 경쟁자 (소규모/니치)
- **ccusage**: CLI 기반 Claude Code 사용량 추적 (HN 유저들이 자주 언급)
- **AgentGuard**: 에이전트 비용 자동 킬 스위치 (Aug 2025 Show HN)
- **PolyClaude**: 수학으로 Claude Code 비용 절약 (Mar 2026 Show HN)

---

## ClaudeTrack 차별화 포인트 (업데이트)

### 🎯 포지셔닝: "Claude Code 개발자를 위한 AI 지출 관제탑"

#### 차별점 #1: Claude Code 네이티브 특화
- 경쟁사들은 OpenAI/Anthropic 등 범용 지원
- ClaudeTrack은 **Claude Code 세션에 완전히 특화**
- Claude Code의 세션 구조, CLAUDE.md, 에이전트 루프를 깊이 이해
- 경쟁사가 따라오기 어려운 깊이

#### 차별점 #2: 개인 개발자 친화적 가격
- Langfuse: $29-$199/월 / LangSmith: $39/seat/월
- ClaudeTrack: 개인 무료 + 유료도 $9-19/월 수준으로 진입 가능
- 헤비 유저/팀만 Pro 플랜으로 업셀

#### 차별점 #3: "얼마나 썼나"가 아닌 "얼마나 효율적인가"
- 경쟁사: 비용 로깅/추적이 주
- ClaudeTrack: **ROI 시각화** - 투입 비용 대비 완성된 태스크 추적
- "이 세션에서 $12 썼는데, PR 3개 머지됨" 식의 가치 증명

#### 차별점 #4: 실시간 예산 가드레일
- HN Pain Point #2: 하룻밤에 $2,000 날리는 사례 주간 발생
- ClaudeTrack: 일별/세션별 예산 한도 + Slack/Email 알림
- "월 $100 한도 80% 도달 시 알림" 등 맞춤형 트리거

#### 차별점 #5: Helicone 이탈 유저 흡수 기회
- 헬리콘 16K 조직이 대안 탐색 중
- 마케팅: "Helicone이 인수됐나요? ClaudeTrack으로 이전하세요"
- 온보딩 가이드: Helicone → ClaudeTrack 마이그레이션

---

## 가격 전략 (재검토)

### 현재 시장 벤치마크
| 제품 | 무료 | 입문 | Pro |
|------|------|------|-----|
| Helicone | 10K req/월 | $79/월 | $799/월 |
| Langfuse | 50K units/월 | $29/월 | $199/월 |
| LangSmith | 5K traces/월 | $39/seat/월 | Enterprise |
| Portkey | 10K logs/월 | $49/월 | Enterprise |

### ClaudeTrack 권장 가격 (제안)

**무료 플랜 (Starter)**
- 개인 개발자 무료
- 월 1,000 세션 추적
- 30일 기록 보관
- 기본 대시보드
- 이메일 알림 1개

**Pro 플랜 - $12/월 또는 $99/년**
- 무제한 세션 추적
- 90일 기록 보관
- 팀원 3명까지
- 실시간 예산 알림 (Slack + Email)
- CSV/JSON 내보내기
- API 접근

**Team 플랜 - $39/월 또는 $299/년**
- 팀원 무제한
- 1년 기록 보관
- 프로젝트별/팀원별 비용 분리
- 월별 리포트 자동 발송
- 우선 지원

### 가격 전략 근거
1. **LLM 관측성 시장 평균($49-79/월)보다 50-70% 저렴** → 개인 개발자 첫 진입 장벽 낮춤
2. **$99/년 옵션**: "12개월치 카드 한 번에" 선호하는 개발자 공략
3. **Claude Code Max($200/월) 대비 Pro 플랜($12/월)**: "Claude에 $200 쓰는데 추적에 $12 못 쓰겠어?" 포지셔닝
4. **무료 플랜 관대하게**: Product Hunt/HN에서 무료로 써보고 → 자연스럽게 Pro 전환
