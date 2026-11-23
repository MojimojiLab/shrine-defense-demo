import {Game,W,H,clamp} from './engine.js';
const $=s=>document.querySelector(s),game=new Game();
const app=new PIXI.Application();
let loaded=false,lastState='',toastUntil=0,frameTime=0,uiClock=0;
const sheets={},nodes=new Map(),keys=new Set(),touch={x:0,y:0,id:null,origin:null};
let world,actors,fx,under,bg,ink;
const textPool=[];let textCursor=0;
const overlay=$('#overlay'),panel=$('#panel');
function fit(){const scale=Math.min(innerWidth/W,innerHeight/H);app.renderer.resize(Math.round(W*scale),Math.round(H*scale));world.scale.set(scale);}
function textures(tex,rows){const out=[];const w=tex.source.width,h=tex.source.height;for(let r=0;r<rows;r++){out[r]=[];for(let c=0;c<4;c++){const x=Math.round(c*w/4),y=Math.round(r*h/rows);out[r][c]=new PIXI.Texture({source:tex.source,frame:new PIXI.Rectangle(x,y,Math.round((c+1)*w/4)-x,Math.round((r+1)*h/rows)-y)});}}return out;}
function sprite(kind){const s=new PIXI.Sprite(sheets[kind][0][0]);s.anchor.set(.5,.94);const size={miko:112,ghost:100,oni:126,boss:265}[kind];s.width=size;s.height=size;actors.addChild(s);return s;}
function syncSprite(id,kind,x,y,row,frame,flash=0){let s=nodes.get(id);if(!s){s=sprite(kind);nodes.set(id,s);}s.texture=sheets[kind][row][frame];s.position.set(x,y);s.zIndex=y;s.tint=flash?0xffb9a7:0xffffff;return s;}
function text(v,x,y,color=0xffe7b7,size=19){let t=textPool[textCursor];if(!t){t=new PIXI.Text({text:'',style:{fontFamily:'system-ui',fontSize:size,fill:color,fontWeight:'bold',stroke:{color:0x172238,width:3}}});t.anchor.set(.5);fx.addChild(t);textPool.push(t);}textCursor++;t.visible=true;t.text=v;t.style.fill=color;t.style.fontSize=size;t.position.set(x,y);}
function clearFx(){for(const t of textPool)t.visible=false;textCursor=0;ink.clear();under.clear();}
function bossFrame(b){if(b.state==='entry')return [1,Math.floor(game.t*5)%4];if(b.state==='idle')return [0,Math.floor(game.t*3)%4];if(b.state==='defeat')return [5,Math.min(3,Math.floor(b.timer/.35))];return [{slam:2,cast:3,roar:4}[b.state],b.timer<.4?0:b.timer<1.3?1:b.timer<1.7?2:3];}
function draw(){
 clearFx();const live=new Set(['player']);const p=game.player;
 syncSprite('player','miko',p.x,p.y,p.dir,p.moving?Math.floor(game.t*8)%4:1,p.stun);
 under.ellipse(p.x,p.y-2,21,8).fill({color:0x091126,alpha:.35});
 for(const e of game.enemies){live.add(e.id);syncSprite(e.id,e.kind,e.x,e.y,e.dir,Math.floor(e.phase)%4,e.flash);}
 if(game.boss){const b=game.boss;live.add(b.id);const [r,c]=bossFrame(b);syncSprite(b.id,'boss',b.x,b.y,r,c,b.flash);}
 for(const [id,s] of nodes)if(!live.has(id)){s.destroy();nodes.delete(id);}
 for(const o of game.orbs){under.circle(o.x,o.y-8,5+Math.min(3,o.value)).fill({color:0x9af3bb,alpha:.85});under.circle(o.x-1,o.y-10,2).fill(0xeaffee);}
 for(const z of game.zones){under.circle(z.x,z.y,z.r).fill({color:0xe74848,alpha:.15+.1*Math.sin(game.t*15)}).stroke({color:0xff7166,width:3});under.circle(z.x,z.y,z.r*(1-z.life/z.total)).stroke({color:0xffac87,width:2});}
 const g=ink;
 for(const b of game.bullets){g.roundRect(b.x-5,b.y-10,10,20,2).fill(0xfff1c5).stroke({color:0xe7a25b,width:1});g.moveTo(b.x-2,b.y-4).lineTo(b.x+2,b.y+5).stroke({color:0xc74e44,width:2});}
 for(const b of game.hostile){g.circle(b.x,b.y,12).fill(0x8544c0);g.circle(b.x,b.y,6).fill(0xe0b1ff);}
 if(game.stats.orbit){const count=Math.min(6,game.stats.orbit+1);for(let i=0;i<count;i++){const a=game.t*2+i/count*Math.PI*2,x=p.x+Math.cos(a)*115,y=p.y-20+Math.sin(a)*85;g.roundRect(x-5,y-10,10,20,1).fill(0xffe9ab);}}
 for(const e of game.effects){if(e.type){g.circle(e.x,e.y,(e.type==='burst'?230:125)*(1-e.life/e.max)).stroke({color:e.type==='burst'?0xffe5a5:0xee8877,width:5,alpha:e.life/e.max});}else text(e.text,e.x,e.y-(1-e.life/e.max)*32,0xffedc9,18);}
}
function fmt(t){return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;}
function hud(){
 $('#hud').hidden=game.status==='ready';$('#footer').hidden=game.status==='ready';$('#health').textContent=`${game.health} / 10`;$('#wave').textContent=`${game.wave} / 6`;
 $('#level').textContent=`${game.level} · ${game.xp} / ${game.required}`;$('#time').textContent=`${game.kills} · ${fmt(game.t)}`;
 $('#skills').textContent=`護符 ${Math.round(game.stats.damage)} 傷害 · ${game.stats.multi} 目標　｜　御幣 Lv.${game.stats.orbit}　｜　結界 Lv.${game.stats.burst}`;
 $('#bossInfo').hidden=!game.boss||game.status==='won';if(game.boss){$('#bossHealth').textContent=`${Math.max(0,Math.ceil(game.boss.hp))} / ${game.boss.maxHp}`;$('#bossMove').textContent={entry:'鬼王正在逼近',idle:game.boss.hp<game.boss.maxHp*.35?'狂暴 · 加速出招':'尋找進攻時機',slam:'震地重槌 · 離開紅圈',cast:'三道鬼火 · 橫向閃避',roar:'喚靈咆哮 · 準備回防',defeat:'災厄消散'}[game.boss.state];}
}
function setPanel(){
 if(lastState===game.status)return;lastState=game.status;touch.x=touch.y=0;$('#joystick').hidden=true;
 if(game.status==='playing'||game.status==='dying'){overlay.hidden=true;return;}
 if(game.status==='ready')return;
 overlay.hidden=false;panel.className='panel';
 if(game.status==='paused'){panel.innerHTML='<p class="eyebrow">結界仍在，稍作歇息</p><h2>遊戲已暫停</h2><p class="result">按 P / Esc 或點選下方按鈕繼續</p><button class="primary" id="resume">繼續守護</button>';$('#resume').onclick=()=>game.pause();}
 if(game.status==='upgrade'){panel.innerHTML=`<p class="eyebrow">靈力提升 · 等級 ${game.level}</p><h2>選擇一項強化</h2><p class="description">戰鬥已暫停，選擇後繼續。</p><div class="choices">${game.choices.map((u,i)=>`<button class="choice" data-choice="${i}"><b>${u.name}</b><small>${u.desc}</small></button>`).join('')}</div>`;panel.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>game.choose(Number(el.dataset.choice)));}
 if(game.status==='won'||game.status==='lost'){panel.innerHTML=`<p class="eyebrow">${game.status==='won'?'長夜已盡 · 晨光將至':'結界破碎 · 災厄未息'}</p><h2>${game.status==='won'?'神社守護成功':'神社失守'}</h2><p class="result">守護時間 ${fmt(game.t)}　｜　擊退 ${game.kills}<br>巫女等級 ${game.level}　｜　剩餘結界 ${game.health} / 10</p><button class="primary" id="restart">再次挑戰</button>`;$('#restart').onclick=()=>{game.start();keys.clear();};}
}
function input(){let x=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),y=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);if(touch.id!==null){x=touch.x;y=touch.y;}return {x,y};}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');toastUntil=performance.now()+2400;}
function events(){for(const e of game.drain()){if(e.type==='wave')toast(e.text);if(e.type==='shrine'){document.body.animate([{boxShadow:'inset 0 0 120px #f4454580'},{boxShadow:'inset 0 0 0 #f4454500'}],{duration:500});}if(e.type==='end')keys.clear();}}
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(k))e.preventDefault();keys.add(k);if((k==='p'||k==='escape')&&!e.repeat)game.pause();if(game.status==='upgrade'&&['1','2','3'].includes(k))game.choose(Number(k)-1);});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
function releaseTouch(){touch.id=null;touch.origin=null;touch.x=touch.y=0;$('#joystick').hidden=true;}
window.addEventListener('blur',()=>{keys.clear();releaseTouch();if(game.status==='playing')game.pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();releaseTouch();if(game.status==='playing')game.pause();}});
$('#pause').onclick=()=>game.pause();
async function init(){try{
 await app.init({width:W,height:H,background:0x0b1020,antialias:true,resolution:Math.min(devicePixelRatio||1,2),autoDensity:true,preference:'webgl'});
 $('#game').appendChild(app.canvas);world=new PIXI.Container();app.stage.addChild(world);
 const names=['arena','miko','ghost','oni','boss'];const tex=await Promise.all(names.map(n=>PIXI.Assets.load(`assets/${n}.png`)));
 bg=new PIXI.Sprite(tex[0]);bg.width=W;bg.height=H;world.addChild(bg);
 under=new PIXI.Graphics();world.addChild(under);actors=new PIXI.Container();actors.sortableChildren=true;world.addChild(actors);fx=new PIXI.Container();world.addChild(fx);ink=new PIXI.Graphics();fx.addChild(ink);
 names.slice(1).forEach((n,i)=>sheets[n]=textures(tex[i+1],n==='boss'?6:4));fit();window.addEventListener('resize',fit);draw();
 app.canvas.addEventListener('pointerdown',e=>{if(game.status!=='playing'||touch.id!==null)return;touch.id=e.pointerId;touch.origin={x:e.clientX,y:e.clientY};touch.x=touch.y=0;app.canvas.setPointerCapture(e.pointerId);const j=$('#joystick');j.hidden=false;j.style.left=`${e.clientX-50}px`;j.style.top=`${e.clientY-50}px`;j.querySelector('i').style.transform='';});
 app.canvas.addEventListener('pointermove',e=>{if(e.pointerId!==touch.id||!touch.origin)return;const dx=e.clientX-touch.origin.x,dy=e.clientY-touch.origin.y,d=Math.max(40,Math.hypot(dx,dy));touch.x=dx/d;touch.y=dy/d;$('#joystick i').style.transform=`translate(${touch.x*30}px,${touch.y*30}px)`;});
 app.canvas.addEventListener('pointerup',releaseTouch);app.canvas.addEventListener('pointercancel',releaseTouch);app.canvas.addEventListener('lostpointercapture',releaseTouch);
 $('#start').disabled=false;$('#start').textContent='開始守護';$('#start').onclick=()=>game.start();loaded=true;
 app.ticker.add(ticker=>{const dt=Math.min(.05,ticker.deltaMS/1000);frameTime+=dt;game.update(dt,input());events();setPanel();draw();uiClock+=dt;if(uiClock>.1){hud();uiClock=0;}if(performance.now()>toastUntil)$('#toast').classList.remove('show');});
 window.shrineGame={snapshot:()=>game.snapshot(),version:'1.0.0'};
 // Local browser QA only; absent on the published origin.
 if(['localhost','127.0.0.1'].includes(location.hostname)||location.hostname.includes('preview'))window.__qa={game,advance:(seconds)=>{for(let t=0;t<seconds;t+=.05)game.update(.05,input());events();setPanel();draw();hud();}};
 }catch(err){console.error(err);$('#start').textContent='重新載入';$('#start').disabled=false;$('#start').onclick=()=>location.reload();$('.description').textContent='素材或繪圖引擎載入失敗，請重新載入頁面。';}}
init();
