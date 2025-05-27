import Navbar from './Navbar'
import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { useState } from 'react'
import Footer from './Footer'
import { House, SquarePen, Settings } from 'lucide-react'
/**
 * Main layout component for browsing the application
 * Contains the sidebar, navbar and content area
 */
const navigationList = [
  { name: 'Home', href: '/', icon: House, current: true },
  { name: 'Create', href: '/create', icon: SquarePen, current: false },
  { name: 'Profile', href: '/profile', icon: Settings, current: false },
]

const Browse = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='min-h-screen flex'>
      {/* Sidebar component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationList={navigationList}
      />

      {/* Main content area */}
      <div className='flex flex-col flex-1 lg:pl-72'>
        {/* Top navigation */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className='flex-1 overflow-y-auto bg-white p-4 sm:p-6'>
          <Outlet />
        </main>
        <Footer navigationList={navigationList} />
      </div>
    </div>
  )
}

export default Browse
