import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "./Login";
import Browse from "./Browse";
import Home from "./Home";
import ErrorPage from "./ErrorPage";
const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Browse />,
      children: [
        {
          index: true, // this is for "/"
          element: <Home />,
        },
        /* {
          path: "create",
          element: <Create />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "explore",
          element: <Explore />,
        }, */
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
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
