import { describe, it, expect } from 'vitest'

// Simple utility functions for testing
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US')
  } catch {
    return 'Invalid Date'
  }
}

const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats valid date', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
    })

    it('handles invalid date', () => {
      expect(formatDate('invalid')).toBe('Invalid Date')
    })
  })

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated'
      const result = truncateText(longText, 20)
      expect(result).toBe('This is a very long ...')
    })

    it('keeps short text unchanged', () => {
      const shortText = 'Short text'
      const result = truncateText(shortText, 20)
      expect(result).toBe('Short text')
    })

    it('handles empty text', () => {
      expect(truncateText('')).toBe('')
      expect(truncateText(null)).toBe('')
    })
  })

  describe('slugify', () => {
    it('creates valid slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
    })

    it('handles special characters', () => {
      expect(slugify('Test & Example')).toBe('test-example')
    })

    it('removes extra dashes', () => {
      expect(slugify('---test---')).toBe('test')
    })
  })
})
