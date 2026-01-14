# Plan: Infinity Craft (Food Edition) - Milestone 1

## Goal
Create a "blank canvas" game environment where users can drag food ingredients from a sidebar onto a main play area.

## Core Concepts
1.  **Infinite Canvas**: An area where elements can be placed freely.
2.  **Ingredient Sidebar**: A list of available base ingredients (from `dataset1.json`).
3.  **Drag and Drop**: The ability to spawn an instance of an ingredient on the canvas by dragging it from the sidebar.

## Data Structure
We will use `dataset1.json` which has:
- `id`: number
- `name`: string
- `type`: 'ingredient' | 'technique'

## Component Architecture
- **`App`**: Main state holder.
    - `ingredients`: List of available types (loaded from JSON).
    - `elements`: List of instances on the canvas `{ id, typeId, x, y }`.
- **`Sidebar`**: Displays the list of available ingredients.
- **`Canvas`**: The drop target. Renders the `elements`.
- **`Card`**: Visual representation of an ingredient/element.

## Drag and Drop Strategy
- **Mouse Events**: Use `onMouseDown`, `onMouseMove`, `onMouseUp` at the window or canvas level to track dragging.
- **State**:
    - `dragging`: `{ typeId, startX, startY, currentX, currentY } | null`
- **Logic**:
    1.  User clicks an item in Sidebar -> Start drag.
    2.  User moves mouse -> Update "ghost" or actual element position.
    3.  User releases mouse:
        - If over Canvas -> Add new element to `elements` state at that position.
        - If not -> Cancel drag.

## Next Steps
1.  Setup `types.ts`.
2.  Implement `Sidebar.tsx`.
3.  Implement `Canvas.tsx`.
4.  Implement basic Game Loop/State in `App.tsx`.
