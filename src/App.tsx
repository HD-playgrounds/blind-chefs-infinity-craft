import { useState, useEffect } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar'
import { GameCanvas } from './components/GameCanvas'
import type { Ingredient, CanvasElement, DragState } from './types'
import { DraggableCard } from './components/DraggableCard'

const API_BASE = 'http://localhost:8000'

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [discoveredIds, setDiscoveredIds] = useState<number[]>([])
  const [masteryCounts, setMasteryCounts] = useState<Record<number, number>>({})
  const [isCombining, setIsCombining] = useState<{ x: number, y: number } | null>(null)
  const [combiningIds, setCombiningIds] = useState<string[]>([])
  const [unlockedBaseIds, setUnlockedBaseIds] = useState<number[]>([])

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch(`${API_BASE}/items`)
        const items = await itemsRes.json()
        setIngredients(items)

        const progRes = await fetch(`${API_BASE}/progression`)
        const prog = await progRes.json()
        setDiscoveredIds(prog.discovered_ids)
        setUnlockedBaseIds(prog.unlocked_base_ids)
        setMasteryCounts(prog.mastery_counts)
      } catch (err) {
        console.error("Failed to fetch data from backend:", err)
      }
    }
    fetchData()
  }, [])

  const handleSidebarDragStart = (e: React.MouseEvent, typeId: number) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    setDragState({
      typeId,
      startX: offsetX,
      startY: offsetY,
      currentX: e.clientX,
      currentY: e.clientY,
      isNew: true
    })
  }

  const handleCanvasDragStart = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const element = elements.find(el => el.id === elementId)
    if (!element) return

    const sidebarWidth = 320
    const offsetX = e.clientX - (element.x + sidebarWidth)
    const offsetY = e.clientY - element.y

    setDragState({
      typeId: element.typeId,
      startX: offsetX,
      startY: offsetY, // Grab offset relative to top-left of element
      currentX: e.clientX,
      currentY: e.clientY,
      isNew: false,
      elementId
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return
      setDragState(prev => prev ? {
        ...prev,
        currentX: e.clientX,
        currentY: e.clientY
      } : null)
    }

    const handleMouseUp = async (e: MouseEvent) => {
      if (!dragState) return

      const sidebarWidth = 320
      const dropX = e.clientX
      const dropY = e.clientY

      const { typeId, startX, startY, isNew, elementId } = dragState
      const finalX = dropX - sidebarWidth - startX
      const finalY = dropY - startY

      setDragState(null)

      if (dropX > sidebarWidth) {
        let combined = false
        let targetEl: CanvasElement | undefined = undefined

        const candidates = isNew ? elements : elements.filter(el => el.id !== elementId)
        for (const el of candidates) {
          const cardWidth = 120
          const cardHeight = 50
          const rect1 = { x: finalX, y: finalY, w: cardWidth, h: cardHeight }
          const rect2 = { x: el.x, y: el.y, w: cardWidth, h: cardHeight }
          if (rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x &&
            rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y) {
            targetEl = el
            break
          }
        }

        let dropped = false
        if (targetEl) {
          dropped = true
          const sourceId = crypto.randomUUID()
          setElements(prev => {
            if (isNew) {
              return [...prev, { id: sourceId, typeId, x: finalX, y: finalY }]
            } else {
              return prev.map(el => el.id === elementId ? { ...el, x: finalX, y: finalY } : el)
            }
          })

          const activeSourceId = isNew ? sourceId : elementId!
          const activeTargetId = targetEl.id

          setCombiningIds(prev => [...prev, activeSourceId, activeTargetId])
          setIsCombining({ x: (finalX + targetEl.x) / 2, y: (finalY + targetEl.y) / 2 })

          try {
            const res = await fetch(`${API_BASE}/combine?source_id=${typeId}&target_id=${targetEl.typeId}`, {
              method: 'POST'
            })
            const data = await res.json()

            if (data.result_id) {
              const resultId = data.result_id

              // Refresh all ingredients to ensure the new one is available in the list
              const itemsRes = await fetch(`${API_BASE}/items`)
              const items = await itemsRes.json()
              setIngredients(items)

              setDiscoveredIds(prev => prev.includes(resultId) ? prev : [...prev, resultId])
              setMasteryCounts(prev => ({ ...prev, [resultId]: data.mastery_count }))
              if (data.is_unlocked) setUnlockedBaseIds(prev => prev.includes(resultId) ? prev : [...prev, resultId])

              setElements(prev => {
                const filtered = prev.filter(el => el.id !== activeTargetId && el.id !== activeSourceId)
                return [...filtered, { id: crypto.randomUUID(), typeId: resultId, x: targetEl!.x, y: targetEl!.y }]
              })
              combined = true
            }
          } catch (err) {
            console.error("Combination failed:", err)
          } finally {
            setIsCombining(null)
            setCombiningIds(prev => prev.filter(id => id !== activeSourceId && id !== activeTargetId))
          }
        }

        if (!dropped) {
          if (isNew) {
            setElements(prev => [...prev, { id: crypto.randomUUID(), typeId, x: finalX, y: finalY }])
          } else if (elementId) {
            setElements(prev => prev.map(el => el.id === elementId ? { ...el, x: finalX, y: finalY } : el))
          }
        }
      } else if (!isNew && elementId) {
        setElements(prev => prev.filter(el => el.id !== elementId))
      }
    }

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, elements, ingredients])

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        ingredients={ingredients}
        onDragStart={handleSidebarDragStart}
        discoveredIds={discoveredIds}
        masteryCounts={masteryCounts}
        unlockedBaseIds={unlockedBaseIds}
      />
      <GameCanvas
        elements={dragState && !dragState.isNew && dragState.elementId
          ? elements.filter(el => el.id !== dragState.elementId)
          : elements
        }
        ingredients={ingredients}
        onMouseDown={handleCanvasDragStart}
        dragState={dragState}
        combiningIds={combiningIds}
        isCombining={isCombining}
      />

      {/* Ghost Element Layer */}
      {dragState && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          transform: `translate(${dragState.currentX - dragState.startX}px, ${dragState.currentY - dragState.startY}px)`
        }}>
          <DraggableCard
            ingredient={ingredients.find(i => i.id === dragState.typeId)!}
            variant={!dragState.isNew ? 'canvas' : 'default'}
            onMouseDown={() => { }}
            className={dragState.isNew && !ingredients.find(i => i.id === dragState.typeId)!.isBase ? 'llm-generated' : ''}
            style={!dragState.isNew ? {
              cursor: 'grabbing'
            } : {
              boxShadow: 'var(--shadow-hard)',
              transform: 'translate(-1px, -1px)',
              cursor: 'grabbing',
              backgroundColor: 'var(--color-surface)',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
            }}
          />
        </div>
      )}
    </div>
  )
}

export default App
