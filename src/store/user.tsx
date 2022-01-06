import create from 'zustand'
import { IUser, PlanType } from '../lib/interfaces'


type UserStoreType = {
    user: IUser | undefined
    has_plan: boolean | undefined
    user_plan: PlanType | undefined
    setUser: (user: IUser | undefined) => void
    getUser: () => IUser | undefined
    setUserHasPlan: (plan: boolean | undefined) => void
    getUserHasPlan: () => boolean | undefined
    setUserPlan: (plan: PlanType | undefined) => void
    getUserPlan: () => PlanType | undefined
}

// global user state
const useUserStore = create<UserStoreType>((set, get) => ({
    user: undefined,
    has_plan: undefined,
    user_plan: undefined,
    user_has_plan: false,
    isAuthenticated: undefined,
    setUser: (newuser: IUser | undefined) => {
        if (!newuser) {
            return set(state => ({
                ...state, user: undefined
            }))
        }
        if (newuser) {
            return set(state => ({
                ...state, user: { ...newuser }
            }))
        }
    },
    getUser: () => {
        return get().user
    },
    setUserHasPlan: (plan) => {
        if (!plan) {
            return set(state => ({
                ...state, has_plan: undefined
            }))
        }
        return set(state => ({
            ...state, has_plan: plan
        }))
    },
    getUserHasPlan: () => {
        return get().has_plan
    },
    getUserPlan: () => {
        return get().user_plan
    },
    setUserPlan: plan => {
        if (!plan) {
            return set(state => ({
                ...state, user_plan: undefined
            }))
        }
        return set(state => ({
            ...state, user_plan: { ...plan }
        }))
    }
}))

export default useUserStore