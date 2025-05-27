import { ROUTES } from "./app";
import { UI_TEXT } from "./ui";

export const NAVIGATION = {
  userDropdown: [
    { name: UI_TEXT.buttons.profile, href: ROUTES.PROFILE },
    { name: UI_TEXT.buttons.signOut, href: "#", hasAction: true },
  ],
  hideLogoRoutes: [ROUTES.LOGIN],
  sidebar: [
    { name: "Home", href: ROUTES.HOME, icon: "House", current: true },
    { name: "Create", href: ROUTES.CREATE, icon: "SquarePen", current: false },
    { name: "Profile", href: ROUTES.PROFILE, icon: "Settings", current: false },
  ],
  explore: {
    name: "Explore",
    href: ROUTES.EXPLORE,
    icon: "Telescope",
    current: false,
  },
  tags: [{ id: 1, name: "tag1", genre: "normal", current: false }],
};

export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
  github: "#",
};
