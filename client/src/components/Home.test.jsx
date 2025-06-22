import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router"
import Home from "./Home"

// Mock the Hero component
vi.mock("./Hero", () => ({
  default: ({ heroImage, onButtonClick }) => (
    <div data-testid="hero-component">
      <img
        src={heroImage}
        alt="hero"
      />
      <button
        onClick={onButtonClick}
        data-testid="hero-button"
      >
        Get Started
      </button>
    </div>
  ),
}))

// Mock the RestaurantCard component
vi.mock("./RestaurantCard", () => ({
  default: ({ id }) => (
    <div data-testid={`restaurant-card-${id}`}>Restaurant Card {id}</div>
  ),
}))

const mockNavigate = vi.fn()
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe("Home Component", () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders without crashing", () => {
    renderHome()
    expect(screen.getByTestId("hero-component")).toBeInTheDocument()
  })

  it("renders hero section", () => {
    renderHome()

    expect(screen.getByTestId("hero-component")).toBeInTheDocument()
    expect(screen.getByAltText("hero")).toBeInTheDocument()
  })

  it("renders restaurant cards", () => {
    renderHome()

    // With real POSTS_DATA, we only have one post with id: 1
    expect(screen.getByTestId("restaurant-card-1")).toBeInTheDocument()
  })

  it("has proper layout structure", () => {
    const { container } = renderHome()

    const homeDiv = container.firstChild
    expect(homeDiv).toHaveClass("min-h-screen")
  })
})
