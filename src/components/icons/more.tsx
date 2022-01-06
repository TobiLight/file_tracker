import React from "react"

export const VerticalMoreIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
    )
}

export const HorizontalMoreIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
            xmlns="http://www.w3.org/2000/svg"
        ><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
    )
}