import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

function Loader() {
  return (
    <div className="height_viewport flex w-full items-center justify-center bg-gray-100">
      <BounceLoader color="#FF0000" />
    </div>
  );
}

export default Loader;
