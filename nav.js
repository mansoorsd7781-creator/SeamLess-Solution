(()=>{const b=document.currentScript.dataset.base||'',p=location.pathname;
const L=[['Customer Analytics','saas-dashboard'],['AI Chat','ai-chat'],['Marketing Analytics','agent-workflow'],['Sales Analytics','sales-analytics'],['Analytics','analytics'],['Customers','customers'],['Settings','settings']];
const i=L.findIndex(([,u])=>p.includes('/'+u+'/')),cur=L[i],prev=L[(i+L.length-1)%L.length],next=L[(i+1)%L.length];
const a=([n,u],t)=>'<a href="'+b+u+'/index.html" aria-label="'+t+': '+n+'">'+'<small>'+(t==='Previous'?'PREV':'NEXT')+'</small>'+(t==='Previous'?'&larr; ':'')+n+(t==='Next'?' &rarr;':'')+'</a>';
const h=document.createElement('header');h.className='topbar';
h.innerHTML='<a class="logo" href="'+b+'index.html">DHRK</a>'+(cur?'<span class="here">'+cur[0]+'</span><nav aria-label="Pages">'+a(prev,'Previous')+a(next,'Next')+'<a class="all" href="'+b+'index.html#pages">&#9638; All pages</a></nav>':'');
document.body.prepend(h);const cs=document.createElement('script');cs.src=b+'cursor.js';document.head.append(cs)})();
