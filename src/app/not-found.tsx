import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="text-indigo-400 hover:text-indigo-300">
        Return to Home
      </Link>
    </div>
  );
} 