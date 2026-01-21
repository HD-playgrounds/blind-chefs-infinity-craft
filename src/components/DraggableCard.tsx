import React from 'react';
import type { Ingredient } from '../types';

interface DraggableCardProps {
    ingredient: Ingredient;
    onMouseDown: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
    className?: string;
    isHighlight?: boolean;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
    ingredient,
    onMouseDown,
    style,
    className,
    isHighlight
}) => {
    return (
        <div
            onMouseDown={onMouseDown}
            className={`draggable-card ${className || ''}`}
            style={{
                padding: '12px 20px',
                backgroundColor: ingredient.isBase ? '#1e1e24' : '#312e81', // Indigo for complex items
                borderRadius: '50px',
                color: '#fff',
                userSelect: 'none',
                cursor: 'grab',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: isHighlight 
                    ? '0 0 20px 5px rgba(255, 215, 0, 0.6), 0 4px 6px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: isHighlight ? '1px solid #fbbf24' : '1px solid #3f3f46',
                transform: isHighlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
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
