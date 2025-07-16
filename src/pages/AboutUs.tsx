import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Users, Target, Heart, Lightbulb, Hammer, Shield, Star, Award, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const teamMembers = [
    {
      name: "Dr. Aaditya Pandey",
      role: "GM – Operations & NPD",
      image: "https://github.com/AstraGenX/astragenxlogo/blob/main/huihuihui.jpg?raw=true",
      description: "Leverages his interdisciplinary academic background in polymer science, packaging technology, and process engineering, along with extensive production experience, to lead innovative product development and streamline operational excellence."
    },
    {
      name: "Mrs. Anju Pandey",
      role: "Founder",
      image: "https://github.com/AstraGenX/astragenxlogo/blob/main/anu%20aunty.jpg?raw=true",
      description: "At 65, this inspiring woman entrepreneur blends a lifetime of social wisdom with creative vision, shaping Taksha into a brand that celebrates thoughtful and meaningful gifting."
    },
    {
      name: "Mrs. Kalpana Ray",
      role: "Founder",
      image: "https://github.com/AstraGenX/astragenxlogo/blob/main/aunty%20kal.jpg?raw=true",
      description: "At 61, Kalpana Ray embarks on an inspiring new chapter, transforming years of nurturing a family into nurturing a vision. As a homemaker-turned-entrepreneur, she infuses Taksha with quiet strength, timeless values, and a deep understanding of what makes a gift truly meaningful. Her journey is a testament to courage, reinvention, and the beauty of beginning anew at any age."
    },
    {
      name: "Dr. Madhuparna Ray",
      role: "GM – Marketing and New Product Innovation",
      image: "https://github.com/AstraGenX/astragenxlogo/blob/main/didi.jpg?raw=true",
      description: "Brings her deep-rooted expertise in polymer science, material innovation, and sustainable technologies to shape the brand's strategic growth. With a strong foundation in research and an entrepreneurial vision honed through building ventures from the ground up, she drives Taksha's market positioning, brand storytelling, and outreach, ensuring each product resonates with thoughtful design and cultural significance."
    }
  ];

  const approaches = [
    {
      icon: <Lightbulb className="h-8 w-8 text-saffron-600" />,
      title: "Innovation",
      description: "We blend traditional techniques with modern design sensibilities to create pieces that are both timeless and contemporary."
    },
    {
      icon: <Heart className="h-8 w-8 text-mahogany-600" />,
      title: "Passion",
      description: "Every piece we create is infused with love and dedication, ensuring that our craft resonates with emotion and meaning."
    },
    {
      icon: <Shield className="h-8 w-8 text-teak-600" />,
      title: "Quality",
      description: "We never compromise on quality, using only the finest materials and time-tested techniques to ensure durability."
    },
    {
      icon: <Users className="h-8 w-8 text-walnut-600" />,
      title: "Community",
      description: "We believe in supporting local artisans and preserving traditional crafts for future generations."
    }
  ];

  const industries = [
    { name: "Corporate", icon: <Award className="h-6 w-6" /> },
    { name: "Education", icon: <Star className="h-6 w-6" /> },
    { name: "Hospitality", icon: <Heart className="h-6 w-6" /> },
    { name: "Real Estate", icon: <Shield className="h-6 w-6" /> },
    { name: "Wellness", icon: <Lightbulb className="h-6 w-6" /> },
    { name: "Fashion", icon: <Zap className="h-6 w-6" /> },
    { name: "Technology", icon: <Target className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-walnut-800 via-mahogany-700 to-walnut-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-lg font-serif italic text-saffron-300 mb-4">
            Śilpasya mūlaṃ kartṛ-hṛdayam
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            About Taksha
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            The foundation of craft lies in the heart of the creator
          </p>
        </div>
      </section>


      {/* Our Story Enhanced */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-walnut-800 mb-8 text-center">Our Story</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Taksha, we redefine the art of gifting by blending traditional craftsmanship with contemporary design. Specializing in bespoke wooden creations, we offer thoughtfully curated solutions for a wide range of needs—from corporate gifting and conference welcome kits, to personal events, academic milestones, hospitality souvenirs, and lifestyle keepsakes.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  While wood remains our signature medium, our offerings extend beyond it—embracing diverse materials and formats tailored for every industry, occasion, and imagination. Whether you're in corporate, education, hospitality, real estate, wellness, fashion, or tech, Taksha delivers gifts that are meaningful, memorable, and made to stand out.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Driven by innovation and research, our product designs go beyond aesthetics—we craft custom stories that resonate with your audience, turning every creation into a personal narrative, a celebration of milestones, and a piece of lasting value. Our passion lies in turning your vision into tangible artistry, making every gift a story worth sharing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center border-saffron-200">
                  <Hammer className="h-12 w-12 text-saffron-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-walnut-800 mb-2">Handcrafted</h3>
                  <p className="text-sm text-muted-foreground">Every piece is meticulously crafted by skilled artisans</p>
                </Card>
                <Card className="p-6 text-center border-mahogany-200">
                  <Star className="h-12 w-12 text-mahogany-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-walnut-800 mb-2">Premium Quality</h3>
                  <p className="text-sm text-muted-foreground">Using only the finest materials and techniques</p>
                </Card>
                <Card className="p-6 text-center border-teak-200">
                  <Zap className="h-12 w-12 text-teak-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-walnut-800 mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Blending tradition with modern design</p>
                </Card>
                <Card className="p-6 text-center border-walnut-200">
                  <Heart className="h-12 w-12 text-walnut-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-walnut-800 mb-2">Meaningful</h3>
                  <p className="text-sm text-muted-foreground">Every gift tells a unique story</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Industries We Serve */}
      <section className="py-20 bg-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-serif text-walnut-800 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From corporate to personal, we create meaningful gifts for every industry and occasion
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="w-60 group bg-white rounded-3xl p-6 text-center shadow-md border border-walnut-100
          transform transition-all duration-300 ease-in-out
          hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(244,179,78,0.4)]
          hover:bg-gradient-to-br hover:from-saffron-50 hover:via-teak-50 hover:to-walnut-50"
              >
                {/* Icon container wrapper */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-16 h-16 flex items-center justify-center rounded-full
              bg-gradient-to-tr from-saffron-400 via-saffron-300 to-saffron-100
              shadow-lg animate-pulse group-hover:scale-110 group-hover:animate-none
              transition-transform duration-300 ease-in-out"
                  >
                    <span
                      className="text-3xl"
                      style={{
                        background: 'linear-gradient(90deg, #f4b34e, #e08e30, #a35c18)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {industry.icon}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-walnut-900 text-base font-semibold transition-colors group-hover:text-saffron-700">
                  {industry.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Our Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-walnut-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-saffron-600 mr-3" />
                  <h3 className="text-2xl font-serif font-bold text-walnut-800">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To preserve and promote traditional Indian craftsmanship while creating contemporary pieces that add meaning and beauty to modern lives. We strive to support local artisans and keep ancient techniques alive for future generations while delivering gifts that are meaningful, memorable, and made to stand out.
                </p>
              </CardContent>
            </Card>

            <Card className="border-walnut-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-8 w-8 text-mahogany-600 mr-3" />
                  <h3 className="text-2xl font-serif font-bold text-walnut-800">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To become a globally recognized brand that represents the finest in Indian craftsmanship, where every piece tells a story of heritage, quality, and artistic excellence while meeting the evolving needs of contemporary lifestyles across diverse industries and occasions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-walnut-800 mb-4">Our Approach</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in a holistic approach to craftsmanship that honors tradition while embracing innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {approaches.map((approach, index) => (
              <Card key={index} className="text-center border-walnut-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {approach.icon}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-walnut-800 mb-3">
                    {approach.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {approach.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-walnut-800 mb-4">Meet Our Leaders</h2>
            <p className="text-lg text-muted-foreground">
              The visionary minds and skilled hands behind every Taksha creation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-walnut-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-semibold text-walnut-800 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-saffron-600 font-medium mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-walnut-800 mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you and discuss your custom requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-8">
            <Card className="text-center border-walnut-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Email Us</h3>
                <a
                  href="mailto:taksha15.woodendecor@gmail.com"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-saffron-600 transition-colors break-words"
                >
                  taksha15.woodendecor@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-walnut-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Call Us</h3>
                <div className="space-y-1">
                  <a href="tel:+917906964311" className="block text-sm text-muted-foreground hover:text-saffron-600 transition-colors">
                    +91 79069 64311
                  </a>
                  <a href="tel:+919007630516" className="block text-sm text-muted-foreground hover:text-saffron-600 transition-colors">
                    +91 90076 30516
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-walnut-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground">
                  Haridwar, India
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-walnut-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-saffron-600 mx-auto mb-4" />
                <h3 className="font-semibold text-walnut-800 mb-2">Working Hours</h3>
                <p className="text-sm text-muted-foreground">
                  24 x 7<br />
                  Always Available
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleContactUs}
              className="bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;