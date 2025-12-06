# Wiki Racing UI 개선 가이드라인 (Figma 기반)

## 1. Figma 디자인 분석 (Given-When-Then)

Figma 디자인은 **Given-When-Then** 패턴으로 구성되어 있으며, 각 프레임별 기능 요구사항은 다음과 같습니다.

---

### Frame 1: 메인 화면 (WIKIRACING)

*   **GIVEN** (초기 상태)
    *   흰색 배경의 메인 화면 중앙에 "WIKIRACING" 타이틀이 표시된다.
    *   중앙에 빨간색 "Play" 버튼(CTA)이 있다.
    *   우측 상단에 어두운 색상의 "Leaderboard" 버튼이 있다.
    *   하단에 "쉬운 난이도", "랜덤 난이도"를 선택할 수 있는 난이도 선택 컴포넌트(보라색 체크박스)가 있다.
    *   "역링크 허용" 체크박스 옵션이 있다.
    *   "보관함", "도움말" 버튼이 있다.

*   **WHEN** (사용자 액션)
    *   "Play" 버튼을 클릭한다.
    *   "Leaderboard" 버튼을 클릭한다.
    *   "역링크 허용" 체크박스를 토글한다.
    *   난이도 옵션을 변경한다.

*   **THEN** (기대 결과)
    *   **게임 시작**: 게임 플레이 화면(Frame 2)으로 전환된다.
    *   **리더보드 이동**: 리더보드 화면(Frame 3)으로 전환된다.
    *   **역링크 모드**: 역링크 허용 여부 상태가 변경된다. (게임 플레이 시 반영)
    *   **난이도 변경**: 게임 난이도 상태가 변경된다. (게임 플레이 시 반영)

---

### Frame 2: 게임 플레이 화면 (노드 트리)

*   **GIVEN** (초기 상태)
    *   **상단 경로 바**: `Start → ... → NOW → ... → GOAL` 형태의 경로가 표시된다. 현재 문서는 "NOW"로 강조(빨간색)된다.
    *   **중앙 노드**: 원형 영역에 현재 문서와 연결된 링크들이 노드(text1, text2, ...) 형태로 시각화된다.
    *   **우측 Git Branch**: "목록 보기" 버튼 클릭 시, 방문 기록이 Git 브랜치 형태로 표시된다. 각 노드는 상태에 따라 다른 색상(노랑, 분홍 등)으로 구분되고, 탐색 깊이(S1, S2...)가 표시된다.

*   **WHEN** (사용자 액션)
    *   중앙의 **링크 노드(예: text8)를 클릭**한다.
    *   상단 경로 바의 **"before" 버튼을 클릭**한다.
    *   우측의 **"목록 보기" 버튼을 클릭**한다.
    *   우측 Git Branch 뷰의 **특정 노드를 클릭**한다.

*   **THEN** (기대 결과)
    *   **노드 이동**: 클릭한 노드가 새로운 "NOW"가 되며, 중앙 노드와 상단 경로 바, 우측 Git Branch 뷰가 모두 업데이트된다.
        *   링크 목록을 불러오는 동안에는 **스켈레톤 UI**가 표시된다.
        *   만약 목표(GOAL) 문서가 링크 목록에 포함되어 있다면, 해당 노드는 **초록색으로 강조**된다.
    *   **이전 페이지 이동**: "before" 버튼 클릭 시 이전 방문 문서로 상태가 되돌아간다. (첫 페이지에서는 비활성화)
    *   **Git Branch 뷰 토글**: 우측에 Git Branch 형태의 방문 기록 패널이 나타나거나 사라진다.
        *   **역링크 허용 시**: 현재 노드와 연결된 모든 문서(순방향, 역방향)가 표시된다.
        *   **역링크 비허용 시**: 방문했던 순차적인 경로만 표시된다.

---

### Frame 3: 리더보드 화면

*   **GIVEN** (초기 상태)
    *   "Leaderboard" 제목과 함께 순위 목록이 아코디언 UI로 제공된다.
    *   각 항목은 접혀 있으며, 플레이어 정보(Title)와 펼침 아이콘(chevron down)이 표시된다.

*   **WHEN** (사용자 액션)
    *   특정 **순위 항목(플레이어)을 클릭**한다.

*   **THEN** (기대 결과)
    *   클릭한 항목이 펼쳐지면서(애니메이션 동반), 해당 플레이어의 게임 경로가 **Git Branch 형태로 시각화**되어 표시된다.
    *   다른 항목을 클릭하면 이전에 열렸던 항목은 접히고 새로 선택한 항목이 펼쳐진다.

---

## 2. 구현 요구사항 및 체크리스트

### P1: 핵심 기능

