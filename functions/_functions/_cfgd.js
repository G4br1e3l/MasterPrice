import { writeFileSync, readFileSync } from "fs"

var set_me = JSON.parse(readFileSync("./root/config.json"))

export const named = ({MP}) => {

    let MP_ID = MP.authState?.me?.id ?? MP.user.id
    let MP_VName = MP.authState?.me?.verifiedName ?? MP.user.verifiedName
    let MP_Name = MP.authState?.me?.name ?? MP.user.name

    let N_name = MP_VName === MP_Name? MP_VName : MP_Name
    let N_1ID = MP_ID.includes("@")? MP_ID.split("@")[0] : MP_ID
    let N_2ID = N_1ID.includes(":")? N_1ID.split(":")[0] : N_1ID

    set_me.bot.user_id = N_2ID
    set_me.bot.user_name = N_name
    set_me.bot.verified = 'DONE'

    writeFileSync("./root/config.json", JSON.stringify(set_me))
}