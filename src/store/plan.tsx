import create from "zustand"
import { PlanType } from "../lib/interfaces"

type UserPlanStore = {
    plan: PlanType | undefined | null
    plans: PlanType[] | undefined | null
    setPlans: (plans: PlanType[] | undefined | null) => void
    setPlan: (plan: PlanType | undefined | null) => void
    getPlan: (id: number | undefined | null) => Partial<PlanType> | undefined | null | void
    getPlans: () => PlanType[] | undefined | null
    savePlanToLocalStorage: (data: PlanType) => void
    savePlansToLocalStorage: (data: PlanType[]) => void
    getPlanFromLocalStorage: (key: string) => void
}

export const useUserPlanStore = create<UserPlanStore>((set, get) => ({
    plan: undefined,
    plans: undefined,
    setPlans: (plans) => {
        if (!plans) {
            return set(state => ({
                ...state, plans: undefined
            }))
        }
        return set(state => ({
            ...state, plans: plans
        }))
    },
    setPlan: (plan: PlanType | undefined | null) => {
        if (!plan)
            return set(state => ({
                ...state, plan: undefined
            }))

        if (plan)
            return set(state => ({
                ...state, plan: { ...plan }
            }))
    },
    getPlan: (id) => {
        return get().plans?.forEach(plan => plan.id === id)
        // return {
        //     id: get().plan?.id,
        //     frequency: get().plan?.frequency,
        //     plan_name: get().plan?.plan_name,
        //     max_number_invites: get().plan?.max_number_invites,
        //     storage_size: get().plan?.storage_size,
        //     price: get().plan?.price,
        // }
    },
    getPlans: () => {
        return get().plans
    },
    savePlanToLocalStorage: (data) => {
        return localStorage.setItem('ft_user_plan', JSON.stringify(data))
    },
    savePlansToLocalStorage: (data) => {
        return localStorage.setItem('ft_plan_list', JSON.stringify(data))
    },
    getPlanFromLocalStorage: (key) => {
        let data: string | null = localStorage.getItem(key)
        if (data)
            return JSON.parse(data)
        return data
    }
}))