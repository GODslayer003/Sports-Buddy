import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Lightbulb, CheckCircle2 } from 'lucide-react';

interface QuickStartGuideProps {
  onClose: () => void;
}

export function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: 'Complete Your Profile',
      description: 'Add your sports preferences, skill levels, and availability',
      action: 'Go to Profile',
    },
    {
      id: 2,
      title: 'Find Events',
      description: 'Browse and join sports events in your area',
      action: 'Browse Events',
    },
    {
      id: 3,
      title: 'Connect with Others',
      description: 'Use the matching feature to find sports buddies',
      action: 'Find Partners',
    },
    {
      id: 4,
      title: 'Create Your First Event',
      description: 'Organize a sports event and invite others',
      action: 'Create Event',
    },
  ];

  const toggleStep = (id: number) => {
    setCompletedSteps(prev => 
      prev.includes(id) 
        ? prev.filter(stepId => stepId !== id)
        : [...prev, id]
    );
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Get the most out of Sports Buddy</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                completedSteps.includes(step.id)
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="mt-0.5">
                {completedSteps.includes(step.id) ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  completedSteps.includes(step.id) ? 'line-through text-muted-foreground' : ''
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {step.id}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {completedSteps.length} of {steps.length} completed
            </span>
            <Button variant="outline" size="sm" onClick={onClose}>
              Got it!
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
