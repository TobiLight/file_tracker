import { Breadcrumb, Card, message, Popconfirm } from "antd"
import DashboardLayout from "../../../../components/layout/UserDashboard/Dashboard"
import { FolderTitle } from "../Folders/Container/FolderTitle"
import FileFilled from "@ant-design/icons/lib/icons/FileFilled"
import { Link, NavLink, useHistory, useParams } from "react-router-dom"
import { UploadModal } from "../../../../components/UploadModal"
import { useUploadModal } from "../../../../hooks/useUploadModal"
import { useUserFolder } from "../../../../hooks/useUserFolder"
import Loading3QuartersOutlined from "@ant-design/icons/lib/icons/Loading3QuartersOutlined"
import { TrashIcon } from "../../../../components/icons/trash"
import FileUploadIcon from "../../../../components/icons/fileupload"
import BxsTrashAltIcon from "../../../../components/icons/trashalt"
import { useQuery, useQueryClient } from "react-query"
import { UploadFile } from "./Container/UploadFile"
import FileIcon from "../../../../components/icons/file"
import FolderIcon from "../../../../components/icons/folder"
import FileDownloadIcon from "../../../../components/icons/filedownload"
import useLocalStorage from "../../../../hooks/useLocalStorage"
import ApiRequest from "../../../../helpers/axios"
import { CreateFolderModal } from "../Folders/Container/CreateFolderModal"
import { useModal } from '../../../../hooks/useModal'
import { LeftArrow } from "../../../../components/icons/arrow"


type FolderNameType = {
    [x: string]: string
}

type FileDownloadType = {
    file: string | any
    signal: AbortSignal | undefined
}


