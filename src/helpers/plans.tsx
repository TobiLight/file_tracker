import axios from "axios"
import { PlanType } from "../lib/interfaces"
import ApiRequest from "./axios"

export const FetchPlans = async (signal: AbortSignal | undefined): Promise<PlanType[]> => {
    try {
        const data: any = await ApiRequest.get("/plan/list/", { signal })
        const plans: PlanType[] = [...data.data]
        return plans
    } catch (err: any) {
        console.log('error from method', err)
        if (!err?.response) {
            throw new Error("Check if you're connected to the internet")
        }
        throw new Error(err)
    }
}

export const getUserPlanData = async (email: string | undefined, signal?: AbortSignal | undefined): Promise<PlanType> => {
    try {
        const request = await ApiRequest.get(`/plan/user/${email}/`, { signal })
        return request.data
    } catch (err: any) {
        throw new Error(err)
    }
}