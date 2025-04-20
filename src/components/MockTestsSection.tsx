import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

const mockTestsData = [
  {
    id: 1,
    title: "Frontend Development Mock Test",
    description: "Test your knowledge in HTML, CSS, and JavaScript.",
    questions: 50,
    duration: "60 minutes",
    difficulty: "Intermediate",
    category: "Frontend",
    status: "Complete",
    score: 85,
    dateTaken: "2024-07-15",
  },
  {
    id: 2,
    title: "Backend Development Mock Test",
    description: "Test your knowledge in Node.js, Express, and MongoDB.",
    questions: 60,
    duration: "75 minutes",
    difficulty: "Advanced",
    category: "Backend",
    status: "In Progress",
    score: 60,
    dateTaken: "2024-07-20",
  },
  {
    id: 3,
    title: "Data Structures and Algorithms Mock Test",
    description: "Test your knowledge in arrays, linked lists, and sorting algorithms.",
    questions: 40,
    duration: "45 minutes",
    difficulty: "Beginner",
    category: "DSA",
    status: "Not Started",
    score: 0,
    dateTaken: null,
  },
  {
    id: 4,
    title: "Full Stack Development Mock Test",
    description: "Test your knowledge in both frontend and backend technologies.",
    questions: 100,
    duration: "120 minutes",
    difficulty: "Advanced",
    category: "Full Stack",
    status: "Complete",
    score: 92,
    dateTaken: "2024-08-01",
  },
  {
    id: 5,
    title: "React.js Mock Test",
    description: "Test your knowledge in React components, state management, and hooks.",
    questions: 50,
    duration: "60 minutes",
    difficulty: "Intermediate",
    category: "Frontend",
    status: "In Progress",
    score: 70,
    dateTaken: "2024-08-05",
  },
  {
    id: 6,
    title: "Node.js Mock Test",
    description: "Test your knowledge in Node.js modules, streams, and events.",
    questions: 60,
    duration: "75 minutes",
    difficulty: "Advanced",
    category: "Backend",
    status: "Not Started",
    score: 0,
    dateTaken: null,
  },
  {
    id: 7,
    title: "Database Management Mock Test",
    description: "Test your knowledge in SQL, NoSQL, and database design.",
    questions: 40,
    duration: "45 minutes",
    difficulty: "Beginner",
    category: "Database",
    status: "Complete",
    score: 78,
    dateTaken: "2024-08-10",
  },
  {
    id: 8,
    title: "Mobile App Development Mock Test",
    description: "Test your knowledge in React Native and mobile app architecture.",
    questions: 100,
    duration: "120 minutes",
    difficulty: "Advanced",
    category: "Mobile",
    status: "In Progress",
    score: 88,
    dateTaken: "2024-08-15",
  },
  {
    id: 9,
    title: "Vue.js Mock Test",
    description: "Test your knowledge in Vue components, directives, and reactivity.",
    questions: 50,
    duration: "60 minutes",
    difficulty: "Intermediate",
    category: "Frontend",
    status: "Not Started",
    score: 0,
    dateTaken: null,
  },
  {
    id: 10,
    title: "Express.js Mock Test",
    description: "Test your knowledge in Express middleware, routing, and error handling.",
    questions: 60,
    duration: "75 minutes",
    difficulty: "Advanced",
    category: "Backend",
    status: "Complete",
    score: 95,
    dateTaken: "2024-08-20",
  },
];

const assessmentPhases = [
  {
    phase: "Resume Screening",
    successRate: 75,
    description: "Percentage of candidates who pass the initial resume screening phase.",
  },
  {
    phase: "Technical Interview",
    successRate: 50,
    description: "Percentage of candidates who pass the technical interview phase.",
  },
  {
    phase: "Coding Challenge",
    successRate: 60,
    description: "Percentage of candidates who successfully complete the coding challenge.",
  },
  {
    phase: "HR Interview",
    successRate: 80,
    description: "Percentage of candidates who pass the HR interview phase.",
  },
];

const interviewTips = [
  "Research the company and the role thoroughly.",
  "Practice common interview questions and prepare your answers.",
  "Be ready to discuss your projects and experiences in detail.",
  "Demonstrate your problem-solving skills and technical knowledge.",
  "Ask thoughtful questions to show your interest and engagement.",
  "Dress professionally and maintain a positive attitude.",
  "Follow up with a thank-you note after the interview.",
];

const assessmentCategories = [
  "Frontend Development",
  "Backend Development",
  "Data Structures and Algorithms",
  "Full Stack Development",
  "Mobile App Development",
  "Database Management",
  "Machine Learning",
  "DevOps",
];

const popularTopics = [
  "JavaScript",
  "React",
  "Node.js",
  "SQL",
  "Data Structures",
  "Algorithms",
  "HTML",
  "CSS",
];

const resourcesList = [
  {
    title: "LeetCode",
    description: "Practice coding problems and prepare for technical interviews.",
    link: "https://leetcode.com/",
  },
  {
    title: "HackerRank",
    description: "Solve coding challenges and participate in contests.",
    link: "https://www.hackerrank.com/",
  },
  {
    title: "GeeksforGeeks",
    description: "Learn about computer science concepts and algorithms.",
    link: "https://www.geeksforgeeks.org/",
  },
  {
    title: "MDN Web Docs",
    description: "Comprehensive documentation for web technologies.",
    link: "https://developer.mozilla.org/",
  },
  {
    title: "Stack Overflow",
    description: "Find answers to your coding questions and help others.",
    link: "https://stackoverflow.com/",
  },
];

export default function MockTestsSection() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const filteredTests = React.useMemo(() => {
    let tests = mockTestsData;

    if (selectedCategory !== "All") {
      tests = tests.filter((test) => test.category === selectedCategory);
    }

    if (searchQuery) {
      tests = tests.filter((test) =>
        test.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDate) {
      tests = tests.filter((test) => {
        if (test.dateTaken) {
          const testDate = new Date(test.dateTaken);
          return (
            testDate.getFullYear() === selectedDate.getFullYear() &&
            testDate.getMonth() === selectedDate.getMonth() &&
            testDate.getDate() === selectedDate.getDate()
          );
        }
        return false;
      });
    }

    return tests;
  }, [selectedCategory, searchQuery, selectedDate]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Mock Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {assessmentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder="Search Mock Tests"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2024-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Table>
              <TableCaption>A list of your mock tests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>{test.difficulty}</TableCell>
                    <TableCell>{test.status}</TableCell>
                    <TableCell className="text-right">{test.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right">
                    {filteredTests.length} mock tests
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Phase Success Rates</CardTitle>
            <CardTitle>
              <Badge variant="secondary">Insights</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessmentPhases.map((phase, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`progress-${index}`}>{phase.phase}</Label>
                    <span>{phase.successRate}%</span>
                  </div>
                  <Progress id={`progress-${index}`} value={phase.successRate} />
                  <p className="text-sm text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Tips</CardTitle>
            <CardTitle>
              <Badge variant="secondary">Tips</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {interviewTips.map((tip, index) => (
                <li key={index} className="text-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Assessment Categories</AccordionTrigger>
          <AccordionContent>
            {assessmentCategories.map((category, index) => (
              <div key={index} className="py-2">
                {category}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Popular Topics</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((topic, index) => (
                <Badge key={index}>{topic}</Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Resources</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {resourcesList.map((resource, index) => (
                <div key={index} className="space-y-2">
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {resource.title}
                  </a>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
