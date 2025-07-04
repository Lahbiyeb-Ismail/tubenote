import BounceLoader from "react-spinners/BounceLoader";

export function Loader() {
  return (
    <div className="h-screen bg-white flex items-center justify-center container max-w-4xl mx-auto px-4 py-8">
      <BounceLoader color="#FF0000" />
    </div>
  );
}
