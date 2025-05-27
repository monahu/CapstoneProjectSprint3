import { Link } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { APP_CONFIG } from "../utils/constants/app";
import { ROUTES } from "../utils/constants/app";
import { UI_TEXT } from "../utils/constants/ui";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-md mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {UI_TEXT.error.pageNotFound}
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {UI_TEXT.error.pageNotFoundDesc}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to={ROUTES.HOME}
              className="inline-block w-full sm:w-auto px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              {UI_TEXT.error.goHome}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-block w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {UI_TEXT.error.goBack}
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-sm text-gray-500">
            <p>{UI_TEXT.error.needHelp}</p>
            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              {APP_CONFIG.supportEmail}
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ErrorPage;
