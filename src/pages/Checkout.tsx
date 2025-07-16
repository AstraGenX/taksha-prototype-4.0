import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ordersAPI, userAPI } from '@/services/api';
import Navigation from '@/components/Navigation';
import { Address } from '@/components/UserProfile';
import { MapPin, CreditCard, Truck, CheckCircle, Loader2, Package } from 'lucide-react';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card'
  });
  const { items, getTotalPrice, clearCart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        duration: 3000,
      });
      navigate('/auth?redirect=checkout');
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items to proceed with checkout.",
        duration: 3000,
      });
      navigate('/products');
    }
  }, [items, orderPlaced, navigate, toast]);

  // Load saved addresses
  useEffect(() => {
    if (user) {
      loadSavedAddresses();
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const loadSavedAddresses = async () => {
    try {
      const response = await userAPI.getAddresses();
      setSavedAddresses(response.addresses || []);
      
      // Pre-select default address if available
      const defaultAddress = response.addresses?.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        fillFormWithAddress(defaultAddress);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      // Fallback to localStorage
      const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        setSavedAddresses(addresses);
        
        const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          fillFormWithAddress(defaultAddress);
        }
      }
    }
  };

  const fillFormWithAddress = (address: Address) => {
    setFormData(prev => ({
      ...prev,
      name: address.name,
      phone: address.phone,
      address: `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}`,
      city: address.city,
      pincode: address.pincode,
      email: prev.email || user?.email || ''
    }));
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
    fillFormWithAddress(address);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFormData = () => {
    const { name, email, phone, address, city, pincode } = formData;
    
    if (!name || !email || !phone || !address || !city || !pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateFormData()) return;

    setLoading(true);
    
    try {
      // Create order data
      const orderData = {
        items: items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: getTotalPrice(),
        userEmail: formData.email
      };

      // Place order through API
      const response = await ordersAPI.create(orderData);
      
      if (response.success) {
        setOrderId(response.order.orderNumber || response.order._id);
        setOrderPlaced(true);
        
        // Clear cart after successful order
        await clearCart();
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${response.order.orderNumber || response.order._id} has been placed.`,
          duration: 5000,
        });
        
        setStep(4); // Move to success step
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            
            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Saved Addresses</h4>
                {savedAddresses.map((address) => (
                  <Card 
                    key={address.id} 
                    className={`cursor-pointer border-2 ${
                      selectedAddressId === address.id ? 'border-saffron-500' : 'border-gray-200'
                    }`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.pincode}
                          </p>
                        </div>
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* New Address Form */}
            <div className="space-y-4">
              <h4 className="font-medium">Enter New Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>
            
            <Button 
              onClick={() => setStep(2)}
              className="w-full bg-saffron-600 hover:bg-saffron-700 text-white"
            >
              Continue to Payment
            </Button>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <Label htmlFor="card" className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <Label htmlFor="cod" className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white"
              >
                Review Order
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image || 'https://via.placeholder.com/60x60'} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount:</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Shipping Address</h4>
              <p>{formData.name}</p>
              <p>{formData.phone}</p>
              <p>{formData.address}</p>
              <p>{formData.city}, {formData.pincode}</p>
            </div>
            
            {/* Payment Method */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Method</h4>
              <p>{formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h3>
            <p className="text-gray-600">
              Your order #{orderId} has been placed successfully. 
              You will receive a confirmation email shortly.
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={() => navigate('/products')}
                variant="outline"
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-walnut-800 mb-2">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order securely
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step ? 'bg-saffron-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div className={`w-16 h-0.5 ${
                      stepNum < step ? 'bg-saffron-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {step === 1 && 'Shipping Information'}
                    {step === 2 && 'Payment Method'}
                    {step === 3 && 'Order Review'}
                    {step === 4 && 'Order Confirmation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderStepContent()}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            {step < 4 && (
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total:</span>
                          <span>₹{getTotalPrice().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;