const express = require('express');
const router = express.Router();
const { enhanceSearch, testAIService, isAIAvailable } = require('../services/aiSearchService');
const { admin } = require('../middleware/auth');

// Optional auth middleware - allows requests with or without tokens
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // If no auth header, proceed without user
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  
  // If auth header exists, try to authenticate
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    // If auth fails, still proceed but without user
    console.log('Optional auth failed, proceeding without user:', error.message);
    req.user = null;
    next();
  }
};

/**
 * AI Search Routes
 * Handles AI-enhanced search requests
 */

/**
 * POST /api/ai-search
 * Enhance search query using AI and return results
 */
router.post('/ai-search', optionalAuth, async (req, res) => {
  try {
    const { query, limit = 10, offset = 0 } = req.body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required and must be a non-empty string',
        success: false
      });
    }

    // Check if AI service is available
    if (!isAIAvailable()) {
      return res.status(503).json({
        error: 'AI search service is not available. API key not configured.',
        success: false,
        aiDisabled: true
      });
    }

    // Validate limits
    const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const sanitizedOffset = Math.max(parseInt(offset) || 0, 0);

    console.log(`AI Search request: "${query}" (limit: ${sanitizedLimit}, offset: ${sanitizedOffset})`);

    // Perform AI-enhanced search
    const startTime = Date.now();
    const results = await enhanceSearch(
      query.trim(),
      sanitizedLimit,
      sanitizedOffset,
      req.user?._id
    );
    const duration = Date.now() - startTime;

    console.log(`AI Search completed in ${duration}ms, found ${results.length} results`);

    // Generate helpful suggestions if no results found
    let suggestions = [];
    let encouragingMessage = '';
    if (results.length === 0) {
      const queryLower = query.trim().toLowerCase();
      if (queryLower.includes('pizza')) {
        suggestions = ['italian', 'casual', 'delivery'];
        encouragingMessage = `No "pizza" spots found yet, but don't worry! Try exploring these alternatives or be the first to share your favorite pizza place! 🍕`;
      } else if (queryLower.includes('burger')) {
        suggestions = ['american', 'fast', 'grill'];
        encouragingMessage = `No "burger" joints discovered yet! Help build our community by sharing your go-to burger spot or try these related searches! 🍔`;
      } else if (queryLower.includes('sushi')) {
        suggestions = ['japanese', 'fresh', 'seafood'];
        encouragingMessage = `No "sushi" restaurants shared yet! Be a trendsetter and post about your favorite sushi experience! 🍣`;
      } else if (queryLower.includes('coffee')) {
        suggestions = ['cafe', 'breakfast', 'cozy'];
        encouragingMessage = `No "coffee" spots brewing yet! Share your favorite café or try these cozy alternatives! ☕`;
      } else if (queryLower.includes('chinese')) {
        suggestions = ['asian', 'takeout', 'noodles'];
        encouragingMessage = `No "chinese" restaurants found yet! Help others discover great Asian cuisine by sharing your favorite spot! 🥡`;
      } else {
        suggestions = ['casual', 'family', 'popular'];
        encouragingMessage = `No matches found yet, but every great food community starts somewhere! Try these popular categories or share your own dining discovery! 🌟`;
      }
    }

    // Return results
    res.json({
      success: true,
      query: query.trim(),
      results: results,
      count: results.length,
      limit: sanitizedLimit,
      offset: sanitizedOffset,
      aiEnhanced: true,
      processingTime: duration,
      ...(results.length === 0 && { 
        message: encouragingMessage,
        suggestions: suggestions
      })
    });

  } catch (error) {
    console.error('AI Search error:', error);
    
    res.status(500).json({
      error: 'AI search failed. Please try again or use regular search.',
      success: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-search/test
 * Test AI service availability and functionality
 */
router.get('/ai-search/test', async (req, res) => {
  try {
    if (!isAIAvailable()) {
      return res.status(503).json({
        available: false,
        error: 'AI service not configured. Missing GEMINI_API_KEY.'
      });
    }

    const testResult = await testAIService();
    
    res.json({
      available: true,
      testResult,
      service: 'Google Gemini AI',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI service test error:', error);
    
    res.status(500).json({
      available: false,
      error: 'AI service test failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/ai-search/status
 * Get AI service status
 */
router.get('/ai-search/status', (req, res) => {
  const available = isAIAvailable();
  res.json({
    available,
    service: 'Google Gemini AI',
    features: available ? [
      'Natural language query enhancement',
      'Keyword extraction',
      'Fallback to regular search'
    ] : [],
    message: available ? 'AI search is ready' : 'AI search is disabled - API key not configured',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;