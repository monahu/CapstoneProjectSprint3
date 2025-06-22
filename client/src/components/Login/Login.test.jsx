import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  mockSignInData,
  mockSignUpData,
} from "../../test/testUtils";
import Login from "./Login";

// Mock the useAuth hook
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    errorMessage: null,
    isLoading: false,
  }),
}));

// Mock components
vi.mock("../Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../Footer", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("../Hero", () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));

vi.mock("./LoginForm", () => ({
  default: ({ isSignInForm, onSubmit }) => (
    <form
      data-testid="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        // Use mock data from testUtils
        const formData = isSignInForm ? mockSignInData : mockSignUpData;
        onSubmit(formData);
      }}
    >
      <div data-testid="form-type">
        {isSignInForm ? "Sign In Form" : "Sign Up Form"}
      </div>
      <button type="submit">{isSignInForm ? "Sign In" : "Sign Up"}</button>
    </form>
  ),
}));
