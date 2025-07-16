# Taksha Prototype 4.0

A modern e-commerce platform built with React, TypeScript, and Vite, featuring a comprehensive product catalog, admin dashboard, and user-friendly interface.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products by categories with advanced filtering
- **Shopping Cart**: Add/remove items, view cart contents
- **Wishlist**: Save favorite products for later
- **User Authentication**: Login/register functionality
- **Order Management**: Place orders and view order history
- **Product Search**: Search products by name and description
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of sales, orders, and products
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **User Management**: Admin user controls
- **Analytics**: Sales and performance metrics

### Technical Features
- **Modern Stack**: React 18, TypeScript, Vite
- **State Management**: React Query for server state, Context API for client state
- **UI Components**: Shadcn/ui components with Tailwind CSS
- **API Integration**: RESTful API with proper error handling
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized bundle size and loading

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui
- **State Management**: React Query, Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Taksha Prototype 4.0"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── admin/           # Admin-specific components
│   └── ...              # Other components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
├── lib/                 # Utility functions
└── main.tsx            # Application entry point
```

## 🎯 Key Components

### Pages
- **Index**: Homepage with hero section and featured products
- **ShopByCategory**: Product catalog with filtering and search
- **ProductCatalog**: Detailed product listings
- **Auth**: User authentication (login/register)
- **Checkout**: Order placement and payment
- **Admin**: Admin dashboard and management tools

### Components
- **Navigation**: Header with menu and cart
- **ProductCard**: Product display component
- **Cart**: Shopping cart functionality
- **WishlistSidebar**: Wishlist management
- **AdminDashboard**: Admin interface

### Contexts
- **AuthContext**: User authentication state
- **CartContext**: Shopping cart state
- **WishlistContext**: Wishlist state

## 🔧 Configuration

### Environment Variables
The application uses environment variables for configuration. Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Taksha
```

### API Endpoints
The application expects the following API endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🎨 Styling

The project uses Tailwind CSS with custom color scheme:
- Primary colors: Orange and saffron tones
- Neutral colors: Walnut and gray tones
- Consistent spacing and typography

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interactions

## 🔒 Security Features

- Input validation and sanitization
- Protected admin routes
- Secure authentication flow
- XSS protection
- Error boundary implementation

## 🚀 Performance Optimizations

- Code splitting with dynamic imports
- Lazy loading of components
- Optimized images and assets
- Efficient state management
- Minimized bundle size

## 📈 Future Enhancements

- Payment gateway integration
- Real-time notifications
- Advanced analytics
- Multi-language support
- Progressive Web App (PWA) features
- Image optimization
- Search engine optimization (SEO)

## 🐛 Known Issues

- Some mock data is used for demonstration
- Payment integration is placeholder
- Real-time features not implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Shadcn/ui for the beautiful component library
- Tailwind CSS for the utility-first styling
- Lucide React for the icon set
- React Query for state management
- Vite for the build tool

---

**Built with ❤️ by the Taksha Team**