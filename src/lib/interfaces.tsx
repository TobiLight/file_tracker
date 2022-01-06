import React from "react";

export interface IWindowResize {
    width: number | undefined
    height: number | undefined
}

export interface IMainPageLayout {
    className?: string
    children: React.ReactNode
}

export interface IMobileHeader {
    className?: string
    handleclick: () => void
    showMenu: boolean
}

export interface IFormInput {
    placeholder?: string
    value?: string | number | readonly string[] | undefined
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    disabled: boolean
    name: string
    className?: string
    type: 'text' | 'password' | 'email' | 'tel' | 'number'
    inputmode?: 'numeric'
    pattern?: string
    autocomplete?: string
    maxlength?: string
    required?: boolean
}

export interface IFormDate {
    name?: string
    className?: string
    value?: string
    min?: string
    max?: string
}

export interface IFormCheckBox {
    value?: string
    name?: string
    className?: string
    checked?: boolean
    handleCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface IFormRadio {
    value?: string
    name?: string
    className?: string
    checked?: boolean
}

export interface IFormTextArea {
    placeholder?: string
    value: string | number | readonly string[] | undefined
    handlechange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    disabled: boolean
    name: string
    className?: string
    cols: number
    rows: number
}

export interface IFormButton {
    btnText: string
    className?: string
    disabled?: boolean
    style?: React.CSSProperties
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export interface UserLayout {
    children: React.ReactNode
    className?: string
}

export interface AdminLayout {
    children: React.ReactNode
    className?: string
}

export interface IUser {
    email: string | undefined
    first_name?: string | undefined
    last_name?: string | undefined
    date_joined?: string | undefined
    last_login?: string | undefined
    is_admin?: boolean
    is_regular?: boolean
}


export type UserProfileType = {
    user: IUser,
    has_plan: boolean | undefined
}


export interface IUserAuth {
    email: string | undefined
    password: string | undefined
    password2?: string | undefined
    first_name?: string | undefined
    last_name?: string | undefined
    token?: string | undefined
}

export interface PlanType {
    frequency: string
    id: number
    max_number_invites: number
    plan_name: string
    price: number
    storage_size: number
}