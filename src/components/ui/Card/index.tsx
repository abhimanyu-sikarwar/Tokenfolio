'use client';
import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    clickable?: boolean;
    selected?: boolean;
    hoverEffect?: 'light' | 'medium' | 'none';
    padding?: string;
    'data-testid'?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    clickable = false,
    selected = false,
    hoverEffect = 'light',
    padding = 'p-4',
    'data-testid': testId = 'card',
}) => {
    const baseClasses = [
        'bg-white dark:bg-gray-800',
        'rounded-lg',
        'border border-gray-200 dark:border-gray-700',
        'transition-all duration-200',
        padding,
        className
    ];

    if (clickable || hoverEffect !== 'none') {
        const hoverClasses = {
            light: 'hover:shadow-sm hover:border-gray-300 dark:hover:border-gray-600',
            medium: 'hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500 hover:-translate-y-1'
        };

        baseClasses.push(hoverClasses[hoverEffect === 'none' ? 'light' : hoverEffect]);
    }

    if (clickable) {
        baseClasses.push('cursor-pointer');
    }

    if (selected) {
        baseClasses.push('ring-2 ring-blue-500 dark:ring-blue-400');
    }

    const cardClasses = baseClasses.join(' ');

    return (
        <div
            className={cardClasses}
            onClick={clickable ? onClick : undefined}
            data-testid={testId}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={clickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
        >
            {children}
        </div>
    );
};

export default Card;