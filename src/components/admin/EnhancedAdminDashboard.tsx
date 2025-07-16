import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  IndianRupee,
  Eye,
  AlertCircle,
  Calendar,
  Star,
  MessageSquare,
  Settings,
  FileText,
  Upload,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminAPI } from '@/services/api';

// Import admin components
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CategorySeriesManagement from './CategorySeriesManagement';
import BlogManagement from './BlogManagement';
import HomepageContentManagement from './HomepageContentManagement';
import BannerManagement from './BannerManagement';

const EnhancedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    salesData: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, salesResponse, productsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getSalesAnalytics({ period: 'last_30_days' }),
        adminAPI.getProductAnalytics()
      ]);

      setDashboardStats({
        ...statsResponse,
        salesData: salesResponse.revenue || [],
        topProducts: productsResponse.topProducts || []
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{dashboardStats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardStats.totalOrders}
                </p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardStats.totalProducts}
                </p>
                <p className="text-xs text-gray-500">Active products</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-orange-600">
                  {dashboardStats.totalUsers}
                </p>
                <p className="text-xs text-gray-500">Registered users</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardStats.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardStats.topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {dashboardStats.topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardStats.recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{order.total}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QuickActions = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setActiveTab('products')}
          className="h-20 flex-col space-y-2"
        >
          <Package className="h-6 w-6" />
          <span>Add Product</span>
        </Button>
        <Button
          onClick={() => setActiveTab('orders')}
          className="h-20 flex-col space-y-2"
          variant="outline"
        >
          <ShoppingCart className="h-6 w-6" />
          <span>View Orders</span>
        </Button>
        <Button
          onClick={() => setActiveTab('categories')}
          className="h-20 flex-col space-y-2"
          variant="outline"
        >
          <Settings className="h-6 w-6" />
          <span>Manage Categories</span>
        </Button>
        <Button
          onClick={() => setActiveTab('blog')}
          className="h-20 flex-col space-y-2"
          variant="outline"
        >
          <FileText className="h-6 w-6" />
          <span>Write Blog</span>
        </Button>
      </div>
    </div>
  );

  const SystemHealth = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium">Server Status</span>
            <Badge variant="default">Online</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium">Database</span>
            <Badge variant="default">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium">Last Backup</span>
            <Badge variant="secondary">2 hours ago</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadDashboardData}>
            <Download className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SystemHealth />
          <QuickActions />
          <OverviewTab />
        </TabsContent>

        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategorySeriesManagement />
        </TabsContent>

        <TabsContent value="blog">
          <BlogManagement />
        </TabsContent>

        <TabsContent value="homepage">
          <HomepageContentManagement />
        </TabsContent>

        <TabsContent value="banners">
          <BannerManagement />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">General Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Site Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded" 
                        defaultValue="Taksha Veda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Email</label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded" 
                        defaultValue="info@takshaveda.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Payment Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Currency</label>
                      <select className="w-full p-2 border rounded">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border rounded" 
                        defaultValue="18"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Shipping Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Free Shipping Threshold</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border rounded" 
                        defaultValue="999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Standard Shipping Cost</label>
                      <input 
                        type="number" 
                        className="w-full p-2 border rounded" 
                        defaultValue="99"
                      />
                    </div>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminDashboard;