import { ClerkProvider } from '@clerk/react'
import { useNavigate } from 'react-router-dom'

// Without signInUrl/signUpUrl, Clerk sends people to its hosted Account Portal; the router hooks make
// Clerk's own page changes (sign-in steps, redirects after sign-in) go through React Router instead of a full reload
export const ClerkProviderWithRouter = ({ publishableKey, children }) => {
    const navigate = useNavigate()

    return (
        <ClerkProvider
            publishableKey={publishableKey}
            routerPush={(to) => navigate(to)}
            routerReplace={(to) => navigate(to, { replace: true })}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
        >
            {children}
        </ClerkProvider>
    )
}
