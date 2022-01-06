import React from "react"
import FolderIcon from "../../../../../components/icons/folder"

type FolderTitleType = {
    title: string | undefined
}
export const FolderTitle = React.memo(({ title }: FolderTitleType): JSX.Element => {
    return (
        <div className="w-full flex gap-2 sm:gap-0 items-center cursor-pointer">
            <FolderIcon className="text-blue-500 sm:mr-2" style={{ width: 30, height: 30 }} />
            <p className="truncate text-xs font-medium sm:w-16">{title}</p>
        </div>
    )
})