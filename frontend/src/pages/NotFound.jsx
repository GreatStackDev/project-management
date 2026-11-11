import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

export function NotFound() {
    return (
        <section className="max-w-md mx-auto py-24 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <Compass className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">404</p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">Page not found</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                The page you're looking for doesn't exist or has moved.
            </p>
            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition"
            >
                <ArrowLeft className="size-4 rtl:-scale-x-100" /> Back to dashboard
            </Link>
        </section>
    );
}
