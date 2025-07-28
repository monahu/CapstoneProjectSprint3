/**
 * Post Service Index - Entry point for all post-related operations
 * Combines CRUD, interaction, tag management, and search services
 */

const crudService = require('./postCrudService')
const interactionService = require('./postInteractionService')
const tagService = require('./postTagService')
const searchService = require('./postSearchService')

module.exports = {
  // CRUD Operations
  ...crudService,
  
  // User Interactions
  ...interactionService,
  
  // Tag Management
  ...tagService,
  
  // Search Operations
  ...searchService,
}