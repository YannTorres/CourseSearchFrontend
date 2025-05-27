
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Users, BookOpen, Play, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCompleted: boolean;
  lessons: number;
  instructor: string;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  milestones: number;
  createdAt: string;
  progress: number;
  courses: Course[];
}

const RoadmapDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    // Mock data - in a real app, this would fetch from an API
    const mockRoadmaps: Roadmap[] = [
      {
        id: '1',
        title: 'Full Stack Web Development',
        description: 'Complete journey from frontend to backend development with modern technologies. Learn HTML, CSS, JavaScript, React, Node.js, databases, and deployment strategies.',
        category: 'Web Development',
        estimatedDuration: '6 months',
        difficulty: 'Intermediate',
        milestones: 12,
        createdAt: '2024-01-15',
        progress: 45,
        courses: [
          {
            id: 'c1',
            title: 'HTML & CSS Fundamentals',
            description: 'Master the building blocks of web development',
            duration: '3 weeks',
            difficulty: 'Beginner',
            isCompleted: true,
            lessons: 24,
            instructor: 'Sarah Johnson'
          },
          {
            id: 'c2',
            title: 'JavaScript Essentials',
            description: 'Learn modern JavaScript programming concepts',
            duration: '4 weeks',
            difficulty: 'Intermediate',
            isCompleted: true,
            lessons: 32,
            instructor: 'Mike Chen'
          },
          {
            id: 'c3',
            title: 'React Development',
            description: 'Build dynamic user interfaces with React',
            duration: '5 weeks',
            difficulty: 'Intermediate',
            isCompleted: false,
            lessons: 40,
            instructor: 'Emily Rodriguez'
          },
          {
            id: 'c4',
            title: 'Node.js & Express',
            description: 'Server-side development with Node.js',
            duration: '4 weeks',
            difficulty: 'Intermediate',
            isCompleted: false,
            lessons: 28,
            instructor: 'David Kim'
          },
          {
            id: 'c5',
            title: 'Database Design & MongoDB',
            description: 'Learn database concepts and MongoDB',
            duration: '3 weeks',
            difficulty: 'Intermediate',
            isCompleted: false,
            lessons: 20,
            instructor: 'Lisa Wang'
          }
        ]
      },
      {
        id: '2',
        title: 'Data Science Mastery',
        description: 'From statistics basics to machine learning and advanced analytics',
        category: 'Data Science',
        estimatedDuration: '8 months',
        difficulty: 'Advanced',
        milestones: 15,
        createdAt: '2024-01-10',
        progress: 20,
        courses: [
          {
            id: 'c6',
            title: 'Statistics Fundamentals',
            description: 'Essential statistical concepts for data science',
            duration: '4 weeks',
            difficulty: 'Beginner',
            isCompleted: true,
            lessons: 30,
            instructor: 'Dr. Robert Smith'
          },
          {
            id: 'c7',
            title: 'Python for Data Science',
            description: 'Learn Python programming for data analysis',
            duration: '5 weeks',
            difficulty: 'Intermediate',
            isCompleted: false,
            lessons: 35,
            instructor: 'Anna Thompson'
          }
        ]
      },
      {
        id: '3',
        title: 'UI/UX Design Fundamentals',
        description: 'Learn design principles, user research, and prototyping skills',
        category: 'Design',
        estimatedDuration: '4 months',
        difficulty: 'Beginner',
        milestones: 8,
        createdAt: '2024-01-20',
        progress: 75,
        courses: [
          {
            id: 'c8',
            title: 'Design Principles',
            description: 'Core principles of visual design',
            duration: '2 weeks',
            difficulty: 'Beginner',
            isCompleted: true,
            lessons: 16,
            instructor: 'Jessica Martinez'
          },
          {
            id: 'c9',
            title: 'User Research Methods',
            description: 'Understanding user needs and behaviors',
            duration: '3 weeks',
            difficulty: 'Intermediate',
            isCompleted: true,
            lessons: 20,
            instructor: 'Tom Wilson'
          },
          {
            id: 'c10',
            title: 'Prototyping with Figma',
            description: 'Create interactive prototypes and wireframes',
            duration: '4 weeks',
            difficulty: 'Intermediate',
            isCompleted: false,
            lessons: 24,
            instructor: 'Maria Garcia'
          }
        ]
      }
    ];

    const foundRoadmap = mockRoadmaps.find(r => r.id === id);
    setRoadmap(foundRoadmap || null);
  }, [id]);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roadmap not found</h1>
            <Button onClick={() => navigate('/roadmaps')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Roadmaps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const completedCourses = roadmap.courses.filter(course => course.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/roadmaps')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roadmaps
        </Button>

        {/* Roadmap Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                  {roadmap.category}
                </Badge>
                <Badge className={getDifficultyColor(roadmap.difficulty)}>
                  {roadmap.difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {roadmap.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {roadmap.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{roadmap.estimatedDuration}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Target className="h-5 w-5 mr-2" />
                  <span>{roadmap.milestones} milestones</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{roadmap.courses.length} courses</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{completedCourses}/{roadmap.courses.length} completed</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="lg:w-80">
              <Card className="dark:bg-gray-700 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                        <span className="font-medium dark:text-white">{roadmap.progress}%</span>
                      </div>
                      <Progress value={roadmap.progress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Courses Completed</span>
                        <span className="font-medium dark:text-white">{completedCourses}/{roadmap.courses.length}</span>
                      </div>
                      <Progress value={(completedCourses / roadmap.courses.length) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Courses</h2>
          
          <div className="space-y-4">
            {roadmap.courses.map((course, index) => (
              <Card 
                key={course.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Course Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {course.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Course {index + 1}
                            </span>
                            <Badge className={getDifficultyColor(course.difficulty)}>
                              {course.difficulty}
                            </Badge>
                            {course.isCompleted && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Completed
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {course.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.duration}
                            </span>
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {course.lessons} lessons
                            </span>
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.instructor}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Button 
                            variant={course.isCompleted ? "outline" : "default"}
                            className="flex items-center gap-2"
                          >
                            <Play className="h-4 w-4" />
                            {course.isCompleted ? "Review" : "Start Course"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetails;
