(()=>{
if(!matchMedia('(hover:hover) and (pointer:fine)').matches||window.__cur)return;window.__cur=1;
const st=document.createElement('style');
st.textContent=`html.cur,html.cur *{cursor:none!important}
.cur-dot,.cur-ring{position:fixed;left:0;top:0;pointer-events:none;z-index:99999;opacity:0;transition:opacity .25s}
.cur-dot{width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#e0003f;box-shadow:0 0 12px rgba(224,0,63,.8)}
.cur-ring{width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;border:1px solid rgba(236,239,241,.55);display:grid;place-items:center;
font:600 10px/1 system-ui,sans-serif;letter-spacing:.16em;color:#1b1d20;
transition:width .3s cubic-bezier(.2,.7,.2,1),height .3s cubic-bezier(.2,.7,.2,1),margin .3s cubic-bezier(.2,.7,.2,1),background .3s,border-color .3s,opacity .25s,scale .2s}
.cur-ring.link{width:60px;height:60px;margin:-30px 0 0 -30px;background:rgba(224,0,63,.16);border-color:#e0003f}
.cur-ring.card{width:92px;height:92px;margin:-46px 0 0 -46px;background:#e0003f;border-color:#e0003f;backdrop-filter:blur(4px)}
.cur-ring.text{width:22px;height:22px;margin:-11px 0 0 -11px;border-color:#e0003f}
.cur-ring.down{scale:.82}.cur-on .cur-dot,.cur-on .cur-ring{opacity:1}.cur-card-on .cur-dot{opacity:0}`;
document.head.append(st);
const dot=document.createElement('div'),ring=document.createElement('div');dot.className='cur-dot';ring.className='cur-ring';
document.body.append(dot,ring);const H=document.documentElement;H.classList.add('cur');
const slow=matchMedia('(prefers-reduced-motion:reduce)').matches;
let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;x=e.clientX;y=e.clientY;H.classList.add('cur-on');
dot.style.transform='translate3d('+x+'px,'+y+'px,0)';
const t=e.target.closest?e.target:null,c=t&&t.closest('.pg'),l=t&&t.closest('a,button,select,label,summary,[role=button]'),i=t&&t.closest('input[type=text],input:not([type]),textarea');
ring.className='cur-ring'+(c?' card':i?' text':l?' link':'')+(ring.classList.contains('down')?' down':'');
ring.textContent=c?'OPEN':'';H.classList.toggle('cur-card-on',!!c)},{passive:true});
addEventListener('pointerdown',()=>ring.classList.add('down'));addEventListener('pointerup',()=>ring.classList.remove('down'));
document.addEventListener('pointerleave',()=>H.classList.remove('cur-on'));
(function loop(){rx+=(x-rx)*(slow?1:.16);ry+=(y-ry)*(slow?1:.16);ring.style.transform='translate3d('+rx+'px,'+ry+'px,0)';requestAnimationFrame(loop)})();
})();
