import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import { roomRefs } from "../core.js";

export async function init({ code, uiRef, stateRef }){
  await set(uiRef, {
    buttons: [
      { key:"left",  label:"⬅️ Left",  actionType:"moveLeft" },
      { key:"right", label:"Right ➡️", actionType:"moveRight" },
      { key:"score", label:"✅ SCORE", actionType:"score" }
    ]
  });
  await set(stateRef, {
    width: 920,
    p: {} // player positions by id
  });
  attachActionListener(code);
}

export function start({ code }){ /* no-op for now */ }

export function draw({ room, canvas, ctx }){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "22px system-ui";
  ctx.fillText("Trash Dash — move and score!", 20, 36);

  const st = room.state || {};
  const p = st.p || {};
  let x=50, y=120;
  ctx.fillText("Players:", 20, 80);
  Object.entries(p).forEach(([id,val])=>{
    ctx.fillText(id.slice(-4)+": x="+(val.x||0)+" score="+(val.score||0), 40, y);
    // draw a square
    ctx.fillRect((val.x||0), y+10, 20, 20);
    y += 60;
  });
}

// minimal action handler
export function attachActionListener(code){
  const { actionsRef, stateRef } = roomRefs(code);
  onValue(actionsRef, snap => {
    const actions = snap.val(); if(!actions) return;
    const arr = Object.entries(actions).map(([k,v])=>({id:k, ...v})).sort((a,b)=>a.ts-b.ts);
    const last = arr[arr.length-1];
    if(!last) return;
    // read-modify-write of state
    onValue(stateRef, s => {
      const st = s.val() || { width:920, p:{} };
      const me = st.p[last.playerId] || { x: 100, score: 0 };
      const speed = 18;
      if (last.type==="moveLeft")  me.x = Math.max(0, (me.x||0) - speed);
      if (last.type==="moveRight") me.x = Math.min(st.width-20, (me.x||0) + speed);
      if (last.type==="score")     me.score = (me.score||0) + 1;
      st.p[last.playerId] = me;
      set(stateRef, st);
    }, { onlyOnce:true });
  });
}
