export function FooterCopyright() {
  return (
    <div className="border-t border-gray-800 pt-8 text-center">
      <p className="text-gray-400">
        ©
        {" "}
        {new Date().getFullYear()}
        {" "}
        TubeNote. All rights reserved.
      </p>
    </div>
  );
}
