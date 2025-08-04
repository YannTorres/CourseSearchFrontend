import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getCoursesPaged } from '../services/api'; // Supondo que a API aceite os novos parâmetros
import { Search, BookOpen, Users, Clock, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';

// --- Tipos Ajustados para refletir a API ---

interface Tag {
  id: string;
  name: string;
}

// A API envia platform como string, então ajustamos o tipo aqui
type Platform = string;

interface Course {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  // Propriedades que ainda não vêm da API foram marcadas como opcionais (?)
  tags?: Tag[];
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  category?: string;
  students?: number;
  duration?: string;
  rating?: number;
}

interface PagedResult<T> {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[]; // Mantemos 'items' aqui, pois a transformação é feita no serviço da API
}

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estados para filtros e busca
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'all');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Estados para paginação e dados
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const resultsPerPage = 9;
  const [pagedResult, setPagedResult] = useState<PagedResult<Course> | null>(null);
  
  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados quando os filtros ou a página mudam
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCoursesPaged(currentPage, resultsPerPage);
        setPagedResult(data);
      } catch (err) {
        setError('Não foi possível carregar os cursos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, searchQuery, levelFilter, categoryFilter, sortBy, resultsPerPage]);

  // Efeito para SINCRONIZAR o estado dos filtros com a URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (levelFilter !== 'all') params.set('level', levelFilter);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, currentPage, levelFilter, categoryFilter, sortBy, setSearchParams]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleLevelChange = (value: string) => {
    setLevelFilter(value);
    setCurrentPage(1);
  };
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const totalCourses = pagedResult?.totalCount || 0;
  const totalPages = pagedResult?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          
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

          <div className="flex flex-wrap gap-4 items-center">
            {/* Filtros continuam aqui, sem alterações */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
            </div>
            <Select value={levelFilter} onValueChange={handleLevelChange}><SelectTrigger className="w-40"><SelectValue placeholder="Nível" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os níveis</SelectItem><SelectItem value="Beginner">Iniciante</SelectItem><SelectItem value="Intermediate">Intermediário</SelectItem><SelectItem value="Advanced">Avançado</SelectItem></SelectContent></Select>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}><SelectTrigger className="w-48"><SelectValue placeholder="Categoria" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as categorias</SelectItem><SelectItem value="development">Desenvolvimento</SelectItem><SelectItem value="design">Design</SelectItem></SelectContent></Select>
            <Select value={sortBy} onValueChange={handleSortChange}><SelectTrigger className="w-40"><SelectValue placeholder="Ordenar por" /></SelectTrigger><SelectContent><SelectItem value="relevance">Relevância</SelectItem><SelectItem value="rating">Avaliação</SelectItem><SelectItem value="students">Alunos</SelectItem><SelectItem value="title">Título</SelectItem></SelectContent></Select>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Encontrado<span className="font-semibold"> {totalCourses} </span>curso{totalCourses !== 1 ? 's' : ''}
            {searchQuery && <span> para "{searchQuery}"</span>}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16"><p>Carregando...</p></div>
        ) : error ? (
          <div className="text-center py-16 text-red-500"><p>{error}</p></div>
        ) : pagedResult?.items.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400">Tente ajustar sua busca ou filtros.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pagedResult?.items.map((course) => (
                <Card 
                  key={course.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {/* Removido temporariamente pois 'category' e 'level' não vêm da API */}
                      {/* <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">{course.category}</Badge>
                        <Badge className={`text-xs ${getLevelColor(course.level)}`}>{course.level}</Badge>
                      </div> */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{course.description || "Descrição não disponível."}</p>
                    </div>

                    <div className="space-y-3">
                      {/* Removido temporariamente pois 'students' e 'duration' não vêm da API */}
                      {/* <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{course.students} alunos</span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>{course.duration}</span>
                      </div> */}

                      <div className="flex items-center justify-between">
                        {/* Removido temporariamente pois 'rating' não vem da API */}
                        {/* <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium dark:text-white">{course.rating}</span>
                        </div> */}
                        
                        {/* Corrigido para exibir a string 'platform' diretamente */}
                        <span className="text-sm text-gray-500 dark:text-gray-400">por {course.platform}</span>
                      </div>

                      {/* Removido temporariamente pois 'tags' não vem da API */}
                      {/* <div className="flex flex-wrap gap-1">
                        {course.tags?.slice(0, 3).map((tag) => (
                           <Badge key={tag.id} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">{tag.name}</Badge>
                        ))}
                        {course.tags && course.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 dark:border-gray-600">
                            +{course.tags.length - 3}
                          </Badge>
                        )}
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={!pagedResult?.hasPreviousPage}>Anterior</Button>
                <span className="px-4 py-2 text-sm">Página {pagedResult?.pageNumber} de {totalPages}</span>
                <Button variant="outline" onClick={() => setCurrentPage(currentPage + 1)} disabled={!pagedResult?.hasNextPage}>Próxima</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
