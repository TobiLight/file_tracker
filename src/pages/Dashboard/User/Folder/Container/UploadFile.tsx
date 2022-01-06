import { ModalType } from "../../../../../lib/types"
import FileUploadIcon from "../../../../../components/icons/fileupload";
import React from "react";
import { UploadServices } from "../../../../../helpers/upload";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import useLocalStorage from "../../../../../hooks/useLocalStorage";

type FolderNameType = {
    [x: string]: string
}

export const UploadFile = ({ closeModal }: ModalType): JSX.Element => {
    const folderName: FolderNameType = useParams()
    const [path,] = useLocalStorage<string | undefined>('ft_user_path', undefined)
    const qc = useQueryClient()
    const { uploadMutation } = UploadServices()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const data = new FormData()
        if (event.target.files && event.target.files.length > 0) {
            data.append('file', event.target.files[0])
            data.append('filename', event.target.files[0].name)
            data.append('path_to_file', path ? `user_home/${path}/` : `user_home/${folderName?.folder}/`)
            uploadMutation.mutate(data, {
                onSuccess: data => {
                    if (data.status === 200) {
                        message.success('File upload successful')
                        qc.invalidateQueries()
                        closeModal()
                        return
                    }
                    qc.invalidateQueries()
                    message.error("File upload failed :(")
                    closeModal()
                }
            })
        }
    }

    return (
        <div style={{ backgroundColor: '#14141473' }} className={"min-h-screen bg-gray-500 w-full fixed z-10 top-0 left-0 grid items-center"}>
            <div className="w-9/12 md:w-2/4 bg-white rounded mx-auto flex flex-col justify-between">
                <div className="border-b border-gray-300 h-14 rounded-tl rounded-tr flex items-center justify-between px-4">
                    <p className="tracking-wider pl-2 text-xs">Upload files</p>
                    <p onClick={closeModal} className="cursor-pointer px-4">X</p>
                </div>
                <div className="p-6 h-full mt-2 mb-8">
                    <form encType="multipart/form-data">
                        <div className="grid items-center place-items-center place-content-center mx-auto justify-center rounded border border-gray-300 w-full p-2 bg-gray-100 h-full sm:h-56">
                            <label htmlFor="file-upload" className="relative cursor-pointer grid items-center place-items-center place-content-center mx-auto justify-center h-full">
                                <input onChange={handleChange} type="file" accept=".xlsx, .xls, .csv, .txt, .doc, .docx" multiple name="" id="" className="absolute left-0 right-0 z-10 h-full w-full opacity-0 cursor-pointer" />
                                <p className="mb-4">
                                    <FileUploadIcon className="w-14 h-14 text-blue-500" />
                                </p>
                                <p className="text-lg text-gray-700 text-center">Click on this area to upload</p>
                                <p className="text-gray-400 text-center">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="folder_modal_footer border-t border-gray-300 p-3 flex gap-3 justify-end h-14">
                    <button onClick={closeModal} className="px-3 py-1 text-white bg-gray-700 hover:bg-gray-600 text-xs rounded">Cancel</button>
                    {/* <button onClick={closeModal} className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-400 text-xs rounded">Upload</button> */}
                </div>
            </div >
        </div >
    )
}
