import { useState } from "react";
import { useOrganizationList } from "@clerk/react";
import toast from "react-hot-toast";
import { clerkErrorMessage } from "../lib/clerk-error";

const PENDING = { status: "pending" };

// Invitations sent to the signed-in user. Clerk keeps them pending until accept() is called,
// so without this an invited person who signs in normally could never join.
export function MyInvitations({ className = "" }) {
    const { isLoaded, setActive, userInvitations } = useOrganizationList({ userInvitations: PENDING });
    const [joiningId, setJoiningId] = useState(null);
    const invitations = userInvitations?.data ?? [];

    if (!isLoaded || invitations.length === 0) return null;

    const handleJoin = async (invitation) => {
        setJoiningId(invitation.id);
        try {
            await invitation.accept();
            // Switching the active workspace makes Layout refetch, and its retry waits for the webhook to save the membership
            await setActive({ organization: invitation.publicOrganizationData.id });
            await userInvitations.revalidate();
            toast.success(`Joined ${invitation.publicOrganizationData.name}`);
        } catch (error) {
            toast.error(clerkErrorMessage(error));
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <section aria-labelledby="my-invitations" className={className}>
            <h2 id="my-invitations" className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
                Invitations
            </h2>
            <ul className="space-y-1">
                {invitations.map((invitation) => (
                    <li key={invitation.id} className="flex items-center justify-between gap-3 p-2 rounded text-sm text-start">
                        <span className="truncate text-gray-800 dark:text-white">{invitation.publicOrganizationData.name}</span>
                        <button type="button" onClick={() => handleJoin(invitation)} disabled={joiningId !== null} className="shrink-0 px-3 py-1 rounded text-xs text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500" >
                            {joiningId === invitation.id ? "Joining..." : "Join"}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
