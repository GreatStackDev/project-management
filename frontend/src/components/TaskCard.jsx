import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { priorityTexts, typeIcons } from "../lib/task-styles";

// One task in the mobile list (below lg), mirroring TaskRow
export function TaskCard({ task, selectable, selected, canEditStatus, onToggleSelect, onStatusChange }) {
    const { icon: TypeIcon, color } = typeIcons[task.type] || {};
    const { background, prioritycolor } = priorityTexts[task.priority] || {};
    const statusId = `status-${task.id}`;

    return (
        <div className=" dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-300 dark:border-zinc-800 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h3 className="text-zinc-900 dark:text-zinc-200 text-sm font-semibold">{task.title}</h3>
                {selectable && (
                    <input type="checkbox" aria-label={`Select ${task.title}`} className="size-4 accent-zinc-600 dark:accent-zinc-500" onChange={() => onToggleSelect(task.id)} checked={selected} />
                )}
            </div>

            <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                {TypeIcon && <TypeIcon className={`size-4 ${color}`} />}
                <span className={`${color} uppercase`}>{task.type}</span>
            </div>

            <div>
                <span className={`text-xs px-2 py-1 rounded ${background} ${prioritycolor}`}>
                    {task.priority}
                </span>
            </div>

            <div>
                <label htmlFor={statusId} className="text-zinc-600 dark:text-zinc-400 text-xs">Status</label>
                <select id={statusId} name="status" disabled={!canEditStatus} onChange={(e) => onStatusChange(task.id, e.target.value)} value={task.status} className="w-full mt-1 bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-300 dark:ring-zinc-700 outline-none px-2 py-1 rounded text-sm text-zinc-900 dark:text-zinc-200 disabled:opacity-60" >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <img src={task.assignee?.image} className="size-5 rounded-full" alt="avatar" />
                {task.assignee?.name || "-"}
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <CalendarIcon className="size-4" />
                {format(new Date(task.due_date), "dd MMMM")}
            </div>
        </div>
    );
}
