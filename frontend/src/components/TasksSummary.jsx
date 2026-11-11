import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/react";
import { Link } from "react-router-dom";

const PREVIEW_COUNT = 3;

export default function TasksSummary() {

    const { currentWorkspace } = useSelector((state) => state.workspace);
    const { user } = useUser();
    const [tasks, setTasks] = useState([]);
    // Which cards show their full list, keyed by card title
    const [expanded, setExpanded] = useState({});

    // Get all tasks for all projects in current workspace
    useEffect(() => {
        if (currentWorkspace) {
            setTasks(currentWorkspace.projects.flatMap((project) => project.tasks));
        }
    }, [currentWorkspace]);

    const myTasks = tasks.filter(i => i.assigneeId === user?.id);
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE');
    const inProgressIssues = tasks.filter(i => i.status === 'IN_PROGRESS');

    const summaryCards = [
        {
            title: "My Tasks",
            count: myTasks.length,
            icon: User,
            color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
            items: myTasks
        },
        {
            title: "Overdue",
            count: overdueTasks.length,
            icon: AlertTriangle,
            color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
            items: overdueTasks
        },
        {
            title: "In Progress",
            count: inProgressIssues.length,
            icon: Clock,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
            items: inProgressIssues
        }
    ];

    return (
        <div className="space-y-6">
            {summaryCards.map((card) => (
                <div key={card.title} className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 rounded-lg overflow-hidden">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                <card.icon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <h3 className="text-sm font-medium text-gray-800 dark:text-white">{card.title}</h3>
                                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${card.color}`}>
                                    {card.count}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {card.items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">
                                No {card.title.toLowerCase()}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {(expanded[card.title] ? card.items : card.items.slice(0, PREVIEW_COUNT)).map((issue) => (
                                    <Link key={issue.id} to={`/taskDetails?projectId=${issue.projectId}&taskId=${issue.id}`} className="block p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-blue-500 transition-colors">
                                        <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                            {issue.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-zinc-400 capitalize mt-1">
                                            {issue.type} • {issue.priority} priority
                                        </p>
                                    </Link>
                                ))}
                                {card.count > PREVIEW_COUNT && (
                                    <button
                                        type="button"
                                        aria-expanded={Boolean(expanded[card.title])}
                                        onClick={() => setExpanded((prev) => ({ ...prev, [card.title]: !prev[card.title] }))}
                                        className="flex items-center justify-center w-full text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-white mt-2"
                                    >
                                        {expanded[card.title] ? "Show less" : `View ${card.count - PREVIEW_COUNT} more`}
                                        <ArrowRight className={`w-3 h-3 ms-2 rtl:-scale-x-100 transition-transform ${expanded[card.title] ? "-rotate-90 rtl:rotate-90" : ""}`} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
