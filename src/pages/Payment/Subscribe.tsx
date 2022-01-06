import { Card, Divider, Button, Result } from "antd"
import { StorageIcon } from "../../components/icons/storage"
import UsersIcon from "../../components/icons/users"
import useUserStore from "../../store/user"
import ShareAltOutlined from "@ant-design/icons/lib/icons/ShareAltOutlined"
import axios from "axios"
import { useMutation } from "react-query"
import { IUser, PlanType } from "../../lib/interfaces"
import { useHistory } from "react-router"
import useLocalStorage from "../../hooks/useLocalStorage"
import { UserAuth } from "../../helpers/auth"
import ApiRequest from "../../helpers/axios"


export const SubscribeToPlan = (): JSX.Element => {
    const history = useHistory()
    const { getUserPlan, setUserHasPlan, getUser } = useUserStore()
    const [plan,] = useLocalStorage<Partial<PlanType> | undefined>('ft_user_plan', undefined)
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [userHasPlan,] = useLocalStorage<boolean | undefined>('ft_user_has_plan', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const { GetUserProfile } = UserAuth()

    const subscribeToPlan = async (planName: string | undefined): Promise<any> => {
        try {
            const request = await ApiRequest.post("/plan/stripe/subscribe/", { plan: planName }, { headers: { 'Authorization': `JWT ${token}` } })
            return request.data
        } catch (err: any) {
            console.log(err?.response);
            throw new Error(err)
        }
    }

    const subscribe = useMutation((planName: string | undefined) => subscribeToPlan(planName))

    const handleSubscribe = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault()
        subscribe.mutate(plan?.plan_name)
    }

    const handleRedirect = async () => {
        try {
            const data = await GetUserProfile(user?.email || getUser()?.email)
            if (data?.has_plan) {
                setUserHasPlan(data.has_plan)
                history.replace("/user/dashboard/overview")
            }
        } catch (err: any) {
            console.log('err', err)
        }
    }

    if (subscribe.isSuccess) {
        console.log('user plan', userHasPlan)
        return (
            <div className="grid">
                <Result
                    status="success"
                    title={`Successfully Purchased File Tracker ${plan?.plan_name === 'Plan A' ? 'Basic' : plan?.plan_name === 'Plan B' ? 'Standard' : 'Pro'} plan`}
                    extra={[
                        <Button onClick={handleRedirect} type="primary" key="dashboard">
                            Go to Dashboard
                        </Button>
                    ]}
                />
            </div>
        )
    }

    return (
        <div className="subscribe">
            <Card title={`Subscribe to ${(getUserPlan()?.plan_name || plan?.plan_name) === 'Plan A' ? 'Basic' : (getUserPlan()?.plan_name || plan?.plan_name) === 'Plan B' ? 'Standard' : 'Pro'} Plan`}>
                <p className="flex w-full items-center"><UsersIcon width="1em" height="1em" className="mr-2" /> Send invite to {getUserPlan()?.max_number_invites || plan?.max_number_invites} users</p>
                <p className="flex w-full items-center">
                    <ShareAltOutlined width="1em" height="1em" className="mr-2" />
                    Share files with {getUserPlan()?.max_number_invites || plan?.max_number_invites} users
                </p>
                <p className="flex w-full items-center">
                    <StorageIcon width="1em" height="1em" className="mr-2" />
                    {getUserPlan()?.storage_size || plan?.storage_size}gb data storage</p>
            </Card>
            <div className="subtotal border-gray-200 mt-8 pb-16">
                <div className="flex flex-col space-y-8">
                    <div className="flex justify-between items-center place-items-center text-sm">
                        <p className="text-gray-600">Total</p>
                        <p className="text-xs w-10 h-10 flex place-items-center place-content-center items-center text-gray-200 rounded-full bg-gray-500 shadow-lg">€{plan?.price}</p>
                    </div>
                    <Divider />
                    <div className="flex justify-between">
                        <Button onClick={() => history.replace("/select-plan")} type="ghost" className="bg-gray-600 hover:bg-gray-500 hover:text-white border-none text-white">Change plan</Button>
                        <Button loading={subscribe.isLoading} disabled={subscribe.isLoading} onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => { handleSubscribe(event) }} type="primary">{subscribe.isLoading ? 'Subscribing' : 'Subscribe'}</Button>
                    </div>
                </div>
            </div>
        </div>

    )
}