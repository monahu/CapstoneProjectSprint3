import { Bell, ChevronDown, Menu as MenuIcon, Search } from 'lucide-react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useLocation, useNavigate } from 'react-router'

const Navbar = ({ setSidebarOpen, userNavigation }) => {
  const user = false
  const location = useLocation()
  const navigate = useNavigate()
  const hideLogoRoutes = ['/login', '/signup']

  return (
    <div className='sticky top-0 z-40 flex h-16 items-center gap-x-4 bg-white px-4 shadow sm:px-6 lg:px-8 border-b  border-gray-200'>
      {hideLogoRoutes.includes(location.pathname) && (
        <div className='flex-1 hidden md:block'>
          <button
            className='btn btn-ghost text-xl'
            onClick={() => navigate('/')}
          >
            RestJAM
          </button>
        </div>
      )}
      {/* Mobile sidebar button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
      >
        <MenuIcon className='size-6' />
      </button>
      {/* Search */}
      <form
        action='#'
        method='GET'
        className='grid flex-1 grid-cols-1'
      >
        <input
          name='search'
          type='search'
          placeholder='Search'
          aria-label='Search'
          className='col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6'
        />
        <Search
          aria-hidden='true'
          className='pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400'
        />
      </form>
      {/* Right controls */}
      <div className='flex items-center gap-x-4'>
        {!user && (
          <>
            <button className='text-gray-400 hover:text-gray-500'>
              <a
                className='btn'
                href='/login'
              >
                Login/Signup
              </a>
            </button>
          </>
        )}

        {user && (
          <Menu>
            <MenuButton className='flex items-center'>
              <img
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
                alt=''
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
                  <a
                    href={item.href}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                  >
                    {item.name}
                  </a>
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
