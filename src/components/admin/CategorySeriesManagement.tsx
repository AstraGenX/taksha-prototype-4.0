
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Image as ImageIcon, Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminAPI, uploadAPI } from '@/services/api';

const CategorySeriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSeries, setEditingSeries] = useState(null);
  const { toast } = useToast();

  // Load categories and series from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesResponse, seriesResponse] = await Promise.all([
        adminAPI.getCategories(),
        adminAPI.getSeries()
      ]);
      
      setCategories(categoriesResponse.categories || []);
      setSeries(seriesResponse.series || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load categories and series data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await adminAPI.createCategory(categoryData);
      setCategories([...categories, response.category]);
      toast({
        title: "Success",
        description: "Category added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (id, updates) => {
    try {
      const response = await adminAPI.updateCategory(id, updates);
      setCategories(categories.map(cat => 
        cat._id === id ? response.category : cat
      ));
      toast({
        title: "Success",
        description: "Category updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await adminAPI.deleteCategory(id);
      setCategories(categories.filter(cat => cat._id !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleAddSeries = async (seriesData) => {
    try {
      const response = await adminAPI.createSeries(seriesData);
      setSeries([...series, response.series]);
      toast({
        title: "Success",
        description: "Series added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add series",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSeries = async (id, updates) => {
    try {
      const response = await adminAPI.updateSeries(id, updates);
      setSeries(series.map(ser => 
        ser._id === id ? response.series : ser
      ));
      toast({
        title: "Success",
        description: "Series updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update series",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSeries = async (id) => {
    try {
      await adminAPI.deleteSeries(id);
      setSeries(series.filter(ser => ser._id !== id));
      toast({
        title: "Success",
        description: "Series deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete series",
        variant: "destructive",
      });
    }
  };

  const CategoryForm = ({ category, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      image: category?.image || '',
      icon: category?.icon || '',
      color: category?.color || '#000000',
      isActive: category?.isActive ?? true,
      sortOrder: category?.sortOrder || 0,
      seoTitle: category?.seoTitle || '',
      seoDescription: category?.seoDescription || '',
      seoKeywords: category?.seoKeywords || ''
    });

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
        const response = await uploadAPI.uploadImage(file, 'categories');
        setFormData({...formData, image: response.url});
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onCancel();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Category Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase()})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="color">Category Color</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="icon">Icon (Font Awesome class)</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({...formData, icon: e.target.value})}
            placeholder="e.g., fas fa-gift"
          />
        </div>

        <div>
          <Label htmlFor="image">Category Image</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Category" className="w-20 h-20 object-cover rounded" />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="active">Status</Label>
          <Select
            value={formData.isActive ? 'active' : 'inactive'}
            onValueChange={(value) => setFormData({...formData, isActive: value === 'active'})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            <Save className="h-4 w-4 mr-2" />
            Save Category
          </Button>
        </div>
      </form>
    );
  };

  const SeriesForm = ({ series, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: series?.name || '',
      description: series?.description || '',
      image: series?.image || '',
      color: series?.color || '#000000',
      isActive: series?.isActive ?? true,
      sortOrder: series?.sortOrder || 0,
      isLimited: series?.isLimited || false,
      launchDate: series?.launchDate || '',
      endDate: series?.endDate || ''
    });

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      try {
        const response = await uploadAPI.uploadImage(file, 'series');
        setFormData({...formData, image: response.url});
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      onCancel();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Series Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="color">Series Color</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="image">Series Image</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Series" className="w-20 h-20 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="active">Status</Label>
            <Select
              value={formData.isActive ? 'active' : 'inactive'}
              onValueChange={(value) => setFormData({...formData, isActive: value === 'active'})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        {formData.isLimited && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="launchDate">Launch Date</Label>
              <Input
                id="launchDate"
                type="date"
                value={formData.launchDate}
                onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            <Save className="h-4 w-4 mr-2" />
            Save Series
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Categories Management</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <CategoryForm 
                  onSubmit={handleAddCategory}
                  onCancel={() => {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center">
                      {category.name}
                      {category.color && (
                        <span 
                          className="ml-2 w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{category.productCount || 0} products</span>
                      <span>Order: {category.sortOrder}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <CategoryForm 
                        category={category}
                        onSubmit={(data) => handleUpdateCategory(category._id, data)}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Series Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Series Management</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Series
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Series</DialogTitle>
                </DialogHeader>
                <SeriesForm 
                  onSubmit={handleAddSeries}
                  onCancel={() => {}}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {series.map((ser) => (
              <div key={ser._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {ser.image && (
                    <img 
                      src={ser.image} 
                      alt={ser.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center">
                      {ser.name}
                      {ser.color && (
                        <span 
                          className="ml-2 w-4 h-4 rounded-full"
                          style={{ backgroundColor: ser.color }}
                        />
                      )}
                      {ser.isLimited && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          Limited
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{ser.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{ser.productCount || 0} products</span>
                      <span>Order: {ser.sortOrder}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={ser.isActive ? "default" : "secondary"}>
                    {ser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Series</DialogTitle>
                      </DialogHeader>
                      <SeriesForm 
                        series={ser}
                        onSubmit={(data) => handleUpdateSeries(ser._id, data)}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteSeries(ser._id)}
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

export default CategorySeriesManagement;
