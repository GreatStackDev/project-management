import { SignUp } from '@clerk/react'

// Path routing so steps like email verification live under /sign-up (the route in App.jsx is a splat for that)
export const SignUpPage = () => (
    <main className='flex items-center justify-center min-h-screen p-4 bg-white dark:bg-zinc-950'>
        <SignUp routing="path" path="/sign-up" />
    </main>
)
