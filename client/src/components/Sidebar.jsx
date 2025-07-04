import { House, SquarePen, Settings, Telescope, X, LogIn } from "lucide-react"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react"
import { Link } from "react-router"
import { APP_CONFIG } from "../utils/constants/app"
import { SearchForm } from "./SearchForm"
import { useSelector } from "react-redux"
import { useSidebar } from "../hooks"

const iconMap = {
  House,
  SquarePen,
  Settings,
  Telescope,
  X,
  LogIn,
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((store) => store.user)

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <X
                    aria-hidden="true"
                    className="size-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            <SidebarContent user={user} />
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r border-gray-200 bg-white px-6 pb-4">
        <SidebarContent user={user} />
      </div>
    </>
  )
}

const SidebarContent = ({ user }) => {
  const {
    navigationList: navList,
    explore: exploreData,
    tags,
    hasMoreTags,
    showAllTags,
    setShowAllTags,
    handleTagClick,
    classNames,
  } = useSidebar(user)

  // Add icons to navigation items
  const navigationList = navList.map((item) => ({
    ...item,
    icon: iconMap[item.icon],
  }))

  // Add icon to explore data
  const explore = {
    ...exploreData,
    icon: iconMap[exploreData.icon],
  }

  return (
    <>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto  bg-white px-6">
        <div className="flex h-16 shrink-0 items-center">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              alt={APP_CONFIG.name}
              src={APP_CONFIG.logo}
              className="h-12 w-auto mt-2"
            />
          </Link>
        </div>
        <nav className="mt-6 flex flex-1 flex-col">
          <ul
            role="list"
            className="flex flex-1 flex-col gap-y-9"
          >
            <li>
              <ul
                role="list"
                className="-mx-2 space-y-1"
              >
                {navigationList.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.current
                            ? "text-white"
                            : "text-gray-400 group-hover:text-indigo-600",
                          "size-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs/6 font-semibold text-gray-400 flex flex-row gap-x-3">
                <Link
                  to={explore.href}
                  className={classNames(
                    explore.current
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                    "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold w-full"
                  )}
                >
                  <explore.icon
                    aria-hidden="true"
                    className={classNames(
                      explore.current
                        ? "text-white"
                        : "text-gray-400 group-hover:text-indigo-600",
                      "size-6 shrink-0"
                    )}
                  />
                  {explore.name}
                </Link>
              </div>
              <ul
                role="list"
                className="-mx-2 mt-2 space-y-2 flex flex-row gap-x-3 flex-wrap"
              >
                {tags.map((tag) => (
                  <li key={tag.name}>
                    <button
                      onClick={() => handleTagClick(tag.name)}
                      className={classNames(
                        tag.current
                          ? " text-white"
                          : "text-gray-700  hover:bg-gray-100 hover:text-indigo-600",
                        "w-full"
                      )}
                    >
                      <span
                        className={classNames(
                          tag.current
                            ? "border-primary bg-primary"
                            : "border-gray-600 bg-gray-50 hover:border-indigo-600 group-hover:text-indigo-600 ",
                          "flex size-6 w-full px-3 py-1 items-center justify-center rounded-xl border-[1.4px] text-[0.9rem] font-medium cursor-pointer transition-colors"
                        )}
                      >
                        {tag.name}
                      </span>
                      {/* <span className='truncate'>{tag.name}</span> */}
                    </button>
                  </li>
                ))}
              </ul>

              {/* More Button */}
              {hasMoreTags && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-purple-600 text-sm font-medium underline hover:text-purple-800 transition-colors"
                  >
                    {showAllTags ? "less" : "more"}
                  </button>
                </div>
              )}
            </li>
            <SearchForm
              className=" md:hidden border-t border-gray-200 pt-4"
              hideClearButton={true}
            />
          </ul>
        </nav>
      </div>
    </>
  )
}

export { Sidebar }
