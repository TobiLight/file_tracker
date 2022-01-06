import React, { useCallback, useEffect, useState } from "react"
import FolderFilled from "@ant-design/icons/lib/icons/FolderFilled"
import { Card, message } from "antd"
import DashboardLayout from "../../../../components/layout/UserDashboard/Dashboard"
import "./folder.css"
import { FolderTitle } from "./Container/FolderTitle"
import { CreateFolderModal } from "./Container/CreateFolderModal"
import { useModal } from "../../../../hooks/useModal"
import { NavLink } from "react-router-dom"
import { useFolders } from "./FoldersLogic"
import Loading3QuartersOutlined from "@ant-design/icons/lib/icons/Loading3QuartersOutlined"
import useLocalStorage from "../../../../hooks/useLocalStorage"



const Folders = (): JSX.Element => {
    const { isModalVisible, showModal, handleCancel } = useModal()
    const { folders, isLoading } = useFolders()
    const [path, setPath] = useLocalStorage<string | undefined>('ft_user_path', undefined)

    useEffect(() => {
        setPath(undefined)
    }, [])

    return (
        <DashboardLayout>
            {isModalVisible && <CreateFolderModal closeModal={() => handleCancel()}
            />}
            <div className="flex flex-col flex-auto flex-grow flex-shrink h-full">
                <div className="block flex-grow flex-shrink h-full">
                    <Card title={`user_home/`}
                        extra={
                            <>
                                <button
                                    onClick={showModal}
                                    className="sm:hidden px-3 py-1 flex items-center shadow-md bg-blue-500 hover:bg-blue-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><FolderFilled width={"1em"} height={"1em"} />
                                </button>
                                <button
                                    onClick={showModal}
                                    className="hidden px-3 py-1 sm:flex items-center shadow-md bg-blue-500 hover:bg-blue-600 text-white rounded transform hover:-translate-y-1 transition-all delay-75"><FolderFilled className="mr-2 " /> Create Folder</button></>
                        }
                        className="flex flex-col h-full"
                    >
                        <div className="folders-body h-full flex-1"
                        >
                            {
                                isLoading ?
                                    <div className="w-full grid items-center place-items-center place-content-center">
                                        <Loading3QuartersOutlined spin={true} className="text-blue-500 text-4xl" />
                                    </div>
                                    :
                                    folders && folders.length > 0 ?
                                        <div className="w-full grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 items-center place-items-center gap-8">
                                            {folders.map((folder, idx) => (
                                                <NavLink onClick={() => setPath(path ? `${path}/${folder}` : folder)} key={'ft-' + idx} to={`/user/dashboard/folders/${folder}`} className="w-full hover:text-gray-400">
                                                    <div className="w-full p-3 shadow-md rounded flex justify-between">
                                                        <div className="flex gap-4 justify-between w-full">
                                                            <FolderTitle title={folder} />
                                                        </div>
                                                    </div>
                                                </NavLink>

                                            ))}
                                        </div>

                                        :
                                        <div className="w-full grid items-center place-items-center place-content-center">
                                            <p>You currently have no folders</p>
                                        </div>
                            }
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout >
    )
}

export default Folders