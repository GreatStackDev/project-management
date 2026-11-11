import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Trans, useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { updateProject } from "../features/workspaceSlice";

const AddProjectMember = ({ project, isDialogOpen, setIsDialogOpen }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);

    // Compare by id: emails can change in Clerk, ids never do
    const projectMemberIds = project.members.map((member) => member.user.id);
    const candidates = (currentWorkspace?.members ?? []).filter((member) => !projectMemberIds.includes(member.user.id));

    const [userId, setUserId] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const { data } = await api.post(`/api/projects/${project.id}/members`, { userId });
            dispatch(updateProject(data));
            toast.success(t("addMember.added"));
            setUserId("");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsAdding(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> {t("addMember.title")}
                    </h2>
                    <p className="text-sm text-zinc-700 dark:text-zinc-400">
                        <Trans i18nKey="addMember.addingTo" values={{ name: project.name }} components={{ name: <span className="text-blue-600 dark:text-blue-400" /> }} />
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="add-member" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            {t("addMember.memberLabel")}
                        </label>
                        <div className="relative">
                            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-4 h-4" />
                            <select id="add-member" value={userId} onChange={(e) => setUserId(e.target.value)} className="ps-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500" required >
                                <option value="">{candidates.length ? t("addMember.selectMember") : t("addMember.everyoneAdded")}</option>
                                {candidates.map((member) => (
                                    <option key={member.user.id} value={member.user.id}> {member.user.email} </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-5 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition" >
                            {t("common.cancel")}
                        </button>
                        <button type="submit" disabled={isAdding || !userId} className="px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white disabled:opacity-50 transition" >
                            {isAdding ? t("addMember.adding") : t("addMember.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectMember;
