import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { addProject } from "../features/workspaceSlice";

// Project.team_lead is required, so the creator is the lead unless someone else is picked
const emptyForm = (leadId) => ({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    start_date: "",
    end_date: "",
    team_members: leadId ? [leadId] : [],
    team_lead: leadId ?? "",
});

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {

    const { currentWorkspace } = useSelector((state) => state.workspace);
    const dispatch = useDispatch();
    const { user } = useUser();
    const members = currentWorkspace?.members ?? [];
    // Ids are what the database stores; emails are only for display
    const emailOf = (userId) => members.find((m) => m.user.id === userId)?.user.email ?? userId;

    const [formData, setFormData] = useState(() => emptyForm(user?.id));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await api.post("/api/projects", formData);
            dispatch(addProject(data));
            toast.success("Project created");
            setFormData(emptyForm(user?.id));
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeTeamMember = (userId) => {
        setFormData((prev) => ({ ...prev, team_members: prev.team_members.filter((id) => id !== userId) }));
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-start z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">
                <button type="button" aria-label="Close" className="absolute top-3 end-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => setIsDialogOpen(false)} >
                    <XIcon className="size-5" />
                </button>

                <h2 className="text-xl font-medium mb-1">Create New Project</h2>
                {currentWorkspace && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        In workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Project Name */}
                    <div>
                        <label htmlFor="project-name" className="block text-sm mb-1">Project Name</label>
                        <input id="project-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter project name" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" required />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="project-description" className="block text-sm mb-1">Description</label>
                        <textarea id="project-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your project" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20" />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="project-status" className="block text-sm mb-1">Status</label>
                            <select id="project-status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="project-priority" className="block text-sm mb-1">Priority</label>
                            <select id="project-priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="project-start" className="block text-sm mb-1">Start Date</label>
                            <input id="project-start" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                        </div>
                        <div>
                            <label htmlFor="project-end" className="block text-sm mb-1">End Date</label>
                            <input id="project-end" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} min={formData.start_date || undefined} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" />
                        </div>
                    </div>

                    {/* Lead */}
                    <div>
                        <label htmlFor="project-lead" className="block text-sm mb-1">Project Lead</label>
                        <select id="project-lead" value={formData.team_lead} onChange={(e) => setFormData({ ...formData, team_lead: e.target.value, team_members: [...new Set([...formData.team_members, e.target.value])] })} className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm" >
                            {members.map((member) => (
                                <option key={member.user.id} value={member.user.id}>
                                    {member.user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Team Members */}
                    <div>
                        <label htmlFor="project-members" className="block text-sm mb-1">Team Members</label>
                        <select id="project-members" value="" className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                            onChange={(e) => {
                                const userId = e.target.value;
                                if (userId) setFormData((prev) => ({ ...prev, team_members: [...prev.team_members, userId] }));
                            }}
                        >
                            <option value="">Add team members</option>
                            {members
                                .filter((member) => !formData.team_members.includes(member.user.id))
                                .map((member) => (
                                    <option key={member.user.id} value={member.user.id}>
                                        {member.user.email}
                                    </option>
                                ))}
                        </select>

                        {formData.team_members.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.team_members.map((userId) => (
                                    <div key={userId} className="flex items-center gap-1 bg-blue-200/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-sm" >
                                        {emailOf(userId)}
                                        {/* The lead is always on the team, so only other members can be removed */}
                                        {userId !== formData.team_lead && (
                                            <button type="button" aria-label={`Remove ${emailOf(userId)}`} onClick={() => removeTeamMember(userId)} className="ms-1 hover:bg-blue-300/30 dark:hover:bg-blue-500/30 rounded" >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 text-sm">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800" >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !currentWorkspace} className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200 disabled:opacity-50" >
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectDialog;
