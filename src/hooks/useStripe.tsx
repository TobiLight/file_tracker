import { Form, message } from "antd"
import modal from "antd/lib/modal"
import { AxiosResponse } from "axios"
import { useQueryClient, useQuery, useMutation } from "react-query"
import { useHistory } from "react-router-dom"
import ApiRequest from "../helpers/axios"
import { IUser } from "../lib/interfaces"
import useUserStore from "../store/user"
import useLocalStorage from "./useLocalStorage"

type UserInputType = {
    name?: string
    email?: string
    card_number?: string
    cvc?: string
    exp_year?: string
    exp_month?: string
    line1?: string
    city?: string
    country?: string
}

export const useStripe = () => {
    const { getUser } = useUserStore()
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const checkUserHasStripe = async (signal: AbortSignal | undefined) => {
        try {
            const data = await ApiRequest.get(`/plan/stripe/customer/${user?.email || getUser()?.email}`, {
                signal, headers: {
                    'Authorization': `JWT ${token}`
                }
            })
            return data.data
        } catch (err: any) {
            throw new Error(err)
        }
    }

    const checkUserHasStripeAccount = useQuery('stripe_user', ({ signal }) => checkUserHasStripe(signal), {
        refetchInterval: 1000 * 3600,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 330,
        retry: 2,
        cacheTime: 1000 * 3600,
        refetchOnReconnect: true
    })

    const createStripeCustomer = async (user: UserInputType): Promise<AxiosResponse<any, any>> => {
        try {
            const request = await ApiRequest.post("/plan/stripe/create/customer/", {
                ...user
            }, { headers: { 'Authorization': `JWT ${token}` } })
            return request.data
        } catch (err: any) {
            console.log(err?.response)
            if (!err?.response) {
                throw new Error("Something went wrong :(")
            }
            throw new Error(err?.response.data)
        }
    }


    const createStripeAccount = useMutation((userInput: UserInputType) => createStripeCustomer({ ...userInput }), {
        onSuccess: (data: /*StripeUserType*/ | any) => {
            modal.success({ content: 'You have successfully created an account with Stripe!' })
            checkUserHasStripeAccount.refetch()
        },
        onError: (err: any) => {
            message.error(err)
        }
    })

    return { checkUserHasStripeAccount, createStripeAccount }
}