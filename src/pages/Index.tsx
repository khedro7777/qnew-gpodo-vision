
import React from 'react';
import Header from '@/components/Header';
import PomodoroTimer from '@/components/PomodoroTimer';
import TaskList from '@/components/TaskList';
import Stats from '@/components/Stats';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! Ready to be productive?
          </h2>
          <p className="text-gray-600">
            Use the Pomodoro technique to stay focused and accomplish more today.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <Stats />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pomodoro Timer */}
          <div className="space-y-6">
            <PomodoroTimer />
            
            {/* Quick Tips */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Productivity Tips</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Work for 25 minutes, then take a 5-minute break</li>
                <li>• Remove distractions during focus sessions</li>
                <li>• After 4 pomodoros, take a longer 15-30 minute break</li>
                <li>• Keep your tasks specific and actionable</li>
              </ul>
            </div>
          </div>

          {/* Task List */}
          <div>
            <TaskList />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with focus and productivity in mind • Gpodo.com</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
