import * as React from "react";

function FileUploadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            {...props}
        >
            <path d="M18 32h12V20h8L24 6 10 20h8zm-8 4h28v4H10z" />
        </svg>
    );
}

export default FileUploadIcon;
