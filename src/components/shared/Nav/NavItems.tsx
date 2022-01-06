type NavItemsType = {
    className?: string
    children: React.ReactNode
}
export const NavItems = ({ className, children }: NavItemsType): JSX.Element => (
    <ul className={`list-none w-full text-sm ${className}`}>
        {children}
    </ul>
)