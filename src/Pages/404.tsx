import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "@components/Header";
import Footer from "@components/Footer";

const NotFoundPage = ({
  isLoggedIn,
  userData,
  setOpen,
  setIsLoggedIn,
  categories,
  refreshUserData,
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="px-0  flex-column min-vh-100 d-flex">
      <header className="row w-100">
        <Header
          isLoggedIn={isLoggedIn}
          userData={userData}
          setOpen={setOpen}
          setIsLoggedIn={setIsLoggedIn}
          categories={categories}
          onPostCreated={refreshUserData}
          callerIdentifier={"404Page"}
        />
      </header>
      <hr className="my-0" />

      <main className=" w-100 h-100 px-1 row flex-grow-1 align-items-center">
        <div className="text-center">
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Oops! Page Not Found</h2>
          <p className="lead">
            We're sorry, but the page you were looking for doesn't exist.
          </p>
          <p>It might have been moved or deleted. Please check the URL.</p>
          <div className="d-flex justify-content-center flex-wrap">
            <a href="/" className="btn btn-primary m-1">
              Home
            </a>
            <button
              onClick={handleBack}
              className="btn btn-outline-primary m-1"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
