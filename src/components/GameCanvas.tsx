import React from 'react';
import type { CanvasElement, Ingredient } from '../types';
import { DraggableCard } from './DraggableCard';

interface GameCanvasProps {
    elements: CanvasElement[];
    ingredients: Ingredient[];
    onMouseDown: (e: React.MouseEvent, elementId: string) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ elements, ingredients, onMouseDown }) => {
    return (
        <div
            className="canvas"
            style={{
                flex: 1,
                position: 'relative',
                backgroundColor: '#0c0c0e',
                backgroundImage: 'radial-gradient(circle at center, #1a1a1f 0%, #0c0c0e 100%)',
                overflow: 'hidden',
                userSelect: 'none',
                // Grid pattern for visual depth
                backgroundSize: '40px 40px',
                backgroundPosition: '-19px -19px',
            }}
        >
            {elements.map((el) => {
                const ingredient = ingredients.find((i) => i.id === el.typeId);
                if (!ingredient) return null;

                return (
                    <DraggableCard
                        key={el.id}
                        ingredient={ingredient}
                        onMouseDown={(e) => onMouseDown(e, el.id)}
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
        </div>
    );
};
