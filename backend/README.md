# Taksha Veda Backend API

A comprehensive Node.js backend API for the Taksha Veda E-Commerce platform, built with Express.js and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Product Management**: Complete CRUD operations for products with categories, series, and variants
- **Order Management**: Full order lifecycle with payment integration
- **Cart & Wishlist**: Persistent cart and wishlist functionality
- **Payment Integration**: Razorpay payment gateway integration
- **Email Notifications**: Automated email notifications for orders and user actions
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Blog System**: Content management system for blog posts
- **File Uploads**: Image upload and management with Cloudinary
- **Search & Filtering**: Advanced search and filtering capabilities
- **Analytics**: Sales, user, and product analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Payment**: Razorpay
- **Email**: Nodemailer
- **File Storage**: Cloudinary
- **Image Processing**: Sharp
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taksha_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@takshaveda.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your-session-secret-key
```

4. **Start MongoDB**
Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Seed the Database**
```bash
node scripts/seedDatabase.js
```

6. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove item from wishlist
- `POST /api/wishlist/toggle` - Toggle item in wishlist

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment
- `POST /api/payment/refund` - Process refund (Admin)

### Blog
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create blog post (Admin)
- `PUT /api/blog/:id` - Update blog post (Admin)
- `DELETE /api/blog/:id` - Delete blog post (Admin)

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/analytics/sales` - Get sales analytics
- `GET /api/admin/analytics/products` - Get product analytics
- `GET /api/admin/analytics/users` - Get user analytics

### Upload
- `POST /api/upload/image` - Upload single image (Admin)
- `POST /api/upload/images` - Upload multiple images (Admin)
- `DELETE /api/upload/image/:publicId` - Delete image (Admin)

## Database Models

### User Model
- User authentication and profile information
- Address management
- User preferences
- Role-based access control

### Product Model
- Product information and specifications
- Image gallery and variants
- Stock management
- Reviews and ratings
- SEO optimization

### Order Model
- Order details and tracking
- Payment information
- Shipping details
- Order history

### Cart Model
- User-specific cart items
- Quantity management
- Coupon handling

### Wishlist Model
- User wishlist items
- Product preferences

### Blog Model
- Blog posts and content
- Comments and interactions
- SEO optimization

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Types
- `individual` - Regular customers
- `corporate` - Business customers
- `institution` - Institutional customers
- `admin` - System administrators

## Payment Integration

The API integrates with Razorpay for payment processing:

1. Create order with `POST /api/payment/create-order`
2. Process payment on frontend with Razorpay
3. Verify payment with `POST /api/payment/verify-payment`

## Email Notifications

Automated emails are sent for:
- Welcome new users
- Order confirmations
- Order status updates
- Password reset requests

## File Upload

Images are uploaded to Cloudinary with automatic optimization:
- Automatic format conversion (WebP)
- Quality optimization
- Responsive transformations
- CDN delivery

## Security Features

- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- Password hashing with bcrypt
- JWT token expiration

## Error Handling

The API implements comprehensive error handling:
- Validation errors
- Database errors
- Authentication errors
- Payment errors
- File upload errors

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Production Environment

1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up SSL certificates
5. Use PM2 for process management

### Deployment Commands

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name taksha-api

# Monitor
pm2 monitor
```

## API Documentation

Complete API documentation is available at `/api/docs` when running in development mode.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper tests
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact: support@takshaveda.com

---

**Note**: This backend is specifically designed for the Taksha Veda E-Commerce platform and includes features tailored for handcrafted product sales, Indian cultural elements, and traditional craftsmanship showcase.