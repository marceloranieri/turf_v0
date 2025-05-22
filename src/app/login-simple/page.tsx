export default function LoginSimplePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Simplified Login</h1>
        <p className="text-center text-gray-600">This is a temporary login page that bypasses authentication.</p>
        <div className="mt-6">
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline">
            Log In with Username
          </button>
        </div>
        <div className="mt-4">
          <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline">
            Log In with Google
          </button>
        </div>
      </div>
    </div>
  );
} 