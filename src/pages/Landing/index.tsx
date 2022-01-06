import React from 'react'
import './style/style.css'
import './style/index.css'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Button } from 'antd'
import { StorageIcon } from '../../components/icons/storage'
import { useNewsFetch } from '../../hooks/useDataFetcher'
import { Blog } from '../Blog/Blog'
import UsersIcon from '../../components/icons/users'
import fileshare from '../../assets/images/file-share.jpg'
import MainLayout from '../../components/layout/MainLayout'
import Loading3QuartersOutlined from "@ant-design/icons/lib/icons/Loading3QuartersOutlined"
import ShareAltOutlined from '@ant-design/icons/lib/icons/ShareAltOutlined'
import { BlogPosts } from '../Blog/BlogPosts'
import useLocalStorage from '../../hooks/useLocalStorage'
import ApiRequest from '../../helpers/axios'

type PlanType = {
    frequency: string
    id: number
    max_number_invites: number
    plan_name: string
    price: number
    storage_size: number
}

export const LandingPage = (): JSX.Element => {
    const { stories, isStoriesLoading, isStoriesError } = useNewsFetch()
    const [, savePlansToLocalStorage] = useLocalStorage<PlanType[] | undefined>('ft_plan_list', undefined)

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
        onSuccess: data => {
            savePlansToLocalStorage({ ...data })
        }
    })

    return (
        <MainLayout className="relative">
            <div className="hero-wrapper">
                <div className="hero-content">
                    <h3 className="text-xl font-bold tracking-wider">Secure file sharing with anyone, anywhere in the world.</h3>
                    <p className="text-md sm:text-lg md:text-xl">A filing system that could be used by anyone to save, manage, share and organise their files based on a certain criteria</p>
                </div>
                <div className="flex space-x-5 mt-8">
                    <NavLink to="/register">
                        <button className="trial-btn">Start your free trial</button>
                    </NavLink>
                    <NavLink to="/login">
                        <button className="login-btn">Login</button>
                    </NavLink>
                </div>
            </div>

            <div className="flex flex-row flex-wrap md:flex-nowrap">
                <div className="h-96 w-full lg:p-8">
                    <img src={fileshare} alt="file_tracker" className="object-cover w-full h-full lg:rounded-full" />
                </div>
                <div className="px-6 flex flex-col space-y-5 md:space-y-0 justify-evenly py-10 bg-white md:w-4/5 whitespace-pre-wrap">
                    <p className="text-lg">Reduce the time spent on managing and maintaining paper  documents, storage space required for paper documents, delay in retrieval of  paper documents and the risks of loss of documents due to physical damage.
                    </p>
                    <button className="get-started-btn">Get Started</button>
                </div>
            </div>

            <div className="p-6 bg-blue-500 pb-16">
                <h1 className="text-white text-4xl font-bold text-center py-10">
                    Choose Your Plan
                </h1>

                {isError &&
                    <div className="grid place-items-center">
                        <p className="text-gray-200 text-center">An error occured while fetching plans :(</p>
                        <Button onClick={() => refetch()} type="ghost" className="text-white mt-2 hover:bg-gray-200 hover:text-gray-700">retry</Button>
                    </div>
                }

                {isLoading &&
                    <div className="w-full flex justify-center">
                        <Loading3QuartersOutlined spin={true} className="text-gray-200 text-5xl text-center" />
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
                    </div>}
            </div>

            <div className="blog">
                <h1 className="text-gray-600 text-4xl font-bold text-center py-10">
                    Blog
                </h1>
                {isStoriesLoading &&
                    <div className="w-full grid place-items-center items-center mb-8">
                        <Loading3QuartersOutlined spin={true} className="text-gray-800 text-5xl text-center" />
                    </div>
                }

                {isStoriesError &&
                    <div className="h-20 items-center w-full place-content-center place-items-center text-center">
                        <p>An error has occured!</p>
                    </div>
                }

                {stories?.length &&
                    <div className="blog-posts w-10/12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 items-center place-content-center justify-center mx-auto mb-10">
                        <Blog blogposts={<BlogPosts count={5} posts={stories} />} />
                    </div>
                }
            </div>
        </MainLayout>
    )
}