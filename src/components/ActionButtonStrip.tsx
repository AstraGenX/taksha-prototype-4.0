import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ActionButtonStrip = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookNow = () => {
    toast({
      title: "Booking Request",
      description: "Redirecting to consultation booking...",
    });

    navigate('/contact');
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleFeedback = () => {
    toast({
      title: "Thank you!",
      description: "Feedback form will open shortly...",
    });

    navigate('/contact');
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleContact = () => {
    navigate('/contact');
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-walnut-800 via-mahogany-700 to-walnut-800 relative overflow-hidden">
      {/* Wood texture background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h30v30H0V0zm15 15h30v30H15V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <p className="text-lg font-serif italic text-saffron-300 mb-2">
            Saṅgatiḥ karma yogaḥ
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Connect with Tradition
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Whether you're seeking custom creations, expert guidance, or sharing your experience - we're here for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Book Now */}
          <div className="group">
            <Button
              size="lg"
              onClick={handleBookNow}
              className="w-full h-auto py-6 px-8 bg-saffron-600 hover:bg-saffron-500 text-white border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center space-y-3"
            >
              <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <Calendar className="h-8 w-8" />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">Book Now</div>
                <div className="text-sm opacity-90">Schedule a consultation</div>
              </div>
            </Button>
          </div>

          {/* Contact Us */}
          <div className="group">
            <Button
              size="lg"
              onClick={handleContact}
              className="w-full h-auto py-6 px-8 bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center space-y-3"
            >
              <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <MessageCircle className="h-8 w-8" />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">Contact Us</div>
                <div className="text-sm opacity-90">Let's discuss your needs</div>
              </div>
            </Button>
          </div>

          {/* Give Feedback */}
          <div className="group">
            <Button
              size="lg"
              onClick={handleFeedback}
              className="w-full h-auto py-6 px-8 bg-mahogany-600 hover:bg-mahogany-500 text-white border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center space-y-3"
            >
              <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <Star className="h-8 w-8" />
              </div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">Give Feedback</div>
                <div className="text-sm opacity-90">Share your experience</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Sanskrit Quote */}
        <div className="text-center mt-12">
          <p className="text-white/80 font-serif italic text-lg">
            "Yatra saṅgatiḥ tatra kalā"
          </p>
          <p className="text-white/60 text-sm mt-2">
            Where there is unity, there is art
          </p>
        </div>
      </div>
    </section>
  );
};

export default ActionButtonStrip;
