interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className || ''}`}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            {...props}
        >
            {isLoading && <span className="loading-spinner" aria-hidden="true" />}
            <span className={isLoading ? 'sr-only' : undefined}>{children}</span>
        </button>
    );
};
