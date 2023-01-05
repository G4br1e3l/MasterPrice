//
import { Key } from './_dlay.js' 
import { readFileSync, writeFileSync } from "fs"

//functions response
import { sendReaction } from './_rect.js'

//
export const TenCount = async ({ MP, message }) => {
    (async function teste(x){
        const reactions = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','✅']
        await sendReaction({
            client: MP,
            param: message,
            answer: reactions[x]
        })
        if( x <= 10 ) teste( x + 1 )
    })(0)
}

export const getGroupData = ({ Type, groupMetadata, message }) => {

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))

    const Keya = Key(message)

    switch(Type){
        case 'isAdmin':
            let u = []
            for (let i of groupMetadata.participants) {
                if(i.admin === 'admin' || i.admin === 'superadmin') u.push(i.id)
            }
            if(u.includes(Keya.participant)) return true
        break
        case 'isBotAdmin':
            let us = []
            for (let i of groupMetadata.participants) {
                if(i.admin === 'admin' || i.admin === 'superadmin') us.push(i.id)
            }
            if(us.includes(`${getConfigProperties.bot.user_id}@s.whatsapp.net`)) return true
        break
    }
}

export const Provided = ({ Modo, Parametro}) =>{
    
    var getGroupProperties = JSON.parse(readFileSync('./database/commands/distributed.json'))
    
    switch(Modo){
        case 'provide':
            getGroupProperties.off.secure.push(Parametro)
            writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
        break
        case 'unprovide':
        for (let i = 0; i < getGroupProperties.off.secure.length; i++) {
            if (getGroupProperties.off.secure[i] === Parametro){
                getGroupProperties.off.secure.splice(i, 1)
                writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
                break
            }
        }
        break
    }
}

export const Restricted = ({ Modo, Parametro}) =>{
    
    var getGroupProperties = JSON.parse(readFileSync('./database/commands/distributed.json'))
    
    switch(Modo){
        case 'restrict':
            getGroupProperties.commands.only.group.push(Parametro)
            writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
        break
        case 'unrestrict':
        for (let i = 0; i < getGroupProperties.commands.only.group.length; i++) {
            if (getGroupProperties.commands.only.group[i] === Parametro){
                getGroupProperties.commands.only.group.splice(i, 1)
                writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
                break
            }
        }
        break
    }
}

export const Owned = ({ Modo, Parametro}) =>{
    
    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))
    
    switch(Modo){
        case 'addowner':
            getConfigProperties.bot.owners.push(Parametro)
            writeFileSync("./root/config.json", JSON.stringify(getConfigProperties))
        break
        case 'removeowner':
        for (let i = 0; i < getConfigProperties.bot.owners.length; i++) {
            if (getConfigProperties.bot.owners[i] === Parametro){
                getConfigProperties.bot.owners.splice(i, 1)
                writeFileSync("./root/config.json", JSON.stringify(getConfigProperties))
                break
            }
        }
        break
    }
}