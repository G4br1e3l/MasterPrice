const fs = require("fs")

var set_me = JSON.parse(fs.readFileSync("./root/config.json"))

const { say } = require('./_functions/_sayd.js')
const { react } = require('./_functions/_rect.js')
const { send } = require('./_functions/_send.js')

/*
send({
    client: MP, 
    param: message, 
    answer: 'Hello!',
    path_image: './database/images/download.webp'
})
say({
    client: MP, 
    param: message, 
    answer: 'Por favor.'
}).finally(() => 
react({
    client: MP, 
    param: message, 
    answer: '🙂'
}))
*/

const save = ({file_path, filename}) =>  fs.writeFileSync(file_path, JSON.stringify(filename))

const commands = async ({MP, typed, group_data, message}) => {

    var args = (typed.split(set_me.prefix)[1]).trim().split(/ +/)
    const arguments = []
    args.forEach(word => {
        arguments.push(word.toLowerCase())
    })

    async function run ({arguments}){
        switch(arguments[0]){
            case '':
            break
            default: return
        }
    }
    await Promise.resolve().then( async () => await run({arguments: arguments}))
}

module.exports = { commands }