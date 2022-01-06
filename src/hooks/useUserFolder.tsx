import { message } from "antd"
import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import ApiRequest from "../helpers/axios"
import { IUser } from "../lib/interfaces"
import useLocalStorage from "./useLocalStorage"

type DeleteFileType = {
    path: string
    fileName: string
}

type DeleteFolderType = {
    foldername: string
    path_to_folder: string
}

export const useUserFolder = (path_to_folder: string) => {
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const [path, savePath] = useLocalStorage<string | undefined>('ft_user_path', undefined)
    const fetchFiles = async (signal: AbortSignal | undefined): Promise<any[]> => {
        if (!path) {
            savePath(path_to_folder)
        }


        try {
            const data = await ApiRequest.get(`/file-upload/folder/content?path_to_dir=user_home/${path_to_folder}`, {
                headers: {
                    'Authorization': `JWT ${token}`
                },
                signal
            })
            return data.data
        } catch (err: any) {
            if (err?.response.status === 401 || err?.response.status === 403) {
                localStorage.removeItem('ft_token')
                localStorage.removeItem('ft_user')
                localStorage.removeItem('ft_user_has_plan')
            }
            throw new Error(err)
        }
    }

    const { data, isLoading, isError, refetch } = useQuery([`${path_to_folder}/user_files`, user?.email], ({ signal }) => fetchFiles(signal), { staleTime: 1000 * 3500, retry: 2, retryDelay: 300000, refetchOnWindowFocus: false })

    const splitPath = (filePath: string): string => {
        const split = filePath.split("/")
        return split.slice(0, split.length - 1).join("/")
    }


    const deleteFolder = async ({ foldername, path_to_folder }: DeleteFolderType) => {
        try {
            const folder = await ApiRequest.delete("/file-upload/delete/folder/", {
                data: {
                    folder_name: foldername, path_to_folder: path_to_folder
                },
                headers: {
                    'Authorization': `JWT ${token}`
                }
            })
            return folder.data
        } catch (err: any) {
            if (err?.response.status === 401 || err?.response.status === 403) {
                message.error(`${err?.response.data.detail}`)
                localStorage.removeItem('ft_token')
                localStorage.removeItem('ft_user')
                localStorage.removeItem('ft_user_has_plan')
                throw new Error(err?.response.status)
            }
            throw new Error(err)
        }
    }

    const deleteFolderMutation = useMutation(['delete-folder'], ({ foldername, path_to_folder }: DeleteFolderType) => deleteFolder({ foldername, path_to_folder }))

    const deleteFile = async ({ path, fileName }: DeleteFileType) => {
        try {
            const request = await ApiRequest.delete(`/file-upload/delete/file/`, {
                data: {
                    path_to_file: path ? `user_home/${path}` : 'user_home',
                    filename: fileName
                },
                headers: {
                    'Authorization': `JWT ${token}`
                },
            })
            return request.data
        } catch (err: any) {
            if (err?.response.status === 401 || err?.response.status === 403) {
                localStorage.removeItem('ft_token')
                localStorage.removeItem('ft_user')
                localStorage.removeItem('ft_user_has_plan')
                throw new Error(err?.response.status)
            }
            message.error("An error has occured!")
            throw new Error(err)
        }
    }

    const { deleteFileMutation } = useMutation(['delete_file'], deleteFile)


    return { data, isLoading, isError, refetch, deleteFolderMutation, deleteFileMutation, splitPath }
}