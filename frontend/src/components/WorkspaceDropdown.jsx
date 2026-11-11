import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { assets } from "../assets/assets";
import { MyInvitations } from "./MyInvitations";
import { useTranslation } from "react-i18next";

function WorkspaceDropdown() {

    const { workspaces } = useSelector((state) => state.workspace);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { openCreateOrganization, setActive } = useClerk();
    const { t } = useTranslation();

    // Clerk's active organization is what the backend reads from the token, so it must switch too
    const onSelectWorkspace = async (organizationId) => {
        await setActive({ organization: organizationId })
        dispatch(setCurrentWorkspace(organizationId))
        setIsOpen(false);
        navigate('/')
    }

    // Workspaces are Clerk Organizations; the webhook sync saves the new one to our database
    const onCreateWorkspace = () => {
        setIsOpen(false);
        openCreateOrganization({ afterCreateOrganizationUrl: '/' });
    }

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative m-4" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="w-full flex items-center justify-between p-3 h-auto text-start rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                <div className="flex items-center gap-3">
                    <img src={currentWorkspace?.image_url || assets.workspace_img_default} alt="" className="w-8 h-8 rounded shadow" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.name || t("workspace.select")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                            {t("workspace.count", { count: workspaces.length })}
                        </p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full start-0">
                    <MyInvitations className="p-2 border-b border-gray-200 dark:border-zinc-700" />
                    <div className="p-2">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
                            {t("workspace.heading")}
                        </p>
                        {workspaces.map((ws) => (
                            <button type="button" key={ws.id} onClick={() => onSelectWorkspace(ws.id)} className="w-full flex items-center gap-3 p-2 text-start cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                                <img src={ws.image_url || assets.workspace_img_default} alt="" className="w-6 h-6 rounded" />
                                <span className="block flex-1 min-w-0">
                                    <span className="block text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {ws.name}
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-zinc-400 truncate">
                                        {t("workspace.memberCount", { count: ws.members.length })}
                                    </span>
                                </span>
                                {currentWorkspace?.id === ws.id && (
                                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>

                    <hr className="border-gray-200 dark:border-zinc-700" />

                    <button type="button" onClick={onCreateWorkspace} className="w-full p-2 text-start cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <span className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                            <Plus className="w-4 h-4" /> {t("workspace.create")}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;
