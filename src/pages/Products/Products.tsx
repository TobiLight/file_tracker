import { Button } from "antd"
import { useQuery } from "react-query"
import { StorageIcon } from "../../components/icons/storage"
import UsersIcon from "../../components/icons/users"
import ApiRequest from "../../helpers/axios"
import { PlanType } from "../../lib/interfaces"
import Loading3QuartersOutlined from "@ant-design/icons/lib/icons/Loading3QuartersOutlined"
import ShareAltOutlined from '@ant-design/icons/lib/icons/ShareAltOutlined'
import useLocalStorage from "../../hooks/useLocalStorage"
import MainLayout from "../../components/layout/MainLayout"


export const Products = (): JSX.Element => {
    const fetchPlans = async (signal: AbortSignal | undefined): Promise<PlanType[]> => {
        try {
            const data: any = await ApiRequest.get("/plan/list/", { signal })
            const plans: PlanType[] = [...data.data]
            return plans
        } catch (err: any) {
            throw new Error(err)
        }
    }

    const { isError, isLoading, isSuccess, refetch, data } = useQuery(['get_plans'], ({ signal }) => fetchPlans(signal), {
        refetchInterval: 1000 * 3600,
        staleTime: 1000 * 3600,
        keepPreviousData: true,
        refetchOnMount: false,
        retryOnMount: false,
        cacheTime: 1000 * 3300,
        notifyOnChangeProps: ['data', 'error'],
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    })
    return (
        <MainLayout className="min-h-screen">
            <div className="p-6 pb-16 h-full mt-20">
                <h1 className="text-blue-500 text-4xl font-bold text-center py-10">
                    Choose Your Plan
                </h1>

                {isError &&
                    <div className="grid place-items-center h-full">
                        <p className="text-gray-200 text-center">An error occured while fetching plans :(</p>
                        <Button onClick={() => refetch()} type="ghost" className="text-white mt-2 hover:bg-gray-200 hover:text-gray-700">retry</Button>
                    </div>
                }

                {isLoading &&
                    <div className="w-ful h-full flex justify-center">
                        <Loading3QuartersOutlined spin={true} className="text-blue-400 text-5xl text-center" />
                    </div>
                }

                {isSuccess &&
                    <div className="grid lg:grid-cols-3 gap-6">
                        {data?.map((plan: PlanType) => (
                            <div key={plan.id} className="pricing-table text-center bg-white h-auto">
                                <div className="pricing-heading bg-black text-center text-white font-bold py-6">
                                    <p className="w-full h-full text-lg font-semibold">{
                                        (plan.plan_name === 'Plan A' && 'Basic') ||
                                        (plan.plan_name === 'Plan B' && 'Standard') ||
                                        (plan.plan_name === 'Plan C' && 'Pro')
                                    }</p>
                                </div>
                                <div className="p-8 text-lg font-semibold">
                                    <p className="pb-4 border-b-2">€{plan.price}<span className="text-xs ">/{plan.frequency}</span></p>
                                </div>
                                <ul className="flex flex-col space-y-2 font-semibold">
                                    <li className="flex justify-center w-full items-center"><StorageIcon width="1em" height="1em" className="mr-2" /> {plan.storage_size}gb storage</li>
                                    <li className="flex justify-center w-full items-center"><UsersIcon width="1em" height="1em" className="mr-2" /> Invite {plan.max_number_invites} users</li>
                                    <li className="flex justify-center w-full items-center"><ShareAltOutlined width="1em" height="1em" className="mr-2" /> Share files with {plan.max_number_invites} users</li>
                                </ul>
                                <div className="w-full flex place-content-center">
                                    <Button size="large" htmlType="button" href="/register" type="ghost" className="bg-gray-800 hover:bg-gray-600 hover:text-gray-100 border-0 text-gray-200 rounded mt-6 mb-10">Sign up</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </MainLayout>
    )
}