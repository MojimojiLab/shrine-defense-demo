// Presentation only. Damage is applied immediately; nearby rapid hits share a label.
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const DAMAGE_LIMIT=36;
export function damagePosition(e,after=0){
 const age=clamp(e.max-e.life+after,0,e.max);
 return {x:clamp(e.x+e.drift*age,40,1560),y:clamp(e.y-65*age,18,880),alpha:clamp((e.life-after)/.18,0,1)};
}
export function damageLabelsOverlap(a,b,after=0){
 if(a.life<=after||b.life<=after)return false;
 const p=damagePosition(a,after),q=damagePosition(b,after);
 return Math.abs(p.x-q.x)<76&&Math.abs(p.y-q.y)<28;
}
export function damageText(amount){const n=Math.round(amount);return n>=1e6?`${(n/1e6).toFixed(1)}m`:n>=1e4?`${(n/1e3).toFixed(1)}k`:String(n);}
export function addDamageNumber(effects,target,amount){
 const labels=effects.filter(e=>e.type==='damage'&&e.life>0),same=labels.filter(e=>e.targetId===target.id);
 const recent=same.find(e=>e.max-e.life<=.12);
 if(recent){recent.amount+=amount;recent.text=damageText(recent.amount);return recent;}
 // Keep at most three active labels on one target, and bound global draw cost.
 const expired=same.length>=3?same.reduce((a,b)=>a.life<b.life?a:b):labels.length>=DAMAGE_LIMIT?labels.reduce((a,b)=>a.life<b.life?a:b):null;
 if(expired){expired.life=0;labels.splice(labels.indexOf(expired),1);}
 const top=target.kind==='boss'?235:target.kind==='oni'?115:95;
 const x=clamp(target.x,44,1556),y=clamp(target.y-top,24,860);
 const columns=[0,-80,80,-160,160,-240,240];
 for(const row of [0,1,2,3,4,5])for(const offset of columns){
  const label={type:'damage',targetId:target.id,amount,text:damageText(amount),x:clamp(x+offset,44,1556),y:clamp(y-row*32,24,860),drift:offset<0?-10:offset>0?10:0,life:.68,max:.68};
  // Reserve the future trajectory as well as the initial location.
  if(labels.some(other=>[0,.1,.2,.3,.4,.5,.6,Math.min(label.life,other.life)-.001].some(t=>damageLabelsOverlap(label,other,t))))continue;
  effects.push(label);return label;
 }
 // A saturated region may suppress a visual label, never the actual damage.
 return null;
}
