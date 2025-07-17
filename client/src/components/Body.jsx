import { createBrowserRouter, RouterProvider } from "react-router"
import { Login } from "./Login"
import Edit from "./Edit/Edit";
import Browse from "./Browse"
import Home from "./Home"
import { Detail } from "./Detail"
import Create from "./Create/Create"
import { Explore } from "./Explore"
import ErrorPage from "./ErrorPage"
import Donate from "./Donate"
import Profile from "./Profile"

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Browse />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "post/:id",
          element: <Detail />,
        },
        {
          path: "create",
          element: <Create />,
        },
        {
          path: "edit/:id",
          element: <Edit />,
        },
        {
          path: "profile",
          element: <Profile />,
        }, 
        {
          path: "donate",
          element: <Donate />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*", // Catch-all route for 404
      element: <ErrorPage />,
    },
  ])

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body
