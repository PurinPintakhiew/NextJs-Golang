import { signIn, signOut, useSession } from "next-auth/react";

export default function MasterNevBar() {
  const { data: session } = useSession();
  return (
    <div className="flex bg-gray-700 text-white justify-between items-center">
      <div>Next Js Beginner Project</div>
      <div className="flex gap-2 items-center">
        {session ? (
          <>
            <span>Signed in as {session?.user?.email}</span>
            <button onClick={() => signOut()} className="bg-red-500 p-2 border-1 border-white">
              Sign out
            </button>
          </>
        ) : (
          <>
            <span>Not signed in</span>
            <button onClick={() => signIn()} className="bg-green-500 p-2 border-1 border-white">
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
