import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Users, Clock, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';

// Sample course data
const courses = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the fundamentals of React including components, props, state, and hooks.",
    category: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    students: 15420,
    rating: 4.8,
    instructor: "Sarah Johnson",
    tags: ["React", "JavaScript", "Frontend"]
  },
  {
    id: 2,
    title: "Advanced Python Programming",
    description: "Master advanced Python concepts including decorators, metaclasses, and async programming.",
    category: "Programming",
    level: "Advanced",
    duration: "12 weeks",
    students: 8930,
    rating: 4.9,
    instructor: "Michael Chen",
    tags: ["Python", "Backend", "Data Science"]
  },
  {
    id: 3,
    title: "Data Science with Machine Learning",
    description: "Comprehensive course covering statistics, data analysis, and machine learning algorithms.",
    category: "Data Science",
    level: "Intermediate",
    duration: "16 weeks",
    students: 12350,
    rating: 4.7,
    instructor: "Dr. Emily Rodriguez",
    tags: ["Machine Learning", "Statistics", "Python", "Data Analysis"]
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    description: "Learn design principles, user research, wireframing, and prototyping.",
    category: "Design",
    level: "Beginner",
    duration: "10 weeks",
    students: 9870,
    rating: 4.6,
    instructor: "Alex Thompson",
    tags: ["Design", "Figma", "User Experience", "Prototyping"]
  },
  {
    id: 5,
    title: "Node.js and Express Backend Development",
    description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
    category: "Web Development",
    level: "Intermediate",
    duration: "14 weeks",
    students: 7650,
    rating: 4.8,
    instructor: "David Kim",
    tags: ["Node.js", "Express", "MongoDB", "Backend"]
  },
  {
    id: 6,
    title: "Mobile App Development with React Native",
    description: "Create cross-platform mobile applications using React Native.",
    category: "Mobile Development",
    level: "Intermediate",
    duration: "12 weeks",
    students: 6540,
    rating: 4.7,
    instructor: "Lisa Zhang",
    tags: ["React Native", "Mobile", "iOS", "Android"]
  },
  {
    id: 7,
    title: "Digital Marketing Strategy",
    description: "Learn SEO, social media marketing, content marketing, and analytics.",
    category: "Marketing",
    level: "Beginner",
    duration: "8 weeks",
    students: 11230,
    rating: 4.5,
    instructor: "Robert Martinez",
    tags: ["SEO", "Social Media", "Marketing", "Analytics"]
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    description: "Understanding network security, encryption, and ethical hacking basics.",
    category: "Security",
    level: "Beginner",
    duration: "10 weeks",
    students: 5890,
    rating: 4.9,
    instructor: "Jennifer Adams",
    tags: ["Security", "Networking", "Encryption", "Ethical Hacking"]
  },
  {
    id: 9,
    title: "Cloud Computing with AWS",
    description: "Master Amazon Web Services including EC2, S3, Lambda, and more.",
    category: "Cloud Computing",
    level: "Intermediate",
    duration: "14 weeks",
    students: 9120,
    rating: 4.8,
    instructor: "Thomas Wilson",
    tags: ["AWS", "Cloud", "DevOps", "Infrastructure"]
  },
  {
    id: 10,
    title: "Blockchain and Cryptocurrency",
    description: "Understand blockchain technology, smart contracts, and cryptocurrency development.",
    category: "Blockchain",
    level: "Advanced",
    duration: "16 weeks",
    students: 4560,
    rating: 4.6,
    instructor: "Maria Garcia",
    tags: ["Blockchain", "Cryptocurrency", "Smart Contracts", "Web3"]
  },
  {
    id: 11,
    title: "DevOps Essentials",
    description: "Aprenda os fundamentos de DevOps, CI/CD, automação e monitoramento.",
    category: "DevOps",
    level: "Beginner",
    duration: "8 weeks",
    students: 4320,
    rating: 4.7,
    instructor: "Carlos Silva",
    tags: ["DevOps", "CI/CD", "Automação", "Monitoramento"]
  },
  {
    id: 12,
    title: "Introdução ao TypeScript",
    description: "Descubra os benefícios do TypeScript para aplicações JavaScript modernas.",
    category: "Programming",
    level: "Beginner",
    duration: "6 weeks",
    students: 3780,
    rating: 4.6,
    instructor: "Ana Souza",
    tags: ["TypeScript", "JavaScript", "Frontend"]
  },
  {
    id: 13,
    title: "Gestão de Projetos Ágeis",
    description: "Domine Scrum, Kanban e metodologias ágeis para gestão de projetos.",
    category: "Management",
    level: "Intermediate",
    duration: "10 weeks",
    students: 2890,
    rating: 4.8,
    instructor: "Bruno Lima",
    tags: ["Scrum", "Kanban", "Ágil", "Gestão"]
  }
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by level
    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => course.level === levelFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    // Sort courses
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'students':
        filtered.sort((a, b) => b.students - a.students);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchQuery, levelFilter, categoryFilter, sortBy]);

  // Paginação
  const totalPages = Math.ceil(filteredCourses.length / resultsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  useEffect(() => {
    // Se a página atual for maior que o total de páginas após um filtro, volta para a primeira página
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredCourses, totalPages, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const categories = [...new Set(courses.map(course => course.category))];

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
            
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="Beginner">Iniciante</SelectItem>
                <SelectItem value="Intermediate">Intermediário</SelectItem>
                <SelectItem value="Advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="rating">Avaliação</SelectItem>
                <SelectItem value="students">Alunos</SelectItem>
                <SelectItem value="title">Título</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Encontrado<span className="font-semibold"> {filteredCourses.length} </span>curso{filteredCourses.length !== 1 ? 's' : ''}
            {searchQuery && <span> para "{searchQuery}"</span>}
          </p>
        </div>

        {/* Course Results */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400">Tente ajustar sua busca ou filtros.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedCourses.map((course) => (
                <Card 
                  key={course.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {course.category}
                        </Badge>
                        <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                          {course.level}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {course.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{course.students.toLocaleString()} alunos</span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>{course.duration}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium dark:text-white">{course.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">por {course.instructor}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {course.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {tag}
                          </Badge>
                        ))
                        }
                        {course.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 dark:border-gray-600">
                            +{course.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
              }
            </div>
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  className="px-3 py-1 rounded-md border text-sm font-medium disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded-md border text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 rounded-md border text-sm font-medium disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
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
