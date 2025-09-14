import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, Users, Clock, Calendar, Award, ExternalLink, BookOpen, Play, Download, MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Header from '@/components/Header';
import { courseService } from '@/services/courseService';
import { Course, CourseReview } from '@/types/course';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id!),
    enabled: !!id,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['courseReviews', id],
    queryFn: () => courseService.getCourseReviews(id!),
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
      case 'Iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100';
      case 'Avançado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100';
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

        <div className="grid gap-8 lg:grid-cols-6">
          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
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
                      ({enrichedCourse.ratingCount})
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

            {/* Course Reviews */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Avaliações dos Alunos</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium text-gray-900 dark:text-white">{enrichedCourse.ratingAverage}</span>
                  </div>
                  <span>•</span>
                  <span>{enrichedCourse.ratingCount}</span>
                </div>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review, index) => {
                      const initials = review.userName
                        .split(' ')
                        .map(name => name.charAt(0))
                        .join('')
                        .toUpperCase();
                      
                      const colors = [
                        'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
                        'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
                        'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
                        'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                      ];
                      const colorClass = colors[index % colors.length];

                      return (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                              <span className="text-sm font-medium">{initials}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900 dark:text-white">{review.userName}</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(review.updateAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${
                                      star <= review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">
                                {review.review}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Ainda não há avaliações para este curso.</p>
                  </div>
                )}
                
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrollment Card */}
            <Card className="dark:bg-gray-800 dark:border-gray-700 top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {enrichedCourse.platform?.toLowerCase() === 'alura' ? 'R$ 85,02' : 
                     enrichedCourse.platform?.toLowerCase() === 'microsoft learn' ? 'Gratuito' : 
                     (enrichedCourse.price || 'Consulte a plataforma')}
                  </div>
                  {enrichedCourse.platform?.toLowerCase() === 'alura' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">em 12x</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {enrichedCourse.platform?.toLowerCase() === 'alura' ? 'Acesso a um ano em todos os cursos da plataforma' :
                     enrichedCourse.platform?.toLowerCase() === 'microsoft learn' ? 'Acesso gratuito ao conteúdo' :
                     'Acesso completo ao curso'}
                  </p>
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
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white text-lg">Cursos Relacionados</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Related Course 1 */}
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-20 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                        JavaScript Avançado: ES6+
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-900 dark:text-white font-medium">{enrichedCourse.ratingAverage}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({enrichedCourse.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Course 2 */}
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-20 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                        Node.js e Express
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-900 dark:text-white font-medium">{enrichedCourse.ratingAverage}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({enrichedCourse.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Course 3 */}
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-20 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                        TypeScript Essencial
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-900 dark:text-white font-medium">{enrichedCourse.ratingAverage}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({enrichedCourse.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Course 4 */}
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-20 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                        Vue.js Completo
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-900 dark:text-white font-medium">{enrichedCourse.ratingAverage}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({enrichedCourse.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Course 5 */}
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="w-20 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                        React Native: Apps Mobile
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-900 dark:text-white font-medium">{enrichedCourse.ratingAverage}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({enrichedCourse.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;