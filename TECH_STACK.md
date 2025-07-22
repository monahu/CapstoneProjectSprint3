# RestJAM Technology Stack

This document provides a comprehensive overview of the technology stack used in the RestJAM application, a restaurant social media platform.

## 🖥️ Frontend Technology Stack

### Core Framework & Runtime
- **React 19.1.0** - Primary frontend framework for building user interfaces
- **Vite 6.3.5** - Build tool and development server for fast development experience
- **Node.js 18+** - JavaScript runtime environment

### State Management & Data Fetching
- **Apollo Client 3.13.8** - GraphQL client for data fetching and caching
- **Redux Toolkit 2.8.2** - State management for application-wide state
- **React Redux 9.2.0** - React bindings for Redux
- **GraphQL 16.11.0** - Query language and API specification

### UI Framework & Styling
- **TailwindCSS 4.1.7** - Utility-first CSS framework
- **DaisyUI 5.0.37** - Component library built on Tailwind CSS
- **Headless UI 2.2.4** - Unstyled, accessible UI components
- **Lucide React 0.511.0** - Icon library
- **React Icons 5.5.0** - Popular icon libraries for React

### Routing & Navigation
- **React Router DOM 7.7.0** - Declarative routing for React applications
- **React Router 7.6.1** - Core routing functionality

### Forms & Validation
- **Formik 2.4.6** - Form handling library
- **Yup 1.6.1** - Schema validation library

### Rich Text & Content
- **TipTap React 2.23.1** - Rich text editor framework
- **TipTap Starter Kit 2.23.1** - Essential TipTap extensions
- **ProseMirror View 1.40.0** - Editor view layer
- **DOMPurify 3.2.6** - DOM sanitization library

### User Experience Features
- **Emoji Mart 5.6.0** - Emoji picker component
- **Emoji Picker React 4.12.3** - React emoji picker implementation

### Build & Development Tools
- **ESLint 9.25.0** - JavaScript/TypeScript linting
- **Vite Plugin Compression 0.5.1** - Build compression optimization

## 🔧 Backend Technology Stack

### Core Framework & Runtime
- **Node.js** - JavaScript runtime environment
- **Express 5.1.0** - Web application framework

### API & Data Layer
- **Apollo Server 4.12.2** - GraphQL server implementation
- **GraphQL 16.11.0** - API query language and runtime

### Database & ODM
- **MongoDB** - NoSQL document database
- **Mongoose 8.16.4** - MongoDB object document mapper (ODM)

### Authentication & Security
- **Firebase Admin SDK 13.4.0** - Server-side Firebase authentication
- **Express Rate Limit 7.5.0** - Request rate limiting middleware
- **Validator 13.15.15** - String validation and sanitization
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware

### File Processing & Storage
- **Cloudinary 2.7.0** - Cloud-based image and video management
- **Multer 2.0.1** - Multipart/form-data file upload handling
- **Sharp 0.34.2** - High-performance image processing
- **Streamifier 0.1.1** - Convert buffers to streams

### Payment Processing
- **Stripe 18.3.0** - Payment processing platform
- **@stripe/stripe-js 7.4.0** - Stripe JavaScript SDK

### Utilities & Development
- **Lodash 4.17.21** - JavaScript utility library
- **UUID 11.1.0** - Unique identifier generation
- **DotEnv 16.6.1** - Environment variable management
- **Cookie Parser 1.4.7** - Cookie parsing middleware
- **Nodemon 3.1.10** - Development server auto-restart

## 🗄️ Database Technology

### Primary Database
- **MongoDB** - Document-oriented NoSQL database
  - **Connection**: Mongoose ODM for schema definition and data modeling
  - **Models**: User, Post, Rating, WantToGo, Likes, Tags, PostsTags
  - **Features**: 
    - Compound indexing for performance optimization
    - Document encryption for sensitive data
    - Automatic timestamps and validation

### Database Schema Structure
- **Users**: Firebase UID integration, encrypted sensitive fields
- **Posts**: Restaurant reviews with location, images, ratings
- **Ratings**: 5-star rating system with validation
- **Social Features**: Likes, Want-to-Go lists, tagging system
- **Relational Data**: Junction tables for many-to-many relationships

## 💳 Payment Gateway

### Payment Provider
- **Stripe** - Comprehensive payment processing platform
  - **Integration**: Server-side Stripe SDK with webhook support
  - **Features**:
    - Checkout Sessions for secure payment flow
    - Support for CAD (Canadian Dollar) currency
    - Email capture for donation receipts
    - Success/cancel URL handling
    - Test mode for development

### Payment Flow
1. Client creates donation request
2. Server generates Stripe Checkout Session
3. User completes payment on Stripe-hosted page
4. Redirect to success/cancel URLs
5. Webhook processing for payment confirmation

