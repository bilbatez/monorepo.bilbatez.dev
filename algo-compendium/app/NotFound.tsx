import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Page not found.</p>
      <Link to="/" className="text-[var(--color-turquoise)] hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
