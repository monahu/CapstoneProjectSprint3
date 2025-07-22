# Unit Test Suite

This directory contains unit tests for the React application components and utilities.

## Test Files

### Components

- `src/components/Hero.test.jsx` - Tests for the Hero component
- `src/components/Home.test.jsx` - Tests for the Home page component
- `src/components/Login/Login.test.jsx` - Tests for the Login component

### Utilities

- `src/utils/validationSchema.test.js` - Tests for form validation schemas
- `src/test/testUtils.js` - Test utilities and mocks

## Running Tests

```bash
# Run all unit tests
npm test src/

# Run specific test file
npx vitest run src/components/Hero.test.jsx

# Run tests in watch mode
npx vitest src/
```

## Test Coverage

The tests cover:

- ✅ Component rendering
- ✅ User interactions
- ✅ Form validation
- ✅ Props handling
- ✅ CSS classes and styling
- ✅ Error handling
- ✅ Basic accessibility

## Test Structure

All tests use:

- **Vitest** as the test runner
- **React Testing Library** for component testing
- **Vi** for mocking
- **jsdom** environment for DOM simulation

## Mocking Strategy

- External dependencies are mocked at the module level
- Components are mocked with simple test doubles
- Firebase and GraphQL are mocked to avoid external dependencies
- React Router is mocked for navigation testing
