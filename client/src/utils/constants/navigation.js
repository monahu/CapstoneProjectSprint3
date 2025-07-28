import { ROUTES } from './app'
import { UI_TEXT } from './ui'

export const NAVIGATION = {
  userDropdown: [
    { name: UI_TEXT.buttons.profile, href: ROUTES.PROFILE },
    { name: UI_TEXT.buttons.signOut, href: '#', hasAction: true },
  ],
  hideLogoRoutes: [ROUTES.LOGIN],
  protectedRoutes: [ROUTES.PROFILE, ROUTES.CREATE, ROUTES.EXPLORE, ROUTES.EDIT],
  sidebar: [
    { name: 'Home', href: ROUTES.HOME, icon: 'House', current: true },
    { name: 'Create', href: ROUTES.CREATE, icon: 'SquarePen', current: false },
    { name: 'Profile', href: ROUTES.PROFILE, icon: 'Settings', current: false },
  ],
  footer: [
    {
      name: 'Buy me a coffee',
      href: ROUTES.DONATE,
      icon: 'coffee',
      current: false,
    },
  ],
  sidebarVisitor: [
    { name: 'Home', href: ROUTES.HOME, icon: 'House', current: true },
    { name: 'Login', href: ROUTES.LOGIN, icon: 'LogIn', current: false },
  ],
  explore: {
    name: 'Explore',
    href: ROUTES.EXPLORE,
    icon: 'Telescope',
    current: false,
  },
  tags: [
    { id: 1, name: 'tag1xxx', genre: 'normal', current: true },
    { id: 2, name: 'tag2', genre: 'normal', current: false },
    { id: 3, name: 'tag3', genre: '', current: false },
    { id: 4, name: 'tag4', genre: '', current: false },
    { id: 5, name: 'tag5', genre: 'normal', current: false },
  ],
}

export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  twitter: '#',
  github: '#',
}
