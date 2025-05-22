import { useState, useEffect } from "react";
import { TopicCard } from "./topic-card";
import { TopicFilters } from "./topic-filters";
import { Button } from "@components/ui/button";
import { Loader2 } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  scheduled_date: string;
  participant_count: number;
  comment_count: number;
  tags: string[];
}

interface TopicListProps {
  initialTopics?: Topic[];
  showFilters?: boolean;
}

export function TopicList({ initialTopics = [], showFilters = true }: TopicListProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [loading, setLoading] = useState(!initialTopics.length);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    tags: [] as string[]
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (!initialTopics.length) {
      fetchTopics();
    }
  }, [filters, pagination.page]);

  async function fetchTopics() {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (filters.search) searchParams.append("search", filters.search);
      if (filters.category) searchParams.append("category", filters.category);
      if (filters.tags.length > 0) searchParams.append("tags", filters.tags.join(","));
      searchParams.append("page", pagination.page.toString());
      searchParams.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/topics?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch topics");

      const data = await response.json();
      setTopics(data.topics);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch topics");
    } finally {
      setLoading(false);
    }
  }

  const handleJoin = async (topicId: string) => {
    try {
      const response = await fetch(`/api/topics/${topicId}/join`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to join topic");
      
      // Refresh topics to update participant count
      fetchTopics();
    } catch (err) {
      console.error("Error joining topic:", err);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  if (loading && !topics.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchTopics}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <TopicFilters
          currentFilters={filters}
          onChange={handleFilterChange}
        />
      )}
      
      {topics.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No topics found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                id={topic.id}
                title={topic.title}
                description={topic.description}
                category={topic.category}
                scheduledDate={new Date(topic.scheduled_date)}
                participantCount={topic.participant_count}
                commentCount={topic.comment_count}
                tags={topic.tags}
                onJoin={handleJoin}
              />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 