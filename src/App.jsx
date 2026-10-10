import './App.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Weather } from './components/Weather'

function App() {
  return (
      <ErrorBoundary>
        <Weather />
      </ErrorBoundary>
  );
}

export default App
