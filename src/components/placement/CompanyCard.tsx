
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Star, MapPin, Briefcase, ExternalLink, Heart } from 'lucide-react';

interface CompanyCardProps {
  name: string;
  logo: string;
  industry: string;
  rating: number;
  applied: boolean;
  location: string;
  openRoles: number;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  logo,
  industry,
  rating,
  applied,
  location,
  openRoles,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
        <img
          src={logo}
          alt={`${name} logo`}
          className="h-12 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{industry}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{openRoles} open positions</span>
        </div>
        
        {applied && (
          <Badge variant="secondary" className="mt-2">
            Applied
          </Badge>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Jobs
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
