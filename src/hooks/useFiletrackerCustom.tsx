import axios, { AxiosResponse } from "axios"

export const useFileTracker = () => {
    const fetchData = async (url: string, signal: AbortSignal | undefined): Promise<AxiosResponse<any, any>> => {
        try {
            const { data } = await axios.get(url, { signal })
            return data
        } catch (err: any) {
            throw new Error(err)
        }
    }
}