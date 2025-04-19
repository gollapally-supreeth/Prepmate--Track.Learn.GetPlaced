
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, Star, Briefcase, Building, MapPin, Calendar } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Application status colors
const statusColors: Record<string, string> = {
  'Applied': 'bg-blue-500',
  'In Review': 'bg-yellow-500',
  'Interview': 'bg-purple-500',
  'Offer': 'bg-green-500',
  'Rejected': 'bg-red-500',
};

// Mock applications data
const mockApplications = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    location: 'Mountain View, CA',
    status: 'Interview',
    appliedDate: '2023-07-01',
    lastActivity: '2023-07-10',
    logo: 'https://logo.clearbit.com/google.com',
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Frontend Developer',
    location: 'Redmond, WA',
    status: 'Applied',
    appliedDate: '2023-07-05',
    lastActivity: '2023-07-05',
    logo: 'https://logo.clearbit.com/microsoft.com',
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'Full Stack Engineer',
    location: 'Seattle, WA',
    status: 'In Review',
    appliedDate: '2023-06-28',
    lastActivity: '2023-07-08',
    logo: 'https://logo.clearbit.com/amazon.com',
  },
  {
    id: '4',
    company: 'Apple',
    position: 'iOS Developer',
    location: 'Cupertino, CA',
    status: 'Rejected',
    appliedDate: '2023-06-15',
    lastActivity: '2023-07-01',
    logo: 'https://logo.clearbit.com/apple.com',
  },
  {
    id: '5',
    company: 'Meta',
    position: 'React Developer',
    location: 'Menlo Park, CA',
    status: 'Offer',
    appliedDate: '2023-06-10',
    lastActivity: '2023-07-12',
    logo: 'https://logo.clearbit.com/meta.com',
  },
];

interface ApplicationListProps {
  showHeader?: boolean;
  limit?: number;
  searchTerm?: string;
  filterStatus?: string;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ 
  showHeader = true, 
  limit, 
  searchTerm = '', 
  filterStatus = 'all'
}) => {
  // Filter applications based on search term and status
  const filteredApplications = mockApplications
    .filter(app => 
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(app => 
      filterStatus === 'all' || app.status.toLowerCase().replace(' ', '-') === filterStatus
    )
    .slice(0, limit);

  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Recent Applications</CardTitle>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
      )}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No applications found. Try adjusting your filters or add a new application.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={application.logo} 
                          alt={application.company} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                      <span className="font-medium">{application.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>{application.position}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {application.location}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className="flex items-center gap-1" 
                      style={{ backgroundColor: statusColors[application.status] }}
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationList;
