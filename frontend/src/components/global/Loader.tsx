import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

function Loader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <BounceLoader color="#FF0000" />
    </div>
  );
}

export default Loader;
