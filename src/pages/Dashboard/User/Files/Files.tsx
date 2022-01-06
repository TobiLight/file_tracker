import { LeftArrow, RightArrow } from "../../../../components/icons/arrow"
import FileIcon from "../../../../components/icons/file"
import { HorizontalMoreIcon } from "../../../../components/icons/more"
import { DashboardContent } from "../../../../components/layout/UserDashboard/Content"
import DashboardLayout from "../../../../components/layout/UserDashboard/Dashboard"
import { TrashIcon } from "../../../../components/icons/trash"
import { SquareShareIcon } from "../../../../components/icons/share"
import { CloudArrowUpFillIcon, FileDownloadIcon } from "../../../../components/icons/cloud"
import React, { useState } from "react"
import { UploadModal } from "../../../../components/UploadModal"
import { Button, Card, message, Popconfirm } from "antd"
import FolderFilled from "@ant-design/icons/lib/icons/FolderFilled"
import { useUploadModal } from "../../../../hooks/useUploadModal"

type ShowFileType = {
    visible: boolean
    id: number | string | undefined
}

const Files = (): JSX.Element => {
    const [showFileOptions, setShowFileOptions] = useState<ShowFileType>({
        visible: false,
        id: undefined
    })
    const [confirmLoading_, setConfirmLoading_] = useState(false);
    const [, setVisible] = useState(false)
    const { displayUploadModal, handleOk, confirmLoading, modalText, showUploadModal } = useUploadModal()

    const showPopconfirm = () => {
        setVisible(true)
    };

    const confirm = () => {
        setConfirmLoading_(true)
        new Promise<void>(resolve => {
            setTimeout(() => {
                resolve(message.success("File deleted."))

            }, 2000);
        })
    };

    const cancel = () => {
        setTimeout(() => {
            setVisible(false)
            message.error('Action canceled.');
        }, 0);
    };


    // toggle file options
    const displayFileOptions = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string | number | undefined) => {
        setShowFileOptions({
            visible: !showFileOptions.visible,
            id
        })
    }

    // toggle upload modal


    return (
        <DashboardLayout>
            <div className="flex flex-col flex-auto flex-grow flex-shrink h-full">
                <div className="block flex-grow flex-shrink h-full">
                    <Card title="Files" extra={
                        <Button type="primary"
                            icon={<CloudArrowUpFillIcon width="1em" height="1em" className="mr-2" />}
                            onClick={displayUploadModal}
                            className="flex items-center shadow-md bg-blue-500 hover:bg-blue-600 rounded transform hover:-translate-y-1 transition-all delay-75">
                            {/* <CloudArrowUpFillIcon className="w-5 h-5" /> */}
                            Upload Files
                        </Button>
                    }
                        className="h-full">
                        <UploadModal
                            modalText={modalText}
                            confirmLoading={confirmLoading}
                            visible={showUploadModal}
                            handleOk={handleOk}
                            handleCancel={displayUploadModal}
                        />
                        <div className="grid w-full">
                            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }].map((e, i) => {
                                    return (
                                        <div key={e.id + 's'} className="relative w-full rounded-md p-2 shadow-md">
                                            <div className="flex space-x-2 place-items-center">
                                                <FileIcon className="w-4 h-4 text-blue-400" />
                                                <div className="w-full flex-1 justify-between place-items-center">
                                                    <p className="text-xs">Untitled{e.id}.zip</p>
                                                </div>
                                                <div onClick={(event) => {
                                                    displayFileOptions(event, e.id)
                                                }} className="cursor-pointer rounded-full bg-gray-100 hover:bg-gray-200 p-2">
                                                    <HorizontalMoreIcon className={!showFileOptions.visible && (showFileOptions.id === e.id) ? "w-4 h-4 transition-all delay-75" : "w-4 h-4 transform rotate-90 transition-all delay-75"} />
                                                </div>
                                            </div>
                                            {!showFileOptions.visible && (showFileOptions.id === e.id) &&
                                                <div className="flex space-x-6 place-items-center place-content-end justify-end py-3 mt-3 border-t">
                                                    <div className="text-blue-400 cursor-pointer">
                                                        <FileDownloadIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-gray-400 cursor-pointer">
                                                        <SquareShareIcon className="w-5 h-5" />
                                                    </div>
                                                    <div onClick={showPopconfirm} className="text-red-400 text-sm cursor-pointer">
                                                        <Popconfirm
                                                            title="Are you sure delete this task?"
                                                            onConfirm={confirm}
                                                            onCancel={cancel}
                                                            okButtonProps={{ loading: confirmLoading_ }}
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onVisibleChange={() => console.log('changed')}
                                                            placement="topRight"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </Popconfirm>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="w-full pagination grid justify-end mt-4">
                                <div className="flex space-x-5 place-items-center">
                                    <LeftArrow className="w-10 h-10 text-blue-400 hover:text-blue-600 cursor-pointer" />
                                    <p>1 of 3</p>
                                    <RightArrow className="w-10 h-10 text-blue-400 hover:text-blue-600 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout >
    )
}

export default Files