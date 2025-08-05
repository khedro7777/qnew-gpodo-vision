
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Clock, CheckCircle, AlertTriangle, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const MCPTest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes

  const { data: testResult, isLoading } = useQuery({
    queryKey: ['mcp-test-result', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('mcp_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Mock questions for demonstration - in real app, these would come from a secure API
  const questions: Question[] = [
    {
      id: '1',
      question: 'What is the primary purpose of Model Context Protocol (MCP)?',
      options: [
        'To compress AI models',
        'To enable secure connections between AI assistants and data sources',
        'To train language models',
        'To optimize GPU performance'
      ],
      correctAnswer: 1,
      category: 'Fundamentals'
    },
    {
      id: '2',
      question: 'Which component is responsible for managing MCP server connections?',
      options: [
        'MCP Client',
        'MCP Server',
        'MCP Runtime',
        'MCP Protocol'
      ],
      correctAnswer: 0,
      category: 'Architecture'
    },
    {
      id: '3',
      question: 'What format does MCP use for message exchange?',
      options: [
        'XML',
        'JSON-RPC 2.0',
        'GraphQL',
        'REST'
      ],
      correctAnswer: 1,
      category: 'Technical'
    }
  ];

  const submitTestMutation = useMutation({
    mutationFn: async (testData: { score: number; answers: number[] }) => {
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('mcp_test_results')
        .insert({
          user_id: user.id,
          test_score: testData.score,
          test_data: {
            answers: testData.answers,
            questions: questions.map(q => ({ id: q.id, category: q.category })),
            completedAt: new Date().toISOString()
          },
          status: 'submitted'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-test-result'] });
      toast.success('Test submitted successfully');
      setTestStarted(false);
    },
    onError: (error) => {
      toast.error('Test submission failed: ' + error.message);
    },
  });

  const startTest = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(30 * 60);

    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = () => {
    const score = Math.round(
      (answers.reduce((correct, answer, index) => {
        return correct + (answer === questions[index]?.correctAnswer ? 1 : 0);
      }, 0) / questions.length) * 100
    );

    submitTestMutation.mutate({ score, answers });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-100 text-green-800">Excellent ({score}%)</Badge>;
    } else if (score >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800">Good ({score}%)</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Needs Improvement ({score}%)</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-productivity-blue" />
      </div>
    );
  }

  if (testResult) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Test Completed</h3>
          <p className="text-gray-600 mb-4">You have already completed the MCP skills test.</p>
          {getScoreBadge(testResult.test_score)}
          
          {testResult.status === 'submitted' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">Your test is under review by our team.</p>
            </div>
          )}

          {testResult.status === 'rejected' && testResult.reviewer_notes && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Review notes:</strong> {testResult.reviewer_notes}
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (!testStarted) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">MCP Skills Test</h3>
          <p className="text-gray-600 mb-6">
            This test evaluates your knowledge of Model Context Protocol (MCP) and related technologies.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-productivity-blue mb-2" />
              <h4 className="font-medium text-gray-900">Duration</h4>
              <p className="text-sm text-gray-600">30 minutes</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-productivity-blue mb-2" />
              <h4 className="font-medium text-gray-900">Questions</h4>
              <p className="text-sm text-gray-600">{questions.length} questions</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-productivity-blue mb-2" />
              <h4 className="font-medium text-gray-900">Pass Score</h4>
              <p className="text-sm text-gray-600">70% minimum</p>
            </div>
          </div>

          <Button onClick={startTest} size="lg" className="bg-productivity-blue hover:bg-productivity-blue/90">
            <Play className="w-5 h-5 mr-2" />
            Start Test
          </Button>
        </div>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            {currentQ.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-productivity-blue bg-blue-50 text-productivity-blue'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? 'border-productivity-blue bg-productivity-blue'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNextQuestion}
          disabled={answers[currentQuestion] === undefined || submitTestMutation.isPending}
          className="bg-productivity-blue hover:bg-productivity-blue/90"
        >
          {submitTestMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : currentQuestion === questions.length - 1 ? (
            'Submit Test'
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default MCPTest;
