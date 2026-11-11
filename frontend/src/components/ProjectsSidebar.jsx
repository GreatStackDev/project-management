import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon, SettingsIcon, KanbanIcon, ChartColumnIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ProjectSidebar = () => {

    const location = useLocation();
    const { t } = useTranslation();

    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [searchParams] = useSearchParams();

    const projects = useSelector(
        (state) => state?.workspace?.currentWorkspace?.projects || []
    );

    // `key` is the ?tab= value ProjectDetails reads, so it must never be a translated label
    const getProjectSubItems = (projectId) => [
        { key: 'tasks', title: t('sidebar.projectTabs.tasks'), icon: KanbanIcon },
        { key: 'analytics', title: t('sidebar.projectTabs.analytics'), icon: ChartColumnIcon },
        { key: 'calendar', title: t('sidebar.projectTabs.calendar'), icon: CalendarIcon },
        { key: 'settings', title: t('sidebar.projectTabs.settings'), icon: SettingsIcon },
    ].map((item) => ({ ...item, url: `/projectsDetail?id=${projectId}&tab=${item.key}` }));

    const toggleProject = (id) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    return (
        <div className="mt-6 px-3">
            <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    {t('sidebar.projects')}
                </h3>
                <Link to="/projects">
                    <button className="size-5 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded flex items-center justify-center transition-colors duration-200">
                        <ArrowRightIcon className="size-3 rtl:-scale-x-100" />
                    </button>
                </Link>
            </div>

            <div className="space-y-1 px-3">
                {projects.map((project) => (
                    <div key={project.id}>
                        <button onClick={() => toggleProject(project.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white" >
                            <ChevronRightIcon className={`size-3 text-gray-500 dark:text-zinc-400 rtl:-scale-x-100 transition-transform duration-200 ${expandedProjects.has(project.id) ? "rotate-90 rtl:-rotate-90" : ""}`} />
                            <div className="size-2 rounded-full bg-blue-500" />
                            <span className="truncate max-w-40 text-sm">{project.name}</span>
                        </button>

                        {expandedProjects.has(project.id) && (
                            <div className="ms-5 mt-1 space-y-1">
                                {getProjectSubItems(project.id).map((subItem) => {
                                    // checking if the current path matches the sub-item's URL
                                    const isActive =
                                        location.pathname === `/projectsDetail` &&
                                        searchParams.get('id') === project.id &&
                                        searchParams.get('tab') === subItem.key;

                                    return (
                                        <Link key={subItem.key}to={subItem.url} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors duration-200 text-xs ${isActive ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'}`} >
                                            <subItem.icon className="size-3" />
                                            {subItem.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectSidebar;