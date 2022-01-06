import axios from 'axios'
import { BlogPostType } from '../lib/types'

const NEWS_URL = `http://api.mediastack.com/v1/news?access_key=${process.env.REACT_APP_NEWS_ACCESS_KEY}&languages=en&category=technology`
export const getStories = async (signal: AbortSignal | undefined): Promise<BlogPostType[]> => {
    try {
        const news = await axios.get(NEWS_URL, { signal })
        return news.data.data
    } catch (err: any) {
        throw new Error(err)
    }
}