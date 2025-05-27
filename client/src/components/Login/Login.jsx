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

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const handleFormSubmit = (formData) => {
    // Handle form submission logic after validation here

    console.log("Form submitted:", formData);
    if (!isSignInForm) {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: formData.userName,
            photoURL: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 150) + 1}`,
            email: formData.email,
          })
            .then(() => {
              // Profile updated!
              // update store again - or displayname and photo cannot show correctly
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL,
                })
              );
            })
            .catch((error) => {
              // An error occurred
              setErrorMessage(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
          // ..
        });
    } else {
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed in:", user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null); // Clear error when switching forms
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* sub title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link
            to={"/"}
            className="w-full bg-transparent border-none"
          >
            <img
              alt="RestJAM"
              src="logo.png"
              className="mx-auto h-10 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {isSignInForm ? "Log in" : "Sign up"} to your account
          </h2>
        </div>
        {/* form card */}
        <div className="mt-10 lg:max-w-[600px] sm:mx-auto sm:w-full sm:max-w-[480px]">
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
              ? "New to RestJAM? 👉Sign Up👈 Now"
              : "Already registered? 👉Login In👈 Now."}
          </p>
        </div>
      </div>
      <Footer navigationList={[]} />
    </div>
  );
};

export default Login;
