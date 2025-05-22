export default function EnvDebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Supabase Configuration</h2>
          <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not loaded'}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded (hidden for security)' : 'Not loaded'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Site Configuration</h2>
          <p>NEXT_PUBLIC_SITE_URL: {process.env.NEXT_PUBLIC_SITE_URL || 'Not loaded'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Environment Info</h2>
          <p>NODE_ENV: {process.env.NODE_ENV || 'Not set'}</p>
          <p>Next.js Version: {process.env.NEXT_PUBLIC_NEXT_VERSION || 'Not available'}</p>
        </div>
      </div>
    </div>
  );
} 