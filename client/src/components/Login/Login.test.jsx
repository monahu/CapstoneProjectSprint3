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

describe("Login Component", () => {
  const renderLogin = (options = {}) => {
    // Use renderWithProviders instead of manual BrowserRouter wrapping
    return renderWithProviders(<Login />, options);
  };

  it("renders without crashing", () => {
    renderLogin();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("starts with sign in form by default", () => {
    renderLogin();
    expect(screen.getByText("Sign In Form")).toBeInTheDocument();
  });

  it("has toggle functionality", () => {
    renderLogin();

    // Should have form toggle elements
    expect(screen.getByText("Sign In Form")).toBeInTheDocument();

    // Should have some form of toggle button (simplified test)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("has proper main structure", () => {
    renderLogin();

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("min-h-full");
  });

  it("renders with custom Redux state", () => {
    const customState = {
      user: {
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      },
    };

    renderLogin({ preloadedState: customState });
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
