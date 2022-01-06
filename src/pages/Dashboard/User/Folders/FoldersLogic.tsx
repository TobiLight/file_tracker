import { useEffect, useState } from "react"
import { useUserFolders } from "../../../../hooks/useUserFolders"

export const useFolders = () => {
    const [folders, setFolders] = useState<string[] | undefined>(undefined)
    const { data, isLoading } = useUserFolders()

    useEffect(() => {
        if (data && data?.length > 0) {
            setFolders(data)
        }
    }, [folders, data])

    return { folders, isLoading }
}