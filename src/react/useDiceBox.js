import { useCallback, useEffect, useId, useRef, useState } from "react"
import { DiceBox } from "../DiceBox.js"

/**
 * Mounts a DiceBox into the element that `containerRef` is attached to.
 * The element needs a size (the canvas fills it).
 *
 * const { containerRef, roll, results, ready, rolling } = useDiceBox({ assetPath: "/" })
 * <div ref={containerRef} style={{ height: 400 }} />
 */
export function useDiceBox(options = {}) {
  const containerRef = useRef(null)
  const boxRef = useRef(null)
  const optionsRef = useRef(options)
  const id = `dice-box-${useId().replace(/:/g, "")}`
  const [ready, setReady] = useState(false)
  const [rolling, setRolling] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    const container = containerRef.current
    container.id = id
    let cancelled = false
    const box = new DiceBox(`#${id}`, optionsRef.current)
    box.initialize().then(() => {
      if (cancelled) return
      boxRef.current = box
      setReady(true)
    })
    return () => {
      // StrictMode mounts twice; tear down the discarded instance
      cancelled = true
      boxRef.current = null
      setReady(false)
      box.renderer?.dispose()
      box.renderer?.domElement.remove()
    }
  }, [id])

  const run = useCallback(async (method, arg) => {
    const box = boxRef.current
    if (!box) return
    setRolling(true)
    try {
      const res = await box[method](arg)
      setResults(res)
      return res
    } finally {
      setRolling(false)
    }
  }, [])

  const roll = useCallback((notation) => run("roll", notation), [run])
  const reroll = useCallback((dieIds) => run("reroll", dieIds), [run])
  const add = useCallback((notation) => run("add", notation), [run])
  const remove = useCallback((dieIds) => run("remove", dieIds), [run])
  const clear = useCallback(() => {
    boxRef.current?.clearDice()
    setResults(null)
  }, [])
  const updateConfig = useCallback((opts) => boxRef.current?.updateConfig(opts), [])

  return { containerRef, box: boxRef, ready, rolling, results, roll, reroll, add, remove, clear, updateConfig }
}

/**
 * Listens for the document-level `rollComplete` event (fired by any DiceBox)
 * and returns the latest results.
 */
export function useRollComplete(callback) {
  const [results, setResults] = useState(null)
  const cbRef = useRef(callback)
  cbRef.current = callback
  useEffect(() => {
    const handler = (e) => {
      setResults(e.detail)
      cbRef.current?.(e.detail)
    }
    document.addEventListener("rollComplete", handler)
    return () => document.removeEventListener("rollComplete", handler)
  }, [])
  return results
}
