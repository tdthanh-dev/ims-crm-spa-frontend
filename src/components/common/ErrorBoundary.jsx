import React from 'react';
import { clearAuthData } from '@/utils/auth';

/**
 * Error Boundary Component - Catches JavaScript errors in the component tree
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        console.error('Error caught by ErrorBoundary:', error);
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console
        console.error('🚨 Error Boundary caught an error:', error, errorInfo);

        // Log to external service in production
        // logErrorToService(error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    }

    handleLogout = () => {
        clearAuthData();
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa'
                }}>
                    <div style={{
                        fontSize: '72px',
                        marginBottom: '20px',
                        color: '#dc2626'
                    }}>
                        💥
                    </div>

                    <h1 style={{
                        color: '#dc2626',
                        marginBottom: '16px',
                        fontSize: '28px'
                    }}>
                        Ối! Có lỗi xảy ra
                    </h1>

                    <p style={{
                        color: '#6b7280',
                        marginBottom: '24px',
                        fontSize: '16px',
                        maxWidth: '500px'
                    }}>
                        Có vẻ như ứng dụng gặp sự cố. Vui lòng thử làm mới trang hoặc đăng nhập lại.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px'
                    }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            🔄 Thử lại
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            🔄 Làm mới trang
                        </button>

                        <button
                            onClick={this.handleLogout}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            🚪 Đăng xuất
                        </button>
                    </div>

                    {import.meta.env.DEV && (
                        <details style={{
                            marginTop: '24px',
                            textAlign: 'left',
                            maxWidth: '800px',
                            width: '100%'
                        }}>
                            <summary style={{
                                cursor: 'pointer',
                                marginBottom: '12px',
                                fontWeight: 'bold'
                            }}>
                                🔍 Chi tiết lỗi (Development mode)
                            </summary>
                            <pre style={{
                                backgroundColor: '#1f2937',
                                color: '#f3f4f6',
                                padding: '16px',
                                borderRadius: '8px',
                                overflow: 'auto',
                                fontSize: '12px'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
export { ErrorBoundary };
