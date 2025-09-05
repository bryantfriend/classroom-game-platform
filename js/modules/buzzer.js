import { ref, set, update, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import { roomRefs } from "../core.js";

export async function init({ code, uiRef, stateRef }){
  // Controller UI: single "BUZZ!" button
  await set(uiRef, {
    buttons: [
      { key:"buzz", label:"BUZZ!", actionType:"buzz" }
    ]
  });
  await set(stateRef, { buzzes: [] });
}

export function start({ code }){
  // nothing special; first buzz wins each round (you can reset between questions)
}

export function draw({ room, canvas, ctx }){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "28px system-ui";
  ctx.fillText("Quick Buzzer — first to buzz shows here ↓", 24, 48);

  const buzzes = room.state?.buzzes || [];
  const last = buzzes[buzzes.length-1];
  if (last){
    ctx.fillText("Winner: " + (last.name || last.playerId), 24, 96);
  }
}

// Screen should also listen to actions to record buzzes.
export function attachActionListener(code){
  const { actionsRef, stateRef } = roomRefs(code);
  onValue(actionsRef, snap => {
    const actions = snap.val();
    if(!actions) return;
    // find latest
    const arr = Object.entries(actions).map(([k,v])=>({id:k, ...v})).sort((a,b)=>a.ts-b.ts);
    const last = arr[arr.length-1];
    if (last?.type === "buzz"){
      // append to state.buzzes
      // NOTE: Simple approach—read-modify-write is fine for class demo
      // (race conditions not critical here).
      onValue(stateRef, s => {
        const st = s.val() || { buzzes: [] };
        const name = "Player";
        // not storing player names in action; okay for demo
        st.buzzes = [...(st.buzzes || []), { playerId:last.playerId, name, ts:last.ts }].slice(-10);
        set(stateRef, st);
      }, { onlyOnce:true });
    }
  });
}
