import React from 'react';

interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'white' | 'gray' | 'black';
    className?: string;
    text?: string;
    textBelow?: boolean;
    thickness?: 'thin' | 'regular' | 'thick';
    fullPage?: boolean;
    'data-testid'?: string;
    delayMs?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    className = '',
    text,
    textBelow = false,
    thickness = 'regular',
    fullPage = false,
    'data-testid': testId = 'loading-spinner',
    delayMs = 0,
}) => {
    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const colorClasses = {
        primary: 'text-blue-600 dark:text-blue-400',
        secondary: 'text-purple-600 dark:text-purple-400',
        white: 'text-white',
        gray: 'text-gray-500 dark:text-gray-400',
        black: 'text-gray-900 dark:text-gray-100',
    };

    const thicknessClasses = {
        thin: 'border',
        regular: 'border-2',
        thick: 'border-4',
    };

    const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
    };

    const [show, setShow] = React.useState(delayMs === 0);

    React.useEffect(() => {
        if (delayMs > 0) {
            const timer = setTimeout(() => setShow(true), delayMs);
            return () => clearTimeout(timer);
        }
    }, [delayMs]);

    if (!show) {
        return null;
    }

    const spinner = (
        <div
            className={`
                ${sizeClasses[size]}
                ${colorClasses[color]}
                ${thicknessClasses[thickness]}
                rounded-full
                border-t-transparent
                animate-spin
            `}
            role="status"
            aria-label={text || 'Loading'}
            data-testid={testId}
        />
    );

    const textElement = text && (
        <span
            className={`${textSizeClasses[size]} ${colorClasses[color]} ${textBelow ? 'mt-2' : 'ml-3'}`}
            data-testid={`${testId}-text`}
        >
            {text}
        </span>
    );

    if (fullPage) {
        return (
            <div
                className="fixed inset-0 flex items-center justify-center bg-gray-900/50 dark:bg-black/50 backdrop-blur-sm z-50"
                data-testid={`${testId}-overlay`}
            >
                <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                    {spinner}
                    {text && textBelow && textElement}
                    {text && !textBelow && (
                        <div className="ml-3 text-base font-medium">{text}</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={`inline-flex ${textBelow ? 'flex-col' : 'flex-row'} items-center justify-center ${className}`}
        >
            {spinner}
            {textElement}
        </div>
    );
};

export default LoadingSpinner;