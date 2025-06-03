import Navbar from '../Navbar'
import { useState } from 'react'
import { Link } from 'react-router'
import Footer from '../Footer'
import ContinueWithButtons from './ContinueWithButtons'
import LoginForm from './LoginForm'
import { auth } from '../../utils/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { addUser } from '../../utils/userSlice'
// import { useSyncUser } from '../../hooks/useUser'

import { APP_CONFIG, ROUTES } from '../../utils/constants/app'
import { AUTH_CONFIG } from '../../utils/constants/auth'
import { UI_TEXT } from '../../utils/constants/ui'

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const dispatch = useDispatch()
  // Todo const { syncUser } = useSyncUser()

  const handleFormSubmit = (formData) => {
    const { email, password, firstName, lastName, phone, userName } = formData

    if (!isSignInForm) {
      // * Sign Up with firebase

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user
          updateProfile(user, {
            displayName: userName,
            photoURL: `${AUTH_CONFIG.avatarBaseUrl}${Math.floor(Math.random() * AUTH_CONFIG.maxAvatarNumber) + 1}`,
            email: email,
          }).then(() => {
            // * update Redux store and sync with GraphQL backend
            const { uid, email, displayName, photoURL } = auth.currentUser

            dispatch(
              addUser({
                uid,
                email,
                displayName,
                photoURL,
                firstName,
                lastName,
                phone,
              })
            )

            console.log('User signed up:', user)
            // TODO: Sync user data with GraphQL backend
            console.log('TO DO: Syncing user data with GraphQL backend')
            console.log(
              uid,
              email,
              displayName,
              photoURL,
              firstName,
              lastName,
              phone
            )
            /* syncUser({
              variables: {
                input: {
                  firebaseUid: uid,
                  email,
                  displayName,
                  photoURL,
                  firstName,
                  lastName,
                  phone,
                },
              },
            }).catch((error) => {
              console.error("Error syncing user data:", error)
            }) */
          })
        })
        .catch((error) => {
          setErrorMessage(`${error.code}: ${error.message}`)
        })
    } else {
      // * Sign In
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user
          console.log('User signed in:', user.uid)
          console.log('auth form firebase user', auth.currentUser)
        })
        .catch((error) => {
          setErrorMessage(`${error.code}: ${error.message}`)
        })
    }
  }

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm)
    setErrorMessage(null)
  }

  return (
    <div className='min-h-screen  bg-white '>
      <Navbar />
      <div className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 gradient-bg'>
        {/* sub title */}
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <Link
            to={ROUTES.HOME}
            className='w-full bg-transparent border-none'
          >
            <img
              alt={APP_CONFIG.name}
              src={APP_CONFIG.logo}
              className='mx-auto h-10 w-auto'
            />
          </Link>
          <h2 className='mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
            {isSignInForm ? UI_TEXT.login.signIn : UI_TEXT.login.signUp}{' '}
            {UI_TEXT.login.toAccount}
          </h2>
        </div>
        {/* form card */}
        <div
          className={`mt-10 lg:max-w-[600px] sm:mx-auto sm:w-full sm:max-w-[480px]`}
        >
          <div className='bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12'>
            {errorMessage && (
              <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                {errorMessage}
              </div>
            )}
            <LoginForm
              isSignInForm={isSignInForm}
              onSubmit={handleFormSubmit}
            />
            {isSignInForm && <ContinueWithButtons />}
          </div>

          <p
            className='mt-10 text-center text-sm/6 text-gray-500 cursor-pointer'
            onClick={toggleSignInForm}
          >
            {isSignInForm
              ? UI_TEXT.login.newToApp
              : UI_TEXT.login.alreadyRegistered}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
