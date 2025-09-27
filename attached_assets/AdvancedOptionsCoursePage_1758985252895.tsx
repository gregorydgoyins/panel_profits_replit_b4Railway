import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, CheckCircle, Play, Lock, 
  Star, Award, BarChart2, TrendingUp, Info, Calendar,
  Users, Shield, DollarSign, Target, Zap
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  type: 'video' | 'reading' | 'quiz' | 'interactive';
  description: string;
  points: number;
}

export function AdvancedOptionsCoursePage() {
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [courseProgress, setCourseProgress] = useState(45);
  
  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Options Basics Review',
      duration: '10 min',
      completed: true,
      locked: false,
      type: 'video',
      description: 'Quick refresher on calls, puts, strike prices, and expiration dates.',
      points: 30
    },
    {
      id: '2',
      title: 'The Greeks in Detail',
      duration: '15 min',
      completed: true,
      locked: false,
      type: 'interactive',
      description: 'Deep dive into Delta, Gamma, Theta, Vega, and Rho with interactive examples.',
      points: 40
    },
    {
      id: '3',
      title: 'Covered Call Strategy',
      duration: '12 min',
      completed: true,
      locked: false,
      type: 'video',
      description: 'Generate income from your existing comic holdings using covered calls.',
      points: 35
    },
    {
      id: '4',
      title: 'Protective Put Strategy',
      duration: '10 min',
      completed: true,
      locked: false,
      type: 'reading',
      description: 'Hedge your comic investments with protective put options.',
      points: 30
    },
    {
      id: '5',
      title: 'Long Straddles & Strangles',
      duration: '18 min',
      completed: false,
      locked: false,
      type: 'interactive',
      description: 'Profit from high volatility with advanced straddle and strangle strategies.',
      points: 45
    },
    {
      id: '6',
      title: 'Iron Condor Strategy',
      duration: '16 min',
      completed: false,
      locked: false,
      type: 'video',
      description: 'Master the iron condor for range-bound market conditions.',
      points: 40
    },
    {
      id: '7',
      title: 'Butterfly Spreads',
      duration: '14 min',
      completed: false,
      locked: false,
      type: 'interactive',
      description: 'Implement butterfly spreads for low-volatility profit opportunities.',
      points: 38
    },
    {
      id: '8',
      title: 'Calendar Spreads',
      duration: '13 min',
      completed: false,
      locked: false,
      type: 'reading',
      description: 'Time-based strategies using different expiration dates.',
      points: 35
    },
    {
      id: '9',
      title: 'Diagonal Spreads',
      duration: '15 min',
      completed: false,
      locked: false,
      type: 'video',
      description: 'Combine different strikes and expirations for advanced positioning.',
      points: 42
    },
    {
      id: '10',
      title: 'Risk Management',
      duration: '20 min',
      completed: false,
      locked: false,
      type: 'interactive',
      description: 'Advanced risk management techniques for options portfolios.',
      points: 50
    }
  ];

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalLessons = lessons.length;
  const earnedPoints = lessons.filter(lesson => lesson.completed).reduce((sum, lesson) => sum + lesson.points, 0);
  const totalPoints = lessons.reduce((sum, lesson) => sum + lesson.points, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4 text-blue-400" />;
      case 'reading': return <BookOpen className="h-4 w-4 text-green-400" />;
      case 'quiz': return <Award className="h-4 w-4 text-yellow-400" />;
      case 'interactive': return <BarChart2 className="h-4 w-4 text-purple-400" />;
      default: return <BookOpen className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLessonContent = (lessonId: string) => {
    const lessonContent: Record<string, any> = {
      '5': {
        title: 'Long Straddles & Strangles',
        content: `
          <div class="space-y-6">
            <h3 class="text-2xl font-bold text-white mb-4">Volatility Strategies: Straddles & Strangles</h3>
            
            <div class="bg-slate-700/50 p-6 rounded-lg border border-slate-600/50">
              <h4 class="text-lg font-semibold text-white mb-3">Long Straddle Strategy</h4>
              <p class="text-gray-300 mb-4">A long straddle involves buying both a call and put option with the same strike price and expiration date. This strategy profits when the underlying asset moves significantly in either direction.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
                  <h5 class="font-medium text-green-200 mb-2">When to Use</h5>
                  <ul class="space-y-1 text-green-300 text-sm">
                    <li>• Before major comic announcements</li>
                    <li>• Movie/TV adaptation reveals</li>
                    <li>• Comic convention surprises</li>
                    <li>• Earnings reports from publishers</li>
                  </ul>
                </div>
                <div class="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
                  <h5 class="font-medium text-red-200 mb-2">Risk Profile</h5>
                  <ul class="space-y-1 text-red-300 text-sm">
                    <li>• Max loss: Total premium paid</li>
                    <li>• Breakeven: Strike ± Premium</li>
                    <li>• Unlimited profit potential</li>
                    <li>• Time decay is your enemy</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-slate-700/50 p-6 rounded-lg border border-slate-600/50">
              <h4 class="text-lg font-semibold text-white mb-3">Long Strangle Strategy</h4>
              <p class="text-gray-300 mb-4">A long strangle uses different strike prices - typically an out-of-the-money call and an out-of-the-money put. This reduces the premium cost but requires larger price movements for profitability.</p>
              
              <div class="bg-purple-900/30 p-4 rounded-lg border border-purple-700/30">
                <h5 class="font-medium text-purple-200 mb-2">Strangle vs Straddle</h5>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-purple-300 font-medium mb-1">Straddle</p>
                    <ul class="space-y-1 text-purple-200">
                      <li>• Same strike price</li>
                      <li>• Higher premium cost</li>
                      <li>• Smaller move needed</li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-purple-300 font-medium mb-1">Strangle</p>
                    <ul class="space-y-1 text-purple-200">
                      <li>• Different strike prices</li>
                      <li>• Lower premium cost</li>
                      <li>• Larger move needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700/30">
              <h4 class="font-medium text-white mb-2">Pro Tips</h4>
              <ul class="space-y-2 text-yellow-200 text-sm">
                <li>• Look for high implied volatility before major events</li>
                <li>• Consider closing positions early if you achieve 50% max profit</li>
                <li>• Time straddles around Comic-Con and movie announcements</li>
                <li>• Monitor Greek values daily to manage risk</li>
              </ul>
            </div>
          </div>
        `,
        quiz: [
          {
            question: "What is the maximum loss for a long straddle?",
            options: ["Unlimited", "The total premium paid", "The strike price", "50% of premium paid"],
            correct: 1
          }
        ]
      }
    };
    
    return lessonContent[lessonId] || null;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs overrides={[
        { name: 'Learning Center', path: '/learn' },
        { name: 'Advanced Options Strategies' }
      ]} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Advanced Options Strategies</h1>
        </div>
        <Link
          to="/learn"
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Learning Center</span>
        </Link>
      </div>

      {/* Course Header */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-3">Course Overview</h2>
            <p className="text-gray-300 mb-4">
              Master advanced options strategies for comic book investments. Learn sophisticated techniques for generating income, 
              hedging risk, and profiting from market volatility using complex multi-leg options strategies.
            </p>
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-300">150 minutes total</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">Advanced level</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">385 points</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-orange-900/50 text-orange-200 rounded-full text-sm border border-orange-700/50">
                Advanced
              </span>
              <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm border border-purple-700/50">
                10 Lessons
              </span>
              <span className="px-3 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-sm border border-indigo-700/50">
                Options Trading
              </span>
            </div>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="font-medium text-white mb-3">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Completed:</span>
                <span className="text-white">{completedLessons}/{totalLessons} lessons</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Points:</span>
                <span className="text-yellow-400">{earnedPoints}/{totalPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Course Lessons</h3>
          
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                onClick={() => !lesson.locked && setCurrentLesson(lesson.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  lesson.completed 
                    ? 'bg-green-900/20 border-green-700/30 hover:bg-green-900/30' 
                    : lesson.locked
                      ? 'bg-slate-700/30 border-slate-600/30 opacity-50 cursor-not-allowed'
                      : currentLesson === lesson.id
                        ? 'bg-purple-900/30 border-purple-700/50'
                        : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {lesson.locked ? (
                      <Lock className="h-4 w-4 text-gray-500" />
                    ) : lesson.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      getTypeIcon(lesson.type)
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-500 font-medium">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className={`font-medium ${
                        lesson.locked ? 'text-gray-500' : 'text-white'
                      }`}>
                        {lesson.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{lesson.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{lesson.points} pts</span>
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-xs mt-1 ${
                      lesson.locked ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {lesson.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
              {(() => {
                const lesson = lessons.find(l => l.id === currentLesson);
                const content = getLessonContent(currentLesson);
                
                if (!lesson || !content) return null;
                
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(lesson.type)}
                        <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">{lesson.duration}</span>
                      </div>
                    </div>
                    
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                    
                    {content.quiz && (
                      <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600/50">
                        <h4 className="font-medium text-white mb-4">Knowledge Check</h4>
                        {content.quiz.map((q: any, index: number) => (
                          <div key={index} className="space-y-3">
                            <p className="text-gray-300">{q.question}</p>
                            <div className="space-y-2">
                              {q.options.map((option: string, optIndex: number) => (
                                <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name={`question-${index}`}
                                    className="text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="text-gray-300">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Submit Answer
                        </button>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300">Earn {lesson.points} points</span>
                      </div>
                      
                      {!lesson.completed && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Default course overview */
            <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Welcome to Advanced Options Strategies</h3>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  Master sophisticated options strategies to enhance your comic trading portfolio with advanced risk management and income generation techniques.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white">Volatility Strategies</h4>
                    <p className="text-sm text-gray-400">Profit from market uncertainty</p>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white">Income Generation</h4>
                    <p className="text-sm text-gray-400">Create steady cash flow</p>
                  </div>
                  
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <Target className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <h4 className="font-medium text-white">Risk Management</h4>
                    <p className="text-sm text-gray-400">Protect your investments</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setCurrentLesson('1')}
                  className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Start with Lesson 1
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Stats */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Course Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-xl font-bold text-white">{Math.round((completedLessons / totalLessons) * 100)}%</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Points Earned</p>
            <p className="text-xl font-bold text-yellow-400">{earnedPoints}</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Time Invested</p>
            <p className="text-xl font-bold text-white">45 min</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Next Lesson</p>
            <p className="text-xl font-bold text-purple-400">#{completedLessons + 1}</p>
          </div>
        </div>
      </div>

      {/* Course Certificate Preview */}
      {courseProgress === 100 && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6">
          <div className="text-center">
            <Award className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Congratulations!</h3>
            <p className="text-white/90 mb-4">You've mastered Advanced Options Strategies</p>
            <button className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              Download Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedOptionsCoursePage;