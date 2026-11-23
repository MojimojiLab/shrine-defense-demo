// User-gesture-unlocked Web Audio mixer. All audio is served from this site.
const spec=(file,gain=1,cooldown=.05,limit=3)=>({file,gain,cooldown,limit});
export const MUSIC={title:'bgm_title.ogg',battle:'bgm_battle.ogg',boss:'bgm_boss.ogg'};
export const SOUNDS={
 shot_talisman:spec('shot_talisman.ogg',.25,.11,2),hit:spec('hit.ogg',.3,.065,3),
 enemy_vanish:spec('enemy_vanish.mp3',.55,.1,3),orb_pickup:spec('orb_pickup.ogg',.4,.085,2),
 level_up:spec('level_up.mp3',.85,.3,1),ui_select:spec('ui_select.ogg',.45,.1,1),ui_confirm:spec('ui_confirm.ogg',.65,.08,2),
 shrine_hit:spec('shrine_hit.ogg',.85,.2,2),wave_start:spec('wave_start.ogg',.7,.5,1),
 purify_burst:spec('purify_burst.ogg',.65,.3,2),boss_land:spec('boss_land.ogg',.8,.5,1),
 boss_roar:spec('boss_roar.wav',.65,1,1),boss_warning:spec('boss_warning.ogg',.8,.5,1),
 boss_slam:spec('boss_slam.ogg',.85,.3,1),boss_fireball:spec('boss_fireball.ogg',.7,.3,2),
 boss_summon:spec('boss_summon.wav',.65,.5,1),boss_defeat:spec('boss_defeat.ogg',.85,1,1),
 win:spec('win.ogg',.85,1,1),lose:spec('lose.ogg',.85,1,1)
};
const EVENT_SOUNDS={confirm:'ui_confirm',shot:'shot_talisman',hit:'hit',kill:'enemy_vanish',pickup:'orb_pickup',level:'level_up',
 shrine:'shrine_hit',burst:'purify_burst',bossLand:'boss_land',bossWarning:'boss_warning',
 bossSlam:'boss_slam',bossFireball:'boss_fireball',bossSummon:'boss_summon',bossDefeat:'boss_defeat'};
