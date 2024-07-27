import MasterNevBar from "@/components/MasterNevBar";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MasterLayout({ children }: any) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
    }
  }, [session]);

  return (
    <div className="">
      <Head>
        <title>Next Js Beginner Project</title>
      </Head>
      <main className="">
        <MasterNevBar />
        <div className="">{children}</div>
      </main>
    </div>
  );
}
