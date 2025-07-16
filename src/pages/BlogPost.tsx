import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Share2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const blogPosts = [
    {
      id: 1,
      title: "The Art of Festive Gifting: Diwali Collection 2024",
      category: "Festive Gifting",
      author: "Dr. M Ray",
      date: "2024-10-15",
      excerpt: "Discover how traditional Diwali motifs inspire our latest collection, blending heritage patterns with contemporary aesthetics for meaningful celebrations.",
      content: `
      <p>As the festival of lights approaches, we find ourselves reflecting on the profound symbolism that Diwali brings to our craft. Our 2024 Diwali Collection celebrates the harmony between ancient traditions and modern design, using motifs such as diyas, rangoli patterns, and vibrant colors to evoke joy and prosperity.</p>
      
      <p>Each piece is handcrafted by skilled artisans using sustainable materials, ensuring that the spirit of the festival shines through not just in beauty but also in responsibility. Whether it's gifting to loved ones or corporate partners, these collections embody gratitude and cultural richness.</p>
      
      <p>The intricate designs are inspired by centuries-old art forms, reimagined for today's aesthetic sensibilities. By blending classic motifs with sleek lines and modern textures, we create gifts that feel both timeless and fresh.</p>

      <p>Join us as we light up homes and hearts this Diwali with meaningful gifts that tell stories. From elegant handcrafted diyas to custom gift boxes, our collection is a celebration of tradition, craftsmanship, and the joy of giving.</p>
    `,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      readTime: "5 min read",
      tags: ["Diwali", "Traditional", "Festival"],
      featured: true,
    },
    {
      id: 2,
      title: "Behind the Craft: Meet Our Master Artisan Rajesh Kumar",
      category: "Behind the Scenes",
      author: "Dr. M Ray",
      date: "2024-10-10",
      excerpt: "An intimate conversation with our lead artisan about preserving traditional woodworking techniques while embracing modern design sensibilities.",
      content: `
      <p>In the heart of our workshop, where the scent of freshly cut wood mingles with the rhythmic sounds of traditional tools, Rajesh Kumar breathes life into each creation. With over three decades of experience, Rajesh preserves age-old woodworking techniques passed down through generations.</p>

      <p>His passion for craftsmanship is evident in every delicate curve and joint, balancing precision with artistry. We sat down with Rajesh to learn how he integrates modern aesthetics without compromising the authenticity of traditional methods.</p>
      
      <p>Rajesh shared that every piece he creates carries a story — a story of the wood, the hands that shaped it, and the culture it represents. He believes that preserving these techniques is crucial to maintaining the soul of the craft in a rapidly changing world.</p>

      <p>By combining innovation with respect for tradition, Rajesh and his team ensure that each product is not just a functional item but a piece of living heritage.</p>
    `,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
      readTime: "8 min read",
      tags: ["Artisan", "Craftsmanship", "Interview"],
      featured: false,
    },
    {
      id: 3,
      title: "Sustainable Crafting: Our Journey Towards Eco-Friendly Design",
      category: "Design Talk",
      author: "Dr. M Ray",
      date: "2024-10-05",
      excerpt: "Exploring our commitment to sustainable materials and practices, and how eco-consciousness shapes every piece we create.",
      content: `
      <p>Sustainability is more than a buzzword for us—it's a commitment that guides our entire creative process. From selecting responsibly sourced wood to minimizing waste, every decision is made with care for our planet.</p>
      
      <p>Our designers work closely with environmental experts to ensure materials are recycled or renewable wherever possible. We also implement water-based finishes and natural dyes to reduce chemical impact.</p>
      
      <p>Beyond materials, we invest in efficient manufacturing techniques that reduce energy consumption and promote circularity. Packaging is also thoughtfully designed to be biodegradable or reusable.</p>
      
      <p>This journey towards eco-friendly design reflects our belief that beautiful craftsmanship and environmental responsibility can coexist harmoniously. We invite our customers to join us in making choices that protect the earth for future generations.</p>
    `,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80",
      readTime: "6 min read",
      tags: ["Sustainability", "Eco-friendly", "Materials"],
      featured: false,
    },
    {
      id: 4,
      title: "Corporate Gifting Done Right: Building Lasting Relationships",
      category: "Corporate",
      author: "Dr. M Ray",
      date: "2024-09-28",
      excerpt: "Why thoughtful corporate gifts matter more than ever, and how to choose pieces that reflect your company's values and appreciation.",
      content: `
      <p>In today’s competitive business environment, building strong relationships is essential. Thoughtful corporate gifting goes beyond mere formality; it expresses appreciation and strengthens bonds with clients and employees alike.</p>
      
      <p>Our corporate gifting solutions are designed to align with your brand values, combining elegance with purpose. We help you select customized pieces that convey sincerity and professionalism.</p>
      
      <p>Choosing the right gift involves understanding the recipient’s tastes and the message you want to send. From personalized wooden keepsakes to eco-friendly gift sets, our collection offers options that impress and inspire.</p>
      
      <p>Discover how the right gift can make a lasting impression and foster loyalty that drives long-term success. Building these connections through meaningful gifts elevates your corporate culture and brand image.</p>
    `,
      image: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80",
      readTime: "7 min read",
      tags: ["Corporate", "Relationships", "Business"],
      featured: false,
    },
    {
      id: 5,
      title: "The Philosophy of Meaningful Objects",
      category: "Design Talk",
      author: "Dr. M Ray",
      date: "2024-09-20",
      excerpt: "Delving into the deeper meaning behind handcrafted objects and how they carry emotional significance beyond their functional purpose.",
      content: `
      <p>Objects we cherish often carry stories beyond their physical form. They connect us to memories, emotions, and cultural heritage. Our handcrafted pieces are created with this philosophy in mind.</p>
      
      <p>Every curve, texture, and detail is intentional, inviting reflection and connection. Meaningful design is not just about aesthetics but about the experiences and values it evokes.</p>
      
      <p>We believe that a meaningful object can evoke emotions and inspire conversations, becoming an heirloom passed down through generations. It is a bridge between past and future.</p>
      
      <p>Join us as we explore the profound relationship between humans and the objects they hold dear, celebrating craftsmanship as a form of storytelling.</p>
    `,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      readTime: "10 min read",
      tags: ["Philosophy", "Meaning", "Emotion"],
      featured: false,
    },
    {
      id: 6,
      title: "Workshop Diaries: Creating the Epoch Series",
      category: "Behind the Scenes",
      author: "Dr. M Ray",
      date: "2024-09-15",
      excerpt: "Take a behind-the-scenes look at the creation process of our Epoch Series, from initial sketches to final polished pieces.",
      content: `
      <p>The Epoch Series is the culmination of months of dedication, innovation, and collaboration. Our workshop buzzed with creativity as sketches turned into prototypes and finally, exquisite finished products.</p>
      
      <p>This diary shares intimate glimpses into the challenges and triumphs faced by our artisans, highlighting the balance of tradition and experimentation that defines the series.</p>
      
      <p>From selecting the finest raw materials to mastering new finishing techniques, every step in the process was meticulously crafted. Our artisans brought passion and precision to each phase, ensuring quality and uniqueness.</p>
      
      <p>Experience the journey of craftsmanship that shapes the soul of our creations, blending heritage with modern innovation to create timeless pieces.</p>
    `,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
      readTime: "12 min read",
      tags: ["Process", "Design", "Creation"],
      featured: false,
    },
  ];


  const currentPost = blogPosts.find(post => post.id === parseInt(id || '0'));

  useEffect(() => {
    if (!currentPost) {
      navigate('/blog');
    } else {
      // Scroll to top on post load
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPost, navigate]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The blog post link has been copied to your clipboard.",
    });
  };

  if (!currentPost) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-walnut-100 via-teak-50 to-saffron-50">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="mb-6 hover:bg-walnut-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-saffron-100 text-saffron-800 text-sm font-medium px-3 py-1 rounded-full">
                {currentPost.category}
              </span>
              <span className="text-muted-foreground">{currentPost.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-walnut-800 mb-6">
              {currentPost.title}
            </h1>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{currentPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(currentPost.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Image */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img
              src={currentPost.image}
              alt={currentPost.title}
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>
      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg prose-walnut max-w-none"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-walnut-200">
              {currentPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-walnut-100 text-walnut-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Related Posts */}
      <section className="py-16 bg-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-walnut-800 mb-8 text-center">
              Related Stories
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts
                .filter(post => post.id !== currentPost.id)
                .slice(0, 2)
                .map((post) => (
                  <Card key={post.id} className="hover-scale bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-serif font-bold text-xl text-walnut-800 mb-3 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Button
                        className="bg-saffron-600 hover:bg-saffron-700 text-white"
                        onClick={() => navigate(`/blog/${post.id}`)}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BlogPost;
