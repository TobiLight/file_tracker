import { AxiosResponse } from "axios"
import useLocalStorage from "../hooks/useLocalStorage"
import { IUser, IUserAuth, UserProfileType } from "../lib/interfaces"
import { RegistrationType } from "../lib/types"
import useUserStore from "../store/user"
import ApiRequest from "./axios"


export const UserAuth = () => {
    const { setUser, setUserHasPlan } = useUserStore()
    const [, setUserInLocalStorage] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [, setUserHasPlanInLocalStorage] = useLocalStorage<boolean | undefined>('ft_user_has_plan', undefined)
    const [tokenInLocalStorage, setTokenInLocalStorage] = useLocalStorage<string | undefined>('ft_token', undefined)


    /**
     * Async request to Register a user on file tracker. 
     * @param {String} first_name User's firt name
     * @param {String} last_name User's last name
     * @param {String} email User's email
     * @param {String} password User's password
     * @param {String} password2 confirm the user's password entered
     * @param {String} password2 confirm the user's password entered
     * @returns {Object} returns User data object
     */
    const RegisterUser = async ({ newUser, url }: RegistrationType) => {
        try {
            const request = await ApiRequest.post(url, { ...newUser })
            return request.data
        } catch (err: any) {

            if (err?.response.data.first_name) {
                throw new Error("First name cannot be blank!")
            }

            if (err?.response.data.last_name) {
                throw new Error("First name cannot be blank!")
            }

            if (err?.response.data.email) {
                throw new Error("Enter a valid email address!")
            }

            if (err?.response.data.password2) {
                throw new Error("Password does not match!")
            }

            throw new Error(`${err} || 'Somethi`)
        }
    }

    /**
    *  Get token from server before logging the user in
    * @param {String} email User's email
    * @param {String} password User's password
    * @returns {string} returns JWT token
    */
    const getToken = async ({ email, password }: IUserAuth): Promise<any> => {
        try {
            const data = await ApiRequest.post("/api-token-auth/", { email, password })
            return data?.data.token
        } catch (err: any) {
            if (!err?.response) {
                throw new Error("Something went wrong :(")
            }
            throw new Error(err?.response.data.non_field_errors[0])
        }
    }

    /**
    *  Sign user in with token
    * @param {String} email User's email
    * @param {String} password User's password
    * @param {String} token JWT token
    * @returns {Object} returns user data
    */
    const loginWithToken = async ({ email, password, token }: IUserAuth): Promise<AxiosResponse<any, any>> => {
        try {
            const userInput = await ApiRequest.post('/user/login/', { email, password }, {
                headers: {
                    'Authorization': `JWT ${token}`
                }
            })
            return userInput.data
        } catch (err: any) {
            console.log(err?.response.data)
            if (!err?.response) {
                throw new Error("Something went wrong :(")
            }
            throw new Error(err?.response.data.details || err?.response.data.non_field_errors[0])
        }
    }



    /**
    *  Login handler
    * @param {String} email User's email
    * @param {String} password User's password
    * @param {String} token JWT token
    * @returns {Object} returns user data
    */
    const LoginUser = ({ email, password }: IUserAuth, signal?: AbortSignal | undefined): Promise<Partial<IUser> | any> => {
        return getToken({ email, password }).then(response => {
            setTokenInLocalStorage(response)
            return loginWithToken({ email, password, token: tokenInLocalStorage || response }).then(() => GetUserProfile(email, signal))
            // return GetUserProfile(email, signal)
        }).catch((err: any) => {
            throw new Error(err)
        })
    }

    /**
     * 
     * @param {String} email User email
     * @returns {Object} return User data 
     */
    const GetUserProfile = async (email: string | undefined, signal?: AbortSignal | undefined): Promise<UserProfileType | undefined> => {
        if (!email) {
            return
        }
        try {
            const request = await ApiRequest.get(`/user/profile/${email}/`, { signal })
            setUser({
                email: request.data.user.email,
                first_name: request.data.user.first_name,
                last_name: request.data.user.last_name,
                date_joined: request.data.user.date_joined,
                last_login: request.data.user.last_login,
            })
            setUserInLocalStorage({
                email: request.data.user.email,
                first_name: request.data.user.first_name,
                last_name: request.data.user.last_name,
                date_joined: request.data.user.date_joined,
                last_login: request.data.user.last_login,
            })
            setUserHasPlan(request.data.has_plan)
            setUserHasPlanInLocalStorage(request.data.has_plan)
            return {
                user: request.data.user,
                has_plan: request.data.has_plan
            }
        } catch (err: any) {
            throw new Error(err)
        }
    }

    const checkIfUserHasPlan = async (email: string | undefined) => {
        try {
            const userHasPlan = await ApiRequest.get(`/user/has-plan/${email}/ `)
            return userHasPlan.data
        } catch (err: any) {
            throw new Error(err)
        }
    }


    return { RegisterUser, LoginUser, GetUserProfile, checkIfUserHasPlan }
}