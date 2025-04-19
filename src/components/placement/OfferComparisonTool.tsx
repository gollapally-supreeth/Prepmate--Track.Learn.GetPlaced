
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Heart,
} from 'lucide-react';

// Mock offer data
const offers = [
  {
    id: '1',
    company: 'Google',
    title: 'Software Engineer',
    logo: 'https://logo.clearbit.com/google.com',
    location: 'Mountain View, CA',
    salary: '$120,000',
    equity: '50 RSUs/year',
    benefits: ['Health Insurance', '401k Matching', 'Free Meals'],
    bonusFeatures: ['Flexible Work', '20 PTO days', 'Learning Stipend'],
    startDate: '2023-08-15',
    deadline: '2023-07-25',
  },
  {
    id: '2',
    company: 'Microsoft',
    title: 'Frontend Developer',
    logo: 'https://logo.clearbit.com/microsoft.com',
    location: 'Redmond, WA',
    salary: '$110,000',
    equity: '30 RSUs/year',
    benefits: ['Health Insurance', '401k Matching', 'Gym Membership'],
    bonusFeatures: ['Hybrid Work', '15 PTO days', 'Phone Allowance'],
    startDate: '2023-09-01',
    deadline: '2023-07-30',
  }
];

const OfferComparisonTool: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Offer Comparison</CardTitle>
        <CardDescription>Compare your current job offers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="border-2 border-primary/20">
              <div className="bg-primary/5 p-4 flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={offer.logo}
                    alt={`${offer.company} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{offer.company}</h3>
                  <p className="text-sm text-muted-foreground">{offer.title}</p>
                </div>
              </div>
              
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.location}</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Compensation</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{offer.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{offer.equity}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Key Benefits</p>
                  <div className="flex flex-wrap gap-1">
                    {offer.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Perks</p>
                  <div className="flex flex-wrap gap-1">
                    {offer.bonusFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{new Date(offer.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Decision Deadline</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{new Date(offer.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Badge className="cursor-pointer hover:bg-green-600">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Accept
                  </Badge>
                  <Badge variant="destructive" className="cursor-pointer">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Decline
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferComparisonTool;
