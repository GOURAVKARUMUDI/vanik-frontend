import { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#F5F3EF', fontFamily: 'sans-serif', padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '2rem', color: '#7C3E2F', marginBottom: '1rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            padding: '0.75rem 2rem', background: '#7C3E2F', color: '#fff',
                            border: 'none', borderRadius: '0.5rem', cursor: 'pointer',
                            fontSize: '1rem', fontWeight: 'bold'
                        }}
                    >
                        Return to Home
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
