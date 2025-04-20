
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck2, GraduationCap, ListChecks, PieChart, Presentation, Rocket, Timer, LayoutDashboard } from 'lucide-react';
import { ProgressCard } from '@/components/ProgressCard';
import { AppSidebar } from '@/components/AppSidebar';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Progress } from "@/components/ui/progress"
import {
  CardHeader as ShadCardHeader,
  CardTitle as ShadCardTitle,
  CardDescription as ShadCardDescription,
  CardContent as ShadCardContent,
  CardFooter as ShadCardFooter,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator as RadixSeparator } from "@radix-ui/react-separator"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Task title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  dueTime: z.string().min(5, {
    message: "Due time must be in HH:MM format.",
  }),
  priority: z.enum(["Low", "Medium", "High"]),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  subject: string;
  dueTime: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  onComplete: () => void;
}

function TaskCard({ id, title, description, subject, dueTime, priority, completed, onComplete }: TaskCardProps) {
  const priorityColor =
    priority === "High" ? "text-red-500" :
    priority === "Medium" ? "text-yellow-500" :
    "text-green-500";

  return (
    <Card className="shadow-md card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onComplete}>
            {completed ? "Mark Incomplete" : "Mark Complete"}
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Subject: {subject}</p>
            <p className="text-sm text-muted-foreground">Due Time: {dueTime}</p>
          </div>
          <Badge className={priorityColor}>{priority}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    {
      id: "task-1",
      title: "Complete Math Assignment",
      description: "Finish all problems in chapter 3",
      subject: "Math",
      dueTime: "18:00",
      priority: "High" as const, // Use 'as const' to ensure correct type
      completed: false,
    },
    {
      id: "task-2",
      title: "Read History Chapter",
      description: "Read and take notes on chapter 5",
      subject: "History",
      dueTime: "20:00",
      priority: "Medium" as const,
      completed: true,
    },
    {
      id: "task-3",
      title: "Prepare Presentation",
      description: "Create slides for the science presentation",
      subject: "Science",
      dueTime: "22:00",
      priority: "Low" as const,
      completed: false,
    },
  ]);

  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      dueTime: "",
      priority: "Low",
    },
  })

  const { toast } = useToast()

  function onSubmit(values: TaskFormValues) {
    // Here you would handle form submission, e.g., sending data to an API.
    console.log(values)
    toast({
      title: "Task created.",
      description: "Your task has been created.",
      action: <ToastAction altText="Goto schedule">Undo</ToastAction>,
    })
  }

  const toggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-heading">Dashboard</h1>
        </div>
        <DrawerTrigger asChild>
          <Button variant="outline">Add Task</Button>
        </DrawerTrigger>
      </div>

      <p className="text-muted-foreground">
        Here's an overview of your study progress, upcoming tasks, and important resources.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Total Subjects</CardTitle>
            <CardDescription>All subjects you are currently studying</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Including Math, Science, History...</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Weekly Study Time</CardTitle>
            <CardDescription>Total hours spent studying this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25 Hours</div>
            <p className="text-sm text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Number of exams scheduled for the next month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Exams</div>
            <p className="text-sm text-muted-foreground">Prepare and stay focused!</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Resources Accessed</CardTitle>
            <CardDescription>Number of study resources you've accessed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120+</div>
            <p className="text-sm text-muted-foreground">Explore more to enhance your knowledge!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ProgressCard
          subject="Mathematics"
          progress={75}
          color="bg-focus-blue"
          icon={<PieChart className="h-4 w-4 text-focus-blue" />}
        />
        <ProgressCard
          subject="Computer Science"
          progress={60}
          color="bg-focus-purple"
          icon={<Rocket className="h-4 w-4 text-focus-purple" />}
        />
        <ProgressCard
          subject="History"
          progress={90}
          color="bg-focus-green"
          icon={<GraduationCap className="h-4 w-4 text-focus-green" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Stay organized with your tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                subject={task.subject}
                dueTime={task.dueTime}
                priority={task.priority}
                completed={task.completed}
                onComplete={() => toggleComplete(task.id)}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access your favorite resources quickly</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="btn-hover">
              <CalendarCheck2 className="w-4 h-4 mr-2" />
              Planner
            </Button>
            <Button variant="secondary" className="btn-hover">
              <ListChecks className="w-4 h-4 mr-2" />
              Notes
            </Button>
            <Button variant="secondary" className="btn-hover">
              <Presentation className="w-4 h-4 mr-2" />
              Resources
            </Button>
            <Button variant="secondary" className="btn-hover">
              <Timer className="w-4 h-4 mr-2" />
              Focus Timer
            </Button>
          </CardContent>
        </Card>
      </div>

      <Drawer open={open} onOpenChange={open ? closeDrawer : openDrawer}>
        <DrawerContent className="bg-white dark:bg-gray-900">
          <DrawerHeader>
            <DrawerTitle>Add New Task</DrawerTitle>
            <DrawerDescription>
              Create a new task to stay organized.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a detailed description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Time</FormLabel>
                      <FormControl>
                        <Input placeholder="HH:MM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Task</Button>
              </form>
            </Form>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Dashboard;
