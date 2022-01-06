import { Button, message } from "antd"
import React, { useEffect, useState } from "react"
import { NavLink, useHistory } from "react-router-dom"
import { Chekcbox } from "../../../components/forms/checkbox"
import { FormInput } from "../../../components/forms/TextField/input"
import MainLayout from "../../../components/layout/MainLayout"
import { useAuth } from "../../../hooks/useAuth"
import useLocalStorage from "../../../hooks/useLocalStorage"
import { IUser, IUserAuth } from "../../../lib/interfaces"
import useUserStore from "../../../store/user"


export const AdminSignup = (): JSX.Element => {
    const [input, setInput] = useState<IUserAuth>({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
    })
    const [checked, setCheckbox] = useState<boolean>(false)
    const [user,] = useLocalStorage<IUser | undefined | null>('ft_admin', undefined)
    const [token,] = useLocalStorage<string>('ft_token', '')
    const history = useHistory()
    const { RegisterHandler } = useAuth()
    const { getUser } = useUserStore()

    useEffect(() => {
        if (token && (user?.is_admin || getUser()?.email) && user?.is_admin) {
            return history.replace("/user/dashboard/overview")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
        * handleChange method captures user input
        * @param {MouseEvent} event Input event listener
    */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [event.currentTarget.name]: event.currentTarget.value })
    }

    /**
     * 
     * @param {MouseEvent} event Event Listener
     * @returns void
     */
    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCheckbox(!checked)
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        if (!input?.first_name) {
            window.scrollTo(0, 0)
            return message.error("First name cannot be blank!")
        }

        if (!input?.last_name) {
            window.scrollTo(0, 0)
            return message.error("Last name name cannot be blank!")
        }

        if (!input.email) {
            window.scrollTo(0, 0)
            return message.error("Email cannot be blank!")
        }

        if (!input.password) {
            window.scrollTo(0, 0)
            return message.error("Password cannot be blank!")
        }


        if (input.password.length < 6) {
            window.scrollTo(0, 0)
            return message.error("Password cannot be less than 6 characters!")
        }

        RegisterHandler.mutate({ newUser: input, url: '/user/admin/register/' }, {
            onError: (err: any) => {
                message.error(`${err}`)
                window.scrollTo(0, 0)
            },
            onSuccess: (data: any) => {
                setInput({
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    password2: '',
                })
                setCheckbox(false)
                window.scrollTo(0, 0)
                message.success({ content: "Admin account created successfully!", key: 'registration' })
                // history.push("/login")
                setTimeout(() => {
                    message.destroy('registration')
                    history.push("/admin/login")
                }, 1500)
            },
        })
    }

    return (
        <MainLayout className="bg-gray-100">
            <div className="min-h-screen flex items-center mt-24 my-14">
                <div className="shadow-lg bg-white rounded w-9/12 sm:w-1/2 lg:w-3/5 mx-auto py-8 px-4">
                    <h1 className="text-2xl font-bold text-center mt-4 mb-10">Admin Sign up</h1>
                    <form className="px-6">
                        <div className="lg:flex lg:space-x-8">
                            <div className="firstname mt-5 w-full">
                                <label htmlFor="first_name" className="flex flex-col font-semibold">
                                    First Name
                                    <FormInput required className="mt-2 login-input" name="first_name" value={input.first_name} onChange={handleChange} disabled={false} type={"text"} />
                                </label>
                            </div>

                            <div className="lastname mt-5 w-full">
                                <label htmlFor="last_name" className="flex flex-col font-semibold">
                                    Last Name
                                    <FormInput required className="mt-2 login-input" name="last_name" value={input.last_name} onChange={handleChange} disabled={false} type={"text"} />
                                </label>
                            </div>
                        </div>

                        <div className="email mt-5">
                            <label htmlFor="email" className="flex flex-col font-semibold">
                                Email
                                <FormInput required className="mt-2 login-input" name="email" value={input.email} onChange={handleChange} disabled={false} type={"text"} />
                            </label>
                        </div>

                        <div className="password mt-5">
                            <label htmlFor="password" className="flex flex-col font-semibold">
                                Password
                                <FormInput required className="mt-2 password-input" name="password" value={input.password} onChange={handleChange} disabled={false} type={"password"} />
                            </label>
                        </div>

                        <div className="confirm-password mt-5">
                            <label htmlFor="password2" className="flex flex-col font-semibold">
                                Confirm password
                                <FormInput required className="mt-2 password-input" name="password2" value={input.password2} onChange={handleChange} disabled={false} type={"password"} />
                            </label>
                        </div>
                        <div>
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleSubmit}
                                disabled={!input.password || !input?.password2 ? true : false}
                                loading={RegisterHandler.isLoading}
                                className="my-8"
                            >
                                Create account
                            </Button>
                        </div>
                        <p className="text-sm text-center font-semibold mt-6">Already have an account? <span className="font-normal"><NavLink className="text-blue-500 hover:text-blue-600" to="/login">Click here</NavLink></span></p>
                    </form>

                </div>
            </div >
        </MainLayout >

    )
}