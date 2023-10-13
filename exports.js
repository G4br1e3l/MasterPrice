import {
    readFileSync,
    writeFileSync,
    unlink,
    unlinkSync,
    readdirSync,
    writeFile,
    createWriteStream,
    createReadStream
} from "fs";

import chalk from "chalk"

import P from 'pino'

import ora from 'ora';

import CFonts from 'cfonts'
const { render } = CFonts

import { GetQR } from './qr_.js'

import timezone from 'moment-timezone'
const { tz } = timezone

import emoji from 'node-emoji'
const { unemojify, hasEmoji } = emoji

import pkg1 from 'linkifyjs'
const { find } = pkg1

import baileys from '@whiskeysockets/baileys'
const {
    getContentType,
    default: makeWASocket,
    makeInMemoryStore,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers,
    downloadContentFromMessage
} = baileys

import {
    Read
} from './functions/reader.js'

import {
    Typed
} from './functions/_functions/_contentMessage.js'

import {
    sectionMenu
} from './functions/_functions/menus/_scriptMessage.js'

import {
    Provide
} from './functions/_commands/_provide.js'

import {
    Restrict
} from './functions/_commands/_restrict.js'

import {
    Owner
} from './functions/_commands/_owner.js'

import {
    GPT
} from './functions/_commands/_gpt.js'

import {
    CreateSticker
} from "./functions/_commands/_fig.js";

import {
    GetImage
} from "./functions/_commands/_dfig.js";

import {
    Splitt,
    Delay,
    Date,
    Hour,
    Save,
    Key,
    Spam,
    isSpam,
    Cooldown,
    DownColling,
    isColling,
    sizeCooldown,
    doIgnore,
    IsIgnoring,
    getRandom,
    console_message,
    createdData,
    Named,
    TenCount,
    getGroupData,
    Provided,
    Restricted,
    Owned,
    Audition,
    getMessageText,
    detectMessageStatus
} from './functions/_functions/_functionsMessage.js';

import {
    commands
} from './functions/commands.js'

import {
    sendCaptionImage,
    sendMessageQuoted,
    sendReaction,
    sendMessage,
    sendSticker,
    sendCaptionImageQuoted
} from './functions/_functions/_sendMessage.js';

import ax from "axios";
const { get, post } = ax;

import {
    path
} from "@ffmpeg-installer/ffmpeg";

import {
    spawn
} from "child_process";

import pdfjs from 'pdfjs-dist';
const { getDocument } = pdfjs;

import {
    promisify
} from 'util';

import streamToBuffer from 'stream-to-buffer';

var Config = JSON.parse(readFileSync("./root/configurations.json"))

export {
    Config,
    streamToBuffer as Buffer,
    promisify,
    getDocument,
    sendSticker,
    spawn,
    path,
    writeFile,
    unlinkSync,
    get,
    createReadStream,
    createWriteStream,
    sectionMenu,
    commands,
    Provide,
    Restrict,
    GPT,
    CreateSticker,
    Owner,
    GetImage,
    unlink,
    Read,
    Typed,
    readdirSync,
    Audition,
    getContentType,
    find,
    unemojify,
    hasEmoji,
    writeFileSync,
    makeWASocket,
    makeInMemoryStore,
    Browsers,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    chalk,
    tz,
    readFileSync,
    Splitt,
    Delay,
    Date,
    Hour,
    Save,
    Key,
    Spam,
    isSpam,
    Cooldown,
    DownColling,
    isColling,
    sizeCooldown,
    post,
    doIgnore,
    IsIgnoring,
    console_message,
    createdData,
    Named,
    TenCount,
    getGroupData,
    Provided,
    Restricted,
    Owned,
    getMessageText,
    detectMessageStatus,
    sendReaction,
    sendMessageQuoted,
    sendCaptionImageQuoted,
    sendMessage,
    sendCaptionImage,
    P,
    render,
    ora,
    getRandom,
    GetQR,
    downloadContentFromMessage
};