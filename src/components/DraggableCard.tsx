import React, { useMemo } from 'react';
import type { Ingredient } from '../types';

interface DraggableCardProps {
    ingredient: Ingredient;
    onMouseDown: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
    className?: string;
    isHighlight?: boolean;
    variant?: 'default' | 'canvas';
}

const FUN_FONTS = [
    '"Lobster", cursive',
    '"Leckerli One", cursive',
    '"Rakkas", serif',
    '"Pacifico", cursive',
    '"Bangers", system-ui',
    '"Fredoka", sans-serif',
    '"Righteous", sans-serif',
    '"Chewy", system-ui',
    '"Amatic SC", sans-serif',
    '"Permanent Marker", cursive'
];

const BRIGHT_COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Cyan
    '#96CEB4', // Sage
    '#FFEEAD', // Cream Yellow
    '#FF9F43', // Orange
    '#54A0FF', // Blue
    '#5F27CD', // Purple
    '#FF9FF3', // Pink
    '#00D2D3'  // Cyan Bright
];

// Simple deterministic hash
const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const getIngredientStyle = (id: number | string) => {
    const seed = getHash(String(id));
    const font = FUN_FONTS[seed % FUN_FONTS.length];
    const color = BRIGHT_COLORS[seed % BRIGHT_COLORS.length];
    const rotation = (seed % 10) - 5; // -5 to +5 degrees

    return { font, color, rotation };
};

export const DraggableCard: React.FC<DraggableCardProps> = ({
    ingredient,
    onMouseDown,
    style,
    className,
    isHighlight,
    variant = 'default'
}) => {
    const { font, color, rotation } = useMemo(() => getIngredientStyle(ingredient.id), [ingredient.id]);

    if (variant === 'canvas') {
        return (
            <div
                onMouseDown={onMouseDown}
                className={`draggable-card ${className || ''}`}
                style={{
                    position: 'absolute', // Ensure it positions correctly if absolute is passed in style
                    padding: '4px 8px',
                    color: color,
                    fontFamily: font,
                    fontSize: '42px', // Larger for canvas
                    textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                    transform: `rotate(${rotation}deg) ${isHighlight ? 'scale(1.1)' : 'scale(1)'}`,
                    cursor: 'grab',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    ...style,
                    // Override transform from style if it exists, to include rotation
                    // But we need to handle x/y from style if it's there. 
                    // Usually style has 'left'/'top'. 'transform' might clash.
                    // The parent passes transform for dragging? 
                    // In GameCanvas, it passes top/left.
                    // In App (ghost), it passes transform translate.
                    // We need to merge transforms carefully.
                }}
            >
                {ingredient.name}
            </div>
        );
    }

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
