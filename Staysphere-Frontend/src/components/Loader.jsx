import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 w-100">
      <div className="text-center">
        <FadeLoader
          color="#000"
          loading={true}
          size={50}
          aria-label="Loading Spinner"
        />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;