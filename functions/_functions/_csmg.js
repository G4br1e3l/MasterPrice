import chalk from "chalk"

export const console_message = ({message_param, name, user, entry, hour, date}) =>{

    let user1 = user.includes("@")? user.split("@")[0] : user
    let user2 = user1.includes(":")? user1.split(":")[0] : user1

    return console.log(chalk.rgb(123, 45, 67).bold(
        message_param
        .replaceAll('@botname', name)
        .replaceAll('@user', user2)
        .replaceAll('@entry', chalk.hex('#DEADED').bgGreen.bold(entry))
        .replaceAll('@hour', hour)
        .replaceAll('@date', date)
    ))
}
