import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Service, mockUsers } from "@/data/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const provider = mockUsers.find(u => u.id === service.providerId);

  return (
    <Link to={`/services/${service.id}`} data-testid={`card-service-${service.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={service.image} 
            alt={service.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
              {service.category}
            </Badge>
            {service.isPopular && (
              <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-transparent">
                Popular
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="p-4 flex-none space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 border border-border">
              <AvatarImage src={provider?.avatar} />
              <AvatarFallback>{provider?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground truncate">{provider?.name}</span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 grow">
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-bold">{service.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({service.reviewCount})</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">STARTING AT</span>
            <span className="font-bold text-lg">${service.price}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{service.deliveryDays} Days</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
