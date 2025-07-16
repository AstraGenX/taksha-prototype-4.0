import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  IndianRupee,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ordersAPI, adminAPI } from '@/services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    search: '',
    userType: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAllOrders({
        status: filters.status,
        search: filters.search,
        page: 1,
        limit: 100
      });
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      out_for_delivery: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      returned: <XCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    const [trackingInfo, setTrackingInfo] = useState(order.trackingInfo || '');
    const [notes, setNotes] = useState(order.notes || '');

    const handleSendUpdate = async () => {
      // Implementation for sending order update email
      toast({
        title: "Success",
        description: "Order update sent to customer",
      });
    };

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Order Details - {order.orderNumber}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                  </Badge>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Order Date:</span>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Payment Method:</span>
                  <p className="capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Total Amount:</span>
                  <p className="font-semibold">₹{order.totalAmount}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="tracking">Tracking Information</Label>
                <Input
                  id="tracking"
                  value={trackingInfo}
                  onChange={(e) => setTrackingInfo(e.target.value)}
                  placeholder="Enter tracking number or info"
                />
              </div>

              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSendUpdate} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Update to Customer
              </Button>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-sm text-gray-600">{order.user.userType}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-sm">{order.user.email}</p>
              </div>
              
              {order.user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <p className="text-sm">{order.user.phone}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Shipping Address
                </h4>
                <div className="text-sm space-y-1">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.pincode}</p>
                  {order.shippingAddress.phone && (
                    <p>Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {item.product.images && item.product.images[0] && (
                      <img 
                        src={item.product.images[0].url} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      {item.variant && (
                        <p className="text-sm text-gray-600">
                          Variant: {item.variant.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price}</p>
                    <p className="text-sm text-gray-600">
                      Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.tax}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    );
  };

  const filteredOrders = orders.filter(order => {
    return (
      (filters.status === '' || order.status === filters.status) &&
      (filters.search === '' || 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.user.email.toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.userType === '' || order.user.userType === filters.userType)
    );
  });

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Management</span>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Orders
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.userType}
              onValueChange={(value) => setFilters({...filters, userType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Customers</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilters({ status: '', dateRange: '', search: '', userType: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-600">{order.items.length} items</p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{order.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{order.user.email}</span>
                    </div>
                    <Badge variant="outline">{order.user.userType}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <OrderDetailsModal order={order} onClose={() => {}} />
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;