type NavMenuType = {
    children: React.ReactNode
}
export const NavMenu = ({ children }: NavMenuType): JSX.Element => (
    <div className="w-full">
        <div className="ft_navbar">
            {children}
        </div>
    </div>
)