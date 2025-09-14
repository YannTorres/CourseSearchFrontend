import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AddReviewModalProps {
  courseId: string;
  onReviewAdded: () => void;
}

const AddReviewModal = ({ courseId, onReviewAdded }: AddReviewModalProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get token from localStorage (temporary solution)
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`https://localhost:7236/api/rating/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          rating,
          review: review.trim() || null
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar avaliação');
      }

      toast({
        title: "Sucesso!",
        description: "Sua avaliação foi adicionada com sucesso.",
      });

      setOpen(false);
      setRating(0);
      setReview('');
      onReviewAdded();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" >
          Avaliar Curso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Curso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Sua Avaliação</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="review" className="text-sm font-medium mb-2 block">
              Seu Comentário
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Conte sobre sua experiência com o curso..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {review.length}/500
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewModal;