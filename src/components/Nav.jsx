import Link from "next/link";
import { auth } from "src/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href={"/"}>
        <button className="text-lg font-medium">Creative Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <span className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
              Join Now
            </span>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-cyan-500 text-white py-2 px-6 rounded-mg text-sm rounded-lg">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <Image
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
                width={48}
                height={48}
                alt="avatar"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
