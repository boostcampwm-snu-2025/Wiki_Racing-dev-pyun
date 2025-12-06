import './App.css'

const nodes = [
  {
    id: 'start',
    title: '시작 문서',
    detail: '위키레이싱 시작점 · 나무위키 스타일 트리',
    x: 160,
    y: 160,
    selected: true,
    accent: '#7dd3fc',
  },
  {
    id: 'a',
    title: '링크 문서 A',
    detail: 'n8n 곡선 라인 · 카드형 노드',
    x: 440,
    y: 260,
    accent: '#93c5fd',
  },
  {
    id: 'b',
    title: '링크 문서 B',
    detail: '선택 시 강조 · Tailwind 톤앤매너',
    x: 420,
    y: 420,
    accent: '#a5b4fc',
  },
  {
    id: 'c',
    title: '링크 문서 C',
    detail: '리더보드/경로 시각화로 확장',
    x: 660,
    y: 340,
    accent: '#f9a8d4',
  },
]

const connections = [
  { from: 'start', to: 'a', color: '#60a5fa' },
  { from: 'start', to: 'b', color: '#8b5cf6' },
  { from: 'a', to: 'c', color: '#f472b6' },
]

type NodeProps = {
  id: string
  title: string
  detail: string
  x: number
  y: number
  selected?: boolean
  accent?: string
}

function NodeCard({ title, detail, x, y, selected, accent }: NodeProps) {
  return (
    <div
      className={`node-card ${selected ? 'node-card--selected' : ''}`}
      style={{ left: x, top: y, borderColor: accent }}
    >
      <div className="node-pill" style={{ color: accent }}>
        링크 노드
      </div>
      <div className="node-title">{title}</div>
      <div className="node-detail">{detail}</div>
    </div>
  )
}

function buildPath(from: NodeProps, to: NodeProps) {
  const startX = from.x + 140
  const startY = from.y + 50
  const endX = to.x + 0
  const endY = to.y + 40
  const offset = (endX - startX) * 0.35

  return `M ${startX} ${startY} C ${startX + offset} ${startY}, ${endX - offset} ${endY}, ${endX} ${endY}`
}

function App() {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]))

  return (
    <div className="app">
      <div className="panel">
        <div className="pill">Wiki 안내</div>
        <h1>WikiRacing · n8n 스타일 트리 UI</h1>
        <p>
          레포 Wiki에서 설명한 것처럼 링크 구조를 트리로 확장하고, 선택된 노드를 강조하는 Tailwind 톤의
          미니멀 UI 프로토타입입니다. 나무위키 링크 흐름과 리더보드/경로 시각화를 위한 베이스로 사용할 수
          있도록 카드형 노드와 곡선 SVG 라인을 함께 배치했습니다.
        </p>
        <div className="quick-spec">
          <span>곡선 연결</span>
          <span>카드형 노드</span>
          <span>선택 강조</span>
          <span>다크 + 그리드</span>
        </div>
      </div>

      <div className="workspace">
        <div className="grid" aria-hidden />
        <svg className="connections" aria-hidden>
          {connections.map((edge) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]

            if (!from || !to) return null

            return (
              <path key={`${edge.from}-${edge.to}`} d={buildPath(from, to)} stroke={edge.color} />
            )
          })}
        </svg>

        {nodes.map((node) => (
          <NodeCard key={node.id} {...node} />
        ))}

        <div className="legend">
          <div>
            <div className="legend-dot" />
            <span>Wiki 링크 확장</span>
          </div>
          <div>
            <div className="legend-dot legend-dot--accent" />
            <span>선택된 노드 강조</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
