
import React from 'react';
import { useFocusTimer, type TimerSettings as TimerSettingsType, FocusMode } from './FocusTimerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Brain, Zap, Music, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerSettingsProps {
  className?: string;
}

export function TimerSettings({ className }: TimerSettingsProps) {
  const { 
    state, 
    updateSettings, 
    changeFocusMode, 
    setSound, 
    blockWebsite, 
    unblockWebsite, 
    updateGoals 
  } = useFocusTimer();
  
  const { settings, focusMode, sound, blockedWebsites, goals } = state;
  
  const [newWebsite, setNewWebsite] = React.useState('');
  const [workMinutes, setWorkMinutes] = React.useState(settings.workDuration);
  const [breakMinutes, setBreakMinutes] = React.useState(settings.breakDuration);
  const [longBreakMinutes, setLongBreakMinutes] = React.useState(settings.longBreakDuration);
  const [sessionsCount, setSessionsCount] = React.useState(settings.sessionsBeforeLongBreak);
  
  // Update local state when settings change
  React.useEffect(() => {
    setWorkMinutes(settings.workDuration);
    setBreakMinutes(settings.breakDuration);
    setLongBreakMinutes(settings.longBreakDuration);
    setSessionsCount(settings.sessionsBeforeLongBreak);
  }, [settings]);
  
  // Apply timer duration settings
  const applySettings = () => {
    updateSettings({
      workDuration: workMinutes,
      breakDuration: breakMinutes,
      longBreakDuration: longBreakMinutes,
      sessionsBeforeLongBreak: sessionsCount
    });
  };
  
  // Handle focus mode change
  const handleFocusModeChange = (mode: FocusMode) => {
    changeFocusMode(mode);
    
    // Apply preset durations based on mode
    if (mode === 'sprint') {
      updateSettings({
        workDuration: 15,
        breakDuration: 3,
        longBreakDuration: 15,
      });
    } else if (mode === 'deep') {
      updateSettings({
        workDuration: 50,
        breakDuration: 10,
        longBreakDuration: 30,
      });
    }
  };
  
  // Handle adding a new website to block
  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebsite.trim()) return;
    
    blockWebsite(newWebsite.trim());
    setNewWebsite('');
  };
  
  // Sound options
  const soundOptions = [
    { id: 'none', name: 'None', icon: <VolumeX className="h-4 w-4" /> },
    { id: 'bell', name: 'Bell', src: '/sounds/bell.mp3' },
    { id: 'chime', name: 'Chime', src: '/sounds/chime.mp3' },
    { id: 'digital', name: 'Digital', src: '/sounds/digital.mp3' },
  ];
  
  return (
    <div className={cn("p-4", className)}>
      <h2 className="text-lg font-semibold mb-4">Timer Settings</h2>
      
      <Tabs defaultValue="modes">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="modes" className="flex-1">Focus Modes</TabsTrigger>
          <TabsTrigger value="durations" className="flex-1">Durations</TabsTrigger>
          <TabsTrigger value="distractions" className="flex-1">Distractions</TabsTrigger>
          <TabsTrigger value="goals" className="flex-1">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modes" className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={focusMode === 'deep' ? "default" : "outline"}
              className={cn(
                "flex-col h-24 space-y-2",
                focusMode === 'deep' ? "border-primary" : ""
              )}
              onClick={() => handleFocusModeChange('deep')}
            >
              <Brain className="h-6 w-6" />
              <span>Deep Focus</span>
            </Button>
            
            <Button
              variant={focusMode === 'sprint' ? "default" : "outline"}
              className={cn(
                "flex-col h-24 space-y-2",
                focusMode === 'sprint' ? "border-primary" : ""
              )}
              onClick={() => handleFocusModeChange('sprint')}
            >
              <Zap className="h-6 w-6" />
              <span>Sprint Mode</span>
            </Button>
            
            <Button
              variant={focusMode === 'music' ? "default" : "outline"}
              className={cn(
                "flex-col h-24 space-y-2",
                focusMode === 'music' ? "border-primary" : ""
              )}
              onClick={() => handleFocusModeChange('music')}
            >
              <Music className="h-6 w-6" />
              <span>With Music</span>
            </Button>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Notification Sound</h3>
            <div className="grid grid-cols-4 gap-2">
              {soundOptions.map(option => (
                <Button
                  key={option.id}
                  variant={sound === (option.src || null) ? "default" : "outline"}
                  className="h-20"
                  onClick={() => setSound(option.src || null)}
                >
                  {option.icon || option.name}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="durations" className="space-y-6">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="work-duration">Work Duration</Label>
                <span className="text-sm">{workMinutes} minutes</span>
              </div>
              <Slider
                id="work-duration"
                defaultValue={[workMinutes]}
                min={5}
                max={60}
                step={5}
                onValueChange={values => setWorkMinutes(values[0])}
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="break-duration">Short Break</Label>
                <span className="text-sm">{breakMinutes} minutes</span>
              </div>
              <Slider
                id="break-duration"
                defaultValue={[breakMinutes]}
                min={1}
                max={20}
                step={1}
                onValueChange={values => setBreakMinutes(values[0])}
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="long-break-duration">Long Break</Label>
                <span className="text-sm">{longBreakMinutes} minutes</span>
              </div>
              <Slider
                id="long-break-duration"
                defaultValue={[longBreakMinutes]}
                min={10}
                max={60}
                step={5}
                onValueChange={values => setLongBreakMinutes(values[0])}
                className="mt-1"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sessions-count">Sessions before long break</Label>
                <span className="text-sm">{sessionsCount} sessions</span>
              </div>
              <Slider
                id="sessions-count"
                defaultValue={[sessionsCount]}
                min={2}
                max={8}
                step={1}
                onValueChange={values => setSessionsCount(values[0])}
                className="mt-1"
              />
            </div>
          </div>
          
          <Button onClick={applySettings} className="w-full">Apply Settings</Button>
        </TabsContent>
        
        <TabsContent value="distractions" className="space-y-4">
          <form onSubmit={handleAddWebsite} className="flex gap-2">
            <Input
              placeholder="Enter website to block (e.g., facebook.com)"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Add</Button>
          </form>
          
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium mb-1">Blocked Websites</h3>
            
            {blockedWebsites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No websites blocked yet.</p>
            ) : (
              <div className="space-y-1">
                {blockedWebsites.map((website) => (
                  <div 
                    key={website} 
                    className="flex items-center justify-between p-2 rounded-md bg-muted"
                  >
                    <span className="text-sm">{website}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => unblockWebsite(website)}
                      className="h-7 w-7 p-0 text-destructive"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Block Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  Block notifications during focus sessions
                </p>
              </div>
              <Switch 
                checked={true}
                // This would normally update a setting, but we'll keep it enabled by default
                // onCheckedChange={(checked) => setSetting('blockNotifications', checked)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="daily-sessions">Daily Sessions Goal</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  id="daily-sessions"
                  defaultValue={[goals.dailySessions]}
                  min={1}
                  max={12}
                  step={1}
                  onValueChange={values => updateGoals({ dailySessions: values[0] })}
                  className="flex-1"
                />
                <span className="w-8 text-center">{goals.dailySessions}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="weekly-sessions">Weekly Sessions Goal</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  id="weekly-sessions"
                  defaultValue={[goals.weeklySessions]}
                  min={5}
                  max={50}
                  step={5}
                  onValueChange={values => updateGoals({ weeklySessions: values[0] })}
                  className="flex-1"
                />
                <span className="w-8 text-center">{goals.weeklySessions}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="daily-time">Daily Focus Time (minutes)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  id="daily-time"
                  defaultValue={[goals.dailyFocusTime]}
                  min={15}
                  max={480}
                  step={15}
                  onValueChange={values => updateGoals({ dailyFocusTime: values[0] })}
                  className="flex-1"
                />
                <span className="w-10 text-center">{goals.dailyFocusTime}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
