import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
    <h1 className="text-5xl font-bold text-gray-900">404</h1>
    <p className="text-gray-500">Page not found</p>
    <Link
      to="/dashboard"
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Go home
    </Link>
  </div>
);

export default NotFound;