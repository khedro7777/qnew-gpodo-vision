
import React, { useState } from 'react';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoals, useCreateGoal, useUpdateGoal } from '@/hooks/useProductivityData';

const GoalsTracker = () => {
  const [newGoal, setNewGoal] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalType, setNewGoalType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  
  const { data: goals = [], isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const addGoal = () => {
    if (newGoal.trim() && newGoalTarget) {
      createGoal.mutate({
        title: newGoal.trim(),
        target_value: parseInt(newGoalTarget),
        goal_type: newGoalType,
      });
      setNewGoal('');
      setNewGoalTarget('');
    }
  };

  const incrementGoal = (id: string, currentValue: number) => {
    updateGoal.mutate({ id, current_value: currentValue + 1 });
  };

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGoalTypeChange = (value: string) => {
    setNewGoalType(value as 'daily' | 'weekly' | 'monthly' | 'custom');
  };

  if (isLoading) {
    return <Card className="p-6"><div className="animate-pulse">Loading goals...</div></Card>;
  }

  return (
    <Card className="p-6 bg-white shadow-lg border-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-productivity-green" />
            <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <Input
              placeholder="Goal title..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Target"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
            />
            <Select value={newGoalType} onValueChange={handleGoalTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={addGoal}
              disabled={createGoal.isPending}
              className="bg-productivity-green hover:bg-productivity-green/90 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No goals yet. Set one above to get started!</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = (goal.current_value / goal.target_value) * 100;
              const isCompleted = goal.current_value >= goal.target_value;
              
              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getGoalTypeColor(goal.goal_type)}`}>
                        {goal.goal_type}
                      </Badge>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{goal.current_value} / {goal.target_value}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {!isCompleted && (
                    <div className="flex justify-end mt-3">
                      <Button
                        onClick={() => incrementGoal(goal.id, goal.current_value)}
                        size="sm"
                        variant="outline"
                        disabled={updateGoal.isPending}
                      >
                        +1
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
};

export default GoalsTracker;
