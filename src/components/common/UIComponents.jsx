import React from 'react'

/**
 * Loading Spinner Component
 * Reusable loading indicator with consistent styling
 */
export const LoadingSpinner = ({ size = 'medium', text = 'Đang tải...' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-10 h-10',
        large: 'w-16 h-16'
    }

    return (
        <div className="flex justify-center items-center h-screen flex-col gap-4">
            <div className={`${sizeClasses[size]} border-4 border-primary-200 border-l-primary-500 rounded-full animate-spin`}></div>
            <p className="text-black-600 text-base">{text}</p>
        </div>
    )
}

/**
 * Error Page Component
 * Displays error messages with logout option
 */
export const ErrorPage = ({ error, onLogout, title = '⚠️ Error' }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen p-5 bg-error-50">
            <h1 className="text-error-600 mb-4 text-2xl font-bold">
                {title}
            </h1>

            <p className="text-black-600 mb-6 text-center max-w-lg leading-relaxed">
                {error || 'An unexpected error occurred. Please try again.'}
            </p>

            {onLogout && (
                <button
                    onClick={onLogout}
                    className="px-6 py-3 bg-error-600 hover:bg-error-700 text-white border-0 rounded-lg cursor-pointer text-base font-medium transition-colors duration-200"
                >
                    Logout
                </button>
            )}
        </div>
    )
}

/**
 * Empty State Component
 * Displays when there's no data to show
 */
export const EmptyState = ({
    icon = '📝',
    title = 'No Data',
    description = 'There is no data to display at the moment.',
    action = null
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="text-5xl mb-4">
                {icon}
            </div>

            <h3 className="text-black-700 mb-2 text-lg font-semibold">
                {title}
            </h3>

            <p className="text-black-600 mb-6 max-w-md leading-relaxed">
                {description}
            </p>

            {action && action}
        </div>
    )
}

/**
 * Status Badge Component
 * Reusable status indicator with consistent styling
 */
export const StatusBadge = ({
    status,
    variant = 'default',
    size = 'medium'
}) => {
    const variantClasses = {
        default: 'bg-black-200 text-black-700',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        info: 'bg-primary-100 text-primary-800'
    }

    const sizeClasses = {
        small: 'px-2 py-1 text-xs',
        medium: 'px-3 py-1.5 text-sm',
        large: 'px-4 py-2 text-base'
    }

    return (
        <span className={`inline-block rounded-lg font-medium text-center ${
            variantClasses[variant] || variantClasses.default
        } ${
            sizeClasses[size] || sizeClasses.medium
        }`}>
            {status}
        </span>
    )
}
