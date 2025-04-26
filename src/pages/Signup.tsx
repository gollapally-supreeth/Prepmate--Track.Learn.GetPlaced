import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Logo } from '@/components/ui/logo';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type SignupForm = z.infer<typeof signupSchema>;

const motivationalQuotes = [
  "Your Journey to Success Starts Here 🚀",
  "Transform Your Dreams into Reality ✨",
  "Every Expert Was Once a Beginner 🌱",
  "Your Future Awaits - Take the First Step 🏁",
  "Excellence is Not a Skill, It's an Attitude 💡"
];

// Add password strength helper
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: 'Weak', color: 'bg-red-400', text: 'text-red-500' };
  if (score === 3 || score === 4) return { label: 'Medium', color: 'bg-yellow-400', text: 'text-yellow-600' };
  if (score === 5) return { label: 'Strong', color: 'bg-green-500', text: 'text-green-600' };
  return { label: '', color: '', text: '' };
}

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const navigate = useNavigate();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: '',
    },
  });

  // Quote carousel
  useState(() => {
    const interval = setInterval(() => {
      setQuoteIdx((idx) => (idx + 1) % motivationalQuotes.length);
    }, 3500);
    return () => clearInterval(interval);
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Registration failed');
      } else {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const password = form.watch('password');
  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Floating shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute left-10 top-10 w-16 h-16 bg-purple-200 rounded-full opacity-30" />
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 7 }} className="absolute right-20 top-32 w-24 h-24 bg-indigo-200 rounded-full opacity-20" />
        <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute left-1/2 bottom-10 w-20 h-20 bg-blue-200 rounded-full opacity-20" />
      </div>
      {/* Quote Carousel */}
      <div className="mb-6 z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold text-center bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent min-h-[32px]"
          >
            {motivationalQuotes[quoteIdx]}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Centered Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md flex flex-col items-center justify-center"
      >
        <Card className="shadow-2xl border-0 dark:bg-gray-900/80 bg-white/70 backdrop-blur-lg w-full relative overflow-visible">
          <CardHeader className="flex flex-col items-center gap-2">
            <Logo />
            <CardTitle className="text-2xl font-bold">Create your PrepMate account</CardTitle>
            <CardDescription className="text-center text-base text-gray-500 dark:text-gray-300">Start your journey with us!</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} autoComplete="name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Password
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0} className="cursor-pointer text-gray-400 hover:text-purple-600 focus:outline-none">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="currentColor">i</text></svg>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs text-sm">
                            Use at least 8 characters, including uppercase, lowercase, number, and special character.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          autoComplete="new-password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`h-2 w-24 rounded-full transition-all duration-300 ${strength.color}`}></div>
                        <span className={`text-xs font-semibold ${strength.text}`}>{strength.label}</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Confirm Password"
                          autoComplete="new-password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirm((v) => !v)}
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <CardFooter className="flex flex-col gap-2 items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
