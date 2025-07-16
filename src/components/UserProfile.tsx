import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, LogOut, Settings, MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (user) {
      const savedAddresses = localStorage.getItem(`addresses_${user.id}`);
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && addresses.length > 0) {
      localStorage.setItem(`addresses_${user.id}`, JSON.stringify(addresses));
    }
  }, [addresses, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddress = () => {
    if (
      newAddress.name &&
      newAddress.phone &&
      newAddress.addressLine1 &&
      newAddress.city &&
      newAddress.state &&
      newAddress.pincode
    ) {
      const address: Address = {
        id: Date.now().toString(),
        ...newAddress,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, address]);
      setNewAddress({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      });
      setIsAddressDialogOpen(false);
    }
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePicture || ''} alt={user.name} />
              <AvatarFallback className="bg-saffron-100 text-saffron-700">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Address Management Section */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Addresses</span>
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                      Add a new delivery address to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Textarea
                        id="address1"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        placeholder="House/Flat No., Building Name, Street"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                      <Input
                        id="address2"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        placeholder="Landmark, Area"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="State"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddAddress} className="w-full">
                      Add Address
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </DropdownMenuLabel>

          {addresses.length > 0 ? (
            <div className="max-h-40 overflow-y-auto">
              {addresses.map((address) => (
                <DropdownMenuItem
                  key={address.id}
                  className="flex-col items-start p-3 cursor-pointer group"
                  onClick={() => setDefaultAddress(address.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-3 w-3" />
                      <span className="text-xs font-medium">{address.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {address.isDefault && (
                        <span className="text-xs bg-primary text-primary-foreground px-1 rounded">
                          Default
                        </span>
                      )}
                      <Trash2
                        className="h-3 w-3 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent setting default when deleting
                          handleDeleteAddress(address.id);
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 pl-5">
                    {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              <MapPin className="mr-2 h-3 w-3" />
              No addresses added
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserProfile;
