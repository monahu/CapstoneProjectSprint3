import { ChevronDown, Menu as MenuIcon, Search } from 'lucide-react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router'
import { APP_CONFIG } from '../utils/constants/app'
import { ROUTES } from '../utils/constants/app'
import { UI_TEXT } from '../utils/constants/ui'
import { useNavbar } from '../hooks/useNavbar'
import SearchForm from './SearchForm'

const Navbar = ({ setSidebarOpen }) => {
  // manage navigation bar behavior state
  const { user, userNavigation, hideLogoRoutes, location } = useNavbar()

  return (
    <div className='sticky top-0 z-40 flex h-16 items-center gap-x-4 bg-white px-4 shadow sm:px-6 lg:px-8 border-b  border-gray-200'>
      {hideLogoRoutes.includes(location.pathname) && (
        <div className='flex-1'>
          <Link
            to={ROUTES.HOME}
            className='flex items-center hover:opacity-80 transition-opacity'
          >
            <img
              alt={APP_CONFIG.name}
              src={APP_CONFIG.logo}
              className='h-12 w-auto'
            />
          </Link>
        </div>
      )}
      {/* Mobile sidebar button */}
      {!hideLogoRoutes.includes(location.pathname) && (
        <>
          <button
            onClick={() => setSidebarOpen(true)}
            className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
          >
            <MenuIcon className='size-6' />
          </button>
          <div className='flex-1 md:hidden mx-auto'>
            <Link
              to={ROUTES.HOME}
              className='flex items-center hover:opacity-80 transition-opacity'
            >
              <img
                alt={APP_CONFIG.name}
                src={APP_CONFIG.logo}
                className='h-9 w-auto'
              />
            </Link>
          </div>
          {/* Search */}
          <SearchForm className='hidden md:grid' />
        </>
      )}

      {/* Right controls */}
      <div className='flex items-center gap-x-4 ms-auto'>
        {!user && (
          <>
            <button className='text-gray-400 hover:text-gray-500'>
              <a
                className='btn'
                href={ROUTES.LOGIN}
              >
                {UI_TEXT.login.loginSignup}
              </a>
            </button>
          </>
        )}

        {user && (
          <Menu>
            <MenuButton className='flex items-center'>
              <img
                src={user?.photoURL}
                alt="user's icon"
                className='size-8 rounded-full'
              />
              <span className='ml-2 text-sm font-semibold text-gray-900 hidden lg:inline'>
                userName
              </span>
              <ChevronDown className='ml-1 size-4 text-gray-400 hidden lg:inline' />
            </MenuButton>
            <MenuItems className='absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow ring-1 ring-black/5 focus:outline-none'>
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  {item.action ? (
                    <button
                      type='button'
                      onClick={() => item.action()}
                      className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50'
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    >
                      {item.name}
                    </Link>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        )}
      </div>
    </div>
  )
}

export default Navbar
