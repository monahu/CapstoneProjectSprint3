# RestJAM - Restaurant Social Media Application

A full-stack social media platform for sharing restaurant experiences and recommendations, built by students at Conestoga College as a capstone project.

## 🚀 Live Application

**✅ Sprint 3 - Currently Deployed**
- **Frontend**: https://capstone-project-sprint3-niq2.vercel.app/
- **Backend API**: https://capstone-project-sprint3.vercel.app/

## 📋 Project Status

**Current Phase**: Sprint 3 Complete ✅  
**Status**: Production Ready & Deployed  
**Last Updated**: July 2025

## 🔗 Project Links

- **Design Board**: https://www.figma.com/board/dfU3ZlTdQUzOBkqz3kDND7/Capstone-FIgJam?node-id=0-1&t=5dUhe3uWqOWyfBnV-1
- **Live Frontend**: https://capstone-project-sprint3-niq2.vercel.app/
- **Live Backend**: https://capstone-project-sprint3.vercel.app/

## ✨ Completed Features

### 🔐 User Management & Authentication
- ✅ Firebase Authentication (Email/Password)
- ✅ User profile management with encrypted sensitive data
- ✅ Secure session management and token validation
- ✅ Profile creation and editing functionality

### 📝 Content Management
- ✅ Full CRUD operations for restaurant posts
- ✅ Rich post creation form with validation
- ✅ Multi-resolution image upload and optimization
- ✅ Post editing (owner-only) and deletion
- ✅ Responsive image serving via Cloudinary CDN

### 🌟 Social Features
- ✅ Like/Unlike posts with real-time counters
- ✅ "Want to Go" functionality for restaurant interest
- ✅ Share tracking and social engagement metrics
- ✅ User interaction history and preferences

### 🔍 Search & Discovery
- ✅ Advanced full-text search across posts and restaurants
- ✅ Tag-based filtering and content categorization
- ✅ Location-based search capabilities
- ✅ Voice search integration with Web Speech API
- ✅ Advanced filters with multiple search criteria

### ⭐ Rating System
- ✅ Restaurant rating system (Recommended, New, So-so)
- ✅ Visual rating displays and components
- ✅ Rating integration with post creation

### 🏷️ Tagging System
- ✅ Dynamic tag creation and management
- ✅ Tag-based search and filtering
- ✅ Visual tag display components

### 🎙️ Voice Features
- ✅ Web Speech API integration
- ✅ Voice-to-text for search and content creation
- ✅ Real-time speech transcription

### 💳 Payment Integration
- ✅ Stripe Checkout for donation functionality
- ✅ CAD currency support
- ✅ Secure payment processing

### 📱 User Interface & Experience
- ✅ Mobile-first responsive design
- ✅ Accessibility features (ARIA, keyboard navigation)
- ✅ Loading states and error handling
- ✅ Hero sections and compelling imagery
- ✅ Touch-friendly interface elements

### 🧪 Testing & Quality Assurance
- ✅ Comprehensive Playwright E2E test suite
- ✅ Unit testing setup with Vitest
- ✅ Code quality enforcement with ESLint
- ✅ Error boundaries and comprehensive error handling

## 🛠️ Tech Stack

**Frontend**: React 19 + Vite, TailwindCSS + DaisyUI, Apollo Client, Redux Toolkit  
**Backend**: Node.js + Express, Apollo Server, GraphQL  
**Database**: MongoDB + Mongoose ODM  
**Authentication**: Firebase Auth  
**Payments**: Stripe  
**Storage**: Cloudinary CDN  
**Testing**: Playwright E2E + Vitest Unit Tests  

> 📋 **For complete technology details**: See [TECH_STACK.md](./TECH_STACK.md)

## 🏗️ Architecture & Technical Details

**Database**: MongoDB with 7 models (Users, Posts, Ratings, Likes, WantToGo, Tags, PostsTags)  
**Security**: Field-level encryption, Firebase token validation, rate limiting  
**Performance**: CDN image delivery, code splitting, GraphQL caching, bundle optimization  

> 📊 **For detailed architecture, security, and patterns**: See [TECH_STACK.md](./TECH_STACK.md)

### 🗄️ Apollo Cache Architecture

Our application uses a sophisticated Apollo Client caching strategy for optimal performance and data consistency:

#### **Core Configuration** (`client/src/utils/apolloClient.js`)
- **InMemoryCache** with custom type policies for posts and search queries
- **Pagination Support**: Smart merge strategies for `fetchMore` operations
- **Field-Level Control**: Specific handling for counts (`likeCount`, `shareCount`) with `merge: false`
- **Normalized Storage**: Automatic object deduplication with `addTypename` and `canonizeResults`

#### **Cache Management** (`client/src/utils/cacheUtils.js`)
```javascript
// Smart cache utilities for common operations
updatePostCache()        // Updates specific post fields
refreshPostQueries()     // Triggers cache updates for relevant queries  
evictPostFromCache()     // Removes posts with nested array handling
addPostToCache()         // Adds new posts to existing cached queries
deletePostFromCache()    // Complete deletion with count updates + GC
```

#### **Query Strategies**
- **cache-first**: Fast initial loads from cache
- **cache-and-network**: Background refresh after cache hit
- **network-only**: Force server fetch when needed
- **Pagination**: Custom merge functions handle infinite scroll seamlessly

#### **Mutation Integration**
- **Create Posts**: Automatically adds to cache with count updates
- **Delete Posts**: Removes from cache, updates counts, triggers garbage collection
- **Like/Share**: Real-time field updates without full refetch
- **Auth Changes**: Cache reset on login/logout for user-specific data accuracy

#### **Performance Benefits**
- ⚡ **Instant UI Updates**: Optimistic responses for user interactions
- 🔄 **Smart Invalidation**: Selective cache updates, not full refreshes  
- 📱 **Offline Support**: Cached data available during network issues
- 🎯 **Normalized Sharing**: Same data objects shared across multiple queries

## 🚧 Development Setup

### Prerequisites
- Node.js 18+, MongoDB, Firebase project, Cloudinary account
- Git, 4GB RAM minimum, 2GB storage

### Quick Start
```bash
git clone <repository-url> && cd CapstoneProject
cd server && npm install
cd ../client && npm install
# Copy .env.example to .env in both directories and configure
cd server && npm start  # Backend (port 3500)
cd client && npm run dev  # Frontend (port 5173)
```

> 🔧 **For detailed setup instructions**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)  
> Includes environment configuration, Firebase setup, Cloudinary integration, and troubleshooting.

## 🧪 Testing

### Run Tests
```bash
# Unit tests
cd client && npm run test

# End-to-End tests
cd client && npm run test:e2e

# Test with UI
cd client && npm run test:e2e:ui
```

### Test Coverage
- Authentication workflows
- Post creation and interaction
- Responsive design validation
- Search and filtering functionality
- Social features (likes, want-to-go)

## 📦 Deployment

**Production Environment**: Vercel (Frontend + Backend), MongoDB Atlas, Cloudinary CDN  
**Build**: `npm run build` → Optimized bundles with code splitting  

> 🚀 **Live URLs**: See deployment links at the top of this README
