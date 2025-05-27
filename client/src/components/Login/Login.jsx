import Navbar from "../Navbar";
import { useState } from "react";
import { Link } from "react-router";
import Footer from "../Footer";
import ContinueWithButtons from "./ContinueWithButtons";
import LoginForm from "./LoginForm";
import { auth } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";

import { APP_CONFIG, ROUTES } from "../../utils/constants/app";
import { AUTH_CONFIG } from "../../utils/constants/auth";
import { UI_TEXT } from "../../utils/constants/ui";
import { FORM_CONFIG } from "../../utils/constants/form";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleFormSubmit = (formData) => {
    const { email, password } = formData;

    if (!isSignInForm) {
      // Sign Up
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: formData.userName,
            photoURL: `${AUTH_CONFIG.avatarBaseUrl}${Math.floor(Math.random() * AUTH_CONFIG.maxAvatarNumber) + 1}`,
            email: formData.email,
          })
            .then(() => {
              // Profile updated!
              // update store again - or displayname and photo cannot show correctly
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid,
                  email,
                  displayName,
                  photoURL,
                })
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          setErrorMessage(`${error.code}: ${error.message}`);
        });
    } else {
      // Sign In
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User signed in:", user);
        })
        .catch((error) => {
          setErrorMessage(`${error.code}: ${error.message}`);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* sub title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link
            to={ROUTES.HOME}
            className="w-full bg-transparent border-none"
          >
            <img
              alt={APP_CONFIG.name}
              src={APP_CONFIG.logo}
              className="mx-auto h-10 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {isSignInForm ? UI_TEXT.login.signIn : UI_TEXT.login.signUp}{" "}
            {UI_TEXT.login.toAccount}
          </h2>
        </div>
        {/* form card */}
        <div
          className={`mt-10 lg:max-w-[${FORM_CONFIG.maxWidth.lg}] sm:mx-auto sm:w-full sm:max-w-[${FORM_CONFIG.maxWidth.sm}]`}
        >
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
            className="mt-10 text-center text-sm/6 text-gray-500 cursor-pointer"
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
  );
};

export default Login;
