
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Star, Sparkles, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HomepageContentManagement = () => {
  const { toast } = useToast();
  
  const [featuredProducts, setFeaturedProducts] = useState([
    { id: 1, name: 'Executive Diary Set', category: 'corporate', isFeatured: true },
    { id: 2, name: 'Mandala Wall Art', category: 'home', isFeatured: true },
    { id: 3, name: 'Wooden Photo Frame', category: 'home', isFeatured: true },
  ]);

  const [freshArrivals, setFreshArrivals] = useState([
    { id: 1, name: 'Festival Gift Collection', category: 'custom', isNew: true },
    { id: 2, name: 'Executive Desk Set', category: 'corporate', isNew: true },
    { id: 3, name: 'Artisan Home Decor Trio', category: 'home', isNew: true },
  ]);

  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'Corporate Excellence',
      description: 'Premium corporate gifting solutions',
      image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=600&q=80',
      pdfUrl: '/portfolio/corporate-excellence.pdf',
      category: 'corporate'
    },
    {
      id: 2,
      title: 'Spiritual Harmony',
      description: 'Sacred and spiritual wooden artifacts',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80',
      pdfUrl: '/portfolio/spiritual-harmony.pdf',
      category: 'spiritual'
    }
  ]);

  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    image: '',
    pdfUrl: '',
    category: 'corporate'
  });

  const availableProducts = [
    { id: 4, name: 'Tulsi Mala', category: 'spiritual' },
    { id: 5, name: 'Wooden Pen Drive Casing', category: 'corporate' },
    { id: 6, name: 'Temple Decor Set', category: 'home' },
    { id: 7, name: 'Memory Fridge Magnet', category: 'personal' },
    { id: 8, name: '3D Building Structure', category: 'personal' },
  ];

  const handleAddToFeatured = (productId: number) => {
    const product = availableProducts.find(p => p.id === productId);
    if (product && !featuredProducts.find(p => p.id === productId)) {
      setFeaturedProducts(prev => [...prev, { ...product, isFeatured: true }]);
      toast({
        title: "Product Added",
        description: `${product.name} added to Featured Collection.`,
      });
    }
  };

  const handleAddToFreshArrivals = (productId: number) => {
    const product = availableProducts.find(p => p.id === productId);
    if (product && !freshArrivals.find(p => p.id === productId)) {
      setFreshArrivals(prev => [...prev, { ...product, isNew: true }]);
      toast({
        title: "Product Added",
        description: `${product.name} added to Fresh Arrivals.`,
      });
    }
  };

  const handleAddPortfolio = () => {
    if (!newPortfolio.title || !newPortfolio.image) {
      toast({
        title: "Error",
        description: "Please fill in title and image URL.",
        variant: "destructive"
      });
      return;
    }

    const portfolio = {
      id: Date.now(),
      ...newPortfolio
    };

    setPortfolioItems(prev => [...prev, portfolio]);
    setNewPortfolio({ title: '', description: '', image: '', pdfUrl: '', category: 'corporate' });
    
    toast({
      title: "Portfolio Added",
      description: "New portfolio item has been created successfully.",
    });
  };

  const removeFromFeatured = (id: number) => {
    setFeaturedProducts(prev => prev.filter(p => p.id !== id));
  };

  const removeFromFreshArrivals = (id: number) => {
    setFreshArrivals(prev => prev.filter(p => p.id !== id));
  };

  const removePortfolio = (id: number) => {
    setPortfolioItems(prev => prev.filter(p => p.id !== id));
  };

  return (
    <Tabs defaultValue="featured" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="featured">Featured Collection</TabsTrigger>
        <TabsTrigger value="fresh">Fresh Arrivals</TabsTrigger>
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
      </TabsList>

      <TabsContent value="featured">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Current Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFromFeatured(product.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add to Featured Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableProducts.filter(p => !featuredProducts.find(fp => fp.id === p.id)).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddToFeatured(product.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="fresh">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Current Fresh Arrivals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {freshArrivals.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeFromFreshArrivals(product.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add to Fresh Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableProducts.filter(p => !freshArrivals.find(fp => fp.id === p.id)).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddToFreshArrivals(product.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="portfolio">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Portfolio Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Portfolio Title</label>
                <Input
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter portfolio title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Image URL</label>
                <Input
                  value={newPortfolio.image}
                  onChange={(e) => setNewPortfolio(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">PDF URL</label>
                <Input
                  value={newPortfolio.pdfUrl}
                  onChange={(e) => setNewPortfolio(prev => ({ ...prev, pdfUrl: e.target.value }))}
                  placeholder="/portfolio/sample.pdf"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={newPortfolio.category}
                  onChange={(e) => setNewPortfolio(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="corporate">Corporate</option>
                  <option value="home">Home Decor</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <Button onClick={handleAddPortfolio} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Current Portfolio Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded" />
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <Badge variant="outline" className="mt-1">{item.category}</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removePortfolio(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {item.pdfUrl && (
                      <p className="text-xs text-muted-foreground mt-2">PDF: {item.pdfUrl}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HomepageContentManagement;
