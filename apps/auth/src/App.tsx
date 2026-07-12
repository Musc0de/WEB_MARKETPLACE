import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Button } from '@starsuperscare/ui';

const Fallback = ({ error }: { error: Error }) => (
  <div role='alert'>
    <p>Something went wrong:</p>
    <pre style={{ color: 'red' }}>{error.message}</pre>
  </div>
);

const Home = () => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>StarSuperScare Auth</h1>
    <p>Welcome to the auth application.</p>
    <Button>Test Shared UI Button</Button>
  </div>
);

const NotFound = () => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
