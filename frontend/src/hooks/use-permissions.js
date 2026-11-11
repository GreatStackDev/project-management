import { useOrganization, useUser } from "@clerk/react";

// Mirrors the backend's rules so the UI only offers actions the API will accept.
// UX only: the server still checks every request, so hiding a button is never the security boundary.
export function usePermissions() {
    const { membership } = useOrganization();
    const { user } = useUser();
    const userId = user?.id;

    // Same role string the API reads from the Clerk token (orgRole)
    const isAdmin = membership?.role === "org:admin";

    // Edit settings, add members, create and delete tasks
    const canManageProject = (project) => isAdmin || (Boolean(userId) && project?.team_lead === userId);

    // Status changes are also open to whoever the task is assigned to
    const canChangeStatus = (task, project) =>
        canManageProject(project) || (Boolean(userId) && task?.assigneeId === userId);

    return { isAdmin, canManageProject, canChangeStatus };
}
