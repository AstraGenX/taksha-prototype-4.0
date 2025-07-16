const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Blog = require('../models/Blog');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taksha_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@takshaveda.com',
    password: 'admin123',
    userType: 'admin',
    provider: 'email',
    isVerified: true,
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    userType: 'individual',
    provider: 'email',
    isVerified: true,
    isActive: true,
    phone: '+91 9876543210'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    userType: 'corporate',
    provider: 'email',
    isVerified: true,
    isActive: true,
    phone: '+91 9876543211'
  }
];

// Sample products data
const products = [
  {
    name: 'Executive Diary Set',
    description: 'Premium executive diary with elegant design and quality materials. Perfect for corporate gifting and professional use.',
    category: 'corporate',
    series: 'TakshaVerse',
    price: 1299,
    originalPrice: 1599,
    images: [
      { url: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=400&q=80', isMain: true },
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'
    ],
    features: ['Premium paper quality', 'Leather cover', 'Date marking', 'Corporate branding option'],
    stock: { quantity: 50, threshold: 10 },
    tags: ['diary', 'executive', 'corporate', 'leather'],
    isNew: true,
    isLimited: false,
    isFeatured: true,
    isActive: true,
    rating: { average: 4.8, count: 24 },
    seo: {
      title: 'Executive Diary Set - Premium Corporate Gift',
      description: 'Elegant executive diary set perfect for corporate gifting. Made with premium materials and attention to detail.',
      keywords: ['executive diary', 'corporate gift', 'premium diary', 'leather diary']
    }
  },
  {
    name: 'Mandala Wall Art',
    description: 'Intricate mandala wall art with chakra designs for spiritual spaces. Hand-carved with natural wood finish.',
    category: 'home',
    series: 'Ark Series',
    price: 3299,
    originalPrice: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80', isMain: true },
      { url: 'https://images.unsplash.com/photo-1486308510493-cb147b1d0f40?auto=format&fit=crop&w=400&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1486308510493-cb147b1d0f40?auto=format&fit=crop&w=400&q=80'
    ],
    features: ['Hand-carved mandala', 'Chakra integration', 'Natural wood', 'Ready to hang'],
    stock: { quantity: 15, threshold: 5 },
    tags: ['mandala', 'wall art', 'spiritual', 'home decor'],
    isNew: false,
    isLimited: true,
    isFeatured: true,
    isActive: true,
    rating: { average: 4.9, count: 31 },
    seo: {
      title: 'Mandala Wall Art - Spiritual Home Decor',
      description: 'Beautiful hand-carved mandala wall art for spiritual spaces. Perfect for meditation rooms and home decoration.',
      keywords: ['mandala art', 'spiritual decor', 'wall art', 'home decoration']
    }
  },
  {
    name: 'Tulsi Mala',
    description: 'Sacred Tulsi mala for meditation and spiritual practices. Made from authentic Tulsi beads with natural fragrance.',
    category: 'spiritual',
    series: 'Spiritual Collection',
    price: 599,
    originalPrice: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80', isMain: true },
      { url: 'https://images.unsplash.com/photo-1578659369830-2c48ab1d40a5?auto=format&fit=crop&w=400&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1578659369830-2c48ab1d40a5?auto=format&fit=crop&w=400&q=80'
    ],
    features: ['Authentic Tulsi beads', '108 beads', 'Spiritual significance', 'Natural fragrance'],
    stock: { quantity: 100, threshold: 20 },
    tags: ['tulsi', 'mala', 'spiritual', 'meditation'],
    isNew: false,
    isLimited: false,
    isFeatured: true,
    isActive: true,
    rating: { average: 4.9, count: 85 },
    seo: {
      title: 'Tulsi Mala - Sacred Prayer Beads',
      description: 'Authentic Tulsi mala with 108 beads for meditation and spiritual practices. Natural fragrance and sacred significance.',
      keywords: ['tulsi mala', 'prayer beads', 'meditation', 'spiritual']
    }
  },
  {
    name: 'Festival Gift Set',
    description: 'Specially curated festival gift sets for Diwali and other celebrations. Traditional design with customizable message.',
    category: 'custom',
    series: 'Moments+',
    price: 1599,
    originalPrice: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1618160702659-bd168d0e5af7?auto=format&fit=crop&w=400&q=80', isMain: true },
      { url: 'https://images.unsplash.com/photo-1618160735883-9928a31a576e?auto=format&fit=crop&w=400&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1618160702659-bd168d0e5af7?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1618160735883-9928a31a576e?auto=format&fit=crop&w=400&q=80'
    ],
    features: ['Festival themed', 'Traditional design', 'Gift packaging', 'Customizable message'],
    stock: { quantity: 75, threshold: 15 },
    tags: ['festival', 'gift set', 'diwali', 'celebration'],
    isNew: false,
    isLimited: false,
    isFeatured: false,
    isActive: true,
    rating: { average: 4.7, count: 42 },
    seo: {
      title: 'Festival Gift Set - Celebration Gifts',
      description: 'Beautiful festival gift sets for Diwali and celebrations. Traditional design with customizable packaging.',
      keywords: ['festival gifts', 'diwali gifts', 'celebration', 'traditional']
    }
  },
  {
    name: 'Memory Fridge Magnet',
    description: 'Personalized fridge magnets made from your precious memories. Weather resistant with strong magnetic hold.',
    category: 'personal',
    series: 'Moments+',
    price: 299,
    originalPrice: null,
    images: [
      { url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&q=80', isMain: true },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80'
    ],
    features: ['Photo customization', 'Strong magnet', 'Weather resistant', 'Multiple shapes'],
    stock: { quantity: 200, threshold: 30 },
    tags: ['fridge magnet', 'personalized', 'photo', 'memory'],
    isNew: true,
    isLimited: false,
    isFeatured: false,
    isActive: true,
    rating: { average: 4.5, count: 52 },
    seo: {
      title: 'Memory Fridge Magnet - Personalized Photo Magnet',
      description: 'Custom fridge magnets with your photos. Weather resistant and strong magnetic hold.',
      keywords: ['photo magnet', 'personalized magnet', 'memory magnet', 'custom']
    }
  }
];

// Sample blog posts data
const blogPosts = [
  {
    title: 'The Art of Handcrafted Wooden Products',
    content: `
      <p>In a world dominated by mass-produced items, handcrafted wooden products stand as a testament to the enduring beauty of traditional craftsmanship. Each piece tells a story of skilled artisans who pour their heart and soul into creating something truly unique.</p>
      
      <p>At Taksha Veda, we believe that handcrafted wooden products are more than just functional items – they are works of art that carry the essence of their creators. From intricate carvings to smooth finishes, every detail is carefully considered and executed with precision.</p>
      
      <h3>The Process</h3>
      <p>Our artisans begin with carefully selected wood, choosing pieces that not only meet quality standards but also possess the natural beauty that makes each product unique. The wood is then seasoned and prepared through traditional methods that have been passed down through generations.</p>
      
      <p>The crafting process involves multiple stages of carving, sanding, and finishing. Each step requires patience and skill, as the artisan works to bring out the natural grain and character of the wood.</p>
      
      <h3>Sustainability</h3>
      <p>We are committed to sustainable practices in our production process. All wood used in our products is sourced from responsibly managed forests, ensuring that our craft contributes to environmental conservation rather than depletion.</p>
      
      <p>By choosing handcrafted wooden products, you are not only getting a unique and beautiful item but also supporting sustainable practices and traditional craftsmanship.</p>
    `,
    excerpt: 'Discover the beauty and craftsmanship behind our handcrafted wooden products, where traditional techniques meet modern design sensibilities.',
    category: 'craftsmanship',
    tags: ['handcrafted', 'wood', 'artisan', 'sustainability'],
    featuredImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: true,
    seo: {
      title: 'The Art of Handcrafted Wooden Products - Taksha Veda',
      description: 'Explore the world of handcrafted wooden products and discover the artistry behind traditional craftsmanship.',
      keywords: ['handcrafted wood', 'artisan products', 'traditional craftsmanship', 'sustainable wood']
    }
  },
  {
    title: 'Spiritual Significance of Tulsi in Indian Culture',
    content: `
      <p>Tulsi, known as the "Queen of Herbs" in Ayurveda, holds a special place in Indian culture and spirituality. This sacred plant has been revered for thousands of years, not just for its medicinal properties but for its profound spiritual significance.</p>
      
      <p>In Hindu tradition, Tulsi is considered a manifestation of the goddess Lakshmi, and many households maintain a Tulsi plant in their courtyards or homes. The plant is believed to purify the environment and bring prosperity and good fortune to the family.</p>
      
      <h3>Tulsi Mala and Meditation</h3>
      <p>The Tulsi mala, made from the wood of the Tulsi plant, is an essential tool for meditation and spiritual practice. The 108 beads of the mala are not just a counting mechanism but represent the 108 energy lines that converge to form the heart chakra.</p>
      
      <p>Using a Tulsi mala during meditation is believed to enhance spiritual awareness and provide protection from negative energies. The natural fragrance of Tulsi beads also helps in creating a peaceful and sacred atmosphere for prayer and meditation.</p>
      
      <h3>Benefits of Tulsi Mala</h3>
      <ul>
        <li>Enhances meditation and spiritual practice</li>
        <li>Provides natural aromatherapy benefits</li>
        <li>Believed to offer protection and purification</li>
        <li>Helps maintain focus during prayers</li>
        <li>Connects the user with ancient spiritual traditions</li>
      </ul>
      
      <p>At Taksha Veda, our Tulsi malas are crafted with authentic Tulsi beads, ensuring that you receive all the spiritual and therapeutic benefits of this sacred plant.</p>
    `,
    excerpt: 'Explore the spiritual significance of Tulsi in Indian culture and discover how Tulsi mala can enhance your meditation practice.',
    category: 'spirituality',
    tags: ['tulsi', 'spirituality', 'meditation', 'indian culture'],
    featuredImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: true,
    seo: {
      title: 'Spiritual Significance of Tulsi in Indian Culture - Taksha Veda',
      description: 'Learn about the spiritual significance of Tulsi and how Tulsi mala can enhance your meditation and spiritual practice.',
      keywords: ['tulsi spirituality', 'tulsi mala', 'meditation', 'indian culture']
    }
  },
  {
    title: 'Corporate Gifting: Making the Right Impression',
    content: `
      <p>In the business world, first impressions matter, and corporate gifting is one of the most effective ways to build lasting relationships with clients, partners, and employees. However, choosing the right corporate gift requires careful consideration of various factors including cultural sensitivity, practicality, and brand representation.</p>
      
      <p>At Taksha Veda, we understand that corporate gifts are more than just presents – they are an extension of your brand and values. Our corporate gifting collection is designed to help you make the right impression while celebrating Indian craftsmanship and culture.</p>
      
      <h3>What Makes a Good Corporate Gift?</h3>
      <p>A good corporate gift should be:</p>
      <ul>
        <li><strong>Practical:</strong> Something that recipients can use in their daily lives</li>
        <li><strong>Quality:</strong> Well-made items that reflect positively on your brand</li>
        <li><strong>Culturally appropriate:</strong> Sensitive to the recipient's cultural background</li>
        <li><strong>Memorable:</strong> Unique enough to be remembered and appreciated</li>
        <li><strong>Brandable:</strong> Allows for subtle brand representation</li>
      </ul>
      
      <h3>Our Corporate Collection</h3>
      <p>Our corporate gifting range includes executive diary sets, wooden pen drives, desk organizers, and customized items that can be personalized with your company logo or message. Each piece is crafted with attention to detail and quality materials.</p>
      
      <p>The executive diary set, for instance, features premium paper quality and leather cover, making it a sophisticated gift that recipients will use throughout the year. The wooden pen drive casing combines modern technology with traditional craftsmanship, creating a unique and practical gift.</p>
      
      <h3>Customization Options</h3>
      <p>We offer various customization options including:</p>
      <ul>
        <li>Corporate logo engraving</li>
        <li>Personalized messages</li>
        <li>Custom packaging</li>
        <li>Bulk ordering for events</li>
      </ul>
      
      <p>Whether you're looking for Diwali gifts, year-end appreciation tokens, or client welcome kits, our corporate collection ensures that your gifts make a lasting positive impression.</p>
    `,
    excerpt: 'Learn how to choose the perfect corporate gifts that make lasting impressions and strengthen business relationships.',
    category: 'business',
    tags: ['corporate gifting', 'business', 'professional', 'branding'],
    featuredImage: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isFeatured: false,
    seo: {
      title: 'Corporate Gifting: Making the Right Impression - Taksha Veda',
      description: 'Discover how to choose the perfect corporate gifts that strengthen business relationships and make lasting impressions.',
      keywords: ['corporate gifting', 'business gifts', 'professional gifts', 'corporate branding']
    }
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Create admin user first
    const adminUser = new User(users[0]);
    await adminUser.save();
    console.log('👑 Created admin user');
    
    // Create other users
    const otherUsers = [];
    for (let i = 1; i < users.length; i++) {
      const user = new User(users[i]);
      await user.save();
      otherUsers.push(user);
    }
    console.log(`👥 Created ${otherUsers.length} regular users`);
    
    // Create products
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product({
        ...productData,
        createdBy: adminUser._id,
        updatedBy: adminUser._id
      });
      await product.save();
      createdProducts.push(product);
    }
    console.log(`📦 Created ${createdProducts.length} products`);
    
    // Create blog posts
    const createdBlogs = [];
    for (const blogData of blogPosts) {
      const blog = new Blog({
        ...blogData,
        author: adminUser._id,
        publishedAt: new Date()
      });
      await blog.save();
      createdBlogs.push(blog);
    }
    console.log(`📝 Created ${createdBlogs.length} blog posts`);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Blog Posts: ${blogPosts.length}`);
    console.log('\n🔐 Admin Login Credentials:');
    console.log('Email: admin@takshaveda.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeder
seedDatabase();