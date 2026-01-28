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
                padding: '10px 16px',
                backgroundColor: ingredient.isBase ? '#ffffff' : '#f0f0f0', // White for base, light gray for complex
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: '0px',
                color: 'var(--color-text)',
                userSelect: 'none',
                cursor: 'grab',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 700,
                boxShadow: isHighlight
                    ? '8px 8px 0px 0px var(--color-text)'
                    : '4px 4px 0px 0px var(--color-text)',
                transform: isHighlight ? 'translate(-2px, -2px)' : 'none',
                transition: 'all 0.1s ease-in-out',
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
