'use client';
import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    data?: any;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string, option: DropdownOption) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    width?: 'auto' | 'full';
    error?: string;
    ariaLabel?: string;
    'data-testid'?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    disabled = false,
    className = '',
    width = 'auto',
    error,
    ariaLabel,
    'data-testid': testId = 'dropdown',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: DropdownOption) => {
        onChange(option.value, option);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent, option?: DropdownOption) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else if (option) {
                    handleSelect(option);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    return (
        <div
            className={`relative ${width === 'full' ? 'w-full' : ''} ${className}`}
            ref={dropdownRef}
            data-testid={testId}
        >
            {label && (
                <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    id={`${testId}-label`}
                >
                    {label}
                </label>
            )}

            <button
                type="button"
                className={`
          flex items-center justify-between w-full px-4 py-2 text-sm 
          border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                        : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                    }
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `${testId}-label` : undefined}
                aria-label={ariaLabel}
                disabled={disabled}
                aria-disabled={disabled}
            >
                <span className="flex items-center">
                    {selectedOption?.icon && (
                        <span className="mr-2">{selectedOption.icon}</span>
                    )}
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </span>
                <span className="ml-2">
                    <svg
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </button>

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" id={`${testId}-error`}>
                    {error}
                </p>
            )}

            {/* Dropdown options list */}
            {isOpen && !disabled && (
                <ul
                    className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                    tabIndex={-1}
                    role="listbox"
                    aria-labelledby={label ? `${testId}-label` : undefined}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <li
                                key={option.value}
                                className={`
                  ${option.className || ''}
                  ${isSelected
                                        ? 'text-white bg-blue-600 dark:bg-blue-700'
                                        : 'text-gray-900 dark:text-gray-100'
                                    }
                  cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700
                `}
                                id={`option-${option.value}`}
                                role="option"
                                aria-selected={isSelected}
                                tabIndex={0}
                                onClick={() => handleSelect(option)}
                                onKeyDown={(e) => handleKeyDown(e, option)}
                                data-testid={`${testId}-option-${option.value}`}
                            >
                                <div className="flex items-center">
                                    {option.icon && (
                                        <span className={`mr-2 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                                        {option.label}
                                    </span>
                                </div>

                                {/* Checkmark for selected item */}
                                {isSelected && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;