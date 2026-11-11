import { Plus } from 'lucide-react'
import { useState } from 'react'
import StatsGrid from '../components/StatsGrid'
import ProjectOverview from '../components/ProjectOverview'
import RecentActivity from '../components/RecentActivity'
import TasksSummary from '../components/TasksSummary'
import CreateProjectDialog from '../components/CreateProjectDialog'
import { useUser } from '@clerk/react'
import { usePermissions } from '../hooks/use-permissions'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {

    const { user } = useUser()
    const { isAdmin } = usePermissions()
    const { t } = useTranslation()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className='max-w-6xl mx-auto'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> {t('dashboard.welcome', { name: user?.fullName || user?.primaryEmailAddress?.emailAddress })} </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm"> {t('dashboard.subtitle')} </p>
                </div>

                {isAdmin && (
                    <>
                        <button type="button" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white space-x-2 hover:opacity-90 transition" >
                            <Plus size={16} /> {t('dashboard.newProject')}
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </>
                )}
            </div>

            <StatsGrid />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProjectOverview />
                    <RecentActivity />
                </div>
                <div>
                    <TasksSummary />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
