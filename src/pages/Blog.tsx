import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ArrowRight, Loader2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { blogAPI } from '@/services/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock blog data for fallback
  const mockBlogs = [
    {
      _id: '1',
      title: 'The Art of Traditional Craftsmanship',
      excerpt: 'Discover the rich heritage of traditional Indian crafts and their modern relevance.',
      content: 'Traditional craftsmanship represents the soul of Indian culture...',
      category: 'tradition',
      author: { name: 'Taksha Team', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      publishedAt: '2024-01-15T10:30:00Z',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      tags: ['craftsmanship', 'tradition', 'culture'],
      featured: true,
      readTime: '5 min read'
    },
    {
      _id: '2',
      title: 'Sustainable Gifting: A Modern Approach',
      excerpt: 'How to choose gifts that are both meaningful and environmentally conscious.',
      content: 'Sustainable gifting is becoming increasingly important in our modern world...',
      category: 'lifestyle',
      author: { name: 'Sustainability Team', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b4e69374?w=150' },
      publishedAt: '2024-01-10T15:45:00Z',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80',
      tags: ['sustainability', 'gifting', 'environment'],
      featured: false,
      readTime: '4 min read'
    },
    {
      _id: '3',
      title: 'The Story Behind Every Taksha Product',
      excerpt: 'Learn about the journey from concept to creation in our product development.',
      content: 'Every Taksha product tells a story of passion, dedication, and craftsmanship...',
      category: 'craftsmanship',
      author: { name: 'Design Team', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      publishedAt: '2024-01-05T11:20:00Z',
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80',
      tags: ['design', 'process', 'taksha'],
      featured: false,
      readTime: '6 min read'
    },
    {
      _id: '4',
      title: 'Cultural Significance of Indian Festivals',
      excerpt: 'Exploring the deeper meaning behind traditional Indian celebrations.',
      content: 'Indian festivals are not just celebrations but cultural treasures...',
      category: 'culture',
      author: { name: 'Cultural Team', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      publishedAt: '2024-01-01T09:00:00Z',
      image: 'https://images.unsplash.com/photo-1604909052434-1c5adf2c787d?auto=format&fit=crop&w=800&q=80',
      tags: ['festivals', 'culture', 'tradition'],
      featured: false,
      readTime: '7 min read'
    },
    {
      _id: '5',
      title: 'Finding Inspiration in Everyday Moments',
      excerpt: 'How to discover creative inspiration in your daily life.',
      content: 'Inspiration surrounds us in every moment, waiting to be discovered...',
      category: 'inspiration',
      author: { name: 'Creative Team', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b4e69374?w=150' },
      publishedAt: '2023-12-28T14:30:00Z',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
      tags: ['inspiration', 'creativity', 'life'],
      featured: false,
      readTime: '3 min read'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', color: 'bg-gray-100 text-gray-800' },
    { id: 'tradition', name: 'Tradition', color: 'bg-saffron-100 text-saffron-800' },
    { id: 'craftsmanship', name: 'Craftsmanship', color: 'bg-walnut-100 text-walnut-800' },
    { id: 'culture', name: 'Culture', color: 'bg-orange-100 text-orange-800' },
    { id: 'lifestyle', name: 'Lifestyle', color: 'bg-amber-100 text-amber-800' },
    { id: 'inspiration', name: 'Inspiration', color: 'bg-yellow-100 text-yellow-800' }
  ];

  useEffect(() => {
    loadBlogs();
  }, [selectedCategory, searchTerm]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm || undefined,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      const response = await blogAPI.getAll(filters);
      const blogPosts = response.blogs || [];
      
      // Set featured blog (first blog or most recent)
      if (blogPosts.length > 0) {
        setFeaturedBlog(blogPosts[0]);
        setBlogs(blogPosts.slice(1));
      } else {
        setFeaturedBlog(null);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      console.log('Using fallback mock blog data');
      
      // Filter mock blogs based on search and category
      let filteredBlogs = mockBlogs;
      
      if (selectedCategory !== 'all') {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === selectedCategory);
      }
      
      if (searchTerm) {
        filteredBlogs = filteredBlogs.filter(blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Set featured blog and remaining blogs
      if (filteredBlogs.length > 0) {
        setFeaturedBlog(filteredBlogs[0]);
        setBlogs(filteredBlogs.slice(1));
      } else {
        setFeaturedBlog(null);
        setBlogs([]);
      }
      
      toast({
        title: "Using Demo Data",
        description: "Backend not connected. Showing sample blog posts.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog._id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-orange-600">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover stories, insights, and inspiration from the world of traditional crafts and modern design.
            </p>
          </div>

          {/* Search and Categories */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Blog */}
          {featuredBlog && (
            <Card className="mb-12 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleBlogClick(featuredBlog)}>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(featuredBlog.category)} border-none`}>
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge variant="outline" className={getCategoryColor(featuredBlog.category)}>
                      {featuredBlog.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(featuredBlog.publishedAt)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{featuredBlog.title}</h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">{featuredBlog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700">{featuredBlog.author.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{featuredBlog.readTime}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Card key={blog._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleBlogClick(blog)}>
                <div className="relative h-48">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(blog.category)}>
                      {blog.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {formatDate(blog.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700">{blog.author.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{blog.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {blogs.length === 0 && !featuredBlog && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;