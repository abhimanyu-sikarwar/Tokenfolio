'use client';
import React, { forwardRef, useState } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    helperText?: string;
    error?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onEndIconClick?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    readOnly?: boolean;
    variant?: 'outlined' | 'filled' | 'underlined';
    id?: string;
    clearable?: boolean;
    placeholder?: string;
    successText?: string;
    isValid?: boolean;
    'data-testid'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            error,
            startIcon,
            endIcon,
            onEndIconClick,
            className = '',
            size = 'md',
            fullWidth = false,
            readOnly = false,
            variant = 'outlined',
            id,
            clearable = false,
            placeholder,
            successText,
            isValid,
            onChange,
            onFocus,
            onBlur,
            value,
            type = 'text',
            disabled = false,
            'data-testid': testId = 'input',
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
        };

        const handleClear = () => {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, 'value'
            )?.set;

            if (ref && 'current' in ref && ref.current && nativeInputValueSetter) {
                nativeInputValueSetter.call(ref.current, '');
                const event = new Event('input', { bubbles: true });
                ref.current.dispatchEvent(event);
            }
        };

        const sizeClasses = {
            sm: 'h-8 text-xs',
            md: 'h-10 text-sm',
            lg: 'h-12 text-base',
        };

        const variantClasses = {
            outlined: `
        border 
        ${error ? 'border-red-500 dark:border-red-500' :
                    isValid ? 'border-green-500 dark:border-green-500' :
                        'border-gray-300 dark:border-gray-600'}
        ${isFocused ? 'ring-2 ring-blue-500/20 border-blue-500 dark:border-blue-400' : ''}
        rounded-md
        bg-white dark:bg-gray-800
      `,
            filled: `
        border-0
        ${error ? 'bg-red-50 dark:bg-red-900/20' :
                    isValid ? 'bg-green-50 dark:bg-green-900/20' :
                        'bg-gray-100 dark:bg-gray-700'}
        ${isFocused ? 'ring-2 ring-blue-500/20' : ''}
        rounded-md
      `,
            underlined: `
        border-0
        border-b-2
        ${
            error 
                ?   'border-b-red-500 dark:border-b-red-500' 
                :   isValid 
                        ? 'border-b-green-500 dark:border-b-green-500' 
                        :'border-b-gray-300 dark:border-b-gray-600'
        }
        ${
            isFocused 
                ? 'border-b-blue-500 dark:border-b-blue-400' 
                : ''
        }
        rounded-none
        bg-transparent
      `,
        };

        const disabledClasses = disabled ?
            'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed' :
            'text-gray-900 dark:text-gray-100';

        const paddingClasses = `
            ${startIcon ? 'pl-10' : 'pl-4'} 
            ${(endIcon || (clearable && value)) ? 'pr-10' : 'pr-4'}
            `;

        const widthClasses = fullWidth ? 'w-full' : 'w-auto';

        return (
            <div className={`relative ${widthClasses} ${className}`} data-testid={testId}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className={`
              block text-sm font-medium mb-1
              ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}
            `}
                    >
                        {label}
                    </label>
                )}

                {/* Input container */}
                <div className="relative">
                    {/* Start icon */}
                    {startIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                                {startIcon}
                            </span>
                        </div>
                    )}

                    {/* Input field */}
                    <input
                        id={inputId}
                        ref={ref}
                        disabled={disabled}
                        readOnly={readOnly}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className={`
                            ${sizeClasses[size]}
                            ${variantClasses[variant]}
                            ${disabledClasses}
                            ${paddingClasses}
                            block
                            focus:outline-none
                            ${fullWidth ? 'w-full' : 'w-auto'}
                            transition-colors
                            ${readOnly
                                ? 'bg-gray-50 dark:bg-gray-800 cursor-default'
                                : 'focus:border-blue-500 dark:focus:border-blue-400'
                            }
                        `}
                        type={type}
                        aria-invalid={!!error}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : helperText
                                    ? `${inputId}-helper`
                                    : undefined
                        }
                        data-testid={`${testId}-field`}
                        {...rest}
                    />

                    {/* End icon or clear button */}
                    {(endIcon || (clearable && value)) && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {clearable && value && (
                                <button
                                    type="button"
                                    className={`
                    text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400
                    focus:outline-none
                    ${disabled ? 'hidden' : ''}
                  `}
                                    onClick={handleClear}
                                    tabIndex={-1}
                                    aria-label="Clear"
                                    data-testid={`${testId}-clear-button`}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                            {endIcon && (
                                <span
                                    className={`
                    ${onEndIconClick ? 'cursor-pointer' : ''}
                    ${clearable && value ? 'ml-2' : ''}
                    text-gray-500 dark:text-gray-400
                  `}
                                    onClick={onEndIconClick}
                                    data-testid={`${testId}-end-icon`}
                                >
                                    {endIcon}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Helper text, error message, or success message */}
                {(helperText || error || successText) && (
                    <p
                        id={
                            error
                                ? `${inputId}-error`
                                : successText && isValid
                                    ? `${inputId}-success`
                                    : `${inputId}-helper`
                        }
                        className={`
              mt-1 text-sm
              ${error
                                ? 'text-red-600 dark:text-red-400'
                                : successText && isValid
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-500 dark:text-gray-400'
                            }
            `}
                        data-testid={
                            error
                                ? `${testId}-error`
                                : successText && isValid
                                    ? `${testId}-success`
                                    : `${testId}-helper`
                        }
                    >
                        {error || (isValid && successText ? successText : helperText)}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;