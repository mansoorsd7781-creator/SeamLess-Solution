const reduce=matchMedia('(prefers-reduced-motion:reduce)');
const cards=[...document.querySelectorAll('.pg,.tm')];
if('IntersectionObserver' in window){document.documentElement.classList.add('rv-on');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.18});
cards.forEach(c=>io.observe(c))}
cards.forEach(c=>{
c.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType==='touch')return;
const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
c.style.setProperty('--ry',((x-.5)*8).toFixed(1)+'deg');c.style.setProperty('--rx',((.5-y)*6).toFixed(1)+'deg');
c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%')});
c.addEventListener('pointerleave',()=>{c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')})});
