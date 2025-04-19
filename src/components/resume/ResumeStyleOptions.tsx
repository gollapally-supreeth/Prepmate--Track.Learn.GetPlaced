
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface ResumeStyleOptionsProps {
  style: {
    template: string;
    primaryColor: string;
    fontSize: string;
    spacing: string;
  };
  onChange: (styleData: any) => void;
}

const templates = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple design with minimal styling' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with balanced layout' },
  { id: 'professional', name: 'Professional', description: 'Traditional design for corporate environments' },
  { id: 'creative', name: 'Creative', description: 'Bold design for creative fields' },
  { id: 'colorful', name: 'Colorful', description: 'Vibrant design with accent colors' },
];

const colors = [
  { id: '#1a73e8', name: 'Blue', hex: '#1a73e8' },
  { id: '#34a853', name: 'Green', hex: '#34a853' },
  { id: '#ea4335', name: 'Red', hex: '#ea4335' },
  { id: '#fbbc04', name: 'Yellow', hex: '#fbbc04' },
  { id: '#673ab7', name: 'Purple', hex: '#673ab7' },
  { id: '#ff6d01', name: 'Orange', hex: '#ff6d01' },
  { id: '#202124', name: 'Dark', hex: '#202124' },
];

const ResumeStyleOptions: React.FC<ResumeStyleOptionsProps> = ({ style, onChange }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card 
              key={template.id}
              className={`cursor-pointer overflow-hidden ${
                style.template === template.id ? 'ring-2 ring-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => onChange({ template: template.id })}
            >
              <div className="h-32 bg-muted flex items-center justify-center">
                <div className="w-3/4 aspect-[1.4/1] bg-background border"></div>
              </div>
              <CardContent className="p-4">
                <div className="font-medium">{template.name}</div>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Color & Typography</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.map(color => (
                <div 
                  key={color.id}
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    style.primaryColor === color.hex ? 'ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => onChange({ primaryColor: color.hex })}
                  aria-label={`Set color to ${color.name}`}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select 
              value={style.fontSize} 
              onValueChange={(value) => onChange({ fontSize: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Line Spacing</Label>
            <Select 
              value={style.spacing} 
              onValueChange={(value) => onChange({ spacing: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Layout Options</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Order</Label>
            <p className="text-sm text-muted-foreground">Drag and drop sections to reorder (coming soon)</p>
            <div className="border rounded p-4 space-y-2">
              <div className="p-2 bg-muted rounded flex items-center justify-between">
                <span>Personal Information</span>
                <span className="text-muted-foreground text-sm">(Fixed)</span>
              </div>
              <div className="p-2 bg-muted/50 rounded">Education</div>
              <div className="p-2 bg-muted/50 rounded">Experience</div>
              <div className="p-2 bg-muted/50 rounded">Skills</div>
              <div className="p-2 bg-muted/50 rounded">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeStyleOptions;