export const Folder = (): JSX.Element => {
    const folderName: FolderNameType = useParams()
    const { displayUploadModal, handleOk, showUploadModal } = useUploadModal()
    const { isModalVisible, handleCancel, showModal } = useModal()
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const [path, setPath] = useLocalStorage<string | undefined>('ft_user_path', undefined)
    const { data: folder, isLoading, deleteFolderMutation, deleteFileMutation } = useUserFolder(path ? path : folderName?.folder)
    const history = useHistory()
    const qc = useQueryClient()
    const downloadFile = async (file: any) => {
        message.info('Download Initiated...')
        try {
            const request = await ApiRequest.get(`/file-upload/download?path_to_file=user_home/${path ? `${path}` : `${folderName?.folder}`}&filename=${file}`, {
                headers: {
                    'Authorization': `JWT ${token}`
                },
                // responseType: 'blob'
            })
            message.success('File download started...')
            const url = window.URL.createObjectURL(new Blob([request.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', file)
            link.click()
            return request.data
        } catch (err: any) {
            console.log(err?.response);
            if (err?.response.status === 401 || err?.response.status === 403) {
                localStorage.removeItem('ft_token')
                localStorage.removeItem('ft_user')
                localStorage.removeItem('ft_user_has_plan')
                return history.replace("/login")
            }
            message.error('File download failed')
            console.log(err);
        }
    }


    const splitPath = (filePath: string): string => {
        const split = filePath.split("/")
        console.log(split.slice(0, split.length - 1).join("/"));
        return split.slice(0, split.length - 1).join("/")
    }


    return (
        <DashboardLayout>
            {showUploadModal &&
                // <UploadModal
                //     modalText={modalText}
                //     confirmLoading={confirmLoading}
                //     visible={showUploadModal}
                //     handleOk={handleOk}
                //     handleCancel={displayUploadModal}
                // />
                <UploadFile closeModal={handleOk} />
            }

            {isModalVisible && <CreateFolderModal closeModal={handleCancel}
            />}
            <div className="flex flex-col flex-auto flex-grow flex-shrink h-full">
                <div className="flex flex-col h-full">
                    <div>
                        <Breadcrumb className="flex items-center mb-2">
                            <Breadcrumb.Item className="hover:text-gray-500 cursor-pointer" onClick={() => {
                                history.replace('/user/dashboard/folders')
                            }}>user_home</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Card
                        className="h-full"
                        title={
                            <>
                                <div className="flex items-center gap-3">
                                    <LeftArrow width={"1em"} height={"1em"} className="cursor-pointer text-blue-500 hover:text-blue-400" onClick={() => {
                                        qc.invalidateQueries()
                                        setPath(path ? splitPath(path) : folderName?.folder)
                                        history.goBack()
                                    }} />
                                    <p>{folderName?.folder}</p>
                                </div>
                            </>

                        }
                        extra={
                            <>
                                <div className="flex items-center md:hidden gap-2 w-auto">
                                    <Popconfirm
                                        placement="topRight"
                                        title={'Are you sure you want to delete this folder?'}
                                        onConfirm={() => {
                                            message.info('Deleting folder...')
                                            deleteFolderMutation.mutate({ foldername: folderName?.folder, path_to_folder: path && splitPath(path).length > 0 ? `user_home/${splitPath(path)}` : `user_home/` }, {
                                                onSuccess: data => {
                                                    setPath(path ? splitPath(path) : folderName?.folder)
                                                    qc.invalidateQueries()
                                                    message.success("Folder successfully deleted")
                                                    console.log(path);
                                                    history.goBack()
                                                },
                                                onError: (err: any) => {
                                                    qc.invalidateQueries()
                                                    if (err.message === String(401) || err.message === String(403)) {
                                                        return history.replace("/login")
                                                    }
                                                }
                                            })
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button
                                            title="Delete folder"
                                            className="p-2 flex items-center shadow-md bg-red-500 hover:bg-red-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><BxsTrashAltIcon className="w-4 h-4" />
                                        </button>
                                    </Popconfirm>
                                    <button
                                        title="Upload files"
                                        onClick={displayUploadModal}
                                        className="p-2 flex items-center shadow-md bg-gray-500 hover:bg-gray-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><FileUploadIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        title="Create folder"
                                        onClick={showModal}
                                        className="p-2 flex items-center shadow-md bg-blue-500 hover:bg-blue-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><FolderIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="hidden md:flex items-center place-items-center gap-2 flex-wrap w-auto">
                                    <Popconfirm
                                        placement="topRight"
                                        title={'Are you sure you want to delete this folder?'}
                                        onConfirm={() => {
                                            message.info('Deleting folder...')
                                            deleteFolderMutation.mutate({ foldername: folderName?.folder, path_to_folder: path && splitPath(path).length > 0 ? `user_home/${splitPath(path)}` : `user_home/` }, {
                                                onSuccess: data => {
                                                    setPath(path ? splitPath(path) : folderName?.folder)
                                                    qc.invalidateQueries()
                                                    message.success("Folder successfully deleted")
                                                    history.goBack()
                                                },
                                                onError: (err: any) => {
                                                    qc.invalidateQueries()
                                                    if (err.message === String(401) || err.message === String(403)) {
                                                        return history.replace("/login")
                                                    }
                                                }
                                            })
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button
                                            title="Delete folder"
                                            className="px-3 py-1 flex items-center shadow-md bg-red-500 hover:bg-red-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><TrashIcon width={"1em"} height={"1em"} className="mr-2" /> Delete folder
                                        </button>
                                    </Popconfirm>
                                    <button
                                        title="Upload file"
                                        onClick={displayUploadModal}
                                        className="px-3 py-1 flex items-center shadow-md bg-gray-500 hover:bg-gray-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><FileUploadIcon width={"1em"} height={"1em"} className="mr-2" /> Upload file
                                    </button>
                                    <button
                                        title="Create folder"
                                        onClick={showModal}
                                        className="px-3 py-1 flex items-center shadow-md bg-blue-500 hover:bg-blue-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><FolderIcon width={"1em"} height={"1em"} className="mr-2" /> Create Folder
                                    </button>
                                </div>
                            </>
                        }
                    >
                        <div className="h-full">

                            {isLoading ?
                                <div className="w-full grid items-center place-items-center place-content-center">
                                    <Loading3QuartersOutlined spin={true} className="text-blue-500 text-4xl" />
                                </div>
                                :
                                folder && folder?.length > 0 ?
                                    <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {
                                            folder.map((files: any, idx: any) => (
                                                <div key={idx} className="w-full p-3 shadow-md rounded flex justify-between" >
                                                    <div className="flex gap-4 justify-between w-full">
                                                        <div className="w-full flex gap-2 sm:gap-0 items-center justify-between place-items-center">
                                                            {files?.match(/\.[^\\/]+$/) ?
                                                                <>
                                                                    {/* <NavLink to={`/user/dashboard/folders/${folder}`} className="w-full hover:text-gray-400"> */}
                                                                    <div className="flex items-center">
                                                                        <FileIcon className="text-blue-500 mr-2" style={{ width: 30, height: 30 }} />
                                                                        <p title={files} className="truncate text-xs font-medium sm:w-16">{files}</p>
                                                                    </div>

                                                                    {/* </NavLink> */}
                                                                    <div className="flex items-center place-items-center gap-2 h-full">
                                                                        <div onClick={() => downloadFile(files)} className="transform hover:-translate-y-1 transition-all delay-75 text-green-500 rounded border border-green-300 hiver:border-red-500 hover:bg-green-100 p-2 cursor-pointer">
                                                                            <FileDownloadIcon width={"1em"} height={"1em"} className="download-link" />
                                                                        </div>

                                                                        <Popconfirm
                                                                            placement="topRight"
                                                                            title={'Are you sure you want to delete this file?'}
                                                                            onConfirm={() => {
                                                                                message.info('Deleting file...')
                                                                                deleteFileMutation.mutate({ path: path ?? folderName?.folder, fileName: files }, {
                                                                                    onSuccess: data => {
                                                                                        message.success('File deleted successfully!')
                                                                                        qc.invalidateQueries()
                                                                                    },
                                                                                    onError: (err: any) => {
                                                                                        if (err.message === String(401) || err.message === String(403)) {
                                                                                            return history.replace("/login")
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <div className="transform hover:-translate-y-1 transition-all delay-75 text-red-500 rounded border border-red-300 hiver:border-red-500 hover:bg-red-100 p-2 cursor-pointer">
                                                                                <p><TrashIcon width={"1em"} height={"1em"} /></p>
                                                                            </div>
                                                                        </Popconfirm>

                                                                    </div>
                                                                </>

                                                                :
                                                                <NavLink onClick={() => setPath(path ? `${path}/${files}` : `${folderName?.folder}/${files}`)} to={`/user/dashboard/folders/${files}`} className="w-full hover:text-gray-400 flex items-center place-items-center">
                                                                    <FolderIcon className="text-blue-500 mr-2" style={{ width: 30, height: 30 }} />
                                                                    <p className="truncate text-xs font-medium sm:w-16">{files}</p>
                                                                </NavLink>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    :
                                    <div className="w-full grid items-center place-items-center place-content-center">
                                        <p>You currently have no files</p>
                                    </div>
                            }
                        </div>
                    </Card>
                </div>
            </div >
        </DashboardLayout >
    )
}