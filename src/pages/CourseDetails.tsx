import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, Users, Clock, Calendar, Award, ExternalLink, BookOpen, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/course';

// Sample course data (should match the data structure from Courses.tsx)
const courses = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the fundamentals of React including components, props, state, and hooks.",
    fullDescription: "This comprehensive React course will take you from beginner to confident React developer. You'll learn about component architecture, state management, React hooks, routing, and best practices for building modern web applications. The course includes hands-on projects and real-world examples to reinforce your learning.",
    category: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    students: 15420,
    rating: 4.8,
    instructor: "Sarah Johnson",
    instructorBio: "Senior Frontend Developer at Tech Corp with 8+ years of experience in React development.",
    tags: ["React", "JavaScript", "Frontend"],
    price: "R$ 199,90",
    platformUrl: "https://example-platform.com/course/1",
    syllabus: [
      { title: "Introduction to React", duration: "45 min", completed: false },
      { title: "Components and JSX", duration: "60 min", completed: false },
      { title: "Props and State", duration: "75 min", completed: false },
      { title: "Event Handling", duration: "50 min", completed: false },
      { title: "React Hooks", duration: "90 min", completed: false },
      { title: "React Router", duration: "65 min", completed: false },
      { title: "State Management", duration: "80 min", completed: false },
      { title: "Final Project", duration: "120 min", completed: false }
    ],
    requirements: [
      "Basic knowledge of HTML, CSS, and JavaScript",
      "Familiarity with ES6+ features",
      "Code editor (VS Code recommended)"
    ],
    whatYouWillLearn: [
      "Build dynamic user interfaces with React",
      "Understand component lifecycle and hooks",
      "Manage application state effectively",
      "Implement routing in React applications",
      "Apply React best practices and patterns"
    ]
  },
  {
    id: 2,
    title: "Advanced Python Programming",
    description: "Master advanced Python concepts including decorators, metaclasses, and async programming.",
    fullDescription: "Take your Python skills to the next level with this advanced programming course. Dive deep into Python's most powerful features and learn how to write efficient, maintainable code for complex applications.",
    category: "Programming",
    level: "Advanced",
    duration: "12 weeks",
    students: 8930,
    rating: 4.9,
    instructor: "Michael Chen",
    instructorBio: "Python expert and software architect with 10+ years of experience in enterprise applications.",
    tags: ["Python", "Backend", "Data Science"],
    price: "R$ 299,90",
    platformUrl: "https://example-platform.com/course/2",
    syllabus: [
      { title: "Advanced Functions and Decorators", duration: "90 min", completed: false },
      { title: "Metaclasses and Class Design", duration: "85 min", completed: false },
      { title: "Async Programming", duration: "100 min", completed: false },
      { title: "Performance Optimization", duration: "95 min", completed: false },
      { title: "Testing Strategies", duration: "75 min", completed: false },
      { title: "Design Patterns", duration: "110 min", completed: false }
    ],
    requirements: [
      "Solid understanding of Python fundamentals",
      "Experience with object-oriented programming",
      "Basic knowledge of data structures and algorithms"
    ],
    whatYouWillLearn: [
      "Master advanced Python language features",
      "Write asynchronous and concurrent code",
      "Optimize Python application performance",
      "Implement complex design patterns",
      "Build scalable Python applications"
    ]
  }
  // Add more courses as needed...
];

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id!),
    enabled: !!id,
  });

  // Add default frontend properties if missing from API
  const enrichedCourse: Course | undefined = course ? {
    ...course,
    // Add default values for frontend-only properties if not provided by API
    syllabus: course.syllabus || [
      { title: "Conteúdo do curso", lessons: [{ title: "Em breve", duration: "TBD" }] }
    ],
    requirements: course.requirements || ["Informações não disponíveis"],
    instructor: course.instructor || { name: "Instrutor", bio: "Informações não disponíveis" },
    price: course.price || "Consulte a plataforma",
    students: course.students || 0,
    category: course.category || "Geral",
    whatYoullLearn: course.whatYoullLearn || ["Informações em breve"],
    platformUrl: course.courseUrl || course.platformUrl || "#"
  } : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Carregando curso...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error || !enrichedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Curso não encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">O curso que você está procurando não existe.</p>
            <Button onClick={() => navigate('/courses')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Cursos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const completedLessons = enrichedCourse.syllabus?.reduce((acc, section) => 
    acc + (section.lessons?.filter(lesson => lesson.completed).length || 0), 0) || 0;
  const totalLessons = enrichedCourse.syllabus?.reduce((acc, section) => 
    acc + (section.lessons?.length || 0), 0) || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/courses')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Cursos
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                    {enrichedCourse.category}
                  </Badge>
                  {enrichedCourse.courseLevels && enrichedCourse.courseLevels.length > 0 && (
                    <Badge variant='secondary' className={`${getLevelColor(enrichedCourse.courseLevels[0])}`}>
                      {enrichedCourse.courseLevels[0]}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {enrichedCourse.title}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                  {enrichedCourse.description}
                </p>

                <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {enrichedCourse.durationInMinutes && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{Math.floor(enrichedCourse.durationInMinutes / 60)}h {enrichedCourse.durationInMinutes % 60}min</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                    <span className="text-gray-900 dark:text-white font-medium">{enrichedCourse.ratingAverage}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({enrichedCourse.ratingCount} avaliações)
                    </span>
                  </div>
                  {enrichedCourse.instructor && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      <span>por {enrichedCourse.platform}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {enrichedCourse.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            {enrichedCourse.whatYoullLearn && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">O que você vai aprender</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {enrichedCourse.whatYoullLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Play className="h-4 w-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Course Syllabus */}
            {enrichedCourse.syllabus && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Conteúdo do Curso</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{totalLessons} aulas</span>
                    <span>•</span>
                    <span>{completedLessons} concluídas</span>
                  </div>
                  {totalLessons > 0 && (
                    <Progress value={progressPercentage} className="mt-2" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrichedCourse.syllabus.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{section.title}</h4>
                        <div className="space-y-2 ml-4">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                              <div className="flex items-center">
                                <Play className="h-4 w-4 mr-3 text-blue-500" />
                                <span className="font-medium text-gray-900 dark:text-white">{lesson.title}</span>
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {enrichedCourse.requirements && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {enrichedCourse.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {enrichedCourse.price || 'Consulte a plataforma'}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Acesso completo ao curso</p>
                </div>

                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  onClick={() => window.open(enrichedCourse.platformUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acessar Curso na Plataforma
                </Button>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  {enrichedCourse.instructor && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Plataforma:</span>
                      <span className="font-medium dark:text-white">{enrichedCourse.platform}</span>
                    </div>
                  )}
                  {enrichedCourse.durationInMinutes && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duração:</span>
                      <span className="font-medium dark:text-white">
                        {Math.floor(enrichedCourse.durationInMinutes / 60)}h {enrichedCourse.durationInMinutes % 60}min
                      </span>
                    </div>
                  )}
                  {enrichedCourse.courseLevels && enrichedCourse.courseLevels.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nível:</span>
                      <span className="font-medium dark:text-white">{enrichedCourse.courseLevels.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Plataforma:</span>
                    <span className="font-medium dark:text-white">{enrichedCourse.platform}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Categoria:</span>
                    <span className="font-medium dark:text-white">{enrichedCourse.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Sobre o Instrutor</CardTitle>
              </CardHeader>
              <CardContent>
                {enrichedCourse.instructor && (
                  <>
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                        {enrichedCourse.instructor.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium dark:text-white">{enrichedCourse.instructor.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Instrutor</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {enrichedCourse.instructor.bio || "Instrutor experiente com vasta experiência na área."}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;