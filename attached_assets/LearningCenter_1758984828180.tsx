import React, { useState } from 'react';
import { GraduationCap, BookOpen, TrendingUp, Users, Award, Clock, ChevronRight, Play, CheckCircle, Star, Trophy, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  completed: boolean;
  category: string;
  lessons: number;
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  points: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface PlayerClass {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const mockLearningModules: LearningModule[] = [
  {
    id: '1',
    title: 'Comic Market Fundamentals',
    description: 'Learn the basics of comic book market mechanics, pricing, and trading principles',
    duration: '45 min',
    difficulty: 'Beginner',
    progress: 75,
    completed: false,
    category: 'Basics',
    lessons: 8,
    points: 150
  },
  {
    id: '2',
    title: 'Understanding Comic Ages',
    description: 'Master the classification system from Golden Age to Modern Age comics',
    duration: '30 min',
    difficulty: 'Beginner',
    progress: 100,
    completed: true,
    category: 'Basics',
    lessons: 6,
    points: 120
  },
  {
    id: '3',
    title: 'Grading and Valuation',
    description: 'Deep dive into CGC grading, condition assessment, and market valuation',
    duration: '60 min',
    difficulty: 'Intermediate',
    progress: 40,
    completed: false,
    category: 'Valuation',
    lessons: 10,
    points: 200
  },
  {
    id: '4',
    title: 'Options Trading Strategies',
    description: 'Advanced options trading techniques for comic book investments',
    duration: '90 min',
    difficulty: 'Advanced',
    progress: 0,
    completed: false,
    category: 'Trading',
    lessons: 12,
    points: 250
  },
  {
    id: '5',
    title: 'Creator Bond Analysis',
    description: 'Evaluate creator performance and bond investment opportunities',
    duration: '50 min',
    difficulty: 'Intermediate',
    progress: 60,
    completed: false,
    category: 'Analysis',
    lessons: 9,
    points: 180
  },
  {
    id: '6',
    title: 'Portfolio Management',
    description: 'Build and manage diversified comic book investment portfolios',
    duration: '75 min',
    difficulty: 'Advanced',
    progress: 20,
    completed: false,
    category: 'Portfolio',
    lessons: 11,
    points: 220
  },
  {
    id: '7',
    title: 'Market Timing Techniques',
    description: 'Learn when to enter and exit positions for maximum profit',
    duration: '60 min',
    difficulty: 'Intermediate',
    progress: 0,
    completed: false,
    category: 'Trading',
    lessons: 8,
    points: 160
  },
  {
    id: '8',
    title: 'Technical Analysis for Comics',
    description: 'Apply technical analysis principles to comic book price charts',
    duration: '70 min',
    difficulty: 'Advanced',
    progress: 0,
    completed: false,
    category: 'Analysis',
    lessons: 10,
    points: 200
  },
  {
    id: '10',
    title: 'Advanced Options Strategies',
    description: 'Master sophisticated options strategies for comic book investments including straddles, butterflies, and complex spreads',
    duration: '150 min',
    difficulty: 'Advanced',
    progress: 45,
    completed: false,
    category: 'Trading',
    lessons: 10,
    points: 385
  },
  {
    id: '11',
    title: 'Portfolio Management & Diversification',
    description: 'Learn professional portfolio management techniques tailored for comic book investments with advanced risk management',
    duration: '145 min',
    difficulty: 'Intermediate',
    progress: 60,
    completed: false,
    category: 'Portfolio',
    lessons: 10,
    points: 392
  },
  {
    id: '9',
    title: 'Risk Management Essentials',
    description: 'Protect your portfolio with effective risk management strategies',
    duration: '45 min',
    difficulty: 'Intermediate',
    progress: 0,
    completed: false,
    category: 'Portfolio',
    lessons: 7,
    points: 140
  }
];

const achievements: Achievement[] = [
  { 
    id: '1', 
    title: 'First Steps', 
    description: 'Complete your first learning module', 
    earned: true, 
    points: 50,
    icon: BookOpen
  },
  { 
    id: '2', 
    title: 'Market Scholar', 
    description: 'Complete all basic modules', 
    earned: true, 
    points: 100,
    icon: GraduationCap
  },
  { 
    id: '3', 
    title: 'Trading Expert', 
    description: 'Master advanced trading strategies', 
    earned: false, 
    points: 200,
    icon: TrendingUp
  },
  { 
    id: '4', 
    title: 'Portfolio Master', 
    description: 'Complete portfolio management course', 
    earned: false, 
    points: 150,
    icon: Users
  },
  { 
    id: '5', 
    title: 'Analytical Mind', 
    description: 'Complete all analysis modules', 
    earned: false, 
    points: 175,
    icon: Award
  },
  { 
    id: '6', 
    title: 'Dedicated Learner', 
    description: 'Spend 10+ hours in the learning center', 
    earned: true, 
    points: 75,
    icon: Clock
  }
];

const playerClasses: PlayerClass[] = [
  {
    id: 'associate',
    name: 'Associate',
    description: 'Entry-level market participant with basic knowledge',
    pointsRequired: 0,
    icon: User,
    color: 'bg-gray-500'
  },
  {
    id: 'junior-broker',
    name: 'Junior Broker',
    description: 'Developing trader with growing expertise',
    pointsRequired: 200,
    icon: User,
    color: 'bg-blue-500'
  },
  {
    id: 'broker',
    name: 'Broker',
    description: 'Experienced trader with solid market knowledge',
    pointsRequired: 500,
    icon: Users,
    color: 'bg-indigo-500'
  },
  {
    id: 'regional-executive',
    name: 'Regional Executive',
    description: 'Senior trader with advanced market insights',
    pointsRequired: 1000,
    icon: Award,
    color: 'bg-purple-500'
  },
  {
    id: 'c-level-executive',
    name: 'C-Level Executive',
    description: 'Expert trader with comprehensive market mastery',
    pointsRequired: 2000,
    icon: Star,
    color: 'bg-yellow-500'
  },
  {
    id: 'agency-owner',
    name: 'Agency Owner',
    description: 'Elite trader with exceptional market dominance',
    pointsRequired: 5000,
    icon: Trophy,
    color: 'bg-green-500'
  }
];

export function LearningCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const categories = ['all', 'Basics', 'Valuation', 'Trading', 'Analysis', 'Portfolio'];
  
  const filteredModules = selectedCategory === 'all' 
    ? mockLearningModules 
    : mockLearningModules.filter(module => module.category === selectedCategory);

  const totalProgress = Math.round(
    mockLearningModules.reduce((sum, module) => sum + module.progress, 0) / mockLearningModules.length
  );

  const completedModules = mockLearningModules.filter(module => module.completed).length;
  
  // Calculate total earned points
  const earnedPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0) +
    mockLearningModules.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0) +
    mockLearningModules.filter(m => !m.completed).reduce((sum, m) => Math.floor(sum + (m.points * m.progress / 100)), 0);
  
  // Determine current player class
  const currentClass = playerClasses
    .filter(c => c.pointsRequired <= earnedPoints)
    .sort((a, b) => b.pointsRequired - a.pointsRequired)[0];
  
  // Determine next class
  const nextClass = playerClasses
    .filter(c => c.pointsRequired > earnedPoints)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];
  
  // Calculate progress to next class
  const progressToNextClass = nextClass 
    ? Math.min(100, Math.round(((earnedPoints - currentClass.pointsRequired) / (nextClass.pointsRequired - currentClass.pointsRequired)) * 100))
    : 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-900/50 text-green-200 border-green-700/50';
      case 'Intermediate': return 'bg-yellow-900/50 text-yellow-200 border-yellow-700/50';
      case 'Advanced': return 'bg-red-900/50 text-red-200 border-red-700/50';
      default: return 'bg-gray-900/50 text-gray-200 border-gray-700/50';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Learning Center</h1>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Award className="h-5 w-5" />
          <span className="text-sm">Track your progress and earn rewards</span>
        </div>
      </div>

      {/* Player Class & Progress Overview */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Class */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-full ${currentClass.color}`}>
                <currentClass.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{currentClass.name}</h3>
                <p className="text-sm text-gray-400">{currentClass.description}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Progress to Next Level</span>
                <span className="text-white">{progressToNextClass}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${nextClass ? nextClass.color : 'bg-green-500'}`}
                  style={{ width: `${progressToNextClass}%` }}
                ></div>
              </div>
              {nextClass && (
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-gray-400">{earnedPoints} points</span>
                  <span className="text-gray-400">{nextClass.pointsRequired} points needed for {nextClass.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Points & Achievements */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="text-lg font-semibold text-white mb-3">Academic Achievements</h3>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <span className="text-white">Total Points Earned</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">{earnedPoints}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
                <p className="text-sm text-gray-400">Completed Courses</p>
                <p className="text-lg font-semibold text-white">{completedModules}/{mockLearningModules.length}</p>
              </div>
              <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
                <p className="text-sm text-gray-400">Achievements</p>
                <p className="text-lg font-semibold text-white">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
              </div>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <BookOpen className="h-6 w-6 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
            </div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-1 bg-slate-600 rounded-full h-3">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <span className="text-white font-bold">{totalProgress}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
                <p className="text-sm text-gray-400">Time Invested</p>
                <p className="text-lg font-semibold text-white">4.5h</p>
              </div>
              <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
                <p className="text-sm text-gray-400">Next Milestone</p>
                <p className="text-lg font-semibold text-indigo-400">Junior Broker</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-indigo-600/20'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div 
            key={module.id}
            onClick={() => setSelectedCard(selectedCard === module.id ? null : module.id)}
            className={`group relative bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all hover:-translate-y-1 cursor-pointer
              ${selectedCard === module.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{module.description}</p>
              </div>
              {module.completed && (
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </span>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{module.duration}</span>
                </span>
                <span>{module.lessons} lessons</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white font-medium">{module.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    module.completed ? 'bg-green-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-yellow-400">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">{module.points} points</span>
              </div>
              <Link 
                to={
                  module.id === '1' ? '/learn/comic-fundamentals' :
                  module.id === '10' ? '/learn/advanced-options' :
                  module.id === '11' ? '/learn/portfolio-management' :
                  '#'
                }
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                module.completed 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : module.progress > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
              >
                <Play className="h-4 w-4" />
                <span>
                  {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start Learning'}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all ${
                achievement.earned 
                  ? 'bg-purple-900/30 border-purple-700/30' 
                  : 'bg-slate-700/50 border-slate-600/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <achievement.icon className={`h-6 w-6 ${
                  achievement.earned ? 'text-purple-400' : 'text-gray-500'
                }`} />
                <div>
                  <h3 className={`font-semibold ${
                    achievement.earned ? 'text-white' : 'text-gray-400'
                  }`}>
                    {achievement.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${
                      achievement.earned ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </span>
                    <span className={`text-xs font-medium ${
                      achievement.earned ? 'text-yellow-400' : 'text-gray-500'
                    }`}>
                      {achievement.points} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Class Progression */}
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Character Classes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playerClasses.map((playerClass, index) => {
            const isCurrentClass = currentClass.id === playerClass.id;
            const isUnlocked = earnedPoints >= playerClass.pointsRequired;
            
            return (
              <div 
                key={playerClass.id}
                className={`p-4 rounded-lg border transition-all ${
                  isCurrentClass 
                    ? `border-${playerClass.color.replace('bg-', '')} shadow-[0_0_15px_rgba(255,255,0,0.3)]` 
                    : isUnlocked
                      ? 'border-slate-600/50 bg-slate-700/50'
                      : 'border-slate-700/50 bg-slate-800/50 opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-full ${isUnlocked ? playerClass.color : 'bg-gray-700'}`}>
                    <playerClass.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                      {playerClass.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {isUnlocked ? 'Unlocked' : `Requires ${playerClass.pointsRequired} points`}
                    </p>
                  </div>
                  {isCurrentClass && (
                    <span className="ml-auto px-2 py-1 bg-yellow-900/50 text-yellow-200 rounded-full text-xs border border-yellow-700/50">
                      Current
                    </span>
                  )}
                </div>
                
                <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {playerClass.description}
                </p>
                
                {!isUnlocked && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${playerClass.color}`}
                        style={{ width: `${Math.min(100, Math.round((earnedPoints / playerClass.pointsRequired) * 100))}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {earnedPoints}/{playerClass.pointsRequired} points
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">New to Panel Profits?</h2>
            <p className="text-white/90 mb-4">
              Start with our comprehensive beginner's guide to comic book investing and trading.
            </p>
            <Link 
              to="/learn/getting-started"
              className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>Start Your Journey</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <Users className="h-24 w-24 text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningCenter;