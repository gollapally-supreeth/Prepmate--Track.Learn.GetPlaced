import React, { useState, useEffect } from 'react';
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
  const [newPresetName, setNewPresetName] = useState('');
  const [showAddPreset, setShowAddPreset] = useState(false);
  
  // Update local state when settings change
  React.useEffect(() => {
    setWorkMinutes(settings.workDuration);
    setBreakMinutes(settings.breakDuration);
    setLongBreakMinutes(settings.longBreakDuration);
    setSessionsCount(settings.sessionsBeforeLongBreak);
  }, [settings]);
  
  // Focus Modes config
  const FOCUS_MODES = [
    {
      id: 'deep',
      name: 'Deep Focus',
      work: 50,
      break: 10,
      longBreak: 30,
      sessions: 2,
      sound: null,
      blockWeb: true,
      motivational: 'deep',
      summary: 'Long sessions, no sound, blocks distractions, deep work quotes.'
    },
    {
      id: 'sprint',
      name: 'Sprint',
      work: 15,
      break: 3,
      longBreak: 15,
      sessions: 4,
      sound: '/sounds/chime.mp3',
      blockWeb: false,
      motivational: 'energetic',
      summary: 'Short, intense sessions, energetic sound, no blocking.'
    },
    {
      id: 'music',
      name: 'With Music',
      work: 25,
      break: 5,
      longBreak: 15,
      sessions: 4,
      sound: '/sounds/bell.mp3',
      blockWeb: false,
      motivational: 'general',
      summary: 'Balanced sessions, music, general motivation.'
    }
  ];

  const [selectedMode, setSelectedMode] = useState(null);
  const [blockWeb, setBlockWeb] = useState(false);
  const [motivationalType, setMotivationalType] = useState('general');

  // When a mode is selected, update all local state for preview
  const handleSelectMode = (mode) => {
    setSelectedMode(mode.id);
    setWorkMinutes(mode.work);
    setBreakMinutes(mode.break);
    setLongBreakMinutes(mode.longBreak);
    setSessionsCount(mode.sessions);
    setSound(mode.sound);
    setBlockWeb(mode.blockWeb);
    setMotivationalType(mode.motivational);
  };

  // On mount, set selectedMode to match current settings
  useEffect(() => {
    // Special logic: If 'With Music' mode is selected, allow any sound
    const match = FOCUS_MODES.find(m => {
      if (m.id === 'music') {
        return (
          m.work === workMinutes &&
          m.break === breakMinutes &&
          m.longBreak === longBreakMinutes &&
          m.sessions === sessionsCount &&
          blockWeb === m.blockWeb &&
          motivationalType === m.motivational
          // sound can be any value
        );
      } else {
        return (
          m.work === workMinutes &&
          m.break === breakMinutes &&
          m.longBreak === longBreakMinutes &&
          m.sessions === sessionsCount &&
          sound === m.sound &&
          blockWeb === m.blockWeb &&
          motivationalType === m.motivational
        );
      }
    });
    setSelectedMode(match ? match.id : null);
  }, [workMinutes, breakMinutes, longBreakMinutes, sessionsCount, sound, blockWeb, motivationalType]);

  // Update applySettings to save all changes
  const applySettings = () => {
    updateSettings({
      workDuration: workMinutes,
      breakDuration: breakMinutes,
      longBreakDuration: longBreakMinutes,
      sessionsBeforeLongBreak: sessionsCount
    });
    // Save sound, blockWeb, motivationalType if needed (extend context if required)
    // For now, just show toast
    const mode = FOCUS_MODES.find(m => m.id === selectedMode);
    if (mode) {
      setToast(`${mode.name} mode applied!`);
    } else {
      // fallback to preset logic
      const allPresets = [...FIXED_PRESETS, ...userPresets];
      const matched = allPresets.find(
        p =>
          p.work === workMinutes &&
          p.break === breakMinutes &&
          p.longBreak === longBreakMinutes &&
          p.sessions === sessionsCount
      );
      setToast(matched ? `${matched.name} preset applied!` : 'Custom settings applied!');
    }
  };
  
  // Handle adding a new website to block
  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebsite.trim()) return;
    
    blockWebsite(newWebsite.trim());
    setNewWebsite('');
  };
  
  // Music options for concentration
  const musicOptions = [
    { id: 'lofi', name: 'Lo-fi Beats', src: '/music/lofi.mp3' },
    { id: 'rain', name: 'Rain Sounds', src: '/music/rain.mp3' },
    { id: 'piano', name: 'Piano Focus', src: '/music/piano.mp3' },
  ];
  
  // --- Presets State ---
  const FIXED_PRESETS = [
    {
      id: 'pomodoro',
      name: 'Pomodoro',
      fixed: true,
      work: 25,
      break: 5,
      longBreak: 15,
      sessions: 4
    },
    {
      id: 'deep',
      name: 'Deep Work',
      fixed: true,
      work: 50,
      break: 10,
      longBreak: 30,
      sessions: 2
    },
    {
      id: 'sprint',
      name: 'Quick Sprint',
      fixed: true,
      work: 15,
      break: 3,
      longBreak: 10,
      sessions: 4
    }
  ];

  const [userPresets, setUserPresets] = useState(() => {
    const saved = localStorage.getItem('focusUserPresets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('focusUserPresets', JSON.stringify(userPresets));
  }, [userPresets]);

  // --- Toast State ---
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // --- Preset Editing ---
  const handlePresetChange = (id, field, value, isUser) => {
    if (isUser) {
      setUserPresets(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
  };
  const handlePresetNameChange = (id, value) => {
    setUserPresets(prev => prev.map(p => p.id === id ? { ...p, name: value } : p));
  };
  const handleDeletePreset = (id) => {
    setUserPresets(prev => prev.filter(p => p.id !== id));
  };
  const handleAddPreset = () => {
    const newId = 'user-' + Date.now();
    setUserPresets(prev => [
      ...prev,
      {
        id: newId,
        name: 'New Preset',
        fixed: false,
        work: 25,
        break: 5,
        longBreak: 15,
        sessions: 4
      }
    ]);
  };
  const handleApplyPreset = (preset) => {
    setWorkMinutes(preset.work);
    setBreakMinutes(preset.break);
    setLongBreakMinutes(preset.longBreak);
    setSessionsCount(preset.sessions);
    updateSettings({
      workDuration: preset.work,
      breakDuration: preset.break,
      longBreakDuration: preset.longBreak,
      sessionsBeforeLongBreak: preset.sessions
    });
    setToast(`${preset.name} preset applied!`);
  };
  const handleAddPresetWithValues = () => {
    const newId = 'user-' + Date.now();
    setUserPresets(prev => [
      ...prev,
      {
        id: newId,
        name: newPresetName.trim(),
        fixed: false,
        work: workMinutes,
        break: breakMinutes,
        longBreak: longBreakMinutes,
        sessions: sessionsCount
      }
    ]);
    setToast(`${newPresetName.trim()} preset saved!`);
    setNewPresetName('');
  };

  const MODE_ICONS = {
    deep: <Brain className="w-6 h-6 text-purple-700" />,
    sprint: <Zap className="w-6 h-6 text-yellow-500" />,
    music: <Music className="w-6 h-6 text-blue-500" />,
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {FOCUS_MODES.map(mode => (
              <button
                key={mode.id}
                aria-label={`Select ${mode.name} mode`}
                className={cn(
                  'relative group rounded-2xl border p-4 flex flex-col items-center shadow-sm transition-all duration-200 focus:outline-none',
                  selectedMode === mode.id
                    ? 'border-2 border-primary shadow-lg scale-105 bg-primary/10'
                    : 'border-muted-foreground bg-background hover:shadow-md hover:bg-muted/40',
                )}
                onClick={() => handleSelectMode(mode)}
                type="button"
                tabIndex={0}
              >
                <div className="mb-2 flex items-center justify-center w-full">
                  <span className="inline-flex items-center justify-center rounded-full bg-white shadow p-1.5">
                    {MODE_ICONS[mode.id]}
                  </span>
                </div>
                <div className="mb-0.5 text-base font-bold w-full text-center">{mode.name}</div>
                <div className="mb-2 text-xs text-muted-foreground text-center w-full">{mode.summary}</div>
                {selectedMode === mode.id && (
                  <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">Selected</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Music</h3>
            <div className="grid grid-cols-3 gap-2">
              {musicOptions.map(option => (
                <Button
                  key={option.id}
                  variant={sound === option.src ? "default" : "outline"}
                  className="h-20"
                  onClick={() => setSound(option.src)}
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="durations" className="space-y-6">
          {/* Focus Mode Presets */}
          <div>
            <h3 className="text-sm font-medium mb-2">Presets</h3>
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              {[...FIXED_PRESETS, ...userPresets].map((preset) => {
                const isUser = !preset.fixed;
                const isActive =
                  workMinutes === preset.work &&
                  breakMinutes === preset.break &&
                  longBreakMinutes === preset.longBreak &&
                  sessionsCount === preset.sessions;
                return (
                  <div key={preset.id} className="relative flex items-center">
                    <button
                      className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white border-primary' : 'bg-background border-muted-foreground text-muted-foreground hover:bg-muted'} mr-1`}
                      onClick={() => {
                        setWorkMinutes(preset.work);
                        setBreakMinutes(preset.break);
                        setLongBreakMinutes(preset.longBreak);
                        setSessionsCount(preset.sessions);
                      }}
                    >
                      {preset.name}
                    </button>
                    {isUser && (
                      <button
                        className="ml-[-8px] text-destructive text-xs hover:bg-destructive/10 rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => handleDeletePreset(preset.id)}
                        title="Delete preset"
                        tabIndex={-1}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
              {/* Add Preset Button or Input */}
              {showAddPreset ? (
                <form
                  className="flex gap-2 items-center"
                  onSubmit={e => {
                    e.preventDefault();
                    if (!newPresetName.trim()) return;
                    handleAddPresetWithValues();
                    setShowAddPreset(false);
                  }}
                >
                  <input
                    className="px-2 py-1 rounded border border-muted-foreground text-sm focus:outline-none"
                    placeholder="New preset name"
                    value={newPresetName}
                    onChange={e => setNewPresetName(e.target.value)}
                    style={{ minWidth: 120 }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-full border border-primary text-primary text-sm font-medium bg-background hover:bg-primary/10"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded-full border border-muted-foreground text-muted-foreground text-sm font-medium bg-background hover:bg-muted"
                    onClick={() => { setShowAddPreset(false); setNewPresetName(''); }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary bg-background hover:bg-primary/10 text-xl font-bold"
                  title="Add new preset"
                  onClick={() => setShowAddPreset(true)}
                >
                  +
                </button>
              )}
            </div>
          </div>
          
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
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
