'use client';
import React from 'react';

interface ErrorMessageProps {
    message: string;
    title?: string;
    className?: string;
    onRetry?: () => void;
    showRetry?: boolean;
    retryText?: string;
    description?: string;
    severity?: 'error' | 'warning' | 'info';
    'data-testid'?: string;
    compact?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    title,
    className = '',
    onRetry,
    showRetry = false,
    retryText = 'Try Again',
    description,
    severity = 'error',
    'data-testid': testId = 'error-message',
    compact = false,
}) => {
    const severityStyles = {
        error: {
            container: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
            icon: 'text-red-500 dark:text-red-400',
            title: 'text-red-800 dark:text-red-400',
            message: 'text-red-700 dark:text-red-300',
            button: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white'
        },
        warning: {
            container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
            icon: 'text-yellow-500 dark:text-yellow-400',
            title: 'text-yellow-800 dark:text-yellow-400',
            message: 'text-yellow-700 dark:text-yellow-300',
            button: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white'
        },
        info: {
            container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
            icon: 'text-blue-500 dark:text-blue-400',
            title: 'text-blue-800 dark:text-blue-400',
            message: 'text-blue-700 dark:text-blue-300',
            button: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
        }
    };

    const styles = severityStyles[severity];

    if (compact) {
        return (
            <div
                className={`flex items-center text-sm ${styles.message} px-3 py-2 rounded ${className}`}
                role="alert"
                data-testid={testId}
            >
                <div className={`flex-shrink-0 ${styles.icon} mr-2`}>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <span>{message}</span>
                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className={`ml-auto text-xs font-medium px-2 py-1 rounded ${styles.button}`}
                        type="button"
                        data-testid={`${testId}-retry-button`}
                    >
                        {retryText}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            className={`rounded-md border p-4 ${styles.container} ${className}`}
            role="alert"
            aria-live="assertive"
            data-testid={testId}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    {severity === 'error' && (
                        <svg className={`h-5 w-5 ${styles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    {severity === 'warning' && (
                        <svg className={`h-5 w-5 ${styles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                    {severity === 'info' && (
                        <svg className={`h-5 w-5 ${styles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </div>
                <div className="ml-3">
                    {title && (
                        <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
                    )}
                    <div className={`text-sm ${styles.message} ${title ? 'mt-2' : ''}`}>
                        <p>{message}</p>
                        {description && <p className="mt-1">{description}</p>}
                    </div>
                    {showRetry && onRetry && (
                        <div className="mt-4">
                            <button
                                type="button"
                                className={`rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
                                onClick={onRetry}
                                data-testid={`${testId}-retry-button`}
                            >
                                {retryText}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;