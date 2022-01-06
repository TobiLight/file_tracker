import { IUser } from "./interfaces"

export type BlogPostType = {
    title: string
    description: string
    image: string
    url: string
    // author: string
}

export type BlogPostsType = {
    count: number
    posts: BlogPostType[] | undefined
}

export type PlanType = {
    frequency: string
    id: number
    max_number_invites: number
    plan_name: string
    price: number
    storage_size: number
}

export type FolderType = {
    owner_email: string | undefined
    path_to_folder: string
    folder_name: string
    // profiles_with_access_rights: number[] | undefined
}

export type RegistrationType = {
    newUser: Partial<IUser>,
    url: string
}

export type ModalType = {
    // visible: boolean
    closeModal: () => void
}