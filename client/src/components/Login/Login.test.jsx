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
