import Navbar from '../Navbar'
import { useState } from 'react'
import { Link } from 'react-router'
import Footer from '../Footer'
import ContinueWithButtons from './ContinueWithButtons'
import LoginForm from './LoginForm'
import { useAuth } from '../../hooks/useAuth'
import { APP_CONFIG, ROUTES } from '../../utils/constants/app'
import { UI_TEXT } from '../../utils/constants/ui'
import Hero from '../Hero'
import heroImage from '../../assets/img/login_hero1.webp'

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true)
  const { signIn, signUp, errorMessage, isLoading } = useAuth()

  const handleFormSubmit = async (formData) => {
    try {
      if (isSignInForm) {
        const { email, password } = formData
        await signIn(email, password)
      } else {
        await signUp(formData)
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm)
  }

  return (
    <div className='min-h-screen  bg-white '>
      <Navbar />
      <div className='flex min-h-full flex-1 flex-col justify-center p-6 sm:px-6 lg:px-8 gradient-bg'>
        <Hero
          heroImage={heroImage}
          title={
            isSignInForm ? UI_TEXT.loginHero.title : UI_TEXT.signupHero.title
          }
          description={UI_TEXT.loginHero.description}
          buttonText={UI_TEXT.loginHero.button}
          showButton={false}
          className='min-h-[30vh]'
          contentClassName='max-w-md'
        />
        {/* sub title */}
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <Link
            to={ROUTES.HOME}
            className='w-full bg-transparent border-none'
          >
            <img
              alt={APP_CONFIG.name}
              src={APP_CONFIG.logo}
              className='mx-auto w-auto'
            />
          </Link>
          <h2 className='mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
            {isSignInForm ? UI_TEXT.login.signIn : UI_TEXT.login.signUp}{' '}
            {UI_TEXT.login.toAccount}
          </h2>
          <p
            className='mt-1 text-center text-sm/6 text-gray-500 cursor-pointer'
            onClick={toggleSignInForm}
          >
            {isSignInForm
              ? UI_TEXT.login.newToApp
              : UI_TEXT.login.alreadyRegistered}
          </p>
        </div>
        {/* form card */}
        <div
          className={`mt-2 lg:max-w-[600px] sm:mx-auto sm:w-full sm:max-w-[480px]`}
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
              isLoading={isLoading}
            />
            {/*    {isSignInForm && <ContinueWithButtons />} */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
