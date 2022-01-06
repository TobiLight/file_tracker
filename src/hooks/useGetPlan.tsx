import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import ApiRequest from "../helpers/axios";
import { PlanType } from "../lib/types";

export const useGetUserPlan = (email: string | undefined): PlanType | undefined => {
    const [userPlan, setUserPlan] = useState<PlanType | undefined>()

    useEffect(() => {
        const getUserPlanData = async (email: string | undefined, signal?: AbortSignal | undefined): Promise<PlanType> => {
            try {
                const request = await ApiRequest.get(`/plan/user/${email}/`, { signal })
                return request.data
            } catch (err: any) {
                throw new Error(err)
            }
        }
        getUserPlanData(email).then(data => setUserPlan(data))
    }, [email])



    // useQuery(['user_plan', email], ({ signal }) =>
    //     getUserPlanData(email, signal),
    //     {
    //         refetchOnMount: false, refetchInterval: 1000 * 3600, staleTime: 1000 * 3600, cacheTime: 1000 * 3300, refetchOnWindowFocus: false, retry: 2, retryOnMount: false,
    //         onSuccess: data => setUserPlan(data)
    //     })
    return userPlan
}