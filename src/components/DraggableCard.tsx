import React from 'react';
import type { Ingredient } from '../types';

interface DraggableCardProps {
    ingredient: Ingredient;
    onMouseDown: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
    className?: string;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
    ingredient,
    onMouseDown,
    style,
    className
}) => {
    return (
        <div
            onMouseDown={onMouseDown}
            className={`draggable-card ${className || ''}`}
            style={{
                padding: '12px 20px',
                backgroundColor: '#1e1e24',
                border: '1px solid #3f3f46',
                borderRadius: '50px',
                color: '#fff',
                userSelect: 'none',
                cursor: 'grab',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: 'fit-content',
                ...style,
            }}
        >
            <span style={{ fontSize: '18px' }}>
                {ingredient.icon}
            </span>
            {ingredient.name}
        </div>
    );
};
