import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { courseService } from '@/services/courseService';
import { Course, CourseResponse } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [courseData, setCourseData] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const resultsPerPage = 12;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourses({
        pageNumber: currentPage,
        pageSize: resultsPerPage,
        search: searchQuery.trim() || undefined,
        sortby: sortBy,
        sortOrder: sortOrder
      });
      setCourseData(response);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar cursos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const sort = searchParams.get('sortBy') || 'rating';
    const order = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    
    setSearchQuery(query);
    setSortBy(sort);
    setSortOrder(order);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  const filteredCourses = courseData?.courses ? courseData.courses.filter(course => {
    return true;
  }) : [];

  const updateSearchParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 1 && value !== 'rating' && value !== 'desc') {
        params.set(key, String(value));
      } else if (key === 'q' && value === '') {
        params.delete(key);
      } else if (key !== 'q') {
        // Keep default values in URL for consistency
        params.set(key, String(value));
      }
    });
    
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ 
      q: searchQuery.trim(), 
      page: 1, 
      sortBy, 
      sortOrder 
    });
  };

  const getLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('beginner') || lowerLevel.includes('iniciante')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    if (lowerLevel.includes('intermediate') || lowerLevel.includes('intermediário')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
    if (lowerLevel.includes('advanced') || lowerLevel.includes('avançado')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className={`relative max-w-2xl rounded-lg transition-all duration-300 ${
              isSearchFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-600 shadow-md'
            } bg-white dark:bg-gray-800`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Busque por cursos, tópicos ou instrutores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-12 pr-16 py-5 text-lg border-0 rounded-lg focus:ring-0 focus:outline-none bg-transparent dark:text-white dark:placeholder-gray-400"
              />
              <Button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg h-10 px-6 flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white"
              >
                Buscar
              </Button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
            </div>        

            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              updateSearchParams({ q: searchQuery.trim(), sortBy: value, sortOrder, page: 1 });
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Avaliação</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="ratingCount">Número de Avaliações</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => {
              setSortOrder(value);
              updateSearchParams({ q: searchQuery.trim(), sortBy, sortOrder: value, page: 1 });
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ordem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decrescente</SelectItem>
                <SelectItem value="asc">Crescente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'Carregando...' : (
              <>
                Encontrado<span className="font-semibold"> {courseData?.totalCount || 0} </span>curso{(courseData?.totalCount || 0) !== 1 ? 's' : ''}
                {searchQuery && <span> para "{searchQuery}"</span>}
              </>
            )}
          </p>
        </div>

        {/* Course Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando cursos...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400">Tente ajustar sua busca ou filtros.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card 
                  key={course.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {course.platform}
                        </Badge>
                        {course.courseLevels.length > 0 && (
                          <Badge className={`text-xs ${getLevelColor(course.courseLevels[0])}`}>
                            {course.courseLevels[0]}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {course.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium dark:text-white">
                            {course.ratingAverage}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({course.ratingCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                        {course.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 dark:border-gray-600">
                            +{course.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Paginação */}
            {courseData && courseData.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  className="px-3 py-1 rounded-md border text-sm font-medium disabled:opacity-50"
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                    updateSearchParams({ q: searchQuery.trim(), sortBy, sortOrder, page: newPage });
                  }}
                  disabled={!courseData.hasPreviousPage}
                >
                  Anterior
                </button>
                {courseData && (
                  <span className="font-medium text-sm items-center mt-1">
                    (Página {courseData.pageNumber} de {courseData.totalPages})
                  </span>
                )}
                <button
                  className="px-3 py-1 rounded-md border text-sm font-medium disabled:opacity-50"
                  onClick={() => {
                    const newPage = Math.min(courseData.totalPages, currentPage + 1);
                    setCurrentPage(newPage);
                    updateSearchParams({ q: searchQuery.trim(), sortBy, sortOrder, page: newPage });
                  }}
                  disabled={!courseData.hasNextPage}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
