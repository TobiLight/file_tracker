import { useEffect } from "react"
import useLocalStorage from "./useLocalStorage"

export const useNetworkDetector = () => {
    const [networkStatus, setNetworkStatus] = useLocalStorage<boolean | undefined>('status', undefined)

    useEffect(() => {
        handleConnection()
        window.addEventListener('online', handleConnection)
        window.addEventListener('offline', handleConnection)
        return () => {
            window.removeEventListener('online', handleConnection)
            window.removeEventListener('offline', handleConnection)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleConnection = () => {
        const connected = navigator.onLine ? 'online' : 'offline'
        if (connected === 'online') {
            return setNetworkStatus(true)
        }
        return setNetworkStatus(false)
    }

    return { networkStatus }
}