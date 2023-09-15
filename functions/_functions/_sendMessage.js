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

const presenceSubscribe = async ({ client, Jid }) =>
  client.presenceSubscribe(Jid);

const sendComposingUpdate = async ({ client, Jid }) =>
  client.sendPresenceUpdate("composing", Jid);

const sendPausedUpdate = async ({ client, Jid }) =>
  client.sendPresenceUpdate("paused", Jid);

async function Type({ client, messageJid }) {
  await presenceSubscribe({ client, Jid: messageJid });
  await Delay(1000);
  await sendComposingUpdate({ client, Jid: messageJid });
  await Delay(500);
  await sendPausedUpdate({ client, Jid: messageJid });
  return;
}

async function sendMessageToJid(client, Jid, messageOptions, msgopt1) {
  try {
    const result = await client.sendMessage(Jid, messageOptions, msgopt1);
    return result;
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${Jid}: ${error}`);
    throw error;
  }
}

async function sendCaptionImage({ client, param, answer, path_image }) {
  const {
    details: [{ messageJid }]
  } = param;

  const messageOptions = {
    image: readFileSync(path_image),
    caption: answer,
  };

  await Type({ client, messageJid });
  return await sendMessageToJid(client, messageJid, messageOptions);
}

async function sendMessageTyping({ client, param, answer }) {
  const {
    details: [{ messageJid }]
  } = param;

  const messageOptions = {
    text: answer,
  };

  await Type({ client, messageJid });
  return await sendMessageToJid(client, messageJid, messageOptions);
}

async function sendMessageTypingQuoted({ client, param, answer }) {
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  const messageOptions = { text: answer, fromMe: false };
  const messageOptions1 = { quoted: messageAll };

  await presenceSubscribe({ client, Jid: messageJid });

  do {
    for (let index = 0; index < (answer?.split(" ") || answer).length; index++) {
      await client.sendPresenceUpdate("composing", messageJid);
      await Delay(100);
    }
    await sendPausedUpdate({ client, Jid: messageJid });
  } while (!await sendMessageToJid(client, messageJid, messageOptions, messageOptions1));

  return;
}

async function sendMessageQuoted({ client, param, answer }) {
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  const messageOptions = { text: answer, fromMe: false };
  const messageOptions1 = { quoted: messageAll };

  await presenceSubscribe({ client, Jid: messageJid });

  do {
    for (let index = 0; index < (answer?.split(" ") || answer).length; index++) {
      await client.sendPresenceUpdate("composing", messageJid);
      await Delay(100);
    }
    await sendPausedUpdate({ client, Jid: messageJid });
  } while (!await sendMessageToJid(client, messageJid, messageOptions, messageOptions1));

  return;
}

async function sendReaction({ client, param, answer }) {
  const {
    details: [
      { messageJid, messageId },
      {
        sender: { messageNumber: number }
      }
    ]
  } = param;

  const messageOptions = {
    react: {
      key: {
        remoteJid: messageJid,
        fromMe: false,
        id: messageId,
        participant: [`${number ?? 0}@s.whatsapp.net`]
      },
      text: answer,
    }
  };

  return await sendMessageToJid(client, messageJid, messageOptions);
}

async function sendCaptionImageTyping({ client, param, answer, path_image }) {
  const {
    details: [{ messageJid }]
  } = param;

  const messageOptions = {
    image: readFileSync(path_image),
    caption: answer,
  };

  await presenceSubscribe({ client, Jid: messageJid });

  do {
    for (let index = 0; index < (answer?.split(" ") || answer).length; index++) {
      await client.sendPresenceUpdate("composing", messageJid);
      await Delay(100);
    }
    await sendPausedUpdate({ client, Jid: messageJid });
  } while (!await sendMessageToJid(client, messageJid, messageOptions));

  return;
}

async function sendCaptionImageTypingQuoted({ client, param, answer, path_image }) {
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  const messageOptions = {
    image: readFileSync(path_image),
    caption: answer,
  };

  const messageOptions1 = { quoted: messageAll };

  await presenceSubscribe({ client, Jid: messageJid });

  do {
    for (let index = 0; index < (answer?.split(" ") || answer).length; index++) {
      await client.sendPresenceUpdate("composing", messageJid);
      await Delay(100);
    }
    await sendPausedUpdate({ client, Jid: messageJid });
  } while (!await sendMessageToJid(client, messageJid, messageOptions, messageOptions1));

  return;
}

async function sendMessage({ client, param, answer }) {
  const {
    details: [{ messageJid }]
  } = param;

  const messageOptions = {
    text: answer,
    contextInfo: {
      mentionedJid: [messageJid]
    }
  };

  await Type({ client, messageJid });
  return await sendMessageToJid(client, messageJid, messageOptions);
}

async function sendCaptionImageQuoted({
  client,
  param,
  answer,
  path_image
}) {
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  const messageOptions = {
    image: readFileSync(path_image),
    caption: answer,
  };

  const messageOptions1 = { quoted: messageAll };

  await Type({ client, messageJid });
  return await sendMessageToJid(client, messageJid, messageOptions, messageOptions1);
}

export {
  Type,
  sendCaptionImage,
  sendMessageTyping,
  sendMessageTypingQuoted,
  sendMessageQuoted,
  sendReaction,
  sendCaptionImageTyping,
  sendCaptionImageTypingQuoted,
  sendMessage,
  sendCaptionImageQuoted
};
