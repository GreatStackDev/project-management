import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/react";
import { useTranslation } from "react-i18next";

export default function StatsGrid() {
    const { user } = useUser();
    const { t } = useTranslation();
    const currentWorkspace = useSelector(
        (state) => state?.workspace?.currentWorkspace || null
    );

    // Derived from Redux on every render that changes it; nothing to keep in sync with an effect
    const stats = useMemo(() => {
        const projects = currentWorkspace?.projects ?? [];
        const tasks = projects.flatMap((project) => project.tasks);
        const now = new Date();
        return {
            totalProjects: projects.length,
            completedProjects: projects.filter((p) => p.status === "COMPLETED").length,
            myTasks: tasks.filter((t) => t.assigneeId === user?.id).length,
            // due_date arrives as an ISO string: comparing it to a Date directly is always false
            overdueIssues: tasks.filter((t) => t.status !== "DONE" && new Date(t.due_date) < now).length,
        };
    }, [currentWorkspace, user?.id]);

    const statCards = [
        {
            icon: FolderOpen,
            title: t("dashboard.stats.totalProjects"),
            value: stats.totalProjects,
            subtitle: t("dashboard.stats.projectsIn", { workspace: currentWorkspace?.name }),
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-500",
        },
        {
            icon: CheckCircle,
            title: t("dashboard.stats.completedProjects"),
            value: stats.completedProjects,
            subtitle: t("dashboard.stats.ofTotal", { total: stats.totalProjects }),
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-500",
        },
        {
            icon: Users,
            title: t("dashboard.stats.myTasks"),
            value: stats.myTasks,
            subtitle: t("dashboard.stats.assignedToMe"),
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-500",
        },
        {
            icon: AlertTriangle,
            title: t("dashboard.stats.overdue"),
            value: stats.overdueIssues,
            subtitle: t("dashboard.stats.needAttention"),
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-9">
            {statCards.map(({ icon, title, value, subtitle, bgColor, textColor }) => {
                // A variable, not a destructured parameter: the lint config exempts capitalised
                // variables (varsIgnorePattern '^[A-Z_]') from no-unused-vars, but not parameters
                const Icon = icon;
                return (
                    <div key={title} className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 rounded-md" >
                        <div className="p-6 py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                        {title}
                                    </p>
                                    <p className="text-3xl font-bold text-zinc-800 dark:text-white">
                                        {value}
                                    </p>
                                    {subtitle && (
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
                                    <Icon size={20} className={textColor} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
