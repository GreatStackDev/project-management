import { Plus, Save } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { updateProject } from "../features/workspaceSlice";
import AddProjectMember from "./AddProjectMember";
import { usePermissions } from "../hooks/use-permissions";

// The API sends ISO strings in UTC; slicing keeps the stored day instead of shifting it by the viewer's time zone
const toDateInput = (value) => (value ? value.slice(0, 10) : "");

// Only the editable fields: sending tasks/members back would be rejected by the server anyway
const toForm = (project) => ({
    name: project.name,
    description: project.description ?? "",
    status: project.status,
    priority: project.priority,
    start_date: toDateInput(project.start_date),
    end_date: toDateInput(project.end_date),
    progress: project.progress,
});

export default function ProjectSettings({ project }) {

    const dispatch = useDispatch();
    const canManage = usePermissions().canManageProject(project);
    // The parent keys this component by project id, so the form re-initialises when the project changes
    const [formData, setFormData] = useState(() => toForm(project));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await api.put(`/api/projects/${project.id}`, formData);
            dispatch(updateProject(data));
            setFormData(toForm(data));
            toast.success("Project saved");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";

    const cardClasses = "rounded-lg border p-6 not-dark:bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";

    const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className={cardClasses}>
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">Project Details</h2>
                <form onSubmit={handleSubmit}>
                    {!canManage && (
                        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                            Only workspace admins and the team lead can edit this project.
                        </p>
                    )}
                    {/* A disabled fieldset disables every control inside it, making the form read-only in one place */}
                    <fieldset disabled={!canManage} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <label htmlFor="settings-name" className={labelClasses}>Project Name</label>
                        <input id="settings-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClasses} required />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="settings-description" className={labelClasses}>Description</label>
                        <textarea id="settings-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClasses + " h-24"} />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="settings-status" className={labelClasses}>Status</label>
                            <select id="settings-status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClasses} >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="settings-priority" className={labelClasses}>Priority</label>
                            <select id="settings-priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className={inputClasses} >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="settings-start" className={labelClasses}>Start Date</label>
                            <input id="settings-start" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className={inputClasses} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="settings-end" className={labelClasses}>End Date</label>
                            <input id="settings-end" type="date" value={formData.end_date} min={formData.start_date || undefined} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className={inputClasses} />
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <label htmlFor="settings-progress" className={labelClasses}>Progress: {formData.progress}%</label>
                        <input id="settings-progress" type="range" min="0" max="100" step="5" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} className="w-full accent-blue-500 dark:accent-blue-400" />
                    </div>

                    {canManage && (
                        <button type="submit" disabled={isSubmitting} className="ml-auto flex items-center text-sm justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" >
                            <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                    </fieldset>
                </form>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
                            Team Members <span className="text-sm text-zinc-600 dark:text-zinc-400">({project.members.length})</span>
                        </h2>
                        {canManage && (
                            <>
                                <button type="button" aria-label="Add project member" onClick={() => setIsDialogOpen(true)} className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800" >
                                    <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
                                </button>
                                <AddProjectMember project={project} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                            </>
                        )}
                    </div>

                    {/* Member List */}
                    {project.members.length > 0 && (
                        <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                            {project.members.map((member) => (
                                <div key={member.user.id} className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-300" >
                                    <span> {member.user.email || "Unknown"} </span>
                                    {project.team_lead === member.user.id && <span className="px-2 py-0.5 rounded-xs ring ring-zinc-200 dark:ring-zinc-600">Team Lead</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
