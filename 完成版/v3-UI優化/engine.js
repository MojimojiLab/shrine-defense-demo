import {addDamageNumber} from './combat-text.js';
// Pure simulation: coordinates are in a 1600 × 900 arena, time in seconds.
export const W=1600,H=900,SHRINE={x:800,y:410,rx:160,ry:135};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function moveOutsideShrine(x,y,r=18){
  x=clamp(x,40,W-40);y=clamp(y,55,H-40);
  const dx=x-SHRINE.x,dy=y-SHRINE.y,rx=SHRINE.rx+r,ry=SHRINE.ry+r;
  if(Math.abs(dx)<rx&&Math.abs(dy)<ry){
    if(rx-Math.abs(dx)<ry-Math.abs(dy))x=SHRINE.x+(dx>=0?rx:-rx);
    else y=SHRINE.y+(dy>=0?ry:-ry);
  }
  return {x,y};
}
export const upgrades=[
 {id:'power',name:'強化護符',desc:'所有傷害 +25%',apply:g=>g.stats.damage*=1.25},
 {id:'haste',name:'疾風咒',desc:'護符攻擊間隔縮短 15%',apply:g=>g.stats.interval=Math.max(.15,g.stats.interval*.85)},
 {id:'multi',name:'連符術',desc:'同時攻擊的目標 +1（最多 5）',apply:g=>g.stats.multi=Math.min(5,g.stats.multi+1)},
 {id:'orbit',name:'環身御幣',desc:'解鎖環繞攻擊；再次選擇增加威力',apply:g=>g.stats.orbit++},
 {id:'burst',name:'淨化結界',desc:'解鎖週期範圍傷害；再次選擇增加威力',apply:g=>g.stats.burst++},
 {id:'magnet',name:'靈氣牽引',desc:'吸收距離 +55、移動速度 +12',apply:g=>{g.stats.magnet+=55;g.stats.speed+=12;}}
];
export class Game{
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){
  this.status='ready';this.oldWave=1;this.t=0;this.wave=1;this.health=10;this.kills=0;this.level=1;this.xp=0;this.required=9;
  this.player={x:800,y:670,dir:0,moving:false,stun:0,contact:0};
  this.stats={damage:26,interval:.54,multi:1,speed:260,magnet:100,orbit:0,burst:0};
  this.enemies=[];this.orbs=[];this.bullets=[];this.hostile=[];this.zones=[];this.effects=[];this.events=[];
  this.boss=null;this.bossSpawned=false;this.serial=0;this.spawnClock=.8;this.shotClock=0;this.burstClock=3;this.orbitClock=.7;this.choices=[];
 }
 start(){this.reset();this.status='playing';this.events.push({type:'wave',text:'第 1 波 · 夜襲開始'});}
 event(type,data={}){this.events.push({type,...data});}
 drain(){const e=this.events;this.events=[];return e;}
 pause(){if(this.status==='playing')this.status='paused';else if(this.status==='paused')this.status='playing';}
 choose(index){if(this.status!=='upgrade'||!this.choices[index])return;this.choices[index].apply(this);this.event('confirm');this.status='playing';this.choices=[];this.checkLevel();}
 checkLevel(){if(this.xp<this.required||this.status!=='playing')return;
  this.xp-=this.required;this.level++;this.required=9+this.level*4;
  this.choices=upgrades.filter(u=>u.id!=='multi'||this.stats.multi<5).map(u=>({u,key:this.random()})).sort((a,b)=>a.key-b.key).slice(0,3).map(o=>o.u);
  this.status='upgrade';this.event('level');
 }
 spawn(kind=null,edge=null){
  if(this.enemies.length>=90)return;
  edge??=Math.floor(this.random()*4);let x,y;
  if(edge===0){x=80+this.random()*1440;y=35;}else if(edge===1){x=1560;y=90+this.random()*700;}
  else if(edge===2){x=80+this.random()*1440;y=870;}else{x=35;y=90+this.random()*700;}
  kind??=this.wave>1&&this.random()<Math.min(.48,(this.wave-1)*.12)?'oni':'ghost';
  const hp=kind==='oni'?85+this.wave*10:22+this.wave*4;
  this.enemies.push({id:++this.serial,kind,x,y,hp,maxHp:hp,speed:(kind==='oni'?22:31)+this.wave*2,dir:0,phase:this.random()*4,flash:0,hit:0});
 }
 spawnBoss(){this.bossSpawned=true;this.boss={id:++this.serial,kind:'boss',x:800,y:40,hp:3200,maxHp:3200,state:'entry',timer:0,clock:4,attack:0,phase:0,flash:0};this.event('wave',{text:'災厄鬼王降臨',boss:true});this.event('bossEnter');}
 hurtShrine(n=1){if(this.status!=='playing')return;this.health=Math.max(0,this.health-n);this.event('shrine');if(this.health===0){this.status='lost';this.event('end');}}
 hit(e,d){if(e.hp<=0)return;e.hp-=d;e.flash=.09;this.event('hit');
  addDamageNumber(this.effects,e,d);
  if(e.hp<=0){if(e===this.boss){e.state='defeat';e.timer=0;this.status='dying';this.hostile=[];this.zones=[];this.event('bossDefeat');}
   else{this.kills++;this.orbs.push({id:++this.serial,x:e.x,y:e.y-5,value:e.kind==='oni'?3:1});this.event('kill');}}
 }
 knock(){this.player.stun=.28;this.player.contact=1;}
 update(dt,input={x:0,y:0}){
  dt=Math.min(dt,.05);
  if(this.status==='dying'){for(const e of this.effects)e.life-=dt;this.effects=this.effects.filter(e=>e.life>0);this.boss.timer+=dt;if(this.boss.timer>=1.5){this.status='won';this.event('end');}return;}
  if(this.status!=='playing')return;
  this.t+=dt;const p=this.player;this.wave=Math.min(6,Math.floor(this.t/48)+1);
  if(this.wave!==this.oldWave){this.oldWave=this.wave;if(this.wave>1&&this.wave<6)this.event('wave',{text:`第 ${this.wave} 波 · 惡靈湧入`});}
  if(this.wave===6&&!this.bossSpawned)this.spawnBoss();
  this.spawnClock-=dt;if(this.spawnClock<=0){this.spawn();this.spawnClock=this.boss?.state==='entry'?2.2:Math.max(.65,1.65-this.wave*.14);}
  p.stun=Math.max(0,p.stun-dt);p.contact=Math.max(0,p.contact-dt);
  let ix=input.x||0,iy=input.y||0;const norm=Math.hypot(ix,iy);if(norm>1){ix/=norm;iy/=norm;}
  p.moving=norm>.05&&p.stun<=0;if(p.moving){Object.assign(p,moveOutsideShrine(p.x+ix*this.stats.speed*dt,p.y+iy*this.stats.speed*dt));p.dir=Math.abs(ix)>Math.abs(iy)?(ix<0?1:2):(iy<0?3:0);}
  for(const e of this.enemies){if(e.hp<=0)continue;const dx=SHRINE.x-e.x,dy=SHRINE.y-e.y,d=Math.hypot(dx,dy);e.x+=dx/d*e.speed*dt;e.y+=dy/d*e.speed*dt;e.phase+=dt*7;e.flash=Math.max(0,e.flash-dt);e.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);
   if(Math.abs(dx)<SHRINE.rx+14&&Math.abs(dy)<SHRINE.ry+10){e.hp=0;this.hurtShrine();}
   else if(p.contact===0&&distance(p,e)<33){this.knock();Object.assign(p,moveOutsideShrine(p.x+(p.x-e.x)/33*24,p.y+(p.y-e.y)/33*24));}
  }
  this.enemies=this.enemies.filter(e=>e.hp>0);
  if(this.status!=='playing')return;
  if(this.boss)this.updateBoss(dt);
  this.shotClock-=dt;if(this.shotClock<=0){
   const targets=[...this.enemies,...(this.boss&&this.boss.hp>0?[this.boss]:[])].filter(e=>distance(p,e)<650).sort((a,b)=>distance(p,a)-distance(p,b)).slice(0,this.stats.multi);
   if(targets.length){for(const target of targets)this.bullets.push({id:++this.serial,x:p.x,y:p.y-40,target,life:2});this.shotClock=this.stats.interval;this.event('shot');}
  }
  for(const b of this.bullets){b.life-=dt;const dx=b.target.x-b.x,dy=b.target.y-35-b.y,d=Math.hypot(dx,dy);if(b.target.hp<=0){b.life=0;continue;}if(d<720*dt+15){this.hit(b.target,this.stats.damage);b.life=0;}else{b.x+=dx/d*720*dt;b.y+=dy/d*720*dt;}}
  this.bullets=this.bullets.filter(b=>b.life>0);
  const targets=[...this.enemies,...(this.boss?.hp>0?[this.boss]:[])];
  this.orbitClock-=dt;if(this.stats.orbit&&this.orbitClock<=0){this.orbitClock=.65;for(const e of targets)if(distance(p,e)<135)this.hit(e,this.stats.damage*(.5+this.stats.orbit*.35));}
  this.burstClock-=dt;if(this.stats.burst&&this.burstClock<=0){this.burstClock=4.2;this.event('burst');this.effects.push({x:p.x,y:p.y,type:'burst',life:.5,max:.5});for(const e of targets)if(distance(p,e)<230)this.hit(e,this.stats.damage*(1+this.stats.burst*.7));}
  for(const o of this.orbs){let d=distance(p,o);if(d<this.stats.magnet){const s=Math.min(d,450*dt);o.x+=(p.x-o.x)/Math.max(1,d)*s;o.y+=(p.y-o.y)/Math.max(1,d)*s;d=distance(p,o);}if(d<25){this.xp+=o.value;o.dead=true;this.event('pickup');}}
  this.orbs=this.orbs.filter(o=>!o.dead);
  // Cap drops to keep long sessions bounded; merge value instead of discarding XP.
  if(this.orbs.length>250){const extra=this.orbs.pop();this.orbs[0].value+=extra.value;}
  for(const b of this.hostile){b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(Math.abs(b.x-SHRINE.x)<SHRINE.rx&&Math.abs(b.y-SHRINE.y)<SHRINE.ry){b.life=0;this.hurtShrine();}else if(distance(p,b)<28&&p.contact===0){b.life=0;this.knock();}}
  this.hostile=this.hostile.filter(b=>b.life>0&&b.x>-30&&b.x<W+30&&b.y<H+30);
  for(const z of this.zones){z.life-=dt;if(z.life<=0&&!z.triggered){z.triggered=true;this.event('bossSlam');if(distance(z,p)<z.r)this.knock();if(Math.abs(z.x-SHRINE.x)<SHRINE.rx+z.r&&Math.abs(z.y-SHRINE.y)<SHRINE.ry+z.r)this.hurtShrine();this.effects.push({type:'slam',x:z.x,y:z.y,life:.6,max:.6});}}
  this.zones=this.zones.filter(z=>!z.triggered);
  for(const e of this.effects)e.life-=dt;this.effects=this.effects.filter(e=>e.life>0);
  this.checkLevel();
 }
 updateBoss(dt){const b=this.boss;b.flash=Math.max(0,b.flash-dt);b.timer+=dt;
  if(b.state==='entry'){b.y=Math.min(265,b.y+42*dt);if(b.y===265){b.state='idle';b.timer=0;this.event('bossLand');}return;}
  if(b.state==='idle'){b.clock-=dt;if(b.clock<=0){b.attack=(b.attack+1)%3;b.state=['slam','cast','roar'][b.attack];b.timer=0;b.fired=false;
   if(b.state==='slam')this.event('bossWarning');
   if(b.state==='slam')this.zones.push({x:this.player.x,y:this.player.y,r:125,life:1.3,total:1.3});}
  }else{
   if(b.timer>=1.3&&!b.fired){b.fired=true;
    if(b.state==='cast'){this.event('bossFireball');const angle=Math.atan2(this.player.y-b.y,this.player.x-b.x);for(let n=-1;n<=1;n++)this.hostile.push({id:++this.serial,x:b.x,y:b.y-45,vx:Math.cos(angle+n*.32)*210,vy:Math.sin(angle+n*.32)*210,life:6});}
    if(b.state==='roar'){this.event('bossSummon');for(let i=0;i<5;i++)this.spawn('ghost',i%4);}
   }
   if(b.timer>2.2){b.state='idle';b.timer=0;b.clock=b.hp<b.maxHp*.35?2.2:3.8;}
  }
 }
 snapshot(){return {status:this.status,time:this.t,wave:this.wave,health:this.health,level:this.level,xp:this.xp,kills:this.kills,enemies:this.enemies.length,boss:this.boss?{hp:Math.max(0,this.boss.hp),state:this.boss.state}:null,player:{x:this.player.x,y:this.player.y}};}
}
