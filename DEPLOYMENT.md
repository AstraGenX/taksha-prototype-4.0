# Deployment Guide

## Quick Start

1. **Development**
   ```bash
   npm run dev
   ```
   Opens the application at `http://localhost:8080`

2. **Production Build**
   ```bash
   npm run build
   ```
   Creates optimized build in `dist/` folder

3. **Preview Production**
   ```bash
   npm run preview
   ```
   Serves the production build locally

4. **Deploy Command**
   ```bash
   npm run deploy
   ```
   Builds and previews the application

## Deployment Options

### 1. Static Hosting (Recommended)
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Upload `dist/` contents

### 2. Server Deployment
- **VPS/Cloud**: Copy `dist/` to web server
- **Docker**: Use nginx to serve static files
- **CDN**: Upload to cloud storage with CDN

### 3. Platform-Specific

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
npm run build
# Push dist/ contents to gh-pages branch
```

## Environment Setup

### Production Environment Variables
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Taksha
```

### Development Environment Variables
Create `.env.development`:
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Taksha Dev
```

## Build Configuration

### Vite Configuration
The project uses Vite for building. Configuration is in `vite.config.ts`:
- TypeScript support
- React SWC plugin
- Path aliases
- Development server on port 8080

### Performance Optimizations
- Code splitting enabled
- Tree shaking for unused code
- Asset optimization
- Gzip compression ready

## Pre-deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Check all routes work correctly
- [ ] Verify API endpoints are accessible
- [ ] Test responsive design
- [ ] Check performance metrics
- [ ] Validate forms and user interactions
- [ ] Test error handling

## Troubleshooting

### Common Build Issues
1. **TypeScript errors**: Fix type issues in development
2. **Missing dependencies**: Run `npm install`
3. **Path resolution**: Check vite.config.ts aliases
4. **API endpoints**: Verify environment variables

### Runtime Issues
1. **Blank page**: Check browser console for errors
2. **API failures**: Verify endpoint URLs and CORS
3. **Routing issues**: Check React Router configuration
4. **Performance**: Monitor bundle size and loading times

## Monitoring

### Performance Metrics
- Bundle size: ~632KB (gzipped: ~180KB)
- Load time: < 3 seconds
- Core Web Vitals: Monitor in production

### Error Tracking
- Use browser dev tools
- Implement error boundaries
- Add logging for API calls
- Monitor user interactions

## Security Considerations

### Production Security
- HTTPS only
- Secure API endpoints
- Input validation
- XSS protection
- CSRF prevention

### Content Security Policy
Add CSP headers to prevent XSS:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

---

**Ready for deployment! 🚀**