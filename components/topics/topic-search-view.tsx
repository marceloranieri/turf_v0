"use client"

// Inline SearchFilters component
const SearchFilters = ({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) => {
  return (
    <div className="flex items-center space-x-2">
      <select className="p-2 border rounded bg-zinc-800 border-zinc-700 text-white">
        <option value="all">All Categories</option>
        <option value="topics">Topics</option>
        <option value="users">Users</option>
      </select>
      <select className="p-2 border rounded bg-zinc-800 border-zinc-700 text-white">
        <option value="recent">Most Recent</option>
        <option value="popular">Most Popular</option>
        <option value="relevant">Most Relevant</option>
      </select>
      <button 
        onClick={() => onApplyFilters({})}
        className="bg-violet-600 text-white p-2 rounded hover:bg-violet-700"
      >
        Apply Filters
      </button>
    </div>
  )
}

export function SearchView() {
  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters)
    // In a real app, you would apply these filters to your search results
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        {/* Search Form */}
        <form className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded bg-zinc-800 border-zinc-700 text-white"
          />
          <button className="bg-blue-500 text-white p-2 rounded mt-2">Search</button>
        </form>

        {/* Desktop Filters */}
        <div className="mt-4 hidden md:flex justify-end">
          <SearchFilters onApplyFilters={handleApplyFilters} />
        </div>
      </header>

      {/* Results Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Results</h2>
        {/* Placeholder for Results */}
        <p className="text-zinc-400">No results found.</p>
      </section>

      {/* Filter Button (Fixed Position) */}
      <div className="fixed bottom-20 right-4 z-20 md:hidden">
        <SearchFilters onApplyFilters={handleApplyFilters} />
      </div>
    </div>
  )
}
