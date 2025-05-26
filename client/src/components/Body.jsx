import { createBrowserRouter, RouterProvider } from 'react-router'
import Login from './Login'
import Browse from './Browse'
const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Browse />,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ])

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body
