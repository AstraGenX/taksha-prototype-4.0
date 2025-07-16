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
      // Fallback to static data
      const staticBlogs = [
        {
          _id: '1',
          title: 'The Art of Traditional Woodcarving',
          excerpt: 'Discover the ancient techniques that bring our handcrafted pieces to life, passed down through generations of skilled artisans.',
          content: 'Long form content about traditional woodcarving...',
          author: { name: 'Rajesh Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
          publishedAt: '2024-01-15T10:30:00Z',
          category: 'craftsmanship',
          tags: ['woodcarving', 'tradition', 'craftsmanship'],
          image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=800&q=80',
          readTime: '5 min read'
        },
        {
          _id: '2',
          title: 'Celebrating Diwali with Handcrafted Décor',
          excerpt: 'Transform your home this Diwali with our collection of traditional handcrafted decorative pieces that honor the festival of lights.',
          content: 'Long form content about Diwali decorations...',
          author: { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b4e69374?w=150' },
          publishedAt: '2024-01-12T15:45:00Z',
          category: 'culture',
          tags: ['diwali', 'decoration', 'festival'],
          image: 'https://images.unsplash.com/photo-1605538883669-825200433431?auto=format&fit=crop&w=800&q=80',
          readTime: '4 min read'
        },
        {
          _id: '3',
          title: 'Sustainable Living with Handmade Products',
          excerpt: 'Learn how choosing handcrafted items contributes to a more sustainable lifestyle and supports local artisan communities.',
          content: 'Long form content about sustainable living...',
          author: { name: 'Amit Patel', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
          publishedAt: '2024-01-10T12:20:00Z',
          category: 'lifestyle',
          tags: ['sustainability', 'eco-friendly', 'handmade'],
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
          readTime: '6 min read'
        },
        {
          _id: '4',
          title: 'The Stories Behind Our Artisan Partners',
          excerpt: 'Meet the talented craftspeople who pour their hearts into creating each unique piece in our collection.',
          content: 'Long form content about artisan partners...',
          author: { name: 'Sneha Gupta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
          publishedAt: '2024-01-08T09:15:00Z',
          category: 'inspiration',
          tags: ['artisans', 'stories', 'community'],
          image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
          readTime: '7 min read'
        }
      ];
      
      if (staticBlogs.length > 0) {
        setFeaturedBlog(staticBlogs[0]);
        setBlogs(staticBlogs.slice(1));
      }
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

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
            <p className="text-lg text-muted-foreground">Loading blog posts...</p>
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
            Our Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover stories, insights, and inspiration from the world of traditional craftsmanship
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
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
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-saffron-600 hover:bg-saffron-700' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Blog */}
        {featuredBlog && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-walnut-800 mb-6 text-center">
              Featured Post
            </h2>
            <Card 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleBlogClick(featuredBlog)}
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getCategoryColor(featuredBlog.category)}>
                      {featuredBlog.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{featuredBlog.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold text-walnut-800 mb-4 hover:text-saffron-600 transition-colors">
                    {featuredBlog.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={featuredBlog.author.avatar}
                        alt={featuredBlog.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{featuredBlog.author.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(featuredBlog.publishedAt)}</p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-saffron-600 hover:text-saffron-700">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card 
              key={blog._id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
              onClick={() => handleBlogClick(blog)}
            >
              <div className="relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(blog.category)}>
                    {blog.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-bold text-walnut-800 mb-3 group-hover:text-saffron-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{blog.author.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(blog.publishedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{blog.readTime}</span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {blog.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No blog posts found matching your criteria.</p>
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
      
      <Footer />
    </div>
  );
};

export default Blog;