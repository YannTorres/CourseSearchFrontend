import { useState, useEffect } from 'react';
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
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  milestones: number;
  createdAt: string;
  progress: number;
}

interface ApiRoadmap {
  id: string;
  experienceLevel: number;
  title: string;
  description: string;
  stepsCount: number;
  createdAt: string;
}

interface RoadmapFormData {
  title: string;
  description: string;
  objective: string;
  priorityTechs: string;
  experienceLevel: number;
}

const Roadmaps = () => {
  const navigate = useNavigate();
  
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<RoadmapFormData>({
    defaultValues: {
      title: '',
      description: '',
      objective: '',
      priorityTechs: '',
      experienceLevel: 3, 
    }
  });

  const convertApiRoadmapToRoadmap = (apiRoadmap: ApiRoadmap): Roadmap => {
    const difficulty = apiRoadmap.experienceLevel === 0 ? 'Iniciante' : 
                      apiRoadmap.experienceLevel === 1 ? 'Intermediário' : 'Avançado';
    
    return {
      id: apiRoadmap.id,
      title: apiRoadmap.title,
      description: apiRoadmap.description,
      difficulty,
      milestones: apiRoadmap.stepsCount,
      createdAt: new Date(apiRoadmap.createdAt).toISOString().split('T')[0],
      progress: 0 
    };
  };

  const fetchRoadmaps = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('https://localhost:7236/api/roadmap', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setRoadmaps([]);
      } else if (response.status === 200) {
        const data = await response.json();
        const convertedRoadmaps = data.roadmaps.map(convertApiRoadmapToRoadmap);
        setRoadmaps(convertedRoadmaps);
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const onSubmit = async (data: RoadmapFormData) => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://localhost:7236/api/roadmap/generate-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        } as HeadersInit,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Roadmap created:', result);
        
        await fetchRoadmaps();
        setIsDialogOpen(false);
        form.reset();
      } else {
        console.error('Failed to create roadmap');
      }
    } catch (error) {
      console.error('Error creating roadmap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avançado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
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
              Recomendações de aprendizado
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Crie caminhos de aprendizagem personalizados com recomendações da IA
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crie seu Caminho de Aprendizado Personalizado</DialogTitle>
                <DialogDescription>
                  Conte-nos sobre seus objetivos de aprendizagem e criaremos um roteiro personalizado para você.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Jornada de Desenvolvimento Frontend" {...field} />
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
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva brevemente o objetivo desse Roadmap..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo do Caminho</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Que habilidades ou resultados específicos você deseja alcançar?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Experiência</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={field.value === 0 ? "default" : "outline"}
                              onClick={() => field.onChange(0)}
                              className="flex-1"
                            >
                              Iniciante
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 1 ? "default" : "outline"}
                              onClick={() => field.onChange(1)}
                              className="flex-1"
                            >
                              Intermediário
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === 2 ? "default" : "outline"}
                              onClick={() => field.onChange(2)}
                              className="flex-1"
                            >
                              Avançado
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priorityTechs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tecnologias Prioritárias</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Quais tecnologias ou ferramentas você gostaria de focar? (ex: React, Node.js, Python...)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   {isGenerating && (
                     <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-4">
                       <div className="flex items-center">
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                         <p className="text-blue-700 dark:text-blue-300 text-sm">
                           Estamos gerando seu roadmap personalizado com IA... Isso pode levar alguns momentos.
                           Pode fechar esta aba e continuar navegando.
                         </p>
                       </div>
                     </div>
                   )}

                   <div className="flex justify-end gap-3 pt-4">
                     <Button 
                       type="button" 
                       variant="outline" 
                       onClick={() => setIsDialogOpen(false)}
                       disabled={isGenerating}
                     >
                       Cancelar
                     </Button>
                     <Button type="submit" disabled={isGenerating}>
                       {isGenerating ? (
                         <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           Gerando...
                         </>
                       ) : (
                         'Gerar o Roadmap'
                       )}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Roadmaps Totais</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluídos</p>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Progresso</p>
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sem Roadmaps ainda</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Crie seu primeiro roadmap personalizado para começar sua jornada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmaps;
