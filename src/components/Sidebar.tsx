import React from 'react';
import type { Ingredient } from '../types';
import { DraggableCard } from './DraggableCard';

interface SidebarProps {
    ingredients: Ingredient[];
    onDragStart: (e: React.MouseEvent, ingredientId: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ ingredients, onDragStart }) => {
    return (
        <div
            style={{
                width: '280px',
                height: '100vh',
                backgroundColor: '#121214',
                borderRight: '1px solid #27272a',
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 10,
                boxSizing: 'border-box',
            }}
        >
            <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: 600,
                color: '#e4e4e7'
            }}>
                Ingredients
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {ingredients.map((ing) => (
                    <DraggableCard
                        key={ing.id}
                        ingredient={ing}
                        onMouseDown={(e) => onDragStart(e, ing.id)}
                    />
                ))}
            </div>
        </div>
    );
};
