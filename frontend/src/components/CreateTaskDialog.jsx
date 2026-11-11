import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDateLocale } from "../hooks/use-date-locale";
import { api } from "../lib/api";
import { addTask } from "../features/workspaceSlice";

const emptyForm = {
    title: "",
    description: "",
    type: "TASK",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "",
    due_date: "",
};

export default function CreateTaskDialog({ showCreateTask, setShowCreateTask, projectId }) {
    const { t } = useTranslation();
    const dateLocale = useDateLocale();
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const dispatch = useDispatch();
    const project = currentWorkspace?.projects.find((p) => p.id === projectId);
    const teamMembers = project?.members || [];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(emptyForm);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await api.post("/api/tasks", { ...formData, projectId });
            dispatch(addTask(data));
            toast.success(t("createTask.toastCreated"));
            setFormData(emptyForm);
            setShowCreateTask(false);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return showCreateTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-md p-6 text-zinc-900 dark:text-white">
                <h2 className="text-xl font-bold mb-4">{t("createTask.heading")}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label htmlFor="title" className="text-sm font-medium">{t("createTask.title")}</label>
                        <input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder={t("createTask.titlePlaceholder")} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label htmlFor="description" className="text-sm font-medium">{t("createTask.description")}</label>
                        <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={t("createTask.descriptionPlaceholder")} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Type & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="task-type" className="text-sm font-medium">{t("createTask.type")}</label>
                            <select id="task-type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                <option value="BUG">{t("taskType.BUG")}</option>
                                <option value="FEATURE">{t("taskType.FEATURE")}</option>
                                <option value="TASK">{t("taskType.TASK")}</option>
                                <option value="IMPROVEMENT">{t("taskType.IMPROVEMENT")}</option>
                                <option value="OTHER">{t("taskType.OTHER")}</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="task-priority" className="text-sm font-medium">{t("createTask.priority")}</label>
                            <select id="task-priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1"                             >
                                <option value="LOW">{t("priority.LOW")}</option>
                                <option value="MEDIUM">{t("priority.MEDIUM")}</option>
                                <option value="HIGH">{t("priority.HIGH")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Assignee and Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label htmlFor="task-assignee" className="text-sm font-medium">{t("createTask.assignee")}</label>
                            {/* Task.assigneeId is required in the database, so there's no "Unassigned" choice */}
                            <select id="task-assignee" required value={formData.assigneeId} onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                <option value="" disabled>{t("createTask.selectAssignee")}</option>
                                {teamMembers.map((member) => (
                                    <option key={member?.user.id} value={member?.user.id}>
                                        {member?.user.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="task-status" className="text-sm font-medium">{t("createTask.status")}</label>
                            <select id="task-status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" >
                                <option value="TODO">{t("taskStatus.TODO")}</option>
                                <option value="IN_PROGRESS">{t("taskStatus.IN_PROGRESS")}</option>
                                <option value="DONE">{t("taskStatus.DONE")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1">
                        <label htmlFor="task-due-date" className="text-sm font-medium">{t("createTask.dueDate")}</label>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-5 text-zinc-500 dark:text-zinc-400" />
                            <input id="task-due-date" type="date" required value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-zinc-200 text-sm mt-1" />
                        </div>
                        {formData.due_date && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {format(new Date(formData.due_date), "PPP", { locale: dateLocale })}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowCreateTask(false)} className="rounded border border-zinc-300 dark:border-zinc-700 px-5 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition" >
                            {t("common.cancel")}
                        </button>
                        <button type="submit" disabled={isSubmitting} className="rounded px-5 py-2 text-sm bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white dark:text-zinc-200 transition disabled:opacity-50" >
                            {isSubmitting ? t("common.creating") : t("createTask.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
}
