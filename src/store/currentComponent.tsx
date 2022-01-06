import create from 'zustand'


type CurrentComponentType = {
    selectedMenuKey: string
    setSelectedMenukey: (key: string | undefined) => void
}
const useCurrentComponent = create<CurrentComponentType>(set => ({
    selectedMenuKey: '0',
    setSelectedMenukey: (key) => {
        if (!key) {
            return set(state => ({
                ...state, selectedMenuKey: '-1'
            }))
        }

        localStorage.setItem('selected_menu_key', key)
        return set(state => ({
            ...state, selectedMenuKey: key
        }))
    }
}))

export default useCurrentComponent