const STORAGE='shrine-defense-audio-v1';
export function musicFor(status,boss){return status==='ready'?'title':['playing','paused','upgrade'].includes(status)?(boss?'boss':'battle'):null;}
export class GameAudio{
 constructor({createContext,fetcher,storage,onChange}={}){
  this.createContext=createContext||(()=>{const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)throw Error('Web Audio unavailable');return new C();});
  this.fetcher=fetcher||((...a)=>fetch(...a));this.storage=storage;this.onChange=onChange||(()=>{});
  this.settings={music:.6,sfx:.65,muted:false};
  try{const value=JSON.parse(storage?.getItem(STORAGE)||'null');if(value){for(const k of ['music','sfx'])if(Number.isFinite(value[k]))this.settings[k]=Math.max(0,Math.min(1,value[k]));if(typeof value.muted==='boolean')this.settings.muted=value.muted;}}catch{}
  this.ctx=null;this.buffers=new Map();this.pending=new Map();this.bytes=new Map();this.voices=new Set();this.last=new Map();this.musicVoices=new Set();
  this.track=null;this.desired=null;this.musicVersion=0;this.epoch=0;this.hidden=false;this.duck=1;this.unlocked=false;this.failed=new Set();this.unlockTask=null;
 }
 asset(key){if(key.startsWith('bgm_'))return {folder:'bgm',file:`${key}.ogg`};return {folder:'sfx',file:SOUNDS[key].file};}
 async encoded(path){if(!this.bytes.has(path)){const task=this.fetcher(path).then(r=>{if(!r.ok)throw Error(`Audio HTTP ${r.status}`);return r.arrayBuffer();}).catch(err=>{this.bytes.delete(path);throw err;});this.bytes.set(path,task);}return this.bytes.get(path);}
 preload(){return Promise.allSettled([...Object.values(MUSIC).map(f=>`assets/audio/bgm/${f}`),...Object.values(SOUNDS).map(s=>`assets/audio/sfx/${s.file}`)].map(p=>this.encoded(p)));}
 async buffer(key){
  if(this.buffers.has(key))return this.buffers.get(key);
  if(this.pending.has(key))return this.pending.get(key);
  const task=(async()=>{const {folder,file}=this.asset(key),base=`assets/audio/${folder}/`;
   let buffer;try{buffer=await this.ctx.decodeAudioData((await this.encoded(base+file)).slice(0));}
   catch(err){if(!file.endsWith('.ogg'))throw err;buffer=await this.ctx.decodeAudioData((await this.encoded(base+file.replace('.ogg','.m4a'))).slice(0));}
   this.buffers.set(key,buffer);this.failed.delete(key);return buffer;
  })().catch(()=>{this.failed.add(key);this.onChange();return null;}).finally(()=>this.pending.delete(key));
  this.pending.set(key,task);return task;
 }
 async unlock(){
  if(this.hidden)return false;
  if(this.unlockTask)return this.unlockTask;
  this.unlockTask=(async()=>{try{
   if(!this.ctx){this.ctx=this.createContext();this.master=this.ctx.createGain();this.musicGain=this.ctx.createGain();this.sfxGain=this.ctx.createGain();
    // Limiter catches simultaneous boss and combat transients.
    this.limiter=this.ctx.createDynamicsCompressor();this.limiter.threshold.value=-8;this.limiter.knee.value=6;this.limiter.ratio.value=8;
    this.musicGain.connect(this.master);this.sfxGain.connect(this.master);this.master.connect(this.limiter);this.limiter.connect(this.ctx.destination);this.applyVolumes();}
   await this.ctx.resume();this.unlocked=this.ctx.state==='running';
   if(this.unlocked){this.ensureMusic();for(const key of Object.keys(SOUNDS))void this.buffer(key);}
   this.onChange();return this.unlocked;
  }catch{this.unlocked=false;this.onChange();return false;}})().finally(()=>this.unlockTask=null);
  return this.unlockTask;
 }
 applyVolumes(){if(!this.ctx)return;const now=this.ctx.currentTime;for(const [node,value] of [[this.master,this.settings.muted?0:1],[this.musicGain,this.settings.music*this.duck],[this.sfxGain,this.settings.sfx]]){
  node.gain.cancelScheduledValues(now);node.gain.setTargetAtTime(value,now,.035);
 }}
 setVolume(kind,value){if(!['music','sfx'].includes(kind))return;value=Number(value);if(!Number.isFinite(value))return;this.settings[kind]=Math.max(0,Math.min(1,value));this.save();}
 setMuted(muted){this.settings.muted=!!muted;if(muted)this.stopSfx();this.save();}
 save(){try{this.storage?.setItem(STORAGE,JSON.stringify(this.settings));}catch{}this.applyVolumes();this.onChange();}
 sync(status,boss){const next=musicFor(status,boss);const duck=['paused','upgrade'].includes(status)?.25:1;if(this.duck!==duck){this.duck=duck;this.applyVolumes();}
  if(this.desired===next)return;this.desired=next;this.musicVersion++;this.ensureMusic();}
 async ensureMusic(){
  if(!this.ctx||!this.unlocked)return;
  const version=this.musicVersion,name=this.desired;
  if(!name){for(const v of this.musicVoices)this.fadeOut(v);this.track=null;return;}
  if(this.track?.name===name)return;
  const buffer=await this.buffer(`bgm_${name}`);
  if(!buffer||version!==this.musicVersion||this.hidden||this.track?.name===name)return;
  const now=this.ctx.currentTime;for(const v of this.musicVoices)this.fadeOut(v);
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=buffer;source.loop=true;
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+.75);source.connect(gain);gain.connect(this.musicGain);
  const voice={source,gain,name,ending:false};this.musicVoices.add(voice);this.track=voice;
  source.onended=()=>{this.musicVoices.delete(voice);source.disconnect();gain.disconnect();};source.start();
 }
 fadeOut(voice){if(voice.ending)return;voice.ending=true;const now=this.ctx.currentTime,gain=voice.gain.gain;
  if(gain.cancelAndHoldAtTime)gain.cancelAndHoldAtTime(now);else{const value=gain.value;gain.cancelScheduledValues(now);gain.setValueAtTime(value,now);}
  gain.linearRampToValueAtTime(0,now+.75);try{voice.source.stop(now+.8);}catch{}
 }
 async play(key){
  if(!SOUNDS[key]||!this.unlocked||this.hidden||this.settings.muted||this.settings.sfx===0||this.ctx.state!=='running')return;
  const cfg=SOUNDS[key],now=this.ctx.currentTime,epoch=this.epoch;
  if(now-(this.last.get(key)??-Infinity)<cfg.cooldown)return;
  this.last.set(key,now);
  const buffer=await this.buffer(key);
  if(!buffer||epoch!==this.epoch||this.hidden||this.settings.muted||this.settings.sfx===0||this.ctx.state!=='running'||this.ctx.currentTime-now>.5)return;
  if(this.voices.size>=20||[...this.voices].filter(v=>v.key===key).length>=cfg.limit)return;
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=buffer;gain.gain.value=cfg.gain;source.connect(gain);gain.connect(this.sfxGain);
  const voice={source,gain,key};this.voices.add(voice);source.onended=()=>{this.voices.delete(voice);source.disconnect();gain.disconnect();};source.start();
 }
 stopSfx(){this.epoch++;for(const v of this.voices){try{v.source.stop();}catch{}v.source.disconnect();v.gain.disconnect();}this.voices.clear();}
 reset(){this.stopSfx();this.last.clear();}
 handle(event,status){
  if(event.type==='bossEnter'){void this.play('boss_roar');return;}
  if(event.type==='wave'){if(!event.boss)void this.play('wave_start');return;}
  if(event.type==='end'){this.sync(status,false);this.stopSfx();void this.play(status==='won'?'win':'lose');return;}
  if(event.type==='bossDefeat'){this.sync('dying',true);this.stopSfx();}
  const key=EVENT_SOUNDS[event.type];if(key)void this.play(key);
 }
 async setHidden(hidden){this.hidden=hidden;if(!this.ctx)return;if(hidden){this.stopSfx();try{await this.ctx.suspend();}catch{}}
  else if(this.unlocked){try{await this.ctx.resume();}catch{}if(!this.hidden)this.ensureMusic();}
 }
 snapshot(){return {unlocked:this.unlocked,context:this.ctx?.state||'locked',music:this.desired,playing:this.track?.name||null,settings:{...this.settings},activeSfx:this.voices.size,loaded:this.buffers.size,failed:[...this.failed]};}
}
