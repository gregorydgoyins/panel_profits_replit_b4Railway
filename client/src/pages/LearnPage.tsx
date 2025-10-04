import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Trophy, Lock, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'wouter';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  enrolled: boolean;
  completed: boolean;
  progress: number;
  certification: boolean;
  locked: boolean;
}

export default function LearnPage() {
  const courses: Course[] = [
    {
      id: 'comic-trading-101',
      title: 'Comic Trading Fundamentals',
      description: 'Master the basics of comic asset trading, from understanding market dynamics to executing your first trades.',
      category: 'Trading Basics',
      level: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      enrolled: true,
      completed: false,
      progress: 65,
      certification: true,
      locked: false
    },
    {
      id: 'technical-analysis',
      title: 'Technical Analysis for Comics',
      description: 'Learn to read charts, identify patterns, and use technical indicators to make informed trading decisions.',
      category: 'Analysis',
      level: 'Intermediate',
      duration: '6 hours',
      lessons: 18,
      enrolled: true,
      completed: false,
      progress: 30,
      certification: true,
      locked: false
    },
    {
      id: 'portfolio-management',
      title: 'Portfolio Management Strategies',
      description: 'Build and manage a diversified comic asset portfolio with proven risk management techniques.',
      category: 'Strategy',
      level: 'Intermediate',
      duration: '5 hours',
      lessons: 15,
      enrolled: false,
      completed: false,
      progress: 0,
      certification: true,
      locked: false
    },
    {
      id: 'options-derivatives',
      title: 'Options & Derivatives Trading',
      description: 'Advanced strategies using options, futures, and other derivative instruments in comic markets.',
      category: 'Advanced Trading',
      level: 'Advanced',
      duration: '8 hours',
      lessons: 24,
      enrolled: false,
      completed: false,
      progress: 0,
      certification: true,
      locked: true
    },
    {
      id: 'market-psychology',
      title: 'Market Psychology & Behavioral Finance',
      description: 'Understand the psychological factors that drive market movements and how to avoid common trading biases.',
      category: 'Psychology',
      level: 'Intermediate',
      duration: '4 hours',
      lessons: 10,
      enrolled: false,
      completed: false,
      progress: 0,
      certification: false,
      locked: false
    },
    {
      id: 'grading-authentication',
      title: 'Comic Grading & Authentication',
      description: 'Learn professional grading standards and authentication techniques for comic book assets.',
      category: 'Fundamentals',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 8,
      enrolled: false,
      completed: false,
      progress: 0,
      certification: false,
      locked: false
    },
    {
      id: 'hedge-fund-strategies',
      title: 'Hedge Fund Trading Strategies',
      description: 'Master institutional-grade strategies used by professional hedge funds in comic asset markets.',
      category: 'Professional',
      level: 'Advanced',
      duration: '10 hours',
      lessons: 30,
      enrolled: false,
      completed: false,
      progress: 0,
      certification: true,
      locked: true
    },
    {
      id: 'risk-management',
      title: 'Advanced Risk Management',
      description: 'Implement sophisticated risk management frameworks to protect your portfolio.',
      category: 'Risk Management',
      level: 'Advanced',
      duration: '7 hours',
      lessons: 20,
      enrolled: false,
      completed: false,
      progress: 0,
      certification: true,
      locked: false
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-500';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-500';
      case 'Advanced': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-10 h-10 text-primary" />
          <h1 
            className="text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Learning Center
          </h1>
        </div>
        <p 
          className="text-gray-400 text-lg"
          style={{ fontFamily: 'Hind, sans-serif', fontWeight: 300 }}
        >
          Master comic asset trading with professional courses and earn certifications
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Enrolled Courses</p>
                <p className="text-2xl font-bold text-white">2</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Certifications</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Study Time</p>
                <p className="text-2xl font-bold text-white">12h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className={`hover-elevate ${course.locked ? 'opacity-60' : ''}`}
            data-testid={`course-card-${course.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                {course.locked && <Lock className="w-4 h-4 text-gray-500" />}
                {course.certification && !course.locked && <Trophy className="w-4 h-4 text-yellow-500" />}
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Course Info */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.lessons} lessons
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </div>

                {/* Progress Bar (if enrolled) */}
                {course.enrolled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {course.locked ? (
                    <Button variant="outline" className="w-full" disabled data-testid={`button-locked-${course.id}`}>
                      <Lock className="w-4 h-4 mr-2" />
                      Requires Certification
                    </Button>
                  ) : course.enrolled ? (
                    <Button className="w-full" asChild data-testid={`button-continue-${course.id}`}>
                      <Link href={`/learn/${course.id}`}>
                        <a>Continue Learning</a>
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" asChild data-testid={`button-enroll-${course.id}`}>
                      <Link href={`/learn/${course.id}`}>
                        <a>Enroll Now</a>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
