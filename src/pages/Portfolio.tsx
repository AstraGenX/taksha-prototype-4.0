import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Filter, Eye, Calendar, MapPin, Users, Award, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { portfolioAPI } from '@/services/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'home', name: 'Home Decor' },
    { id: 'temple', name: 'Temple & Spiritual' },
    { id: 'office', name: 'Office Space' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'retail', name: 'Retail' }
  ];

  useEffect(() => {
    loadPortfolio();
  }, [selectedCategory, searchTerm]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        limit: 20,
        sortBy: 'completedAt',
        sortOrder: 'desc'
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const response = await portfolioAPI.getAll(filters);
      setPortfolioItems(response.projects || []);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      // Fallback to static data
      const staticPortfolio = [
        {
          _id: '1',
          title: 'Executive Office Transformation',
          description: 'Complete office makeover with custom wooden furniture and traditional décor elements for a Fortune 500 company.',
          category: 'corporate',
          client: 'TechCorp Solutions',
          location: 'Mumbai, Maharashtra',
          completedAt: '2024-01-15T00:00:00Z',
          duration: '45 days',
          teamSize: 8,
          budget: '₹12,50,000',
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Custom wooden desks', 'Traditional wall art', 'Ambient lighting', 'Cultural elements'],
          testimonial: {
            text: 'The team transformed our office space beautifully, incorporating traditional Indian elements while maintaining a modern professional look.',
            author: 'Rahul Mehta',
            position: 'CEO, TechCorp Solutions'
          },
          awards: ['Best Corporate Design 2024', 'Excellence in Traditional Integration'],
          featured: true
        },
        {
          _id: '2',
          title: 'Royal Wedding Décor',
          description: 'Luxury wedding decoration with handcrafted mandap, traditional lighting, and custom furniture pieces.',
          category: 'wedding',
          client: 'The Sharma Family',
          location: 'Jaipur, Rajasthan',
          completedAt: '2024-01-10T00:00:00Z',
          duration: '30 days',
          teamSize: 15,
          budget: '₹25,00,000',
          images: [
            'https://images.unsplash.com/photo-1519167758481-83f29da8238c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Handcrafted mandap', 'Traditional lighting', 'Custom seating', 'Floral arrangements'],
          testimonial: {
            text: 'Our wedding looked like a dream come true. Every detail was perfect and reflected our cultural heritage beautifully.',
            author: 'Priya Sharma',
            position: 'Bride'
          },
          awards: ['Best Wedding Design 2024'],
          featured: false
        },
        {
          _id: '3',
          title: 'Modern Home with Traditional Touch',
          description: 'Contemporary home interior design enhanced with traditional Indian craftsmanship and cultural elements.',
          category: 'home',
          client: 'The Gupta Residence',
          location: 'Delhi, NCR',
          completedAt: '2024-01-05T00:00:00Z',
          duration: '60 days',
          teamSize: 6,
          budget: '₹8,75,000',
          images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Custom furniture', 'Traditional artwork', 'Modern amenities', 'Cultural integration'],
          testimonial: {
            text: 'Perfect blend of modern comfort and traditional aesthetics. Our home truly reflects our values and style.',
            author: 'Amit Gupta',
            position: 'Homeowner'
          },
          awards: [],
          featured: false
        },
        {
          _id: '4',
          title: 'Temple Complex Design',
          description: 'Sacred temple interior design with traditional wooden carvings, spiritual artwork, and devotional spaces.',
          category: 'temple',
          client: 'Shri Ganesh Temple Trust',
          location: 'Varanasi, Uttar Pradesh',
          completedAt: '2023-12-20T00:00:00Z',
          duration: '90 days',
          teamSize: 12,
          budget: '₹18,00,000',
          images: [
            'https://images.unsplash.com/photo-1605538883669-825200433431?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Traditional carvings', 'Sacred artwork', 'Devotional spaces', 'Cultural authenticity'],
          testimonial: {
            text: 'The spiritual energy and traditional beauty they brought to our temple is beyond words. Truly divine work.',
            author: 'Pandit Sharma',
            position: 'Temple Trust President'
          },
          awards: ['Best Spiritual Design 2023', 'Cultural Heritage Award'],
          featured: false
        },
        {
          _id: '5',
          title: 'Boutique Restaurant Design',
          description: 'Elegant restaurant interior combining modern dining concepts with traditional Indian hospitality elements.',
          category: 'restaurant',
          client: 'Spice Route Restaurant',
          location: 'Goa',
          completedAt: '2023-12-15T00:00:00Z',
          duration: '40 days',
          teamSize: 10,
          budget: '₹15,50,000',
          images: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800&q=80'
          ],
          features: ['Custom dining furniture', 'Traditional lighting', 'Cultural artwork', 'Ambient atmosphere'],
          testimonial: {
            text: 'Our restaurant now has the perfect ambiance that reflects Indian culture while providing modern comfort to our guests.',
            author: 'Chef Ravi Kumar',
            position: 'Owner, Spice Route'
          },
          awards: ['Best Restaurant Design 2023'],
          featured: false
        }
      ];
      
      setPortfolioItems(staticPortfolio);
    } finally {
      setLoading(false);
    }
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      corporate: 'bg-blue-100 text-blue-800',
      wedding: 'bg-pink-100 text-pink-800',
      home: 'bg-green-100 text-green-800',
      temple: 'bg-orange-100 text-orange-800',
      office: 'bg-purple-100 text-purple-800',
      restaurant: 'bg-yellow-100 text-yellow-800',
      retail: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredProjects = portfolioItems.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
            <p className="text-lg text-muted-foreground">Loading portfolio...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-walnut-800 mb-4">
            Our Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of projects showcasing traditional craftsmanship in modern settings
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-walnut-800 mb-6">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Card 
                  key={project._id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
                  onClick={() => openProjectModal(project)}
                >
                  <div className="relative">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={getCategoryColor(project.category)}>
                        {project.category}
                      </Badge>
                      <Badge className="bg-saffron-100 text-saffron-800">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-bold text-walnut-800 mb-2 group-hover:text-saffron-600 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(project.completedAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.teamSize} team
                        </div>
                        <div>{project.duration}</div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-saffron-600 hover:text-saffron-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularProjects.map((project) => (
            <Card 
              key={project._id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
              onClick={() => openProjectModal(project)}
            >
              <div className="relative">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(project.category)}>
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-serif font-bold text-walnut-800 mb-2 group-hover:text-saffron-600 transition-colors line-clamp-2">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(project.completedAt)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {project.client}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-saffron-600 hover:text-saffron-700">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No projects found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-walnut-800">
                {selectedProject.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Project Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProject.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedProject.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
              
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-walnut-800 mb-2">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span className="font-medium">{selectedProject.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">{selectedProject.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{selectedProject.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Size:</span>
                        <span className="font-medium">{selectedProject.teamSize} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span className="font-medium">{selectedProject.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium">{formatDate(selectedProject.completedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-walnut-800 mb-2">Key Features</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-saffron-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-walnut-800 mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  {/* Awards */}
                  {selectedProject.awards.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-walnut-800 mb-2">Awards & Recognition</h3>
                      <div className="space-y-1">
                        {selectedProject.awards.map((award, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4 text-saffron-600" />
                            {award}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Testimonial */}
                  {selectedProject.testimonial && (
                    <div>
                      <h3 className="font-semibold text-walnut-800 mb-2">Client Testimonial</h3>
                      <blockquote className="text-sm text-muted-foreground italic border-l-4 border-saffron-600 pl-4">
                        "{selectedProject.testimonial.text}"
                      </blockquote>
                      <p className="text-sm font-medium mt-2">
                        - {selectedProject.testimonial.author}, {selectedProject.testimonial.position}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

export default Portfolio;