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
                backgroundColor: ingredient.isBase ? '#ffffff' : '#f4f4f5',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--color-text)',
                userSelect: 'none',
                cursor: 'grab',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '15px',
                fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: isHighlight
                    ? 'var(--shadow-hard)'
                    : 'none',
                transform: isHighlight ? 'translate(-1px, -1px)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                width: 'fit-content',
                ...style,
            }}
        >
            <span style={{ fontSize: '20px' }}>
                {ingredient.icon}
            </span>
            {ingredient.name.toLowerCase()}
        </div>
    );
};
