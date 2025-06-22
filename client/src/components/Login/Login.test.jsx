import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import {
  renderWithProviders,
  mockSignInData,
  mockSignUpData,
} from "../../test/testUtils";
import Login from "./Login";
