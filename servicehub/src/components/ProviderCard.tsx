import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { User, ProviderProfile } from "@/data/mockData";

interface ProviderCardProps {
  user: User;
  profile: ProviderProfile;
}

export function ProviderCard({ user, profile }: ProviderCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
      <CardContent className="p-6 text-center flex flex-col items-center space-y-4">
        <Avatar className="w-20 h-20 border-2 border-transparent group-hover:border-primary transition-colors">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="font-bold text-lg">{user.name}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1">{profile.skills.join(" • ")}</p>
        </div>
        <div className="w-full pt-4 border-t border-border flex justify-between items-center text-sm">
          <div className="flex flex-col items-start">
            <span className="text-muted-foreground">Rating</span>
            <StarRating rating={4.9} showCount={false} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">Rate</span>
            <span className="font-bold">${profile.hourlyRate}/hr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
