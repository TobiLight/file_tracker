import axios from "axios"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { Route, Redirect, useHistory } from "react-router-dom"
import useLocalStorage from "../hooks/useLocalStorage"
import { IUser, PlanType } from "../lib/interfaces"
import useUserStore from "../store/user"


export function ProtectedUserRoute({ component: Component, ...rest }: any) {
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [userHasPlan,] = useLocalStorage<boolean | undefined>('ft_user_has_plan', undefined)
    const [userPlan,] = useLocalStorage<PlanType | undefined>('ft_user_plan', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const queryClient = useQueryClient()

    useEffect(() => {
        queryClient.setDefaultOptions({
            queries: {
                staleTime: 1000 * 3600
            }
        })

        queryClient.setQueryData(['user_plan', user?.email], userPlan,)
        queryClient.setQueryData(['user_profile', user?.email], user)
    }, [])

    return (
        <Route
            {...rest}
            render={(props: any) => {
                if (token && userHasPlan && user) {
                    return (<Component {...props} />)
                } else {
                    return (<Redirect to={{ pathname: '/login' }} />)
                }
            }}
        />
    )
}
