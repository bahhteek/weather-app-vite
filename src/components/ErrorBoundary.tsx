import { Component } from "react"

export class ErrorBoundary extends Component {
    state = {hasError: false} 

    static getDerivedStateFromError() {
        return {hasError: true}
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong.</div>
        }
        return this.props.children
    }
}