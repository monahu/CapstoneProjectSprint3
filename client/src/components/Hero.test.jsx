import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "./Hero";

describe("Hero Component", () => {
  const defaultProps = {
    heroImage: "test-image.jpg",
  };

  it("renders with default props", () => {
    render(<Hero {...defaultProps} />);

    // Should render the hero container
    const heroDiv = document.querySelector(".hero");
    expect(heroDiv).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    render(
      <Hero
        {...defaultProps}
        title="Custom Title"
        description="Custom Description"
      />
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
  });

  it("hides button when showButton is false", () => {
    render(
      <Hero {...defaultProps} showButton={false} buttonText="Hidden Button" />
    );

    expect(screen.queryByText("Hidden Button")).not.toBeInTheDocument();
  });

  it("applies background image style", () => {
    render(<Hero {...defaultProps} />);

    const heroDiv = document.querySelector(".hero");
    expect(heroDiv).toHaveStyle({
      backgroundImage: "url(test-image.jpg)",
    });
  });
});
