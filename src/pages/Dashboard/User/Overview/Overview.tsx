import { Divider } from "antd"
import { DashboardContent } from "../../../../components/layout/UserDashboard/Content"
import DashboardLayout from "../../../../components/layout/UserDashboard/Dashboard"
import useLocalStorage from "../../../../hooks/useLocalStorage"
import { PlanType } from "../../../../lib/interfaces"
import useUserStore from "../../../../store/user"

export const Overview = (): JSX.Element => {
    const [userPlan,] = useLocalStorage<PlanType | undefined | null>('ft_user_plan', undefined)
    const { getUserPlan } = useUserStore()
    const converPlanName = (planName: string | undefined) => {
        if (!planName) {
            return 'Unknown'
        }
        return planName === 'Plan A' ? 'Basic' : planName === 'Plan B' ? 'Standard' : 'Pro'
    }
    return (
        <DashboardLayout>
            <DashboardContent title="Overview">
                <div className="mb-14">
                    <h1 className="text font-semibold mb-5">Plan</h1>
                    <div className="flex flex-col md:flex-none md:grid md:grid-cols-3 md:gap-8 space-y-8 md:space-y-0">


                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-lg text-blue-500">Current Plan</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">{converPlanName(userPlan?.plan_name || getUserPlan()?.plan_name)}</p>
                            </div>
                        </div>
                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-lg text-blue-500">Max invites</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">{userPlan?.max_number_invites || getUserPlan()?.max_number_invites}</p>
                            </div>
                        </div>

                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-base text-blue-500">Storage</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">{userPlan?.storage_size || getUserPlan()?.storage_size}gb</p>
                            </div>
                        </div>

                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-base text-blue-500">Subscription type</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">{userPlan?.frequency === 'monthly' ? 'Monthly' : '' || getUserPlan()?.frequency === 'monthly' ? 'Monthly' : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider className="bg-blue-200" />
                <div className="my-14">
                    <h1 className="text font-semibold mb-5">Usage statistics</h1>
                    <div className="flex flex-col md:flex-none md:grid md:grid-cols-3 md:gap-8 space-y-8 md:space-y-0">
                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-base text-blue-500">Used storage</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">3gb</p>
                            </div>
                        </div>

                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-lg text-blue-500">Contacts</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">0 of {userPlan?.max_number_invites || getUserPlan()?.max_number_invites}</p>
                            </div>
                        </div>

                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-base text-blue-500">Files</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">0</p>
                            </div>
                        </div>

                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-base text-blue-500">Folders</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">0</p>
                            </div>
                        </div>

                        <div className="w-full rounded-tl rounded-tr p-4 h-32 shadow-md border-b-4 border-blue-500">
                            <div className="grid justify-center place-content-center place-items-center h-full">
                                <h3 className="font-bold text-xl md:text-base text-blue-500">Total files shared</h3>
                                <p className="text-base md:text-md font-semibold text-gray-500">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardContent>
        </DashboardLayout>
    )
}