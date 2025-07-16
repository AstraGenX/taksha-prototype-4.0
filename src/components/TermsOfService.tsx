
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService = ({ isOpen, onClose }: TermsOfServiceProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-walnut-800">Terms of Service</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Acceptance of Terms</h3>
            <p>By accessing and using Taksha's website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Products and Services</h3>
            <p>Taksha specializes in handcrafted wooden products including corporate gifting kits, customized giftings, home decors, and personal giftings. All products are made with traditional craftsmanship and attention to detail.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Orders and Payment</h3>
            <p>By placing an order, you agree to provide accurate and complete information. Payment must be made in full before shipment. We accept various payment methods as indicated on our website.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Shipping and Delivery</h3>
            <p>We strive to deliver products within the estimated timeframe. Delivery times may vary based on location and product availability. Custom orders may require additional processing time.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Returns and Exchanges</h3>
            <p>Due to the handcrafted nature of our products, returns are accepted only for damaged or defective items. Please contact us within 7 days of receipt for return authorization.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Intellectual Property</h3>
            <p>All content on this website, including designs, logos, and product descriptions, is the property of Taksha and is protected by intellectual property laws.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Limitation of Liability</h3>
            <p>Taksha shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Contact Information</h3>
            <p>For any questions regarding these terms, please contact us at taksha15.woodendecor@gmail.com or call +91 79069 64311.</p>
          </div>

          <p className="text-xs text-gray-500 mt-6">Last Updated: December 2024</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfService;
