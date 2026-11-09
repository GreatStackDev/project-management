import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { loadTheme } from '../features/themeSlice'
import { fetchWorkspaces } from '../features/workspaceSlice'
import { setTokenGetter } from '../lib/api'
import { Loader2Icon, Plus } from 'lucide-react'
import { useUser, useAuth, useClerk, useOrganization, RedirectToSignIn } from '@clerk/react'
import { MyInvitations } from '../components/MyInvitations'
import { clerkErrorMessage } from '../lib/clerk-error'

// A new workspace reaches our database through the webhook a moment after Clerk activates it
const RETRY_DELAY_MS = 1500
const MAX_ATTEMPTS = 4

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { loading, error, workspaces } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()
    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()
    const { openCreateOrganization, setActive } = useClerk()
    const { organization } = useOrganization()
    const userId = user?.id
    const activeOrgId = organization?.id

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [dispatch])

    // Declared before the fetch effect: effects run in order, so the token is ready for the first request
    useEffect(() => {
        setTokenGetter(getToken)
    }, [getToken])

    // Re-runs when the active workspace changes, which also picks up one that was just created
    useEffect(() => {
        if (!userId) return
        let cancelled = false
        let timer
        const load = async (attempt) => {
            try {
                const list = await dispatch(fetchWorkspaces(activeOrgId)).unwrap()
                // The page falls back to the first workspace, but the backend reads the workspace from the token,
                // so Clerk must make it active too or every save fails; this effect then re-runs with its id
                if (!activeOrgId && list.length > 0 && !cancelled) {
                    await setActive({ organization: list[0].id })
                    return
                }
                const isMissing = activeOrgId && !list.some((w) => w.id === activeOrgId)
                if (isMissing && attempt < MAX_ATTEMPTS && !cancelled) {
                    timer = setTimeout(() => load(attempt + 1), RETRY_DELAY_MS)
                }
            } catch (error) {
                // unwrap() rejects with our API's message string, but setActive throws a Clerk error object
                toast.error(typeof error === 'string' ? error : clerkErrorMessage(error))
            }
        }
        load(1)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [userId, activeOrgId, dispatch, setActive])

    // Wait for Clerk to resolve the session so signed-in users don't flash the sign-in form
    if (!isLoaded) return (
        <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
            <Loader2Icon className="size-7 text-blue-500 animate-spin" />
        </div>
    )

    // Passes the current URL as redirect_url, so a signed-out "Open task" email link returns to that task after sign-in
    if (!user) return <RedirectToSignIn />


    if (loading) return (
        <div className='flex items-center justify-center h-screen bg-white dark:bg-zinc-950'>
            <Loader2Icon className="size-7 text-blue-500 animate-spin" />
        </div>
    )

    // Without this, a failed request would look like "no workspaces" and invite creating a duplicate
    if (error && workspaces.length === 0) return (
        <main className='flex flex-col items-center justify-center gap-4 h-screen p-6 text-center bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100'>
            <h1 className='text-xl font-semibold'>Couldn't load your workspaces</h1>
            <p className='text-sm text-gray-500 dark:text-zinc-400'>{error}</p>
            <button type="button" onClick={() => dispatch(fetchWorkspaces(activeOrgId))} className='px-4 py-2 rounded text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'>
                Try again
            </button>
        </main>
    )

    if (workspaces.length === 0) return (
        <main className='flex flex-col items-center justify-center gap-4 h-screen p-6 text-center bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100'>
            <h1 className='text-xl font-semibold'>No workspace yet</h1>
            <p className='text-sm text-gray-500 dark:text-zinc-400'>Create one, or join one you've been invited to.</p>
            {/* A newly invited person lands here, with no sidebar, so this is where they can accept */}
            <MyInvitations className='w-full max-w-xs rounded border border-gray-200 dark:border-zinc-800 p-2' />
            <button type="button" onClick={() => openCreateOrganization({ afterCreateOrganizationUrl: '/' })} className='flex items-center gap-2 px-4 py-2 rounded text-sm text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'>
                <Plus className='size-4' /> Create Workspace
            </button>
        </main>
    )

    return (
        <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
