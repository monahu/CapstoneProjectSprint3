import { describe, it, expect, beforeEach, vi } from "vitest"
import { screen, fireEvent } from "@testing-library/react"
import { Sidebar } from "./Sidebar"
import { renderWithProviders } from "../test/testUtils"

// Mock SearchForm component for test isolation
vi.mock("./SearchForm", () => ({
  default: function SearchForm({ className }) {
    return (
      <div
        data-testid="search-form"
        className={className}
      >
        Search Form
      </div>
    )
  },
}))

describe("Sidebar Component", () => {
  const mockSetSidebarOpen = vi.fn()

  beforeEach(() => {
    mockSetSidebarOpen.mockClear()
  })

  describe("Mobile Sidebar", () => {
    it("renders mobile dialog when sidebarOpen is true", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={true}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      expect(screen.getByRole("dialog")).toBeInTheDocument()
    })

    it("does not render mobile dialog when sidebarOpen is false", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })

    it("calls setSidebarOpen when close button is clicked", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={true}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const closeButton = screen.getByRole("button")
      fireEvent.click(closeButton)

      expect(mockSetSidebarOpen).toHaveBeenCalledWith(false)
    })

    it("has proper accessibility attributes for close button", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={true}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const closeButton = screen.getByRole("button")
      expect(closeButton).toHaveAttribute("type", "button")
      expect(screen.getByText("Close sidebar")).toBeInTheDocument() // confirms there's readable text for screen readers
    })
  })

  describe("Desktop Sidebar", () => {
    it("always renders desktop sidebar", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      // Desktop sidebar should be present regardless of sidebarOpen state
      const desktopSidebar = document.querySelector(".lg\\:fixed")
      expect(desktopSidebar).toBeInTheDocument()
    })
  })

  describe("User Authentication State", () => {
    it("renders authenticated user navigation when user is present", () => {
      const mockUser = { id: 1, name: "Test User" }

      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />,
        { preloadedState: { user: mockUser } }
      )

      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Create")).toBeInTheDocument()
      expect(screen.getByText("Profile")).toBeInTheDocument()
      expect(screen.queryByText("Login")).not.toBeInTheDocument()
    })

    it("renders visitor navigation when user is null", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />,
        { preloadedState: { user: null } }
      )

      expect(screen.getByText("Home")).toBeInTheDocument()
      expect(screen.getByText("Login")).toBeInTheDocument()
      expect(screen.queryByText("Create")).not.toBeInTheDocument()
      expect(screen.queryByText("Profile")).not.toBeInTheDocument()
    })
  })

  describe("Navigation Links", () => {
    it("renders navigation links with correct hrefs", () => {
      const mockUser = { id: 1, name: "Test User" }
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />,
        { preloadedState: { user: mockUser } }
      )

      expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
        "href",
        "/"
      )
      expect(screen.getByRole("link", { name: /create/i })).toHaveAttribute(
        "href",
        "/create"
      )
      expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute(
        "href",
        "/profile"
      )
    })

    it("applies current styling to active navigation item", () => {
      const mockUser = { id: 1, name: "Test User" }

      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />,
        { preloadedState: { user: mockUser } }
      )

      const homeLink = screen.getByRole("link", { name: /home/i })
      expect(homeLink).toHaveClass("bg-primary", "text-white")
    })

    it("applies hover styling to non-active navigation items", () => {
      const mockUser = { id: 1, name: "Test User" }

      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />,
        { preloadedState: { user: mockUser } }
      )

      const createLink = screen.getByRole("link", { name: /create/i })
      expect(createLink).toHaveClass("text-gray-700", "hover:bg-gray-50")
    })
  })

  describe("App Branding", () => {
    it("renders app logo and name", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const logo = screen.getByRole("img")
      expect(logo).toHaveAttribute("alt", "RestJAM")
      expect(logo).toHaveAttribute("src", "restJAM-logo.svg")
    })
  })

  describe("Explore Section", () => {
    it("renders explore section with correct link", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const exploreLink = screen.getByRole("link", { name: /explore/i })
      expect(exploreLink).toHaveAttribute("href", "/explore")
    })
  })

  describe("Tags Section", () => {
    it("renders all tags", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      expect(screen.getByText("tag1xxx")).toBeInTheDocument()
      expect(screen.getByText("tag2")).toBeInTheDocument()
      expect(screen.getByText("tag3")).toBeInTheDocument()
      expect(screen.getByText("tag4")).toBeInTheDocument()
      expect(screen.getByText("tag5")).toBeInTheDocument()
    })

    it("applies current styling to active tag", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const activeTag = screen.getByText("tag1xxx")
      const tagSpan = activeTag.closest("span")
      expect(tagSpan).toHaveClass("border-primary", "bg-primary")
    })

    it("applies default styling to inactive tags", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const inactiveTag = screen.getByText("tag2")
      const tagSpan = inactiveTag.closest("span")
      expect(tagSpan).toHaveClass("border-gray-600", "bg-gray-50")
    })
  })

  describe("Search Form", () => {
    it("renders search form on mobile with correct styling", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const searchForm = screen.getByTestId("search-form")
      expect(searchForm).toBeInTheDocument()
      expect(searchForm).toHaveClass(
        "md:hidden",
        "border-t",
        "border-gray-200",
        "pt-4"
      )
    })
  })

  describe("Responsive Behavior", () => {
    it("has correct responsive classes for mobile dialog", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={true}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const dialog = screen.getByRole("dialog")
      expect(dialog).toHaveClass("lg:hidden")
    })

    it("has correct responsive classes for desktop sidebar", () => {
      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />
      )

      const desktopSidebar = document.querySelector(".lg\\:fixed")
      expect(desktopSidebar).toHaveClass("hidden", "lg:fixed", "lg:inset-y-0")
    })
  })

  describe("Icon Rendering", () => {
    it("renders icons for navigation items", () => {
      const mockUser = { id: 1, name: "Test User" }

      renderWithProviders(
        <Sidebar
          sidebarOpen={false}
          setSidebarOpen={mockSetSidebarOpen}
        />,
        { preloadedState: { user: mockUser } }
      )

      // Icons should be present (they have aria-hidden="true")
      const icons = document.querySelectorAll('[aria-hidden="true"]')
      expect(icons.length).toBeGreaterThan(0)
    })
  })
})
