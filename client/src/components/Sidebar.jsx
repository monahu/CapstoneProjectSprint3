import { House, SquarePen, Settings, Telescope, X, Menu } from 'lucide-react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'

const navigationList = [
  { name: 'Dashboard', href: '#', icon: House, current: true },
  { name: 'Create', href: '#', icon: SquarePen, current: false },
  { name: 'Profile', href: '#', icon: Settings, current: false },
]
const explore = {
  name: 'Explore',
  href: '#',
  icon: Telescope,
  current: false,
}
const tags = [{ id: 1, name: 'tag1', genre: 'normal', current: false }]

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  // const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className='relative z-50 lg:hidden'
      >
        <DialogBackdrop
          transition
          className='fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0'
        />

        <div className='fixed inset-0 flex'>
          <DialogPanel
            transition
            className='relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full'
          >
            <TransitionChild>
              <div className='absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0'>
                <button
                  type='button'
                  onClick={() => setSidebarOpen(false)}
                  className='-m-2.5 p-2.5'
                >
                  <span className='sr-only'>Close sidebar</span>
                  <X
                    aria-hidden='true'
                    className='size-6 text-white'
                  />
                </button>
              </div>
            </TransitionChild>
            <SidebarContent
              navigationList={navigationList}
              tags={tags}
              explore={explore}
            />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r border-gray-200  bg-white px-6 pb-4'>
        <SidebarContent
          navigationList={navigationList}
          tags={tags}
          explore={explore}
        />
      </div>
    </>
  )
}

const SidebarContent = ({ navigationList, tags, explore }) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className='flex grow flex-col gap-y-5 overflow-y-auto  bg-white px-6'>
        <div className='flex h-16 shrink-0 items-center'>
          <img
            alt='RestJAM'
            src='logo.png'
            className='h-8 w-auto'
          />
        </div>
        <nav className='flex flex-1 flex-col'>
          <ul
            role='list'
            className='flex flex-1 flex-col gap-y-7'
          >
            <li>
              <ul
                role='list'
                className='-mx-2 space-y-1'
              >
                {navigationList.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                      )}
                    >
                      <item.icon
                        aria-hidden='true'
                        className={classNames(
                          item.current
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          'size-6 shrink-0'
                        )}
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className='text-xs/6 font-semibold text-gray-400'>
                <a
                  href={explore.href}
                  className={classNames(
                    explore.current
                      ? 'bg-gray-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                  )}
                >
                  <explore.icon
                    aria-hidden='true'
                    className={classNames(
                      explore.current
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-indigo-600',
                      'size-6 shrink-0'
                    )}
                  />
                  {explore.name}
                </a>
              </div>
              <ul
                role='list'
                className='-mx-2 mt-2 space-y-1'
              >
                {tags.map((tag) => (
                  <li key={tag.name}>
                    <a
                      className={classNames(
                        tag.current
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                      )}
                    >
                      <span
                        className={classNames(
                          tag.genre
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600',
                          'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium'
                        )}
                      >
                        {tag.name}
                      </span>
                      {/* <span className='truncate'>{tag.name}</span> */}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

export { Sidebar }
