import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductModal from '@/components/ProductModal';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      image:
        'https://github.com/AstraGenX/astragenxlogo/blob/main/_6b953355-4258-472a-bec4-5fe9bf278e96.jpeg?raw=true',
      title: 'Crafted with Heritage',
      subtitle: 'Kalāyāḥ saṅgatiḥ ādarśam',
      description:
        'Discover handcrafted wooden pieces that tell stories of tradition and innovation',
      cta: 'Shop Now',
      productId: 101,
    },
    {
      image:
        'https://github.com/AstraGenX/astragenxlogo/blob/main/_8f386b3a-b7cf-4e64-86a4-d20e4e33d3b8.jpeg?raw=true',
      title: 'Corporate Gifting Excellence',
      subtitle: 'Saṃskṛtiḥ milati navīnatayā',
      description:
        'Elevate your corporate relationships with thoughtfully designed gift collections',
      cta: 'Book a Gift Kit',
      productId: 102,
    },
    {
      image:
        'https://github.com/AstraGenX/astragenxlogo/blob/main/_25218c8c-63fb-4452-b00a-ab555613de70.jpeg?raw=true',
      title: 'Transform Your Space',
      subtitle: 'Gṛhasya sundartā',
      description:
        'Bring warmth and elegance to your home with our curated decor pieces',
      cta: 'Explore New Collections',
      productId: 103,
    },
  ];

  // Sample products with 4 images each for modal gallery
  const sampleProducts = [
    {
      id: 101,
      name: 'Executive Wooden Desk Organizer',
      category: 'corporate',
      series: 'TakshaVerse',
      price: 2499,
      originalPrice: 2999,
      image:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      image2:
        'https://images.unsplash.com/photo-1590080877777-bb3d7c80ae72?auto=format&fit=crop&w=600&q=80',
      image3:
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
      image4:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviews: 124,
      description:
        'Premium handcrafted wooden desk organizer perfect for modern offices',
      isNew: false,
      isLimited: true,
      features: [
        'Premium wood finish',
        'Multiple compartments',
        'Pen holder',
        'Business card slot',
      ],
    },
    {
      id: 102,
      name: 'Artisan Memory Photo Frame',
      category: 'personal',
      series: 'Moments+',
      price: 1299,
      image:
        'https://images.unsplash.com/photo-1565620551738-42e66656dc5c?auto=format&fit=crop&w=600&q=80',
      image2:
        'https://images.unsplash.com/photo-1585033292069-8a6cc0d57d74?auto=format&fit=crop&w=600&q=80',
      image3:
        'https://images.unsplash.com/photo-1531497865144-2c211b176bc1?auto=format&fit=crop&w=600&q=80',
      image4:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews: 89,
      description:
        'Capture your precious memories in this beautifully crafted wooden frame',
      isNew: true,
      isLimited: false,
      features: [
        'Photo customization',
        'Engraving options',
        'Multiple sizes',
        'Gift packaging',
      ],
    },
    {
      id: 103,
      name: 'Mandala Meditation Set',
      category: 'spiritual',
      series: 'Ark Series',
      price: 1899,
      originalPrice: 2299,
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
      image2:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80',
      image3:
        'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80',
      image4:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviews: 67,
      description:
        'Sacred geometry meets craftsmanship in this meditation essential',
      isNew: false,
      isLimited: true,
      features: [
        'Hand-carved mandala',
        'Meditation guide',
        'Spiritual significance',
        'Premium finish',
      ],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.screenX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    touchEndX.current = e.screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleButtonClick = (productId) => {
    const product = sampleProducts.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <section
        className="relative h-screen overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Background Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4 animate-fade-in">
            <p className="text-lg md:text-xl font-serif italic text-saffron-300 mb-4">
              {slides[currentSlide].subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {slides[currentSlide].description}
            </p>
            <Button
              size="lg"
              onClick={() => handleButtonClick(slides[currentSlide].productId)}
              className="bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
            >
              {slides[currentSlide].cta}
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-saffron-500' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default HeroSection;
