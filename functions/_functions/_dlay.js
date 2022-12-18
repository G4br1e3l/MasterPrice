import { readFileSync, /*writeFileSync*/ } from "fs"

export const delay = () => {
    return new Promise(resolve => setTimeout(resolve, 2000))
}

export const fdelay = () => {
    return new Promise(resolve => setTimeout(resolve, 500))
}