
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlogManagement = () => {
  const { toast } = useToast();
  
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'The Art of Wooden Craftsmanship',
      slug: 'art-of-wooden-craftsmanship',
      excerpt: 'Discover the intricate process behind our handcrafted wooden products.',
      content: 'Lorem ipsum dolor sit amet...',
      author: 'Taksha Team',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
      status: 'published',
      publishDate: '2024-07-01',
      tags: ['craftsmanship', 'wood', 'art']
    },
    {
      id: 2,
      title: 'Spiritual Significance in Wood Carving',
      slug: 'spiritual-significance-wood-carving',
      excerpt: 'Understanding the sacred aspects of traditional wood carving.',
      content: 'Lorem ipsum dolor sit amet...',
      author: 'Taksha Team',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80',
      status: 'draft',
      publishDate: '2024-07-05',
      tags: ['spiritual', 'tradition', 'carving']
    }
  ]);

  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Taksha Team',
    image: '',
    tags: '',
    publishDate: ''
  });

  const handleAddBlog = () => {
    if (!newBlog.title || !newBlog.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content.",
        variant: "destructive"
      });
      return;
    }

    const blog = {
      id: Date.now(),
      ...newBlog,
      slug: newBlog.slug || newBlog.title.toLowerCase().replace(/\s+/g, '-'),
      status: 'draft',
      tags: newBlog.tags.split(',').map(tag => tag.trim())
    };

    setBlogs(prev => [...prev, blog]);
    setNewBlog({
      title: '', slug: '', excerpt: '', content: '', author: 'Taksha Team',
      image: '', tags: '', publishDate: ''
    });
    
    toast({
      title: "Blog Created",
      description: "New blog post has been created as draft.",
    });
  };

  const updateBlogStatus = (id: number, status: string) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id ? { ...blog, status } : blog
    ));
    
    toast({
      title: "Status Updated",
      description: `Blog post ${status === 'published' ? 'published' : 'moved to draft'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Blog Title</label>
                  <Input
                    value={newBlog.title}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter blog title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
                  <Input
                    value={newBlog.slug}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="blog-url-slug"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Excerpt</label>
                <Textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the blog post..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={newBlog.content}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog content here..."
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Featured Image URL</label>
                  <Input
                    value={newBlog.image}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input
                    value={newBlog.author}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                  <Input
                    value={newBlog.tags}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Publish Date</label>
                  <Input
                    type="date"
                    value={newBlog.publishDate}
                    onChange={(e) => setNewBlog(prev => ({ ...prev, publishDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddBlog} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Blog Post
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{blog.title}</h4>
                    <Badge variant={blog.status === 'published' ? "default" : "secondary"}>
                      {blog.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{blog.excerpt}</p>
                  
                  <div className="flex items-center text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    {blog.publishDate}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateBlogStatus(blog.id, blog.status === 'published' ? 'draft' : 'published')}
                      className={blog.status === 'published' ? "text-orange-600" : "text-green-600"}
                    >
                      {blog.status === 'published' ? 'Draft' : 'Publish'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogManagement;
