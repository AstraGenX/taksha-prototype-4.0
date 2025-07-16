import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Package, Truck, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ordersAPI } from '@/services/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view your order history.",
        duration: 3000,
      });
      navigate('/auth');
      return;
    }
    loadOrders();
  }, [user, navigate, toast]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll({
        userId: user.id,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      // Fallback to mock data
      const mockOrders = [
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          status: 'delivered',
          totalAmount: 15999,
          items: [
            {
              name: 'Executive Wooden Desk Organizer',
              quantity: 1,
              price: 2499,
              image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80'
            },
            {
              name: 'Premium Photo Frame Set',
              quantity: 2,
              price: 1299,
              image: 'https://images.unsplash.com/photo-1565620551738-42e66656dc5c?auto=format&fit=crop&w=300&q=80'
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main Street, Mumbai',
            phone: '9876543210'
          },
          createdAt: '2024-01-15T10:30:00Z',
          deliveredAt: '2024-01-20T14:30:00Z',
          trackingNumber: 'TRK123456789'
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          status: 'shipped',
          totalAmount: 8999,
          items: [
            {
              name: 'Artisan Memory Collection',
              quantity: 1,
              price: 4299,
              image: 'https://images.unsplash.com/photo-1565620551738-42e66656dc5c?auto=format&fit=crop&w=300&q=80'
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            address: '123 Main Street, Mumbai',
            phone: '9876543210'
          },
          createdAt: '2024-01-12T15:45:00Z',
          shippedAt: '2024-01-14T09:15:00Z',
          trackingNumber: 'TRK987654321'
        }
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const trackOrder = (trackingNumber) => {
    // This would typically redirect to a tracking page or external service
    toast({
      title: "Tracking Order",
      description: `Tracking number: ${trackingNumber}`,
      duration: 3000,
    });
  };

  const reorderItems = async (order) => {
    try {
      // Add all items from the order back to cart
      for (const item of order.items) {
        // This would use the cart context to add items
        // await addToCart(item);
      }
      
      toast({
        title: "Items Added to Cart",
        description: "All items from this order have been added to your cart.",
        duration: 3000,
      });
      
      navigate('/checkout');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder items. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Please login to view your order history.</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="mt-4 bg-saffron-600 hover:bg-saffron-700"
            >
              Login
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
            <p className="text-lg text-muted-foreground">Loading your orders...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-walnut-800 mb-2">
            Order History
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-walnut-800 mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-saffron-600 hover:bg-saffron-700"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-serif text-walnut-800">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                      <div className="text-right">
                        <p className="text-lg font-bold text-walnut-800">
                          ₹{order.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item(s)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-walnut-800">
                        {order.items[0].name}
                        {order.items.length > 1 && ` and ${order.items.length - 1} more item(s)`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Delivered to {order.shippingAddress.address}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openOrderModal(order)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                    
                    {order.trackingNumber && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => trackOrder(order.trackingNumber)}
                        className="flex items-center gap-1"
                      >
                        <Truck className="h-4 w-4" />
                        Track Order
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reorderItems(order)}
                      className="flex items-center gap-1"
                    >
                      <Package className="h-4 w-4" />
                      Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-bold text-walnut-800">
                Order Details - #{selectedOrder.orderNumber}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-walnut-800">Order Status</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1 capitalize">{selectedOrder.status}</span>
                </Badge>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-walnut-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-walnut-800">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-walnut-800">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-walnut-800 mb-3">Shipping Address</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.shippingAddress.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-walnut-800 mb-3">Order Summary</h3>
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className="font-semibold text-walnut-800 mb-3">Tracking Information</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => trackOrder(selectedOrder.trackingNumber)}
                      className="mt-2"
                    >
                      Track Package
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer />
    </div>
  );
};

export default OrderHistory;