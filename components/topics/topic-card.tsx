import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { CalendarIcon, MessageCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  scheduledDate: Date;
  participantCount: number;
  commentCount: number;
  tags: string[];
  onJoin: (id: string) => void;
}

export function TopicCard({
  id,
  title,
  description,
  category,
  scheduledDate,
  participantCount,
  commentCount,
  tags,
  onJoin,
}: TopicCardProps) {
  const formattedDate = formatDistanceToNow(scheduledDate, { addSuffix: true });
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-sm">{category}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            {formattedDate}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{participantCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{commentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon size={14} />
              <span>{new Date(scheduledDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Button size="sm" onClick={() => onJoin(id)}>
            Join Debate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 