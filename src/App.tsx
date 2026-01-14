import { useState, useEffect } from 'react'
import './App.css'
import dataset from '../data/dataset1.json'
import { Sidebar } from './components/Sidebar'
import { GameCanvas } from './components/GameCanvas'
import type { Ingredient, CanvasElement, DragState } from './types'
import { DraggableCard } from './components/DraggableCard'
import { getCombinationResult } from './lib/recipeGraph'

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [dragState, setDragState] = useState<DragState | null>(null)

  // Cast the dataset to our type
  const ingredients = dataset as Ingredient[]

  const handleSidebarDragStart = (e: React.MouseEvent, typeId: number) => {
    e.preventDefault()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
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

    const sidebarWidth = 280
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

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragState) return

      const sidebarWidth = 280
      const dropX = e.clientX
      const dropY = e.clientY

      if (dropX > sidebarWidth) {
        // Correct logic: we want the final Canvas X.
        // ScreenX = CanvasX + SidebarWidth + GrabOffset
        // So CanvasX = ScreenX - SidebarWidth - GrabOffset
        // And currently: ScreenX = dropX. GrabOffset = startX.
        // Wait, startX IS GrabOffset now.
        // CanvasX = dropX - sidebarWidth - dragState.startX

        const finalX = dropX - sidebarWidth - dragState.startX
        const finalY = dropY - dragState.startY

        // Check for combinations
        let combined = false
        // const droppedRect = { x: finalX, y: finalY, width: 96, height: 128 } // Removed unused

        // Find overlapping element
        // Filter out the element being dragged if it's not new
        const candidateElements = dragState.isNew
          ? elements
          : elements.filter(el => el.id !== dragState.elementId)

        for (const targetEl of candidateElements) {
          const targetRect = { x: targetEl.x, y: targetEl.y, width: 96, height: 128 }

          // Simple AABB collision or distance check. Let's use distance for "center" feel or AABB.
          // Distance between centers often feels better for dropping "on top".
          const centerX1 = finalX + 48
          const centerY1 = finalY + 64
          const centerX2 = targetEl.x + 48
          const centerY2 = targetEl.y + 64
          const dist = Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2))

          if (dist < 50) { // Threshold for combination
            const resultId = getCombinationResult(dragState.typeId, targetEl.typeId)
            if (resultId) {
              // COMBINATION!
              const newElement: CanvasElement = {
                id: crypto.randomUUID(),
                typeId: resultId,
                x: targetEl.x, // Stay at target position
                y: targetEl.y
              }

              // Remove target element and add new result
              // If dragging existing, the previous filter handles it not being in the list if we just setElements from candidateElements filtering target too.

              // We need to carefully construct the new list.
              // Remove targetEl.
              // Remove dragged element (if it existed).
              // Add result.

              // Easier:
              setElements(prev => {
                const withoutTarget = prev.filter(el => el.id !== targetEl.id && el.id !== dragState.elementId)
                return [...withoutTarget, newElement]
              })

              combined = true
              break;
            }
          }
        }

        if (!combined) {
          if (dragState.isNew) {
            const newElement: CanvasElement = {
              id: crypto.randomUUID(),
              typeId: dragState.typeId,
              x: finalX,
              y: finalY
            }
            setElements(prev => [...prev, newElement])
          } else if (dragState.elementId) {
            setElements(prev => prev.map(el => {
              if (el.id === dragState.elementId) {
                return { ...el, x: finalX, y: finalY }
              }
              return el
            }))
          }
        }
      } else {
        // If dropped back on sidebar and it was an existing element, delete it
        if (!dragState.isNew && dragState.elementId) {
          setElements(prev => prev.filter(el => el.id !== dragState.elementId))
        }
      }

      setDragState(null)
    }

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState])

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        ingredients={ingredients}
        onDragStart={handleSidebarDragStart}
      />
      <GameCanvas
        elements={dragState && !dragState.isNew && dragState.elementId
          ? elements.filter(el => el.id !== dragState.elementId)
          : elements
        }
        ingredients={ingredients}
        onMouseDown={handleCanvasDragStart}
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
            onMouseDown={() => { }}
            style={{
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              scale: '1.05',
              cursor: 'grabbing'
            }}
          />
        </div>
      )}
    </div>
  )
}

export default App
