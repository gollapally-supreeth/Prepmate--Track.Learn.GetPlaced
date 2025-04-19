
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  LineChart, 
  ListChecks, 
  Layers,
  User,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import ApplicationList from '@/components/placement/ApplicationList';
import UpcomingEvents from '@/components/placement/UpcomingEvents';
import CompanyCard from '@/components/placement/CompanyCard';
import OfferComparisonTool from '@/components/placement/OfferComparisonTool';
import InterviewPreparationTracker from '@/components/placement/InterviewPreparationTracker';
import AssessmentProgress from '@/components/placement/AssessmentProgress';

// Mock data for the dashboard
const applicationData = [
  { name: 'Applied', value: 12 },
  { name: 'In Review', value: 5 },
  { name: 'Interview', value: 3 },
  { name: 'Offer', value: 2 },
  { name: 'Rejected', value: 4 },
];

const barChartData = [
  { name: 'Apr', applications: 5, interviews: 2, offers: 0 },
  { name: 'May', applications: 8, interviews: 4, offers: 1 },
  { name: 'Jun', applications: 12, interviews: 6, offers: 2 },
  { name: 'Jul', applications: 15, interviews: 8, offers: 3 },
];

const COLORS = ['#6366F1', '#8B5CF6', '#D946EF', '#10B981', '#F43F5E'];

const PlacementTracker = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  // Calculate statistics from mock data
  const totalApplications = applicationData.reduce((acc, curr) => acc + curr.value, 0);
  const totalInterviews = applicationData[2].value;
  const totalOffers = applicationData[3].value;
  const applicationSuccessRate = Math.round((totalOffers / totalApplications) * 100);
  const interviewSuccessRate = Math.round((totalOffers / totalInterviews) * 100);

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Placement Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your journey from applications to offers</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab("applications")}>
            <ListChecks className="mr-2 h-4 w-4" />
            View Applications
          </Button>
          <Button onClick={() => {
            setActiveTab("applications");
            toast({
              title: "Add New Application",
              description: "Create a new job application to track",
            });
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-0 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalApplications}</div>
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalInterviews}</div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Offers Received</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalOffers}</div>
                  <FileCheck className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{applicationSuccessRate}%</div>
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts & Lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Application Status Pie Chart */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Distribution of your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {applicationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Monthly Progress Bar Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Applications, interviews, and offers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="applications" fill="#8B5CF6" name="Applications" />
                      <Bar dataKey="interviews" fill="#10B981" name="Interviews" />
                      <Bar dataKey="offers" fill="#F43F5E" name="Offers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Events & Recent Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingEvents />
            <ApplicationList showHeader={true} limit={3} />
          </div>
          
          {/* Assessment Progress */}
          <AssessmentProgress />
        </TabsContent>
        
        {/* Applications Tab */}
        <TabsContent value="applications" className="mt-0 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full md:w-auto flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
            </div>
          </div>
          
          {/* Full Application List */}
          <ApplicationList showHeader={false} searchTerm={searchTerm} filterStatus={filterStatus} />
        </TabsContent>
        
        {/* Interviews Tab */}
        <TabsContent value="interviews" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interview Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Performance</CardTitle>
                <CardDescription>Your performance across different interview types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>HR Interviews</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Technical Rounds</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>System Design</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Behavioral Questions</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            {/* Interview Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Upcoming Interviews</CardTitle>
                  <CardDescription>
                    Your scheduled interviews for the next 7 days
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="min-w-[56px]">
                      <div className="text-xs text-muted-foreground">Today</div>
                      <div className="text-sm font-medium">2:00 PM</div>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col gap-0.5">
                      <div className="text-sm font-medium">Google - Frontend Engineer</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>45 minutes</span>
                        <Badge className="ml-2" variant="secondary">Technical</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Join</Button>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="min-w-[56px]">
                      <div className="text-xs text-muted-foreground">Tomorrow</div>
                      <div className="text-sm font-medium">11:00 AM</div>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col gap-0.5">
                      <div className="text-sm font-medium">Microsoft - SDE II</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>60 minutes</span>
                        <Badge className="ml-2" variant="secondary">HR Round</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Join</Button>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="min-w-[56px]">
                      <div className="text-xs text-muted-foreground">Fri, Jul 21</div>
                      <div className="text-sm font-medium">3:30 PM</div>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col gap-0.5">
                      <div className="text-sm font-medium">Amazon - Software Engineer</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>90 minutes</span>
                        <Badge className="ml-2" variant="secondary">System Design</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Interview Preparation Tracker */}
            <InterviewPreparationTracker />
          </div>
        </TabsContent>
        
        {/* Companies Tab */}
        <TabsContent value="companies" className="mt-0 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative w-full md:w-auto flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-8"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by industry" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary">
                <Building className="h-4 w-4 mr-2" />
                Track Company
              </Button>
            </div>
          </div>
          
          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CompanyCard 
              name="Google"
              logo="https://logo.clearbit.com/google.com"
              industry="Technology"
              rating={4.5}
              applied={true}
              location="Mountain View, CA"
              openRoles={15}
            />
            <CompanyCard 
              name="Microsoft"
              logo="https://logo.clearbit.com/microsoft.com"
              industry="Technology"
              rating={4.3}
              applied={true}
              location="Redmond, WA"
              openRoles={23}
            />
            <CompanyCard 
              name="Amazon"
              logo="https://logo.clearbit.com/amazon.com"
              industry="Technology"
              rating={4.1}
              applied={false}
              location="Seattle, WA"
              openRoles={42}
            />
            <CompanyCard 
              name="Apple"
              logo="https://logo.clearbit.com/apple.com"
              industry="Technology"
              rating={4.4}
              applied={false}
              location="Cupertino, CA"
              openRoles={18}
            />
            <CompanyCard 
              name="Meta"
              logo="https://logo.clearbit.com/meta.com"
              industry="Technology"
              rating={4.2}
              applied={true}
              location="Menlo Park, CA"
              openRoles={12}
            />
            <CompanyCard 
              name="Netflix"
              logo="https://logo.clearbit.com/netflix.com"
              industry="Entertainment"
              rating={4.3}
              applied={false}
              location="Los Gatos, CA"
              openRoles={8}
            />
          </div>
        </TabsContent>
        
        {/* Offers Tab */}
        <TabsContent value="offers" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Offer Stats */}
            <Card className="md:row-span-2">
              <CardHeader>
                <CardTitle>Offer Summary</CardTitle>
                <CardDescription>Overview of your job offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Offers</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending Responses</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accepted Offers</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Salary</span>
                  <span className="font-medium">$105,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Highest Offer</span>
                  <span className="font-medium">$120,000</span>
                </div>
                <div className="pt-4">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Offer Comparison Tool */}
            <OfferComparisonTool />
          </div>
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default PlacementTracker;
