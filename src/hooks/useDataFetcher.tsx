import { useQuery } from "react-query"
import { getStories } from "../utils/newsapi"


export const useNewsFetch = () => {
    const { isLoading: isStoriesLoading, isError: isStoriesError, isFetching: isFetchingStories, isSuccess: isStoriesSuccess, data: stories } = useQuery(['get_tech_news'], ({ signal }) => getStories(signal), {
        refetchInterval: 1000 * 3600,
        staleTime: 1000 * 300,
        refetchOnMount: false,
        retryOnMount: false,
        cacheTime: 1000 * 3300,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        notifyOnChangeProps: ['data', 'error'],
    })
    return { isStoriesLoading, isStoriesError, isFetchingStories, isStoriesSuccess, stories }
}

