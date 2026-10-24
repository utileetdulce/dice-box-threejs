import { useEffect, useRef, useState } from "react"
import DiceBox from "../../src/index.js"

/**
 * Mounts a DiceBox into the element referenced by the returned `containerRef`.
 * Returns `{ containerRef, roll, ready }`.
 */
export function useDiceBox(options = {}) {
  const containerRef = useRef(null)
  const boxRef = useRef(null)
  const optionsRef = useRef(options)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    let cancelled = false
    const box = new DiceBox(`#${container.id}`, {
      assetPath: "/",
      ...optionsRef.current,
    })
    box.initialize().then(() => {
      if (cancelled) return
      boxRef.current = box
      setReady(true)
    })
    return () => {
      // StrictMode runs effects twice; remove the canvas of the discarded instance
      cancelled = true
      boxRef.current = null
      setReady(false)
      box.renderer?.dispose()
      box.renderer?.domElement.remove()
    }
  }, [])

  const roll = (notation) => boxRef.current?.roll(notation)

  return { containerRef, roll, ready }
}
