import { useState } from 'react';
import { Plus, Map, Clock, Target, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

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
}

interface RoadmapFormData {
  title: string;
  description: string;
  category: string;
  currentLevel: string;
  goals: string;
  timeframe: string;
}

const Roadmaps = () => {
  const navigate = useNavigate();
  
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    {
      id: '1',
      title: 'Full Stack Web Development',
      description: 'Complete journey from frontend to backend development with modern technologies',
      category: 'Web Development',
      estimatedDuration: '6 months',
      difficulty: 'Intermediate',
      milestones: 12,
      createdAt: '2024-01-15',
      progress: 45
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
      progress: 20
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
      progress: 75
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<RoadmapFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      currentLevel: '',
      goals: '',
      timeframe: ''
    }
  });

  const onSubmit = (data: RoadmapFormData) => {
    // Here you would normally send the data to AI to generate the roadmap
    console.log('Form submitted:', data);
    
    // For now, create a placeholder roadmap
    const newRoadmap: Roadmap = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      category: data.category,
      estimatedDuration: data.timeframe,
      difficulty: 'Intermediate',
      milestones: 10,
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0
    };

    setRoadmaps(prev => [newRoadmap, ...prev]);
    setIsDialogOpen(false);
    form.reset();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleRoadmapClick = (roadmapId: string) => {
    navigate(`/roadmaps/${roadmapId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Learning Roadmaps
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create personalized learning paths with AI assistance
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Roadmap
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Your Personalized Roadmap</DialogTitle>
                <DialogDescription>
                  Tell us about your learning goals and we'll create a customized roadmap for you.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roadmap Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Frontend Development Journey" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe what you want to learn..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Web Development" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Timeframe</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3 months" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="currentLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Experience Level</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your current knowledge and experience in this field..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps us tailor the roadmap to your skill level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Goals</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What specific skills or outcomes do you want to achieve?"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be as specific as possible about what you want to learn
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Generate Roadmap
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Map className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Roadmaps</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{roadmaps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {roadmaps.filter(r => r.progress === 100).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {roadmaps.filter(r => r.progress > 0 && r.progress < 100).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <Card 
              key={roadmap.id} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
              onClick={() => handleRoadmapClick(roadmap.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                    {roadmap.category}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(roadmap.difficulty)}`}>
                    {roadmap.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                  {roadmap.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                  {roadmap.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {roadmap.estimatedDuration}
                    </span>
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {roadmap.milestones} milestones
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium dark:text-white">{roadmap.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${roadmap.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created {new Date(roadmap.createdAt).toLocaleDateString()}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {roadmaps.length === 0 && (
          <div className="text-center py-16">
            <Map className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No roadmaps yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first personalized learning roadmap to get started
            </p>
            <Button onClick={() => setIsDialogOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Roadmap
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmaps;
