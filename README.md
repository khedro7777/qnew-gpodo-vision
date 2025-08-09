
# Group Purchasing and Business Development Platform

A comprehensive business development platform that facilitates group purchasing, collaboration, and multi-language support with automatic translation capabilities.

## 🚀 Features

- **Multi-Gateway Business Platform**: Support for purchasing, marketing, suppliers, freelancers, formation, and legal gateways
- **Group Management**: Create and manage business groups with role-based access
- **Automatic Translation**: Powered by DeepSeek API for real-time content translation
- **KYC Verification**: Complete Know Your Customer verification system
- **MCP Agent System**: Multi-Agent system for business process automation
- **Real-time Communication**: Group messaging and notifications
- **Document Management**: IPFS-based document storage and sharing
- **Payment Integration**: PayPal integration for transactions
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Content Management**: Dynamic content creation and management system

## 🛠 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with Row Level Security
- **Storage**: Supabase Storage + IPFS
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI + shadcn/ui
- **Translation**: DeepSeek API integration
- **Payments**: PayPal API integration

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or bun
- Supabase account
- DeepSeek API key (for translations)
- PayPal Developer account (for payments)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd group-purchasing-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Update `src/integrations/supabase/client.ts` with your project details
   - Run the database migrations from the Supabase dashboard

4. **Configure secrets in Supabase**
   - `DEEPSEEK_API_KEY`: For translation services
   - `PAYPAL_CLIENT_ID`: PayPal application client ID
   - `PAYPAL_CLIENT_SECRET`: PayPal application secret

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Main dashboard components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── ...
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── contexts/           # React context providers
├── utils/              # Utility functions
├── integrations/       # External service integrations
└── types/              # TypeScript type definitions

supabase/
├── functions/          # Supabase Edge Functions
└── config.toml         # Supabase configuration
```

## 🔧 Key Components & Hooks

### Authentication
- `useAuth()`: Main authentication hook with profile management
- `AuthProvider`: Context provider for authentication state

### Data Management
- `useOptimizedQuery()`: Enhanced React Query wrapper with performance optimizations
- `usePlatformIntegration()`: Platform-wide data operations
- `useSupabaseData()`: Supabase-specific data hooks

### Performance
- `connectionManager`: Database connection pooling
- `performanceMonitor`: Performance tracking utilities
- `memoryManager`: Memory cleanup and monitoring

### Translation
- `translationManager`: Automatic translation with caching
- `useAutoTranslation()`: Hook for real-time translation

## 🚀 Deployment

### VPS Deployment

1. **Build the application**
   ```bash
   npm run build
   # or
   bun run build
   ```

2. **Configure environment**
   - Update `src/utils/deploymentConfig.ts` for production settings
   - Ensure Supabase Edge Functions are deployed
   - Configure domain and SSL certificates

3. **Set up reverse proxy** (nginx example)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

4. **Process management**
   ```bash
   # Using PM2
   pm2 start "npm start" --name "group-platform"
   ```

### GitHub Integration

The platform is configured for automatic deployment through GitHub Actions:

1. **Connect Repository**: Link your GitHub repository to your deployment service
2. **Environment Variables**: Set up production environment variables
3. **Build Pipeline**: The optimized Vite configuration handles code splitting and optimization
4. **Auto-deployment**: Push to main branch triggers automatic deployment

### Build Optimizations

- **Code Splitting**: Automatic vendor and route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Performance monitoring and optimization

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting and abuse prevention

## 🌐 Translation System

The platform includes an advanced translation system:

- **Automatic Detection**: Detects user language preferences
- **Real-time Translation**: Instant translation of UI elements
- **Caching**: Efficient translation caching for performance
- **DeepSeek Integration**: High-quality AI-powered translations

## 📊 Admin Dashboard

Comprehensive admin features:

- **User Management**: User accounts, KYC verification, role management
- **Content Management**: Dynamic content creation and editing
- **Analytics**: Platform usage and performance metrics
- **API Management**: API key generation and management
- **System Monitoring**: Health checks and performance monitoring

## 🔌 Integrations

### Supabase
- Real-time subscriptions
- File storage and management
- Edge Functions for serverless operations
- Built-in authentication

### Translation Services
- DeepSeek API for high-quality translations
- Automatic language detection
- Translation caching and optimization

### Payment Processing
- PayPal integration for secure payments
- Subscription management
- Transaction history and reporting

## 📈 Performance Optimizations

- **React Query**: Efficient data fetching and caching
- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: WebP format and lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Database Optimization**: Connection pooling and query optimization

## 🐛 Debugging & Monitoring

- **Error Handling**: Centralized error management
- **Performance Monitoring**: Built-in performance tracking
- **Console Logging**: Development-friendly logging
- **Memory Management**: Automatic cleanup and monitoring

## 📝 Development Guidelines

1. **Component Creation**: Keep components small and focused
2. **Hook Usage**: Use custom hooks for data operations
3. **Error Handling**: Always handle errors gracefully
4. **Performance**: Use React.memo() for expensive components
5. **Accessibility**: Follow WCAG guidelines for accessibility
6. **Testing**: Write tests for critical business logic

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Business intelligence dashboard
- **API Marketplace**: Third-party integration marketplace
- **AI Automation**: Enhanced MCP agent capabilities
- **Blockchain Integration**: Decentralized features

## 📞 Support & Documentation

- **Technical Documentation**: Comprehensive API documentation
- **User Guides**: Step-by-step user tutorials  
- **Developer Resources**: Integration guides and examples
- **Support Portal**: Technical support and issue tracking

---

## 🏁 Quick Start Checklist

- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Install dependencies
- [ ] Run database migrations
- [ ] Start development server
- [ ] Configure translation services
- [ ] Set up payment integration
- [ ] Deploy to VPS
- [ ] Connect GitHub for auto-deployment

For detailed setup instructions, refer to the installation section above.
