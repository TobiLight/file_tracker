import ShareAltOutlined from "@ant-design/icons/lib/icons/ShareAltOutlined"
import { Button, Input, Layout, message, Skeleton } from "antd"
import { Content, Header } from "antd/lib/layout/layout"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { useHistory } from "react-router-dom"
import { StorageIcon } from "../../components/icons/storage"
import UsersIcon from "../../components/icons/users"
import SiteFooter from "../../components/shared/Footer"
import { Logo } from "../../components/shared/Nav/Logo"
import ApiRequest from "../../helpers/axios"
import { useAuth } from "../../hooks/useAuth"
import useLocalStorage from "../../hooks/useLocalStorage"
import { IUser } from "../../lib/interfaces"
import { PlanType } from "../../lib/types"
import useUserStore from "../../store/user"

export const SelectPlan = (): JSX.Element => {
    const [selectedPlan, setSelectedPlan] = useState<PlanType | undefined>()
    const queryClient = useQueryClient()
    const planList: PlanType[] | undefined = queryClient.getQueryData('get_plans')
    const plan: PlanType | undefined = queryClient.getQueryData('user_plan')
    const { getUserHasPlan } = useUserStore()
    const { LogoutHandler } = useAuth()
    const [token,] = useLocalStorage<string | undefined | null>('ft_token', undefined)
    const [user,] = useLocalStorage<IUser | undefined | null>('ft_user', undefined)
    const [userHasPlan,] = useLocalStorage<boolean | undefined>('ft_user_has_plan', undefined)
    const [userPlan, saveUserPlanToLocalStorage] = useLocalStorage<PlanType | undefined>('ft_user_plan', undefined)
    const [plansListLocalStorage, savePlansToLocalStorage] = useLocalStorage<PlanType[] | undefined>('ft_plan_list', undefined)
    const history = useHistory()


    useEffect(() => {
        if (!plan) {
            queryClient.setQueryData('user_plan', userPlan || selectedPlan)
        }

        if (!token && !user) {
            return history.replace("/login")
        }

        if (token && (userHasPlan || getUserHasPlan())) {
            return history.replace("/user/dashboard/overview")
        }

        if (!plansListLocalStorage) {
            refetch().then(data => {
                savePlansToLocalStorage(data.data)
            })
        }
        saveUserPlanToLocalStorage(userPlan)
        setSelectedPlan(userPlan || plan)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const fetchPlans = async (signal: AbortSignal | undefined): Promise<PlanType[]> => {
        try {
            const data = await ApiRequest.get("/plan/list/", { signal })
            return data.data
        } catch (err: any) {
            if (!err?.response) {
                throw new Error("Check if you're connected to the internet")
            }
            throw new Error(err)
        }
    }

    const { isError, isLoading, isSuccess, refetch } = useQuery('get_plans', ({ signal }) => fetchPlans(signal), {
        refetchInterval: 1000 * 3600,
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retryOnMount: false,
        staleTime: 1000 * 3600,
        cacheTime: 1000 * 3400,
        onSuccess: (data) => {
            if (data) {
                return savePlansToLocalStorage({ ...data })
            }
        }
    })

    const handleClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>, data: PlanType) => {
        setSelectedPlan({ ...data })
        saveUserPlanToLocalStorage({ ...data })
        message.success(`You selected ${data.plan_name === 'Plan A' ? 'Basic' : data.plan_name === 'Plan B' ? 'Standard' : 'Pro'} plan!`)
    }


    return (
        <>
            <Layout className="min-h-screen">
                <Header className="border-t-2 border-blue-500 bg-white flex items-center justify-between">
                    <Logo />
                    <div className="flex justify-end items-center h-full">
                        <Button type="primary" onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                            LogoutHandler(event)
                            history.replace("/login")
                        }
                        }>Logout</Button>
                    </div>
                </Header>
                <Content>
                    <div className="flex flex-col space-y-10 w-11/12 md:w-7/12 mx-auto">
                        <h1 className="text-4xl my-10 font-bold">Choose your preferred plan</h1>

                        {isLoading &&
                            <div className="grid gap-10 pb-20">
                                <Skeleton.Input active style={{ height: 170, borderRadius: 5 }} />
                                <Skeleton.Input active style={{ height: 170, borderRadius: 5 }} />
                                <Skeleton.Input active style={{ height: 170, borderRadius: 5 }} />
                            </div>
                        }

                        {isError &&
                            <div className="grid place-items-center">
                                <p className="text-center">An error occured while fetching plans :(</p>
                                <Button onClick={() => refetch()} type="primary" className="text-white mt-2">retry</Button>
                            </div>
                        }


                        {isSuccess && planList && planList.map(plan => (
                            <div key={plan.id} className="bg-white shadow-md rounded p-6">
                                <div className="flex flex-col space-y-6">
                                    <div className="flex items-center space-x-5">
                                        <Input checked={plan.plan_name === selectedPlan?.plan_name} onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => handleClick(event, { ...plan })} value={plan.plan_name} name="plan_a" type="radio" className="w-10 h-10 rounded" />
                                        <h1 className="text-3xl font-bold">{(plan.plan_name === 'Plan A' && 'Basic') ||
                                            (plan.plan_name === 'Plan B' && 'Standard') ||
                                            (plan.plan_name === 'Plan C' && 'Pro')}</h1>

                                    </div>
                                    <div className="flex items-center space-x-5">
                                        <div className="w-12"></div>
                                        <div className="flex flex-col space-y-3 font-semibold text-gray-600">
                                            <p className="flex items-center"><StorageIcon width="1em" height="1em" className="mr-2" />{plan.storage_size}gb storage</p>
                                            <p className="flex items-center"><UsersIcon width="1em" height="1em" className="mr-2" />Invite {plan.max_number_invites} users</p>
                                            <p className="flex items-center"><ShareAltOutlined width="1em" height="1em" className="mr-2" /> Share files with {plan.max_number_invites} users</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isSuccess &&
                            <div className="flex justify-end pb-16">
                                <Button htmlType="button" onClick={() => history.replace("/payment")} type="primary" disabled={!selectedPlan?.plan_name ? true : false} className="w-32">Continue</Button>
                            </div>
                        }
                    </div>
                </Content>
                <SiteFooter />
            </Layout>
        </>
    )
}