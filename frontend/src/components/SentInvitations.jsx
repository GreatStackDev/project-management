import { useState } from "react";
import { MailIcon } from "lucide-react";
import toast from "react-hot-toast";
import { clerkErrorMessage } from "../lib/clerk-error";

const roleLabels = { "org:admin": "Admin", "org:member": "Member" };

// Pending invitations of the active workspace (admins only), so an admin can see an invite went out and cancel a typo
export function SentInvitations({ invitations }) {
    const [revokingId, setRevokingId] = useState(null);
    const pending = invitations?.data ?? [];

    if (pending.length === 0) return null;

    const handleRevoke = async (invitation) => {
        setRevokingId(invitation.id);
        try {
            await invitation.revoke();
            await invitations.revalidate();
            toast.success(`Invitation to ${invitation.emailAddress} revoked`);
        } catch (error) {
            toast.error(clerkErrorMessage(error));
        } finally {
            setRevokingId(null);
        }
    };

    return (
        <section aria-labelledby="pending-invitations" className="max-w-4xl">
            <h2 id="pending-invitations" className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Pending invitations ({pending.length})
            </h2>
            <ul className="divide-y divide-gray-200 dark:divide-zinc-800 rounded-md border border-gray-200 dark:border-zinc-800">
                {pending.map((invitation) => (
                    <li key={invitation.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                        <span className="flex items-center gap-2 min-w-0 text-gray-700 dark:text-zinc-300">
                            <MailIcon className="size-4 shrink-0 text-gray-400 dark:text-zinc-500" />
                            <span className="truncate">{invitation.emailAddress}</span>
                            <span className="px-2 py-0.5 text-xs rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300">
                                {roleLabels[invitation.role] ?? invitation.role}
                            </span>
                        </span>
                        <button type="button" onClick={() => handleRevoke(invitation)} disabled={revokingId === invitation.id} className="shrink-0 px-3 py-1 rounded text-xs border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-blue-500" >
                            {revokingId === invitation.id ? "Revoking..." : "Revoke"}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
