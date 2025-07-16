import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, MessageSquare, Package, Handshake } from 'lucide-react';

const GetInTouch = () => {

  const [activeTab, setActiveTab] = useState('feedback');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // ✅ Smooth scroll animation
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
    console.log('Selected Rating:', selectedRating);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-walnut-800 via-mahogany-700 to-walnut-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-lg font-serif italic text-saffron-300 mb-4">
            Sahakāraḥ janayati kalām
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Let's Co-Create Something Beautiful
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Collaboration creates art
          </p>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-4xl mx-auto">

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8">
              <div className="flex flex-wrap justify-center bg-walnut-100 rounded-lg p-1 gap-2">
                <Button
                  variant={activeTab === 'feedback' ? 'default' : 'ghost'}
                  className={`flex items-center space-x-2 ${activeTab === 'feedback' ? 'bg-saffron-600 hover:bg-saffron-700 text-white' : 'text-walnut-700 hover:bg-walnut-200'}`}
                  onClick={() => setActiveTab('feedback')}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Customer Feedback</span>
                </Button>
                <Button
                  variant={activeTab === 'order' ? 'default' : 'ghost'}
                  className={`flex items-center space-x-2 ${activeTab === 'order' ? 'bg-saffron-600 hover:bg-saffron-700 text-white' : 'text-walnut-700 hover:bg-walnut-200'}`}
                  onClick={() => setActiveTab('order')}
                >
                  <Package className="h-4 w-4" />
                  <span>Order Enquiry</span>
                </Button>
                <Button
                  variant={activeTab === 'collaboration' ? 'default' : 'ghost'}
                  className={`flex items-center space-x-2 ${activeTab === 'collaboration' ? 'bg-saffron-600 hover:bg-saffron-700 text-white' : 'text-walnut-700 hover:bg-walnut-200'}`}
                  onClick={() => setActiveTab('collaboration')}
                >
                  <Handshake className="h-4 w-4" />
                  <span>Collaboration Request</span>
                </Button>
              </div>
            </div>

            {/* Form Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">

                {/* Feedback Form */}
                {activeTab === 'feedback' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-saffron-600 mr-3" />
                        <h2 className="text-2xl font-serif font-bold text-walnut-800">
                          Share Your Experience
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Your feedback helps us craft better experiences
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="feedback-name">Name</Label>
                        <Input id="feedback-name" placeholder="Your full name" className="w-full" />
                      </div>
                      <div>
                        <Label htmlFor="feedback-email">Email</Label>
                        <Input id="feedback-email" type="email" placeholder="your.email@example.com" className="w-full" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purchase-experience">Purchase Experience (Optional)</Label>
                      <Input id="purchase-experience" placeholder="Which product did you purchase?" className="w-full" />
                    </div>

                    <div>
                      <Label>Overall Rating</Label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            type="button"
                            onClick={() => setSelectedRating(rating)}
                            variant={selectedRating === rating ? 'default' : 'outline'}
                            size="sm"
                            className={`w-10 h-10 rounded-full ${selectedRating === rating ? 'bg-saffron-600 text-white' : 'hover:bg-saffron-100'
                              }`}
                          >
                            {rating}⭐
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="feedback-message">Your Feedback</Label>
                      <Textarea
                        id="feedback-message"
                        placeholder="Tell us about your experience..."
                        className="min-h-[120px] w-full"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-saffron-600 hover:bg-saffron-700"
                    >
                      Submit Feedback
                    </Button>
                  </form>
                )}

                {/* Order Enquiry Form */}
                {activeTab === 'order' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-saffron-600 mr-3" />
                        <h2 className="text-2xl font-serif font-bold text-walnut-800">
                          Order Enquiry
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        Let us help you find the perfect products
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="order-name">Full Name</Label>
                        <Input id="order-name" placeholder="Your full name" />
                      </div>
                      <div>
                        <Label htmlFor="order-email">Email</Label>
                        <Input id="order-email" type="email" placeholder="your.email@example.com" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company-name">Company Name (Optional)</Label>
                        <Input id="company-name" placeholder="Your company name" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+91 79069 64311" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-interest">Interested Product/Category</Label>
                        <select id="product-interest" className="w-full px-3 py-2 border border-input rounded-md">
                          <option value="">Select category</option>
                          <option value="corporate">Corporate Gifting</option>
                          <option value="custom">Customized Gifting</option>
                          <option value="home">Home Decor</option>
                          <option value="personal">Personal Gifting</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="quantity">Estimated Quantity</Label>
                        <Input id="quantity" placeholder="e.g., 50 pieces" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timeline">Preferred Delivery Timeline</Label>
                      <Input id="timeline" placeholder="e.g., 2 weeks, by festival, urgent" />
                    </div>

                    <div>
                      <Label htmlFor="order-message">Additional Requirements</Label>
                      <Textarea
                        id="order-message"
                        placeholder="Any specific requirements, customization needs, or questions..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reference-file">Reference Material (Optional)</Label>
                      <Input id="reference-file" type="file" accept=".pdf,.jpg,.png,.doc,.docx" />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload logos, mockups, or reference images
                      </p>
                    </div>

                    <Button type="submit" className="w-full bg-saffron-600 hover:bg-saffron-700">
                      Submit Enquiry
                    </Button>
                  </form>
                )}

                {/* Collaboration Form */}
                {activeTab === 'collaboration' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <Handshake className="h-8 w-8 text-saffron-600 mr-3" />
                        <h2 className="text-2xl font-serif font-bold text-walnut-800">
                          Collaboration Request
                        </h2>
                      </div>
                      <p className="text-muted-foreground italic">
                        Yatra saṅgatiḥ tatra kalā - Where there is unity, there is art
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="collab-name">Name</Label>
                        <Input id="collab-name" placeholder="Your full name" />
                      </div>
                      <div>
                        <Label htmlFor="collab-email">Email</Label>
                        <Input id="collab-email" type="email" placeholder="your.email@example.com" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="organization">Organization/Company</Label>
                        <Input id="organization" placeholder="Your organization name" />
                      </div>
                      <div>
                        <Label htmlFor="collaboration-type">Collaboration Type</Label>
                        <select id="collaboration-type" className="w-full px-3 py-2 border border-input rounded-md">
                          <option value="">Select type</option>
                          <option value="design">Design Partnership</option>
                          <option value="vendor">Vendor Collaboration</option>
                          <option value="institution">Institutional Partnership</option>
                          <option value="influencer">Content Creation</option>
                          <option value="exhibition">Exhibition/Event</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="portfolio-link">Portfolio/Social Media Links</Label>
                      <Input id="portfolio-link" placeholder="Website, Instagram, LinkedIn, etc." />
                    </div>

                    <div>
                      <Label htmlFor="collaboration-message">Collaboration Proposal</Label>
                      <Textarea
                        id="collaboration-message"
                        placeholder="Tell us about your collaboration idea, goals, and how we can work together..."
                        className="min-h-[150px]"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-saffron-600 hover:bg-saffron-700">
                      Submit Collaboration Request
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-16 bg-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-walnut-800 mb-4">
              Get In Touch Directly
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover-scale h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <Phone className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Phone</h3>
                <p className="text-muted-foreground">+91 79069 64311</p>
                <p className="text-muted-foreground">+91 90076 30516</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <Mail className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">taksha15.woodendecor@gmail.com</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <MapPin className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Address</h3>
                <p className="text-muted-foreground">Haridwar, India</p>
              </CardContent>
            </Card>

            <Card className="text-center hover-scale h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <Clock className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Hours</h3>
                <p className="text-muted-foreground">24 x 7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-walnut-100 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-walnut-200 to-walnut-300"></div>
              <div className="relative z-10 text-center">
                <MapPin className="h-12 w-12 text-walnut-600 mx-auto mb-4" />
                <p className="text-walnut-700 font-medium text-lg mb-2">Interactive Map</p>
                <Button
                  className="bg-saffron-600 hover:bg-saffron-700"
                  onClick={() => window.open('https://maps.google.com/maps?q=Haridwar,+India', '_blank')}
                >
                  View on Google Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-walnut-800 to-mahogany-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Whether you're here to appreciate, collaborate, or create
          </h2>
          <p className="text-xl opacity-90">
            We're thoughtfully yours.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetInTouch;
