
import { useState } from 'react';
import { User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getActiveTab = () => {
    if (location.pathname === '/roadmaps') return 'roadmaps';
    if (location.pathname === '/categories') return 'categories';
    if (location.pathname === '/login') return 'login';
    return 'home';
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case 'home':
        navigate('/');
        break;
      case 'roadmaps':
        navigate('/roadmaps');
        break;
      case 'categories':
        // TODO: Add categories page
        break;
      case 'login':
        navigate('/login');
        break;
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CourseSearch</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex">
            <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="roadmaps">Roadmaps</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </div>

        {/* Right side - Dark Mode Toggle and Profile */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