#### 메인 화면 (Frame 1)
- [x] `WIKIRACING` 타이틀 중앙 정렬
  - `src/guidelines/MainMenuScreen.tsx:18`에 기본 구현 완료
  - `src/components/WikiRaceGame.tsx:94`에도 동일한 UI 구현됨
- [x] `Play` CTA 버튼 (빨간색)
  - `src/guidelines/MainMenuScreen.tsx:20-22` 및 `src/components/WikiRaceGame.tsx:109-113`에 구현 완료
- [x] `Leaderboard` 버튼 (우측 상단, 다크 테마)
  - `src/guidelines/MainMenuScreen.tsx:12-16` 및 `src/components/WikiRaceGame.tsx:114-123`에 구현 완료
- [ ] 난이도 선택 UI (`쉬운 난이도` / `랜덤 난이도` 토글)
  - `src/guidelines/MainMenuScreen.tsx:26`에 TODO로 남아있음
- [ ] `역링크 허용` 체크박스 UI
  - `src/guidelines/MainMenuScreen.tsx:27`에 TODO로 남아있음
- [ ] `보관함` / `도움말` 버튼
  - `src/guidelines/MainMenuScreen.tsx:28`에 TODO로 남아있음
- [x] 페이지 라우팅: Play → 게임 화면, Leaderboard → 리더보드 화면
  - `src/App.tsx`에 React Router로 3개 화면 라우팅 구현 완료

#### 게임 플레이 화면 (Frame 2)
- [x] **상단 경로 바**: `Start → ... → NOW → ... → GOAL` 형태의 브레드크럼 UI
  - `src/components/GameHeader.tsx:62-74`에 그라데이션 배경의 경로 바 구현 완료
  - Start (보라색 아이콘) → Goal (초록색 아이콘) 시각화
- [x] 현재 문서(`NOW`) 빨간색 하이라이트
  - `src/components/GameHeader.tsx:78-82`에 파란색 배경으로 현재 문서 표시
  - `src/components/WikiNodeTree.tsx:82`에서 현재 노드는 파란색으로 강조
- [x] `before` 버튼 기능 (두 번째 방문부터 활성화)
  - `src/components/GameHeader.tsx:52-60`에 뒤로가기 버튼 구현
  - `GameHeader.tsx:32`에서 path.length > 1일 때만 활성화되도록 구현
  - `src/gameStore.ts:81-93`에 goBack 로직 구현 (이동 횟수 증가 포함)
- [x] **중앙 노드 시각화**: 원형 영역에 링크 노드 배치
  - `src/components/WikiNodeTree.tsx` 전체에 원형 배치 알고리즘 구현
  - `WikiRaceGame.tsx:52-71`에 각도 기반 노드 배치 로직
- [x] 노드 클릭 시 해당 문서로 이동하는 로직
  - `src/components/WikiNodeTree.tsx:65`에서 노드 클릭 핸들러 연결
  - `src/gameStore.ts:45-78`에 navigateTo 액션 구현
