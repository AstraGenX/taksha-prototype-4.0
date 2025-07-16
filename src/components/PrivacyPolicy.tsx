
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy = ({ isOpen, onClose }: PrivacyPolicyProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-walnut-800">Privacy Policy</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Information Sharing</h3>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our website and conducting our business.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Data Security</h3>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Contact Information</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at taksha15.woodendecor@gmail.com or call us at +91 79069 64311.</p>
          </div>

          <div>
            <h3 className="font-semibold text-walnut-800 mb-2">Updates to Privacy Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          </div>

          <p className="text-xs text-gray-500 mt-6">Last Updated: December 2024</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;
