
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const ProductivitySection = () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(25 * 60); // 25 minutes

  const goals = [
    { title: 'Complete 5 focus sessions', current: 3, target: 5, color: 'bg-green-500' },
    { title: 'Review 10 proposals', current: 7, target: 10, color: 'bg-blue-500' },
    { title: 'Join 2 new groups', current: 1, target: 2, color: 'bg-purple-500' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Pomodoro Timer */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Focus Timer
        </h4>
        
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-4">
            {formatTime(currentTime)}
          </div>
          
          <div className="flex justify-center gap-2 mb-4">
            <Button
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="gap-2"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsRunning(false);
                setCurrentTime(25 * 60);
              }}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
          
          <Progress value={((25 * 60 - currentTime) / (25 * 60)) * 100} className="mb-2" />
          <p className="text-sm text-gray-600">Focus Session</p>
        </div>
      </Card>

      {/* Daily Goals */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Daily Goals
        </h4>
        
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{goal.title}</span>
                <span className="text-gray-500">{goal.current}/{goal.target}</span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
        
        <Button size="sm" className="w-full mt-4 gap-2">
          <TrendingUp className="w-4 h-4" />
          View All Goals
        </Button>
      </Card>
    </div>
  );
};

export default ProductivitySection;
