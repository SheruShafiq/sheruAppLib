import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NotFoundPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100">
      <div className="row flex-grow-1 align-items-center">
        <div className="col-12 col-md-8 offset-md-2 text-center">
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
      </div>
      <footer className="row py-3">
        <div className="col-12 text-center">
          <p className="mb-1">Contact Me</p>
          <p className="mb-0">
            <a
              href="mailto:humaira.laeeq@gmail.com"
              className="mx-2 text-decoration-none"
            >
              Email
            </a>
            <a
              href="https://github.com/sherushafiq"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 text-decoration-none"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/sherushfq/"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2 text-decoration-none"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
