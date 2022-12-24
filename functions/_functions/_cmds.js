//
import { Key } from './_dlay.js' 
import { readFileSync, writeFileSync } from "fs"

//functions response
import { sendReaction } from './_rect.js'

import { sendMessageQuoted } from './_smsq.js'

//
const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))

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

    var set_me = JSON.parse(readFileSync("./root/config.json"))

    const Keya = Key(message.messages[0])

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
            if(us.includes(`${set_me.bot.user_id}@s.whatsapp.net`)) return true
        break
    }
}

export const Distribute = ({ Modo, Parametro}) =>{
    
    var Distributed = JSON.parse(readFileSync('./database/commands/distributed.json'))
    
    switch(Modo){
        case 'make':
            Distributed.off.secure.push(Parametro)
            writeFileSync("./database/commands/distributed.json", JSON.stringify(Distributed))
        break
        case 'dimiss':
        for (let i = 0; i < Distributed.off.secure.length; i++) {
            if (Distributed.off.secure[i] === Parametro){
                Distributed.off.secure.splice(i, 1)
                writeFileSync("./database/commands/distributed.json", JSON.stringify(Distributed))
                break
            }
        }
        break
    }
}