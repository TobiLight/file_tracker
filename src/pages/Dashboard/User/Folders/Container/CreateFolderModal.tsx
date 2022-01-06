import React, { useState } from "react"
import { FolderType, ModalType } from "../../../../../lib/types"
import useLocalStorage from "../../../../../hooks/useLocalStorage"
import { IUser } from "../../../../../lib/interfaces"
import { useMutation, useQueryClient } from "react-query"
import axios from "axios"
import { message } from "antd"
import ApiRequest from "../../../../../helpers/axios"
import { useUserFolders } from "../../../../../hooks/useUserFolders"
import { useParams } from "react-router-dom"


export const CreateFolderModal = ({ closeModal }: ModalType): JSX.Element => {
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const [input, setInput] = useState<FolderType | undefined>({ folder_name: '', owner_email: user?.email, path_to_folder: 'user_home' })
    const qc = useQueryClient()
    const [path,] = useLocalStorage<string | undefined>('ft_user_path', undefined)
    const folderName: { [x: string]: string } = useParams()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // setFolder({ folder_name: event.target.value, owner_email: user?.email, path_to_folder: 'user_home/' })
        setInput({ folder_name: event.target.value, owner_email: user?.email, path_to_folder: 'user_home' })
    }

    const createFolder = async () => {
        console.log(path, input?.folder_name);
        try {
            const data = await ApiRequest.post('/file-upload/create-folder/', {
                folder_name: input?.folder_name, owner_email: input?.owner_email, path_to_folder: `${path ? `user_home/${path}` : 'user_home/'}`
            }, {
                headers: {
                    "Authorization": `JWT ${token}`,
                }
            })
            return data.data
        } catch (err: any) {
            console.log(err?.response)
            throw new Error(err)
        }
    }

    const createFolderMutation = useMutation(['user_create_folder'], createFolder, {
        onError: (err) => {
            message.error("An error has occured! Please try again")
        },
        onSuccess: (data) => {
            message.success('Folder created!')
            qc.invalidateQueries()
            closeModal()
        }
    })

    return (
        <div style={{ backgroundColor: '#14141473' }} className={"min-h-screen bg-gray-500 w-full fixed z-10 top-0 left-0 grid items-center"}>
            <div className="w-9/12 md:w-2/4 bg-white rounded mx-auto flex flex-col justify-between">
                <div className="border-b border-gray-300 h-14 rounded-tl rounded-tr flex items-center justify-between px-4">
                    <p className="tracking-wider pl-2 text-xs">Create folder</p>
                    <p onClick={closeModal} className="cursor-pointer px-4">X</p>
                </div>
                <div className="p-6 h-full my-5">
                    <div className="grid gap-3">
                        <label htmlFor="path_to_folder" className="grid">
                            Path to Folder
                            {`user_home/${folderName?.folder ? folderName?.folder : ''}`}
                        </label>
                        <label htmlFor="folder_name">
                            Folder name
                            <input disabled={createFolderMutation.isLoading} onChange={handleChange} type="text" name="folder_name" value={input?.folder_name} placeholder="Enter the name of the folder..." className="rounded w-full px-3 py-1 border border-gray-500 text-gray-600 bg-gray-100" />
                        </label>
                    </div>
                </div>
                <div className="folder_modal_footer border-t border-gray-300 p-3 flex gap-3 justify-end h-14">
                    <button onClick={closeModal} className="px-3 py-1 text-white bg-gray-700 hover:bg-gray-600 text-xs rounded">Cancel</button>
                    <button disabled={createFolderMutation.isLoading} onClick={() => createFolderMutation.mutate()} className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-400 text-xs rounded">{createFolderMutation.isLoading ? 'Creating...' : 'Create'}</button>
                </div>
            </div>
        </div>
    )
}