## 🔐 Authentication & Authorization

### Authentication Provider
- **Firebase Authentication** - Google's authentication service
  - **Client-side**: Firebase Web SDK for user authentication
  - **Server-side**: Firebase Admin SDK for token verification
  - **Methods**: Email/Password, Google Sign-In
  - **Features**: JWT token validation, user management

### Security Features
- **Rate Limiting**: Express Rate Limit (100 requests per 15 minutes)
- **Data Encryption**: Custom encryption plugin for sensitive MongoDB fields
- **Input Validation**: Comprehensive validation using Validator.js and Yup
- **CORS Configuration**: Controlled cross-origin resource sharing

## 🌐 External Services & APIs

### Image & Media Management
- **Cloudinary** - Cloud-based digital asset management
  - **Features**: Image optimization, format conversion, CDN delivery
  - **Processing**: Automatic WebP conversion, resizing, compression
  - **Storage**: Organized folder structure for different content types

### Location Services
- **Google Maps API** (Optional) - Mapping and location services
  - **Features**: Embedded maps for restaurant locations
  - **Fallback**: Graceful degradation when API key not configured

### Development & Deployment
- **Vercel** - Deployment and hosting platform
  - **Frontend**: Static site deployment with serverless functions
  - **Backend**: Node.js serverless function deployment
  - **Configuration**: Environment variable management

## 🧪 Testing Technology Stack

### Frontend Testing
- **Vitest 3.2.4** - Unit testing framework
- **Playwright 1.54.1** - End-to-end testing framework
- **Testing Library React 16.3.0** - React component testing utilities
- **Testing Library Jest DOM 6.6.3** - Custom Jest matchers
- **JSDOM 26.1.0** - DOM implementation for testing

### Testing Features
- **Unit Tests**: Component behavior and utility function testing
- **Integration Tests**: User interaction flows
- **E2E Tests**: Full application workflow testing
- **Test Coverage**: Code coverage reporting
- **CI/CD Integration**: Automated testing in deployment pipeline

## 📦 Package Management & Build

### Package Management
- **npm** - Node.js package manager
- **Package Lock**: Deterministic dependency resolution

### Build & Optimization
- **Vite**: Fast build tool with optimized bundling
- **Code Splitting**: Automatic chunk splitting for optimal loading
- **Tree Shaking**: Dead code elimination
- **Compression**: Gzip compression for production builds
- **Asset Optimization**: Image optimization and lazy loading

## 🔧 Development Tools & Configuration

### Code Quality
- **ESLint**: JavaScript/TypeScript linting with React-specific rules
- **Prettier** (via ESLint): Code formatting
- **Git Hooks**: Pre-commit code quality checks

### Development Environment
- **Hot Module Replacement**: Live code updates during development
- **Proxy Configuration**: API requests proxied to backend during development
- **Environment Variables**: Separate configuration for development/production
- **Source Maps**: Debugging support in development

## 📊 Architecture Patterns

### Frontend Architecture
- **Component-Based**: Modular React component architecture
- **Custom Hooks**: Reusable stateful logic
- **Context API**: Global state management for user authentication
- **Service Layer**: Abstracted API communication layer

### Backend Architecture
- **GraphQL Schema-First**: API design driven by GraphQL schema
- **Resolver Pattern**: Modular resolver functions
- **Middleware Stack**: Express middleware for cross-cutting concerns
- **Service Layer**: Business logic abstraction
- **Model-First**: Database schema definition with Mongoose

### Data Flow
1. **Client**: React components trigger user actions
2. **Apollo Client**: Caches and manages GraphQL queries/mutations
3. **GraphQL API**: Apollo Server resolves queries against MongoDB
4. **Database**: Mongoose models interact with MongoDB
5. **External Services**: Integration with Firebase, Cloudinary, Stripe

---

## 📈 Technology Rationale

### Why This Stack?

**Frontend Choice (React + Vite)**:
- Modern development experience with fast hot reload
- Large ecosystem and community support
- Excellent TypeScript support and tooling

**Backend Choice (Node.js + Express + GraphQL)**:
- JavaScript consistency across frontend and backend
- GraphQL provides efficient data fetching
- Rich ecosystem for integrations

**Database Choice (MongoDB)**:
- Flexible schema for social media content
- Excellent Node.js integration with Mongoose
- Horizontal scaling capabilities

**Authentication Choice (Firebase)**:
- Robust security and user management
- Easy integration with frontend and backend
- Social login support

**Payment Choice (Stripe)**:
- Industry-leading security and compliance
- Comprehensive API and documentation
- Strong Canadian market support

This technology stack provides a modern, scalable, and maintainable foundation for the RestJAM social media platform, with emphasis on developer experience, performance, and user security.