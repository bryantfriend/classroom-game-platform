import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, onValue, set, update, push, serverTimestamp, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import { firebaseConfig } from "../firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function randomCode(len=4){
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s=""; for(let i=0;i<len;i++) s+=alphabet[Math.floor(Math.random()*alphabet.length)];
  return s;
}

export async function createRoom(moduleId, locale="en"){
  const code = randomCode(5);
  const roomRef = ref(db, "rooms/" + code);
  const now = Date.now();
  await set(roomRef, {
    createdAt: now,
    moduleId,
    phase: "lobby",
    locale,
    ui: {},              // module-defined controller UI schema
    state: {},           // module-defined game state
  });
  return { code, roomRef };
}

export function roomRefs(code){
  const roomRef = ref(db, "rooms/" + code);
  return {
    roomRef,
    playersRef: ref(db, "rooms/" + code + "/players"),
    actionsRef: ref(db, "rooms/" + code + "/actions"),
    uiRef: ref(db, "rooms/" + code + "/ui"),
    stateRef: ref(db, "rooms/" + code + "/state"),
    phaseRef: ref(db, "rooms/" + code + "/phase")
  };
}

// Generic action sender
export function sendAction(code, playerId, type, payload={}){
  const { actionsRef } = roomRefs(code);
  return push(actionsRef, { playerId, type, payload, ts: Date.now() });
}

// Register a player (controller joins)
export async function joinRoom(code, name){
  const { playersRef } = roomRefs(code);
  const node = await push(playersRef, { name, score:0, joinedAt: Date.now(), online:true });
  const id = node.key;
  // presence not fully implemented; simple flag
  return { id };
}

// Observe room
export function onRoom(code, cb){
  const { roomRef } = roomRefs(code);
  return onValue(roomRef, snap => cb(snap.val()));
}

// i18n (very small)
export const t = (key, locale="en") => {
  const dict = {
    en:{
      enterRoom:"Enter room code",
      yourName:"Your name",
      join:"Join",
      waiting:"Waiting for teacher…",
      start:"Start",
      players:"Players",
      module:"Module",
      end:"End"
    },
    ru:{
      enterRoom:"Введите код комнаты",
      yourName:"Ваше имя",
      join:"Присоединиться",
      waiting:"Ожидание учителя…",
      start:"Старт",
      players:"Игроки",
      module:"Модуль",
      end:"Конец"
    }
  };
  return (dict[locale] && dict[locale][key]) || dict.en[key] || key;
}
