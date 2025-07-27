import { createBrowserRouter, RouterProvider } from 'react-router'
import { lazy, Suspense } from 'react'
import LoadingState from './LoadingState'
import Browse from './Browse'
import Home from './Home'
import ScrollToTop from './ScrollToTop'
import { UI_TEXT } from '../utils/constants/ui'

// Lazy load heavy components
const Login = lazy(() => import('./Login').then((m) => ({ default: m.Login })))
const Edit = lazy(() => import('./Edit/Edit'))
const Detail = lazy(() =>
  import('./Detail').then((m) => ({ default: m.Detail }))
)
const Create = lazy(() => import('./Create/Create'))
const Explore = lazy(() =>
  import('./Explore').then((m) => ({ default: m.Explore }))
)
const ErrorPage = lazy(() => import('./ErrorPage'))
const Donate = lazy(() => import('./Donate'))
const Profile = lazy(() => import('./Profile'))

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: (
        <ScrollToTop>
          <Browse />
        </ScrollToTop>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'restaurant/:slug',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Detail />
            </Suspense>
          ),
        },
        {
          path: 'create',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Create />
            </Suspense>
          ),
        },
        {
          path: 'edit/:id',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Edit />
            </Suspense>
          ),
        },
        {
          path: 'profile',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: 'donate',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Donate />
            </Suspense>
          ),
        },
        {
          path: 'explore',
          element: (
            <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
              <Explore />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '/login',
      element: (
        <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: '*', // Catch-all route for 404
      element: (
        <Suspense fallback={<LoadingState type={UI_TEXT.loadingTypes.COMPONENT} />}>
          <ErrorPage />
        </Suspense>
      ),
    },
  ])

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body
