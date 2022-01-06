import * as React from "react";

function FileDownloadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            {...props}
        >
            <path d="M38 18h-8V6H18v12h-8l14 14 14-14zM10 36v4h28v-4H10z" />
        </svg>
    );
}

export default FileDownloadIcon;