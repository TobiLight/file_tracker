import { useEffect, useState } from "react";
import { UserAuth } from "../helpers/auth";
import { UserProfileType } from "../lib/interfaces";

export const useGetUserProfile = (email: string | undefined): UserProfileType | undefined => {
    const [userProfile, setUserProfile] = useState<UserProfileType | undefined>()
    const { GetUserProfile } = UserAuth()

    useEffect(() => {
        GetUserProfile(email).then(data => {
            setUserProfile(data)
        })
    }, [email])

    return userProfile
}