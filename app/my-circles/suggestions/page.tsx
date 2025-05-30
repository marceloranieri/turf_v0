import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import RightSidebar from '@/components/right-sidebar'

export default async function SuggestionsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get user preferences
  const { data: profile } = await supabase
    .from('profiles')
    .select('preferences')
    .single()

  // Get suggested circles based on preferences
  const { data: suggestions } = await supabase
    .from('circles')
    .select('*')
    .contains('tags', profile?.preferences || ['Tech'])
    .limit(5)

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">You Might Like</h1>
        
        {suggestions?.length === 0 ? (
          <div className="text-zinc-400 text-center py-8">
            No suggestions available yet. Try updating your preferences!
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions?.map((circle) => (
              <div 
                key={circle.id}
                data-testid="suggested-circle"
                className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{circle.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{circle.description}</p>
                    <div className="flex gap-2 mt-2">
                      {circle.tags?.map((tag: string) => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
                    onClick={() => console.log('Join clicked:', circle.id)}
                  >
                    Join Circle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <RightSidebar nextRefreshAt={new Date(Date.now() + 5 * 60 * 1000)} />
    </div>
  )
} 