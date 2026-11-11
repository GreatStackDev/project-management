import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDateLocale } from "../hooks/use-date-locale";
import { priorityTexts, typeIcons } from "../lib/task-styles";

// One task in the desktop table; clicking the row opens the task, except on the checkbox and status cells
export function TaskRow({ task, selectable, selected, canEditStatus, onToggleSelect, onStatusChange }) {
    const { t } = useTranslation();
    const dateLocale = useDateLocale();
    const navigate = useNavigate();
    const { icon: TypeIcon, color } = typeIcons[task.type] || {};
    const { background, prioritycolor } = priorityTexts[task.priority] || {};

    return (
        <tr onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)} className=" border-t border-zinc-300 dark:border-zinc-800 group hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all cursor-pointer" >
            {selectable && (
                <td onClick={e => e.stopPropagation()} className="ps-2 pe-1">
                    <input type="checkbox" aria-label={t("tasks.selectTask", { title: task.title })} className="size-3 accent-zinc-600 dark:accent-zinc-500" onChange={() => onToggleSelect(task.id)} checked={selected} />
                </td>
            )}
            <td className={`px-4 py-2 ${selectable ? "ps-0" : ""}`}>{task.title}</td>
            <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                    {TypeIcon && <TypeIcon className={`size-4 ${color}`} />}
                    <span className={`uppercase text-xs ${color}`}>{t(`taskType.${task.type}`)}</span>
                </div>
            </td>
            <td className="px-4 py-2">
                <span className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}>
                    {t(`priority.${task.priority}`)}
                </span>
            </td>
            <td onClick={e => e.stopPropagation()} className="px-4 py-2">
                <select name="status" aria-label={t("tasks.columns.status")} disabled={!canEditStatus} title={canEditStatus ? undefined : t("tasks.statusLocked")} onChange={(e) => onStatusChange(task.id, e.target.value)} value={task.status} className="group-hover:ring ring-zinc-100 outline-none px-2 pe-4 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60" >
                    <option value="TODO">{t("taskStatus.TODO")}</option>
                    <option value="IN_PROGRESS">{t("taskStatus.IN_PROGRESS")}</option>
                    <option value="DONE">{t("taskStatus.DONE")}</option>
                </select>
            </td>
            <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                    <img src={task.assignee?.image} className="size-5 rounded-full" alt={t("tasks.avatarAlt")} />
                    {task.assignee?.name || "-"}
                </div>
            </td>
            <td className="px-4 py-2">
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                    <CalendarIcon className="size-4" />
                    {format(new Date(task.due_date), "dd MMMM", { locale: dateLocale })}
                </div>
            </td>
        </tr>
    );
}
