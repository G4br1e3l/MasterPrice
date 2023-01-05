import { writeFileSync } from "fs"
import pkg from 'moment-timezone'
const { tz } = pkg

//
export const set = (value, where) => where.split(value)[0]
export const Delay = (x) => new Promise(resolve => setTimeout(resolve, x))
export const date = () => tz("America/Sao_Paulo").format("DD/MM/YY")
export const hour = () => tz("America/Sao_Paulo").format("HH:mm:ss")
export const save = ({file_path, filename}) =>  writeFileSync(file_path, JSON.stringify(filename))
export const Key = (a) => a[Object.keys(a).find((key) => !['messageTimestamp', 'pushName', 'message'].includes(key))]

//
const Protect = new Set()
export const Spam = (x) => { Protect.add(x); setTimeout(() => Protect.delete(x), 8000) }
export const isSpam = (x) => !!Protect.has(x)

//
const Await = new Set()
export const Cooldown = (x) => { Await.add(x); setTimeout(() => Await.delete(x), 4000) }
export const DownColling = (x) => Await.delete(x)
export const isColling = (x) => !!Await.has(x)
export const sizeCooldown = (x) => Await
//
