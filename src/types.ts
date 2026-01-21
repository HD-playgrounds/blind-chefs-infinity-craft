export interface Ingredient {
    id: number;
    name: string;
    type: 'ingredient' | 'technique' | 'appliance';
    icon: string;
    isBase?: boolean;
    directions?: string;
}

export interface CanvasElement {
    id: string; // Unique instance ID
    typeId: number; // ID from dataset
    x: number;
    y: number;
}

export interface DragState {
    typeId: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isNew: boolean; // True if dragging from sidebar
    elementId?: string; // If dragging existing element
}
