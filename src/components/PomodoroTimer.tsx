import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const reset = useCallback(() => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  }, [isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const switchMode = () => {
    setIsBreak(!isBreak);
    setIsActive(false);
    setMinutes(isBreak ? 25 : 5);
    setSeconds(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            setIsActive(false);
            if (!isBreak) {
              setCompletedPomodoros(prev => prev + 1);
            }
            // Auto-switch to break/work
            setIsBreak(!isBreak);
            setMinutes(isBreak ? 25 : 5);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak]);

  const progress = isBreak 
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <Card className="p-8 bg-white shadow-lg border-0 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className={`w-full h-full ${isBreak ? 'bg-productivity-green' : 'bg-productivity-orange'}`} 
             style={{ height: `${progress}%`, transition: 'height 1s ease-in-out' }} />
      </div>
      
      <div className="relative z-10 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {isBreak ? (
            <>
              <Coffee className="w-5 h-5 text-productivity-green" />
              <span className="text-productivity-green font-medium">Break Time</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-productivity-orange rounded-full animate-pulse" />
              <span className="text-productivity-orange font-medium">Focus Session</span>
            </>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-6xl font-mono font-bold text-gray-900">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-gray-500">
            {isBreak ? '5 minute break' : '25 minute focus session'}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-full ${
              isActive 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                : isBreak 
                ? 'bg-productivity-green hover:bg-productivity-green/90 text-white'
                : 'bg-productivity-orange hover:bg-productivity-orange/90 text-white animate-pulse-glow'
            }`}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </Button>
          
          <Button
            onClick={reset}
            variant="outline"
            className="w-12 h-12 rounded-full border-gray-300 hover:border-gray-400"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Completed today: <span className="font-semibold text-productivity-green">{completedPomodoros}</span> pomodoros
          </p>
          <Button
            onClick={switchMode}
            variant="ghost"
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Switch to {isBreak ? 'Focus' : 'Break'} Mode
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PomodoroTimer;
