import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left max-w-xl">
        <Image
          className="dark:invert"
          src="/logo.svg" // replace with your actual logo if needed
          alt="pdfgo logo"
          width={180}
          height={38}
          priority
        />

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome to <span className="text-blue-600">pdfgo</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Upload, organize, and share PDFs effortlessly. Collaborate in real-time with commenting and version tracking — built for tutors, teams, and creators.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href="/login">
            <button className="rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-5 transition">
              Log In
            </button>
          </Link>
          <Link href="/signup">
            <button className="rounded-full border border-gray-300 dark:border-white/[0.2] hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm sm:text-base h-10 sm:h-12 px-5 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
