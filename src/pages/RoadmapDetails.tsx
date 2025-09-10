
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Users, BookOpen, Play, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCompleted: boolean;
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
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`;
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`https://localhost:7236/api/roadmap/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map API response to component structure
          const mappedRoadmap: Roadmap = {
            id: data.id,
            title: data.roadmapTitle,
            description: data.description,
            difficulty: data.roadmapLevel as 'Beginner' | 'Intermediate' | 'Advanced',
            milestones: data.steps,
            // Static values as requested
            category: 'Recomendação',
            estimatedDuration: '4-8 weeks',
            createdAt: '2024-01-01',
            progress: Math.round((data.courses.filter((c: any) => c.isCompleted).length / data.courses.length) * 100),
            courses: data.courses
              .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
              .map((course: any) => ({
                id: course.id,
                title: course.title,
                description: course.description,
                duration: formatDuration(course.durationInMinutes),
                difficulty: (course.courseLevels[0] || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
                isCompleted: course.isCompleted,
                instructor: course.platformName
              }))
          };
          
          setRoadmap(mappedRoadmap);
        } else {
          console.error('Failed to fetch roadmap:', response.statusText);
          setRoadmap(null);
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
        setRoadmap(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loading roadmap...</h1>
          </div>
        </div>
      </div>
    );
  }

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
      case 'Iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100';
      case 'Avançado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 ';
      default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200';
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
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{roadmap.courses.length} Cursos </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="lg:w-80">
              <Card className="dark:bg-gray-700 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">Visão Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progresso geral</span>
                        <span className="font-medium dark:text-white">{roadmap.progress}%</span>
                      </div>
                      <Progress value={roadmap.progress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Cursos Completos</span>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cursos</h2>
          
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
                              Curso {index + 1}
                            </span>
                            <Badge className={getDifficultyColor(course.difficulty)}>
                              {course.difficulty}
                            </Badge>
                            {course.isCompleted && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Completo
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
                            {course.isCompleted ? "Review" : "Ir para o Curso"}
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
