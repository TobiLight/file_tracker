import axios from "axios"
import { useQuery } from "react-query"
import ApiRequest from "../helpers/axios"
import { IUser } from "../lib/interfaces"
import useLocalStorage from "./useLocalStorage"

export const useUserFolders = () => {
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)

    const fetchUserFolders = async (signal: AbortSignal | undefined): Promise<string[]> => {
        try {
            const data = await ApiRequest.get(`/file-upload/folder/content?path_to_dir=user_home/`, {
                headers: {
                    'Authorization': `JWT ${token}`
                },
                signal
            })
            return data.data
        } catch (err: any) {
            throw new Error(err)
        }
    }


    const { data, isLoading, isError, isSuccess } = useQuery(['user_folders', user?.email], ({ signal }) => fetchUserFolders(signal), {
        staleTime: 1000 * 3600,
        retry: 3
    })

    return { data, isLoading, isError, isSuccess }
}