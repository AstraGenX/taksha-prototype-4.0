import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Product {
    id: string;
    name: string;
    category: string;
    series: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out-of-stock';
    image: string;
    description: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
    }>;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    type: 'individual' | 'corporate';
    totalOrders: number;
    totalSpent: number;
    createdAt: string;
}

export interface SiteConfig {
    siteName: string;
    tagline: string;
    heroTitle: string;
    heroSubtitle: string;
    contactEmail: string;
    phone: string;
    address: string;
    maintenanceMode: boolean;
    updatedAt?: string;
}

export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    image: string;
    tags: string[];
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt?: string;
}

export const useAdminData = () => {
    const { toast } = useToast();

    // Load data from localStorage or use defaults
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('admin_products');
        return saved ? JSON.parse(saved) : [
            {
                id: '1',
                name: 'Executive Desk Set',
                category: 'corporate',
                series: 'TakshaVerse',
                price: 4999,
                stock: 25,
                status: 'active' as const,
                image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&q=80',
                description: 'Premium wooden desk organizer set',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Mandala Wall Art',
                category: 'home',
                series: 'Ark Series',
                price: 3299,
                stock: 0,
                status: 'out-of-stock' as const,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&q=80',
                description: 'Handcrafted mandala design',
                createdAt: new Date().toISOString()
            }
        ];
    });

    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('admin_orders');
        return saved ? JSON.parse(saved) : [
            {
                id: 'ORD001',
                customerId: 'USR001',
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                total: 4999,
                status: 'pending' as const,
                items: [{ productId: '1', name: 'Executive Desk Set', quantity: 1, price: 4999 }],
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Delhi',
                    state: 'Delhi',
                    zipCode: '110001'
                },
                createdAt: new Date().toISOString()
            }
        ];
    });

    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('admin_users');
        return saved ? JSON.parse(saved) : [
            {
                id: 'USR001',
                name: 'John Doe',
                email: 'john@example.com',
                type: 'individual' as const,
                totalOrders: 1,
                totalSpent: 4999,
                createdAt: new Date().toISOString()
            }
        ];
    });

    const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
        const saved = localStorage.getItem('admin_site_config');
        return saved ? JSON.parse(saved) : {
            siteName: 'Taksha',
            tagline: 'Crafting Meaningful Connections',
            heroTitle: 'Where Tradition Meets Innovation',
            heroSubtitle: 'Yatra paramparā navācāreṇa milati',
            contactEmail: 'taksha15.woodendecor@gmail.com',
            phone: '+91 79069 64311',
            address: 'Haridwar, India',
            maintenanceMode: false
        };
    });

    const [blogs, setBlogs] = useState<Blog[]>(() => {
        const saved = localStorage.getItem('admin_blogs');
        return saved ? JSON.parse(saved) : [
            {
                id: '1',
                title: 'The Art of Traditional Woodworking',
                excerpt: 'Exploring the ancient techniques that define our craft',
                content: 'Traditional woodworking is more than just a craft; it\'s a bridge between generations...',
                author: 'Taksha Team',
                category: 'craftsmanship',
                image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
                tags: ['woodworking', 'traditional', 'craftsmanship'],
                status: 'published' as const,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Sustainability in Modern Crafting',
                excerpt: 'How we maintain eco-friendly practices in our work',
                content: 'Sustainability is at the heart of everything we do...',
                author: 'Taksha Team',
                category: 'culture',
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
                tags: ['sustainability', 'eco-friendly', 'environment'],
                status: 'draft' as const,
                createdAt: new Date().toISOString()
            }
        ];
    });

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('admin_products', JSON.stringify(products));
        // Sync with main website products
        localStorage.setItem('products', JSON.stringify(products.filter(p => p.status === 'active')));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('admin_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('admin_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('admin_site_config', JSON.stringify(siteConfig));
        // Sync with main website config
        localStorage.setItem('site_config', JSON.stringify(siteConfig));
    }, [siteConfig]);

    useEffect(() => {
        localStorage.setItem('admin_blogs', JSON.stringify(blogs));
        // Sync published blogs with main website
        localStorage.setItem('blogs', JSON.stringify(blogs.filter(b => b.status === 'published')));
    }, [blogs]);

    // Product management
    const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
        const newProduct: Product = {
            ...productData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        setProducts(prev => [...prev, newProduct]);
        toast({
            title: "Success",
            description: "Product added successfully!",
        });
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(product =>
            product.id === id
                ? { ...product, ...updates, updatedAt: new Date().toISOString() }
                : product
        ));
        toast({
            title: "Success",
            description: "Product updated successfully!",
        });
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({
            title: "Success",
            description: "Product deleted successfully!",
        });
    };

    // Order management
    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status, updatedAt: new Date().toISOString() }
                : order
        ));
        toast({
            title: "Success",
            description: `Order status updated to ${status}`,
        });
    };

    const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setOrders(prev => [...prev, newOrder]);
    };

    // Blog management
    const addBlog = (blogData: Omit<Blog, 'id' | 'createdAt'>) => {
        const newBlog: Blog = {
            ...blogData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        setBlogs(prev => [...prev, newBlog]);
        toast({
            title: "Success",
            description: "Blog post created successfully!",
        });
    };

    const updateBlog = (id: string, updates: Partial<Blog>) => {
        setBlogs(prev => prev.map(blog =>
            blog.id === id
                ? { ...blog, ...updates, updatedAt: new Date().toISOString() }
                : blog
        ));
        toast({
            title: "Success",
            description: "Blog post updated successfully!",
        });
    };

    const deleteBlog = (id: string) => {
        setBlogs(prev => prev.filter(b => b.id !== id));
        toast({
            title: "Success",
            description: "Blog post deleted successfully!",
        });
    };

    // Site configuration
    const updateSiteConfig = (config: SiteConfig) => {
        setSiteConfig({ ...config, updatedAt: new Date().toISOString() });
        toast({
            title: "Success",
            description: "Site configuration updated successfully!",
        });
    };

    // Analytics
    const getAnalytics = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const lowStockProducts = products.filter(product => product.stock < 10).length;
        const activeProducts = products.filter(product => product.status === 'active').length;
        const publishedBlogs = blogs.filter(blog => blog.status === 'published').length;
        const draftBlogs = blogs.filter(blog => blog.status === 'draft').length;
        const recentOrders = orders.slice(0, 5).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
            totalRevenue,
            totalOrders: orders.length,
            pendingOrders,
            totalProducts: products.length,
            activeProducts,
            totalUsers: users.length,
            lowStockProducts,
            publishedBlogs,
            draftBlogs,
            recentOrders
        };
    };

    return {
        products,
        orders,
        users,
        siteConfig,
        blogs,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addOrder,
        updateSiteConfig,
        addBlog,
        updateBlog,
        deleteBlog,
        getAnalytics
    };
};
