import { auth } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  let href = userId ? "/journal" : "/new-user";
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-6">The Best Journal App</h1>
        <p className="text-2xl text-white/60 mb-6">
          This is the best app for tracking your mood, it uses AI to tell you
          how have you been feeling and will also generate title and status for
          your journals.
        </p>
        <Link href={href}>
          <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
            get started
          </button>
        </Link>
      </div>
    </div>
  );
}
