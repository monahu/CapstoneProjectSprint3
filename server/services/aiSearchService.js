const { GoogleGenerativeAI } = require("@google/generative-ai");
const { basicSearch } = require('./post/postSearchService');

/**
 * AI Search Service using Google Gemini
 * Enhances search queries using AI to extract relevant keywords
 */

class AISearchService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeGemini();
  }

  /**
   * Initialize Google Gemini AI
   */
  initializeGemini() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY not found in environment variables');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('Google Gemini AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Gemini AI:', error);
    }
  }

  /**
   * Check if Gemini is available
   */
  isAvailable() {
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
    return hasApiKey && this.genAI && this.model;
  }

  /**
   * Extract keywords from natural language query using Gemini
   */
  async extractKeywords(originalQuery) {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI not available');
    }

    const prompt = `
Extract the most important single word from this restaurant search query: "${originalQuery}"

Return only the ONE most relevant word that would match restaurant post content.
Focus on the main concept: cuisine type, food category, or atmosphere.

Examples:
"find a pizza shop" → pizza
"cozy Italian place for date night" → italian
"quick lunch downtown" → lunch
"family friendly restaurant" → family
"expensive fine dining" → upscale
"burger joint near me" → burger
"sushi restaurant" → sushi

Query: "${originalQuery}"
Keyword:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text().trim();
      
      // Clean up the response - extract single word
      const keyword = response
        .replace(/^Keywords?:?\s*/i, '') // Remove "Keywords:" prefix
        .replace(/['"]/g, '') // Remove quotes
        .replace(/[^\w]/g, '') // Remove non-word characters
        .toLowerCase()
        .trim();

      console.log(`AI Keyword extracted: "${originalQuery}" → "${keyword}"`);
      return keyword;
    } catch (error) {
      console.error('Error extracting keywords with Gemini:', error);
      throw error;
    }
  }

  /**
   * Enhance search using AI - main function
   */
  async enhanceSearch(originalQuery, limit = 10, offset = 0, currentUserId = null) {
    try {
      // Validate input
      if (!originalQuery || originalQuery.trim().length === 0) {
        throw new Error('Original query is required');
      }

      // Check if query is worth enhancing (2+ words)
      const wordCount = originalQuery.trim().split(/\s+/).length;
      if (wordCount < 2) {
        console.log('Query too short for AI enhancement, using original');
        return await basicSearch(originalQuery, limit, offset, currentUserId);
      }

      // Extract keywords using Gemini
      const enhancedKeywords = await this.extractKeywords(originalQuery);
      
      // Perform search with enhanced keywords
      const results = await basicSearch(enhancedKeywords, limit, offset, currentUserId);
      
      console.log(`AI Enhanced search completed: ${results.length} results found`);
      return results;

    } catch (error) {
      console.error('AI search enhancement failed:', error);
      
      // Fallback to original query if AI fails
      console.log('Falling back to original search query');
      return await basicSearch(originalQuery, limit, offset, currentUserId);
    }
  }

  /**
   * Test the AI service with a sample query
   */
  async testService() {
    try {
      const testQuery = "cozy Italian restaurant for romantic dinner";
      console.log(`Testing AI service with: "${testQuery}"`);
      
      const keywords = await this.extractKeywords(testQuery);
      console.log(`Test successful - extracted keywords: "${keywords}"`);
      
      return { success: true, keywords };
    } catch (error) {
      console.error('AI service test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const aiSearchService = new AISearchService();

module.exports = {
  aiSearchService,
  enhanceSearch: (query, limit, offset, userId) => 
    aiSearchService.enhanceSearch(query, limit, offset, userId),
  extractKeywords: (query) => aiSearchService.extractKeywords(query),
  testAIService: () => aiSearchService.testService(),
  isAIAvailable: () => aiSearchService.isAvailable()
};