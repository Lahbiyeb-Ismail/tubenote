import Image from "next/image";
import Link from "next/link";

function TubeNoteLogo() {
  return (
    <div className="w-[150px]">
      <Link href="/">
        <Image
          src="/images/logo-3.png"
          alt="tubenote logo"
          width={232}
          height={72}
        />
      </Link>
    </div>
  );
}

export default TubeNoteLogo;
