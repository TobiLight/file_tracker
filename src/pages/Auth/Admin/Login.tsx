import { Button, message } from "antd"
import React, { useEffect, useState } from "react"
import { NavLink, useHistory } from "react-router-dom"
import { FormInput } from "../../../components/forms/TextField/input"
import PadlockIcon from "../../../components/icons/padlock"
import MainLayout from "../../../components/layout/MainLayout"
import { getUserPlanData } from "../../../helpers/plans"
import { useAuth } from "../../../hooks/useAuth"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { IUser, IUserAuth, UserProfileType } from "../../../lib/interfaces"
import { PlanType } from "../../../lib/types"
import useUserStore from "../../../store/user"

import "./index.css"

export const AdminLogin = () => {
    const [input, setInput] = useState<IUserAuth>({
        email: "",
        password: ""
    })
    const [btnText, setBtnText] = useState<string>("Sign in")
    const { LoginHandler } = useAuth()
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const { getUser } = useUserStore()
    const history = useHistory()

    useEffect(() => {
        if (token && (user?.is_admin || getUser()?.is_admin)) {
            return history.replace("/admin/dashboard/manage-users")
        }

        localStorage.removeItem('ft_admin')
        localStorage.removeItem('ft_token')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * handleChange method captures user email and password input
     * @param {MouseEvent} event Input event listener
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBtnText("Sign in")
        setInput({ ...input, [event.currentTarget.name]: event.currentTarget.value })
    }

    /**
    * handleSubmit method sends user input to the server
    * @param {MouseEvent} event On click event listener
    * @returns 
    */
    const handleSubmit = (event: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setBtnText("Signin in...")
        if (!input.email || !input.password) {
            setBtnText('Sign in')
            message.error("You cannot login without an email and password")
            return
        }
        LoginHandler.mutate({ ...input }, {
            onSuccess: (data: UserProfileType) => {
                if (data.user.is_admin) {
                    return history.replace("/admin/dashboard/manage-users")
                }
                localStorage.removeItem('ft_token')
                return history.replace("/admin/login")
            },
            onError: (err: any) => {
                setBtnText('Sign in')
                localStorage.removeItem('ft_user')
                localStorage.removeItem('ft_token')
                localStorage.removeItem('ft_user_plan')
                message.error(`${err}`)
            }
        })
    }

    return (
        <MainLayout className="bg-gray-100">
            <div className="mt-40 mb-10">
                <div className="shadow-lg bg-white rounded w-10/12 sm:w-1/2 lg:w-2/5 mx-auto py-8 px-4">
                    <div className="login-icon text-center w-full mb-4">
                        <PadlockIcon className="w-8 h-8 mx-auto" />
                    </div>
                    <h1 className="text-xl font-bold text-center">Admin area</h1>
                    <form className="px-6 pt-8" onSubmit={handleSubmit}>
                        <div className="email">
                            <label htmlFor="email" className="flex flex-col font-semibold">
                                Email
                                <FormInput className="mt-2 login-input" name="email" value={input?.email} onChange={handleChange} disabled={false} type={"email"} required={true} />
                            </label>
                        </div>
                        <div className="password mt-5">
                            <label htmlFor="password" className="flex flex-col font-semibold">
                                Password
                                <FormInput className="mt-2 password-input" name="password" value={input?.password} onChange={handleChange} disabled={false} type={"password"} />
                            </label>
                        </div>
                        <div className="mt-4 flex space-x-3 justify-between items-center">
                            <Button
                                type="primary"
                                disabled={LoginHandler.isLoading ? true : false}
                                onClick={handleSubmit}
                                className={LoginHandler.isLoading ? "rounded cursor-not-allowed opacity-50 font-bold bg-blue-500 hover:bg-blue-600 text-white" : "rounded font-bold bg-blue-500 hover:bg-blue-600 text-white"}
                            >
                                {btnText}
                            </Button>
                            <NavLink to="/forgot-password" className="text-blue-500 hover:text-blue-600">
                                Forgot password?
                            </NavLink>
                        </div>
                        <p className="text-center font-semibold mt-6">Don't have an account? <span className="font-normal"><NavLink className="text-blue-500 hover:text-blue-600" to="/admin/register">Click here</NavLink></span></p>
                    </form>
                </div>
            </div>

        </MainLayout>
    )
}
