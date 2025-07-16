
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BannerManagement = () => {
    const { toast } = useToast();
    const [banners, setBanners] = useState([
        {
            id: 1,
            title: 'Main Hero Banner',
            subtitle: 'Premium Wooden Crafts',
            description: 'Discover unique wooden creations',
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
            isActive: true,
            position: 'hero'
        }
    ]);

    const [newBanner, setNewBanner] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        position: 'hero'
    });

    const handleAddBanner = () => {
        if (!newBanner.title || !newBanner.image) {
            toast({
                title: "Error",
                description: "Please fill in title and image URL.",
                variant: "destructive"
            });
            return;
        }

        const banner = {
            id: Date.now(),
            ...newBanner,
            isActive: false
        };

        setBanners(prev => [...prev, banner]);
        setNewBanner({ title: '', subtitle: '', description: '', image: '', position: 'hero' });

        toast({
            title: "Banner Added",
            description: "New banner has been created successfully.",
        });
    };

    const toggleBannerStatus = (id: number) => {
        setBanners(prev => prev.map(banner =>
            banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
        ));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Banner</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Banner Title</label>
                            <Input
                                value={newBanner.title}
                                onChange={(e) => setNewBanner(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter banner title"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Subtitle</label>
                            <Input
                                value={newBanner.subtitle}
                                onChange={(e) => setNewBanner(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Enter subtitle"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                                value={newBanner.description}
                                onChange={(e) => setNewBanner(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Banner description..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Image URL</label>
                            <Input
                                value={newBanner.image}
                                onChange={(e) => setNewBanner(prev => ({ ...prev, image: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Position</label>
                            <select
                                value={newBanner.position}
                                onChange={(e) => setNewBanner(prev => ({ ...prev, position: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
                            >
                                <option value="hero">Main Hero</option>
                                <option value="secondary">Secondary Banner</option>
                                <option value="promotional">Promotional</option>
                            </select>
                        </div>

                        <Button onClick={handleAddBanner} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Banner
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Existing Banners</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {banners.map((banner) => (
                                <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <img src={banner.image} alt={banner.title} className="w-16 h-12 object-cover rounded" />
                                        <div>
                                            <h3 className="font-semibold">{banner.title}</h3>
                                            <p className="text-sm text-muted-foreground">{banner.position}</p>
                                            <Badge variant={banner.isActive ? "default" : "secondary"}>
                                                {banner.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleBannerStatus(banner.id)}
                                            className={banner.isActive ? "text-red-600" : "text-green-600"}
                                        >
                                            {banner.isActive ? "Deactivate" : "Activate"}
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

export default BannerManagement;
