import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';


const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Header */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Course<span className="text-blue-600">Search</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Discover your next learning adventure</p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
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
                className="pl-12 pr-16 py-4 text-lg border-0 rounded-full focus:ring-0 focus:outline-none bg-transparent dark:text-white dark:placeholder-gray-400"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-10 px-6"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Web Development', 'Data Science', 'Design', 'Marketing'].map((category) => (
            <Card 
              key={category} 
              className="hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
              onClick={() => navigate(`/courses?q=${encodeURIComponent(category)}`)}
            >
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
