import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import { Trash, XIcon } from "lucide-react";
import { TaskRow } from "./TaskRow";
import { TaskCard } from "./TaskCard";
import { usePermissions } from "../hooks/use-permissions";

const ProjectTasks = ({ tasks, project }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { canManageProject, canChangeStatus } = usePermissions();
    // Selection only exists to delete, so it's offered only to those who can delete
    const canManage = canManageProject(project);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () => Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, tasks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Select-all works on the rows you can see, so it never picks tasks hidden by a filter
    const visibleIds = filteredTasks.map((t) => t.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedTasks.includes(id));
    const toggleSelectAll = () =>
        setSelectedTasks((prev) =>
            allVisibleSelected ? prev.filter((id) => !visibleIds.includes(id)) : [...new Set([...prev, ...visibleIds])]
        );
    const toggleSelect = (taskId) =>
        setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));

    const handleStatusChange = async (taskId, newStatus) => {
        const toastId = toast.loading(t("tasks.toast.updatingStatus"));
        try {
            const { data } = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
            dispatch(updateTask(data));
            toast.success(t("tasks.toast.statusUpdated"), { id: toastId });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message, { id: toastId });
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm(t("tasks.confirmDelete"));
        if (!confirm) return;

        const toastId = toast.loading(t("tasks.toast.deleting"));
        try {
            // axios sends a DELETE body only through the `data` option
            await api.delete("/api/tasks", { data: { ids: selectedTasks } });
            dispatch(deleteTask(selectedTasks));
            setSelectedTasks([]);
            toast.success(t("tasks.toast.deleted"), { id: toastId });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message, { id: toastId });
        }
    };

    const itemProps = (task) => ({
        task,
        selectable: canManage,
        selected: selectedTasks.includes(task.id),
        canEditStatus: canChangeStatus(task, project),
        onToggleSelect: toggleSelect,
        onStatusChange: handleStatusChange,
    });

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                {["status", "type", "priority", "assignee"].map((name) => {
                    const options = {
                        status: [
                            { label: t("tasks.filters.allStatuses"), value: "" },
                            ...["TODO", "IN_PROGRESS", "DONE"].map((v) => ({ label: t(`taskStatus.${v}`), value: v })),
                        ],
                        type: [
                            { label: t("tasks.filters.allTypes"), value: "" },
                            ...["TASK", "BUG", "FEATURE", "IMPROVEMENT", "OTHER"].map((v) => ({ label: t(`taskType.${v}`), value: v })),
                        ],
                        priority: [
                            { label: t("tasks.filters.allPriorities"), value: "" },
                            ...["LOW", "MEDIUM", "HIGH"].map((v) => ({ label: t(`priority.${v}`), value: v })),
                        ],
                        assignee: [
                            { label: t("tasks.filters.allAssignees"), value: "" },
                            ...assigneeList.map((n) => ({ label: n, value: n })),
                        ],
                    };
                    return (
                        <select key={name} name={name} aria-label={t(`tasks.filters.by.${name}`)} value={filters[name]} onChange={handleFilterChange} className=" border not-dark:bg-white border-zinc-300 dark:border-zinc-800 outline-none px-3 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200" >
                            {options[name].map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    );
                })}

                {/* Reset filters */}
                {(filters.status || filters.type || filters.priority || filters.assignee) && (
                    <button type="button" onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })} className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br from-purple-400 to-purple-500 text-zinc-100 dark:text-zinc-200 text-sm transition-colors" >
                        <XIcon className="size-3" /> {t("tasks.filters.reset")}
                    </button>
                )}

                {canManage && selectedTasks.length > 0 && (
                    <button type="button" onClick={handleDelete} className="px-3 py-1 flex items-center gap-2 rounded bg-gradient-to-br from-indigo-400 to-indigo-500 text-zinc-100 dark:text-zinc-200 text-sm transition-colors" >
                        <Trash className="size-3" /> {t("common.delete")}
                    </button>
                )}
            </div>

            {/* Tasks Table */}
            <div className="overflow-auto rounded-lg lg:border border-zinc-300 dark:border-zinc-800">
                <div className="w-full">
                    {/* Desktop/Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full text-sm text-start not-dark:bg-white text-zinc-900 dark:text-zinc-300">
                            <thead className="text-xs uppercase dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400 ">
                                <tr>
                                    {canManage && (
                                        <th className="ps-2 pe-1">
                                            <input onChange={toggleSelectAll} checked={allVisibleSelected} aria-label={t("tasks.selectAllVisible")} type="checkbox" className="size-3 accent-zinc-600 dark:accent-zinc-500" />
                                        </th>
                                    )}
                                    <th className={`px-4 py-3 ${canManage ? "ps-0" : ""}`}>{t("tasks.columns.title")}</th>
                                    <th className="px-4 py-3">{t("tasks.columns.type")}</th>
                                    <th className="px-4 py-3">{t("tasks.columns.priority")}</th>
                                    <th className="px-4 py-3">{t("tasks.columns.status")}</th>
                                    <th className="px-4 py-3">{t("tasks.columns.assignee")}</th>
                                    <th className="px-4 py-3">{t("tasks.columns.dueDate")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => <TaskRow key={task.id} {...itemProps(task)} />)
                                ) : (
                                    <tr>
                                        <td colSpan={canManage ? 7 : 6}className="text-center text-zinc-500 dark:text-zinc-400 py-6">
                                            {t("tasks.noTasksForFilters")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Card View */}
                    <div className="lg:hidden flex flex-col gap-4">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => <TaskCard key={task.id} {...itemProps(task)} />)
                        ) : (
                            <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
                                {t("tasks.noTasksForFilters")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectTasks;
