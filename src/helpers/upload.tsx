import { message } from "antd"
import axios from "axios"
import { useState } from "react"
import { useMutation } from "react-query"
import useLocalStorage from "../hooks/useLocalStorage"
import ApiRequest from "./axios"

type UploadType = {
    file: any
    file_name: string
    path_to_file: string
    onUploadProgress?: ProgressEvent
}

type UploadRequestType = {
    file: FormData
}

export const UploadServices = () => {
    const [progress, setProgress] = useState<boolean | any | undefined>(undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const uploadRequest = async (file: FormData) => {
        // console.log(file.get('filename'));
        // try {
        //     const fileupload = await ApiRequest.post('/file-upload/file/', {
        //         // file: file, filename: 'file_name', path_to_folder: 'user_home/demo'
        //         file: file.get('file'), filename: file.get('filename'), path_to_file: file.get('path_to_file')
        //     }, {
        //         // withCredentials: true,
        //         headers: {
        //             'Authorization': `JWT ${token}`,
        //             'Accept': '*/*',
        //             "Content-Type": "multipart/form-data; boundary=-293582696224464",
        //         },
        //         onUploadProgress: (progress: ProgressEvent) => {
        //             const { loaded, total } = progress
        //             // const progressevent = Math.random()
        //             console.log('loaded:', loaded, 'total:', total)
        //         }
        //     })
        //     return fileupload
        // } catch (err: any) {
        //     console.log(err?.response)
        //     throw new Error(err)
        // }



        try {
            const request = await fetch('http://localhost:8000/file-upload/file/', {
                method: 'POST',
                body: file,
                headers: {
                    'Authorization': `JWT ${token}`,
                    'Accept': '*/*',
                    // 'Content-Type': 'undefined'
                }
            })
            return request
        } catch (err: any) {
            throw new Error(err)
        }
    }
    const upload = async ({ file, file_name, path_to_file }: UploadType): Promise<any> => {
        const data = new FormData()
        data.append('file', file)
        data.append('filename', file_name)
        data.append('path_to_file', path_to_file)
        const request = await uploadRequest(data)
        return request
    }

    const uploadMutation = useMutation('upload-file', uploadRequest)
    return { uploadMutation }
}