- [x] 목표(`GOAL`) 문서 발견 시 초록색으로 강조
  - `src/components/WikiNodeTree.tsx:80`에서 isGoal일 때 초록색 (#10B981) 적용
  - `WikiNodeTree.tsx:123-127`에 목표 노드 애니메이션 배지 추가
- [ ] 링크 로딩 중 스켈레톤 UI 표시
  - 아직 구현되지 않음 (현재는 Mock 데이터 사용으로 즉시 로딩)
- [x] **Git Branch 시각화**: 우측 패널에 방문 기록 트리 표시
  - `src/components/PathHistory.tsx`에 우측 패널 구현 완료
  - 방문 경로를 순차적으로 표시 (Git Branch 스타일은 아직 완전하지 않음)
  - 현재/시작/목표 노드 아이콘 및 색상 구분
- [ ] 역링크 허용/불가 모드에 따른 분기 처리 로직
  - 상태 관리 구조는 있으나 UI 및 로직 미구현
- [x] 단계별(S1, S2) 및 상태별(현재, 방문) 노드 색상 구분
  - `src/components/WikiNodeTree.tsx:79-85`에 노드별 색상 구분 로직
  - 시작(보라), 현재(파랑), 목표(초록), 방문(주황), 미방문(회색)

#### 리더보드 화면 (Frame 3)
- [x] `Leaderboard` 제목 및 부제목
  - `src/components/Leaderboard.tsx:159-161`에 제목과 설명 구현 완료
- [x] 리더보드 UI 컴포넌트 구현
  - `src/components/Leaderboard.tsx:164-234`에 테이블 형태로 구현 완료
  - Top 10 플레이어 표시, 순위/닉네임/경로/난이도/점수/통계 표시
- [x] 항목 클릭 시 경로 보기 기능
  - `src/components/Leaderboard.tsx:217-228`에 "경로 보기" 버튼 구현
  - Dialog 모달로 경로 상세 보기 (238-249)
- [x] 플레이어의 경로 시각화
  - `src/components/PathReplay.tsx`를 통해 경로 재생 기능 구현
  - 아코디언 대신 Dialog + PathReplay 컴포넌트로 구현됨

### P2: UI/UX 및 인터랙션

#### 공통
- [ ] **색상 시스템**: Primary(빨강), Secondary(다크 그레이), Accent(보라) 등 Figma 기준 색상 적용
- [ ] **버튼 상태**: Hover, Click, Disabled 상태에 대한 시각적 피드백
- [ ] **페이지 전환**: 부드러운 화면 전환 애니메이션 적용
- **로딩 상태**: 데이터 fetching 중임을 알리는 로딩 인디케이터 (e.g., 스피너, 스켈레톤)

#### 게임 플레이 화면 (Frame 2)
- [ ] 노드 선택 시 부드러운 포커스 이동 애니메이션
- [ ] Git Branch 트리 확장/축소 애니메이션

#### 리더보드 화면 (Frame 3)
- [ ] 아코디언 펼침/접힘 애니메이션 (높이 변화)
- [ ] Chevron 아이콘 방향 전환 (up/down)

### P3: 고급 기능 및 최적화

- [ ] **역링크 시스템**: 역링크 허용/불가 상태 관리 및 API 연동
- [ ] **Git Branch 시각화**: SourceTree 스타일의 브랜치 라인 및 노드 연결선 SVG로 구현
- [ ] **반응형 디자인**: 데스크톱, 태블릿, 모바일 환경에 맞는 레이아웃 조정
- [x] **상태 관리**: Zustand 또는 React Context를 사용한 전역 상태(게임 상태, 경로, 모드) 관리 구조 설계
  - `src/store/gameStore.ts`에 Zustand 스토어 초기 구현 완료.

---

## 3. 구현 계획 (Phase)

*   **Phase 1: 화면 구조 및 라우팅 (1-2일)**
    1.  `MainMenu`, `GamePlay`, `Leaderboard` 화면 컴포넌트 구조 설계
    2.  React Router 등을 이용한 페이지 간 라우팅 설정
    3.  TailwindCSS 기반 기본 레이아웃 및 스타일 시스템 구축

*   **Phase 2: 핵심 게임 플레이 기능 (2-3일)**
    1.  상단 경로 바 UI 및 상태 연동
    2.  중앙 노드 시각화 및 클릭 로직 구현
    3.  `before` 버튼 로직 및 비활성화 조건 처리
    4.  링크 로딩 시 스켈레톤 UI 적용

*   **Phase 3: Git Branch 시각화 (2-3일)**
    1.  우측 사이드바 패널 및 토글 기능 구현
    2.  방문 기록 데이터를 기반으로 Git Branch 스타일 트리 렌더링
    3.  역링크 모드에 따른 데이터 필터링 및 표시 로직 구현

*   **Phase 4: 리더보드 및 고도화 (1-2일)**
    1.  리더보드 데이터 fetching 및 아코디언 UI 구현
    2.  아코디언 확장 시 Git Branch 경로 표시 기능 연동
    3.  전체적인 인터랙션 및 애니메이션 폴리싱
    4.  최종 기능 테스트 및 버그 수정

---

## 4. 기술 스택 및 라이브러리

*   **상태 관리**: React Context 또는 Zustand (게임 상태, 역링크 모드, 경로 히스토리 등)
*   **UI 컴포넌트**:
    *   ✅ Radix UI (설치됨): Accordion, Checkbox, Button 등 headless 컴포넌트 활용
*   **스타일링**: Tailwind CSS (Figma 기반 커스텀 색상 및 variants 설정)
*   **애니메이션**: Framer Motion (페이지 전환, 컴포넌트 인터랙션)
*   **시각화 (Git Branch)**:
    *   SVG를 이용한 커스텀 Tree 컴포넌트 개발
    *   재귀적 렌더링을 통한 동적 트리 구조 생성

---

## 5. 다음 단계 제안

1.  **컴포넌트 구조 설계**: `MainMenu.tsx`, `GamePlayScreen.tsx`, `LeaderboardScreen.tsx` 등 주요 화면 컴포넌트와 `NavigationBar.tsx`, `GitBranchTree.tsx` 같은 재사용 컴포넌트 파일 구조 생성
2.  **상태 관리 설계**: Zustand store 또는 React Context에 게임 상태(현재 문서, 경로, 목표, 모드 등) 구조 정의
3.  **스타일 시스템 구축**: `tailwind.config.js`에 Figma 디자인 시스템의 색상, 폰트, variants 추가

**준비되셨으면 단계별로 구현을 시작하겠습니다!** 🚀
