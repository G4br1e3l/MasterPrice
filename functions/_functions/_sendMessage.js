import {
  readFileSync,
  Delay
} from '../../exports.js';

// const replayQuoted = {
//   key: {
//     remoteJid: messageQuoted?.participant || {},
//     fromMe: false,
//     id: messageQuoted?.stanzaId || {}
//   },
//   message: {}
// };

/**
 * Message options for sending a reaction.
 */
const messageOptions = [
  // Reação [0]
  { react: { key: { remoteJid: '', fromMe: false, id: '', participant: [''] }, text: '', } },
  // Texto [1]
  { text: '', fromMe: false },
  // Quoted [2]
  { quoted: '' },
  //Image [3]
  { image: '', caption: '', },
  //Sticker [4]
  { sticker: '', },
];

async function sendMessageToJid(client, Jid, mgOPT1, mgOPT2) {

  //console.log(Jid, mgOPT1, mgOPT2)

  try {
    return (await client.sendMessage(Jid, mgOPT1, mgOPT2));
  } catch (err) {
    console.error(`Erro ao enviar mensagem para ${Jid} ::: ${err}`);
  }
}

async function sendCaptionImage({ Cliente, ClienteJid, ClienteResposta, CaminhoImagem }) {

  messageOptions[3].image = readFileSync(CaminhoImagem)
  messageOptions[3].caption = ClienteResposta

  await Cliente.presenceSubscribe(ClienteJid);

  do {
    for (let index = 0; index < (ClienteResposta?.split(" ") || ClienteResposta).length; index++) {
      await Cliente.sendPresenceUpdate("composing", ClienteJid);
      await Delay(100);
    }
    await Cliente.sendPresenceUpdate("paused", ClienteJid);
  } while (!await sendMessageToJid(Cliente, ClienteJid, messageOptions[3]));
}

async function sendCaptionImageQuoted({ Cliente, ClienteJid, ClienteTopo, ClienteResposta, CaminhoImagem }) {

  messageOptions[3].image = readFileSync(CaminhoImagem)
  messageOptions[3].caption = ClienteResposta
  messageOptions[2].quoted = ClienteTopo

  await Cliente.presenceSubscribe(ClienteJid);

  do {
    for (let index = 0; index < (ClienteResposta?.split(" ") || ClienteResposta).length; index++) {
      await Cliente.sendPresenceUpdate("composing", ClienteJid);
      await Delay(100);
    }
    await Cliente.sendPresenceUpdate("paused", ClienteJid);
  } while (!await sendMessageToJid(Cliente, ClienteJid, messageOptions[3], messageOptions[2]));

}

async function sendMessage({ Cliente, ClienteJid, ClienteResposta }) {

  messageOptions[1].text = ClienteResposta

  await Cliente.presenceSubscribe(ClienteJid);

  do {
    for (let index = 0; index < (ClienteResposta?.split(" ") || ClienteResposta).length; index++) {
      await Cliente.sendPresenceUpdate("composing", ClienteJid);
      await Delay(100);
    }
    await Cliente.sendPresenceUpdate("paused", ClienteJid);
  } while (!await sendMessageToJid(Cliente, ClienteJid, messageOptions[1]));

  return await sendMessageToJid(Cliente, messageJid, messageOptions);
}

async function sendMessageQuoted({ Cliente, ClienteJid, ClienteTopo, ClienteResposta }) {

  messageOptions[1].text = ClienteResposta;
  messageOptions[2].quoted = ClienteTopo;

  await Cliente.presenceSubscribe(ClienteJid);

  do {
    for (let index = 0; index < ((ClienteResposta?.split(""))?.length || 1 ); index++) {
      await Cliente.sendPresenceUpdate("composing", ClienteJid);
      await Delay(Math.floor(Math.random() * 201));
    }
    await Cliente.sendPresenceUpdate("paused", ClienteJid);
  } while (!await sendMessageToJid(Cliente, ClienteJid, messageOptions[1], messageOptions[2]));

  return;
}

// async function sendEdition({ client, mJid, answer }) {
//   const a = await client.relayMessage(mJid, {
//     protocolMessage: {
//       key: {
//         remoteJid: mJid,
//         fromMe: true,
//         id: '3A9EA3E6BA6F50EBD803',
//       },
//       type: 14,
//       editedMessage: {
//         conversation: 'answer'
//       }
//     }
//   }, {})
// }

async function sendReaction({ Cliente, ClienteJid, ClienteId, ClienteNumero, ClienteResposta }) {

  messageOptions[0].react.key.remoteJid = ClienteJid
  messageOptions[0].react.key.id = ClienteId
  messageOptions[0].react.text = ClienteResposta
  messageOptions[0].react.key.participant = [`${ClienteNumero}@s.whatsapp.net`]

  return await sendMessageToJid(Cliente, ClienteJid, messageOptions[0]);
}

async function sendSticker({ Cliente, ClienteJid, ClienteTopo, CaminhoFigurinha }) {
  
  messageOptions[4].sticker = CaminhoFigurinha
  messageOptions[2].quoted = ClienteTopo

  return await sendMessageToJid(Cliente, ClienteJid, messageOptions[4], messageOptions[2]);
}

export {
  sendSticker,
  sendCaptionImage,
  sendMessageQuoted,
  sendReaction,
  sendMessage,
  sendCaptionImageQuoted
};
