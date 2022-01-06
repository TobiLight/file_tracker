function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M20 5h-9.586L8.707 3.293A.997.997 0 008 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2z" />
        </svg>
    );
}

export default FolderIcon;
