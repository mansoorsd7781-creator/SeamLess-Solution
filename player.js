(()=>{const b=(document.currentScript.dataset.base)||'';
const r=document.createElement('div');r.className='rail';r.innerHTML=['H','f','in','a','y'].map(t=>'<a href="#" aria-label="social">'+t+'</a>').join('');
const p=document.createElement('div');p.className='pbar';
p.innerHTML='<button class="pl" aria-label="Play">&#9654;</button><div class="tr"><b>Prefekt</b><span>DJ KENTHA</span></div><div class="bar"><i></i></div><div class="sk"><button aria-label="Previous">&#9664;&#9664;</button><button aria-label="Next">&#9654;&#9654;</button><button aria-label="Playlist">&#9776;</button></div>';
document.body.append(r,p);const pl=p.querySelector('.pl');
pl.onclick=()=>{p.classList.toggle('on');pl.innerHTML=p.classList.contains('on')?'&#10073;&#10073;':'&#9654;'};
})();
