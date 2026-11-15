/* GriffTunes · "Hey DJ" wake word, entirely on this computer.
   A port of openWakeWord's streaming pipeline (github.com/dscripka/openWakeWord, Apache-2.0) to onnxruntime-web:
   16 kHz microphone audio in 80 ms chunks → melspectrogram model → speech embedding model (76 mel frames → 96 numbers)
   → the wake word model (last 16 embeddings → a score from 0 to 1). No audio leaves the computer.
   Loaded only when "Listen for Hey DJ" is on. Exposes window.GTWake. */
(()=>{
'use strict';
const CHUNK=1280,TAIL=480,MEL_KEEP=76,FEAT_KEEP=16;
const W={ready:false,running:false,model:null,ms:0,err:'',score:0,frames:0};
let ort=null,sMel=null,sEmb=null,sWw=null,loadedModel='';
let ctx=null,stream=null,src=null,node=null,q=[],busy=false,onScore=null,lagged=0;
let tail,mel,feats,acc,accN;
let pre=[],recBuf=null;   // the last ~half second, and the request being recorded after the wake word
function reset(){tail=new Float32Array(TAIL);mel=[];for(let i=0;i<MEL_KEEP;i++)mel.push(new Float32Array(32).fill(1));feats=[];acc=new Float32Array(CHUNK);accN=0;W.frames=0}
reset();
function loadScript(u){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>rej(new Error('Could not load '+u));document.head.appendChild(s)})}
// base: the folder GriffTunes runs from; model: file name in wake/
async function load(base,model){
 if(!window.ort)await loadScript(base+'vendor/ort/ort.wasm.min.js');
 ort=window.ort;ort.env.wasm.wasmPaths=new URL(base+'vendor/ort/',location.href).href;ort.env.wasm.numThreads=1;ort.env.logLevel='error';
 const opt={executionProviders:['wasm'],graphOptimizationLevel:'all'};
 if(!sMel)sMel=await ort.InferenceSession.create(base+'wake/melspectrogram.onnx',opt);
 if(!sEmb)sEmb=await ort.InferenceSession.create(base+'wake/embedding_model.onnx',opt);
 if(!sWw||loadedModel!==model){sWw=await ort.InferenceSession.create(base+'wake/'+model,opt);loadedModel=model}
 W.ready=true;W.model=model;reset();
}
// one 80 ms chunk of 16 kHz audio, in 16-bit sample units (−32768…32767); returns the score (or null while warming up)
async function step(chunk){
 const t0=performance.now();
 const x=new Float32Array(TAIL+CHUNK);x.set(tail,0);x.set(chunk,TAIL);tail=chunk.slice(CHUNK-TAIL);
 const mo=await sMel.run({[sMel.inputNames[0]]:new ort.Tensor('float32',x,[1,x.length])});
 const md=mo[sMel.outputNames[0]].data,nf=md.length/32;
 for(let f=0;f<nf;f++){const r=new Float32Array(32);for(let j=0;j<32;j++)r[j]=md[f*32+j]/10+2;mel.push(r)}
 if(mel.length>MEL_KEEP)mel.splice(0,mel.length-MEL_KEEP);
 const ein=new Float32Array(MEL_KEEP*32);for(let i=0;i<MEL_KEEP;i++)ein.set(mel[i],i*32);
 const eo=await sEmb.run({[sEmb.inputNames[0]]:new ort.Tensor('float32',ein,[1,MEL_KEEP,32,1])});
 feats.push(Float32Array.from(eo[sEmb.outputNames[0]].data));if(feats.length>FEAT_KEEP)feats.shift();
 W.frames++;
 let score=null;
 // like openWakeWord, no scores for the first few frames (here: until 16 real embeddings exist, about 1.3 seconds)
 if(feats.length===FEAT_KEEP){
  const win=new Float32Array(FEAT_KEEP*96);feats.forEach((f,i)=>win.set(f,i*96));
  const wo=await sWw.run({[sWw.inputNames[0]]:new ort.Tensor('float32',win,[1,FEAT_KEEP,96])});
  score=wo[sWw.outputNames[0]].data[0];W.score=score;
 }
 W.ms=W.ms?W.ms*.9+(performance.now()-t0)*.1:performance.now()-t0;
 return score;
}
// any length of 16-bit-scale audio: cut into 80 ms chunks; calls back with each score
async function feed(samples,cb){
 let i=0;
 while(i<samples.length){
  const n=Math.min(CHUNK-accN,samples.length-i);acc.set(samples.subarray(i,i+n),accN);accN+=n;i+=n;
  if(accN===CHUNK){const c=acc;acc=new Float32Array(CHUNK);accN=0;const s=await step(c);if(cb)cb(s)}
 }
}
async function pump(){
 if(busy)return;busy=true;
 try{
  while(q.length){
   // fell behind (slow computer, or the tab was in the background): skip ahead rather than pile up
   if(q.length>12){lagged++;q.splice(0,q.length-2)}
   const c=q.shift();
   let s=null;try{s=await step(c)}catch(e){W.err=String(e&&e.message||e);continue}
   if(onScore)try{onScore(s,W)}catch(e){}
  }
 }finally{busy=false}
}
const WORKLET=`class GTWakeTap extends AudioWorkletProcessor{constructor(){super();this.b=new Float32Array(${CHUNK});this.n=0}
process(ins){const ch=ins[0]&&ins[0][0];if(!ch)return true;for(let i=0;i<ch.length;i++){this.b[this.n++]=ch[i]*32767;if(this.n===${CHUNK}){this.port.postMessage(this.b,[this.b.buffer]);this.b=new Float32Array(${CHUNK});this.n=0}}return true}}
registerProcessor('gt-wake-tap',GTWakeTap);`;
// start listening: opts {base, model, deviceId, onScore(score, W)}
async function start(opts){
 if(W.running)await stop();
 W.err='';onScore=opts.onScore||null;
 await load(opts.base||'',opts.model);
 stream=await navigator.mediaDevices.getUserMedia({audio:Object.assign({channelCount:1,echoCancellation:false,noiseSuppression:false,autoGainControl:true},opts.deviceId?{deviceId:{exact:opts.deviceId}}:{})});
 ctx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:16000,latencyHint:'playback'});
 await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET],{type:'application/javascript'})));
 src=ctx.createMediaStreamSource(stream);node=new AudioWorkletNode(ctx,'gt-wake-tap');
 node.port.onmessage=e=>{const c=e.data;pre.push(c);if(pre.length>6)pre.shift();if(recBuf)recBuf.push(c);else{q.push(c);pump()}};
 src.connect(node);
 // the tap needs to be pulled by the graph, but must stay silent
 const mute=ctx.createGain();mute.gain.value=0;node.connect(mute).connect(ctx.destination);
 W.running=true;
 try{await ctx.resume()}catch(e){}
 return ctx.state;   // 'suspended' means Chrome wants a tap on the screen first
}
async function stop(){
 W.running=false;q=[];pre=[];if(recBuf&&W.recStop)W.recStop();
 // let go of this session right away: a start() right after (switching the wake word model) gets fresh ones, and this
 // stop finishing later can't clear the new session's microphone
 const c=ctx,s=stream,sr=src,n=node;ctx=stream=src=node=null;reset();
 if(n)n.port.onmessage=null;
 try{sr&&sr.disconnect();n&&n.disconnect()}catch(e){}
 try{s&&s.getTracks().forEach(t=>t.stop())}catch(e){}
 try{c&&await c.close()}catch(e){}
}
// Record what's said right after the wake word (with a little before it), up to ms long or until W.recStop(); resolves to a WAV blob
function record(ms){
 return new Promise(res=>{
  if(!W.running){res(null);return}
  recBuf=pre.slice();q=[];let t=null;
  const done=()=>{if(!recBuf)return;clearTimeout(t);const b=recBuf;recBuf=null;W.recStop=null;reset();res(wav(b))};
  W.recStop=done;t=setTimeout(done,ms||5000);
 });
}
function wav(chunks){
 const n=chunks.reduce((a,c)=>a+c.length,0),buf=new ArrayBuffer(44+n*2),d=new DataView(buf),str=(o,s)=>{for(let i=0;i<s.length;i++)d.setUint8(o+i,s.charCodeAt(i))};
 str(0,'RIFF');d.setUint32(4,36+n*2,true);str(8,'WAVE');str(12,'fmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);
 d.setUint32(24,16000,true);d.setUint32(28,32000,true);d.setUint16(32,2,true);d.setUint16(34,16,true);str(36,'data');d.setUint32(40,n*2,true);
 let o=44;for(const c of chunks)for(let i=0;i<c.length;i++){d.setInt16(o,Math.max(-32768,Math.min(32767,Math.round(c[i]))),true);o+=2}
 return new Blob([buf],{type:'audio/wav'});
}
W.record=record;W.load=load;W.step=step;W.feed=feed;W.start=start;W.stop=stop;W.reset=reset;
W.resume=()=>ctx&&ctx.state==='suspended'?ctx.resume().catch(()=>{}):Promise.resolve();
W.state=()=>ctx?ctx.state:'off';
W.lagged=()=>lagged;
window.GTWake=W;
})();
