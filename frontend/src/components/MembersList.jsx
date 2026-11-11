import { useTranslation } from "react-i18next";

const RoleBadge = ({ role }) => {
    const { t } = useTranslation();
    return (
        <span
            className={`px-2 py-1 text-xs rounded-md ${role === "ADMIN"
                ? "bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400"
                : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300"
                }`}
        >
            {role ? t(`role.${role}`) : t("role.fallback")}
        </span>
    );
};

// Workspace members as a table on desktop and stacked cards on mobile
export function MembersList({ members }) {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl w-full">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-900/50">
                        <tr>
                            <th className="px-6 py-2.5 text-start font-medium text-sm">{t("members.columns.name")}</th>
                            <th className="px-6 py-2.5 text-start font-medium text-sm">{t("members.columns.email")}</th>
                            <th className="px-6 py-2.5 text-start font-medium text-sm">{t("members.columns.role")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-2.5 whitespace-nowrap flex items-center gap-3">
                                    <img src={member.user.image} alt={member.user.name} className="size-7 rounded-full bg-gray-200 dark:bg-zinc-800" />
                                    <span className="text-sm text-zinc-800 dark:text-white truncate">
                                        {member.user?.name || t("members.unknownUser")}
                                    </span>
                                </td>
                                <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                                    {member.user.email}
                                </td>
                                <td className="px-6 py-2.5 whitespace-nowrap">
                                    <RoleBadge role={member.role} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
                {members.map((member) => (
                    <div key={member.id} className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-3 mb-2">
                            <img src={member.user.image} alt={member.user.name} className="size-9 rounded-full bg-gray-200 dark:bg-zinc-800" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {member.user?.name || t("members.unknownUser")}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">{member.user.email}</p>
                            </div>
                        </div>
                        <RoleBadge role={member.role} />
                    </div>
                ))}
            </div>
        </div>
    );
}
