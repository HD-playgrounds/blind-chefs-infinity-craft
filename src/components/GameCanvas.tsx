import React from 'react';
import type { CanvasElement, Ingredient } from '../types';
import { DraggableCard } from './DraggableCard';

interface GameCanvasProps {
    elements: CanvasElement[];
    ingredients: Ingredient[];
    onMouseDown: (e: React.MouseEvent, elementId: string) => void;
    dragState: any;
    combiningIds?: string[];
    isCombining: { x: number, y: number } | null;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
    elements,
    ingredients,
    onMouseDown,
    dragState,
    combiningIds = [],
    isCombining
}) => {
    return (
        <div
            className="canvas"
            style={{
                flex: 1,
                position: 'relative',
                backgroundColor: 'var(--color-bg)',
                backgroundImage: 'radial-gradient(var(--color-border) 2px, transparent 2px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '-19px -19px',
                overflow: 'hidden',
                userSelect: 'none',
            }}
        >
            {elements.map((el) => {
                const ingredient = ingredients.find((i) => i.id === el.typeId);
                if (!ingredient) return null;

                const sidebarWidth = 280;
                const cardWidth = 120;
                const cardHeight = 50;

                let isHighlight = false;
                if (dragState) {
                    const dragX = dragState.currentX - sidebarWidth - dragState.startX;
                    const dragY = dragState.currentY - dragState.startY;

                    const rect1 = { x: dragX, y: dragY, w: cardWidth, h: cardHeight };
                    const rect2 = { x: el.x, y: el.y, w: cardWidth, h: cardHeight };

                    const isOverlapping =
                        rect1.x < rect2.x + rect2.w &&
                        rect1.x + rect1.w > rect2.x &&
                        rect1.y < rect2.y + rect2.h &&
                        rect1.y + rect1.h > rect2.y;

                    if (isOverlapping) {
                        isHighlight = true;
                    }
                }

                return (
                    <DraggableCard
                        key={el.id}
                        ingredient={ingredient}
                        onMouseDown={(e) => {
                            if (combiningIds.includes(el.id)) return;
                            onMouseDown(e, el.id);
                        }}
                        isHighlight={isHighlight}
                        className={`spawn-animation ${!ingredient.isBase ? 'llm-generated' : ''} ${combiningIds.includes(el.id) ? 'cooking-item' : ''}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: `translate(${el.x}px, ${el.y}px)`,
                            cursor: 'grab',
                            zIndex: 1,
                        }}
                    />
                );
            })}

            {/* Loading Portal - Relative to Canvas */}
            {isCombining && (
                <div className="neo-box" style={{
                    position: 'absolute',
                    left: isCombining.x + 60,
                    top: isCombining.y + 25,
                    padding: '12px 24px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--color-surface)'
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        border: '2px solid var(--color-text)', // Thinner, cleaner
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite' // Smoother spin
                    }} />
                    <div style={{
                        fontWeight: 500,
                        fontSize: '14px',
                        letterSpacing: '-0.01em',
                        fontFamily: 'DM Sans, sans-serif'
                    }}>Creating masterpiece...</div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};
