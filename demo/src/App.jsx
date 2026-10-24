import { useState } from "react"
import { useDiceBox } from "./useDiceBox.js"

export default function App() {
  const [notation, setNotation] = useState("2d20")
  const [result, setResult] = useState(null)
  const { containerRef, roll, ready } = useDiceBox({
    theme_colorset: "white",
    sounds: false,
  })

  const onRoll = async () => setResult(await roll(notation))

  return (
    <div className="app">
      <div className="controls">
        <input value={notation} onChange={(e) => setNotation(e.target.value)} />
        <button onClick={onRoll} disabled={!ready}>Roll</button>
        {result && <span>Total: {result.total} ({result.sets?.map((s) => s.rolls?.map((r) => r.value)).flat().join(", ")})</span>}
      </div>
      <div id="dice-container" className="dice-container" ref={containerRef} />
    </div>
  )
}
