import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X, Upload, Eye, EyeOff, Star, Package, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { productsAPI, uploadAPI, adminAPI } from '@/services/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    series: '',
    status: '',
    search: ''
  });
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse, seriesResponse] = await Promise.all([
        productsAPI.getAll(),
        adminAPI.getCategories(),
        adminAPI.getSeries()
      ]);
      
      setProducts(productsResponse.products || []);
      setCategories(categoriesResponse.categories || []);
      setSeries(seriesResponse.series || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await productsAPI.create(productData);
      setProducts([...products, response.product]);
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (id, updates) => {
    try {
      const response = await productsAPI.update(id, updates);
      setProducts(products.map(product => 
        product._id === id ? response.product : product
      ));
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(product => product._id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      series: product?.series || '',
      price: product?.price || '',
      originalPrice: product?.originalPrice || '',
      images: product?.images || [],
      gallery: product?.gallery || [],
      features: product?.features || [],
      stock: {
        quantity: product?.stock?.quantity || 0,
        threshold: product?.stock?.threshold || 10
      },
      tags: product?.tags || [],
      isNew: product?.isNew || false,
      isLimited: product?.isLimited || false,
      isFeatured: product?.isFeatured || false,
      isActive: product?.isActive ?? true,
      seo: {
        title: product?.seo?.title || '',
        description: product?.seo?.description || '',
        keywords: product?.seo?.keywords || []
      }
    });

    const [uploading, setUploading] = useState(false);
    const [currentFeature, setCurrentFeature] = useState('');
    const [currentTag, setCurrentTag] = useState('');

    const handleImageUpload = async (e, isGallery = false) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      setUploading(true);
      try {
        const uploadPromises = files.map(file => uploadAPI.uploadImage(file, 'products'));
        const responses = await Promise.all(uploadPromises);
        
        const imageUrls = responses.map(res => res.url);
        
        if (isGallery) {
          setFormData({
            ...formData,
            gallery: [...formData.gallery, ...imageUrls]
          });
        } else {
          setFormData({
            ...formData,
            images: [...formData.images, ...imageUrls.map(url => ({ url, isMain: formData.images.length === 0 }))]
          });
        }
        
        toast({
          title: "Success",
          description: `${files.length} image(s) uploaded successfully!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload images",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };

    const addFeature = () => {
      if (currentFeature.trim()) {
        setFormData({
          ...formData,
          features: [...formData.features, currentFeature.trim()]
        });
        setCurrentFeature('');
      }
    };

    const removeFeature = (index) => {
      setFormData({
        ...formData,
        features: formData.features.filter((_, i) => i !== index)
      });
    };

    const addTag = () => {
      if (currentTag.trim()) {
        setFormData({
          ...formData,
          tags: [...formData.tags, currentTag.trim()]
        });
        setCurrentTag('');
      }
    };

    const removeTag = (index) => {
      setFormData({
        ...formData,
        tags: formData.tags.filter((_, i) => i !== index)
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onCancel();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="series">Series</Label>
                <Select
                  value={formData.series}
                  onValueChange={(value) => setFormData({...formData, series: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select series" />
                  </SelectTrigger>
                  <SelectContent>
                    {series.map((ser) => (
                      <SelectItem key={ser._id} value={ser.name}>
                        {ser.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stock.quantity}
                  onChange={(e) => setFormData({
                    ...formData,
                    stock: { ...formData.stock, quantity: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                />
                <Label htmlFor="isNew">New Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isLimited"
                  checked={formData.isLimited}
                  onChange={(e) => setFormData({...formData, isLimited: e.target.checked})}
                />
                <Label htmlFor="isLimited">Limited Edition</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div>
              <Label htmlFor="mainImages">Main Product Images</Label>
              <Input
                id="mainImages"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, false)}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img.url} 
                        alt={`Product ${index + 1}`} 
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData({...formData, images: newImages});
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="gallery">Gallery Images</Label>
              <Input
                id="gallery"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, true)}
                disabled={uploading}
              />
              {formData.gallery.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        onClick={() => {
                          const newGallery = formData.gallery.filter((_, i) => i !== index);
                          setFormData({...formData, gallery: newGallery});
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div>
              <Label>Features</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Add a feature"
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seo.title}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, title: e.target.value }
                })}
                placeholder="SEO optimized title"
              />
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seo.description}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, description: e.target.value }
                })}
                rows={3}
                placeholder="Meta description for search engines"
              />
            </div>

            <div>
              <Label htmlFor="seoKeywords">SEO Keywords (comma-separated)</Label>
              <Input
                id="seoKeywords"
                value={formData.seo.keywords.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, keywords: e.target.value.split(',').map(k => k.trim()) }
                })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </form>
    );
  };

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    return (
      (filters.category === '' || product.category === filters.category) &&
      (filters.series === '' || product.series === filters.series) &&
      (filters.status === '' || 
        (filters.status === 'active' && product.isActive) ||
        (filters.status === 'inactive' && !product.isActive) ||
        (filters.status === 'featured' && product.isFeatured) ||
        (filters.status === 'new' && product.isNew) ||
        (filters.status === 'limited' && product.isLimited)
      ) &&
      (filters.search === '' || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    );
  });

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Management</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm 
                  onSubmit={handleAddProduct}
                  onCancel={() => {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({...filters, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.series}
              onValueChange={(value) => setFilters({...filters, series: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Series</SelectItem>
                {series.map((ser) => (
                  <SelectItem key={ser._id} value={ser.name}>
                    {ser.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilters({ category: '', series: '', status: '', search: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {product.images && product.images[0] && (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge variant="outline">{product.series}</Badge>
                      <span className="text-sm text-gray-500">
                        ₹{product.price}
                        {product.originalPrice && (
                          <span className="ml-2 line-through text-gray-400">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {product.stock?.quantity || 0} in stock
                        </span>
                      </div>
                      {product.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-500">
                            {product.rating.average} ({product.rating.count})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      {product.isNew && <Badge variant="secondary">New</Badge>}
                      {product.isLimited && <Badge variant="secondary">Limited</Badge>}
                      {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
                      {product.stock?.quantity <= product.stock?.threshold && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm 
                        product={product}
                        onSubmit={(data) => handleUpdateProduct(product._id, data)}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;