import { useState, useMemo } from 'react';
import { Search, BookOpen, Users, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return courses.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const showResults = searchQuery.trim().length > 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Header */}
      <div className={`transition-all duration-500 ${showResults ? 'py-6' : 'py-20'}`}>
        <div className="max-w-4xl mx-auto px-4">
          {!showResults && (
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Course<span className="text-blue-600">Search</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">Discover your next learning adventure</p>
            </div>
          )}
          
          {/* Search Bar */}
          <div className={`relative transition-all duration-300 ${showResults ? 'max-w-2xl' : 'max-w-2xl mx-auto'}`}>
            <div className={`relative rounded-full border-2 transition-all duration-300 ${
              isSearchFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-600 shadow-md'
            } bg-white dark:bg-gray-800`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for courses, topics, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-12 pr-4 py-4 text-lg border-0 rounded-full focus:ring-0 focus:outline-none bg-transparent dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''} 
              {filteredCourses.length > 0 && <span> for "{searchQuery}"</span>}
            </p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try searching for different keywords or browse our popular categories.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700">
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
                        <span>{course.students.toLocaleString()} students</span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>{course.duration}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium dark:text-white">{course.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">by {course.instructor}</span>
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
          )}
        </div>
      )}

      {/* Popular Categories - Only show when not searching */}
      {!showResults && (
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Web Development', 'Data Science', 'Design', 'Marketing'].map((category) => (
              <Card 
                key={category} 
                className="hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
                onClick={() => setSearchQuery(category)}
              >
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
