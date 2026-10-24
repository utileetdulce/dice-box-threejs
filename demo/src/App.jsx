import { useState } from "react"
import { useDiceBox } from "../../src/react/index.js"

export default function App() {
  const [notation, setNotation] = useState("2d20")
  const { containerRef, roll, add, clear, ready, rolling, results } = useDiceBox({
    assetPath: "/",
    theme_colorset: "white",
  })

  return (
    <div className="app">
      <div className="controls">
        <input value={notation} onChange={(e) => setNotation(e.target.value)} />
        <button onClick={() => roll(notation)} disabled={!ready || rolling}>Roll</button>
        <button onClick={() => add(notation)} disabled={!ready || rolling}>Add</button>
        <button onClick={clear} disabled={!ready || rolling}>Clear</button>
        {results && <span>Total: {results.total}</span>}
      </div>
      <div className="dice-container" ref={containerRef} />
    </div>
  )
}
