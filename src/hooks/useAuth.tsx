import { useMutation, useQuery } from "react-query"
import { useHistory } from "react-router"
import { UserAuth } from "../helpers/auth"
import { IUserAuth } from "../lib/interfaces"
import { RegistrationType } from "../lib/types"

export const useAuth = () => {
    const history = useHistory()
    const { LoginUser, RegisterUser, GetUserProfile } = UserAuth()

    const LoginHandler = useMutation(({ email, password }: IUserAuth) => LoginUser({ email, password }), {
        mutationKey: 'user_login'
    })

    const RegisterHandler = useMutation(({ newUser, url }: RegistrationType) => RegisterUser({ newUser, url }))

    const LogoutHandler = (event: React.MouseEvent<HTMLElement>): void => {
        localStorage.removeItem('ft_user')
        localStorage.removeItem('ft_user_plan')
        localStorage.removeItem('ft_user_has_plan')
        localStorage.removeItem('ft_token')
        history.replace("/login")
        return
    }

    const GetUserProfileHandler = (email: string | undefined) => {
        const { isLoading, isError, isSuccess, data, refetch } = useQuery(['get_user_profile'], ({ signal }) => GetUserProfile(email, signal), {
            refetchInterval: 1000 * 3600,
            staleTime: 1000 * 300,
            refetchOnMount: false,
            retryOnMount: false,
            cacheTime: 1000 * 3300,
            refetchOnReconnect: true,
            notifyOnChangeProps: ['data', 'error'],
        })
        return { isLoading, isError, isSuccess, data, refetch }
    }


    return { LoginHandler, RegisterHandler, LogoutHandler, GetUserProfileHandler }
}

