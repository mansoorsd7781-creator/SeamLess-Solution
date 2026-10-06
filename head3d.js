(()=>{if(!window.THREE)return;
const c=document.createElement('canvas');c.className='bg';c.setAttribute('aria-hidden','true');document.body.prepend(c);
const R=new THREE.WebGLRenderer({canvas:c,antialias:true,alpha:true}),S=new THREE.Scene(),C=new THREE.PerspectiveCamera(40,1,.1,80);
C.position.z=10;R.setPixelRatio(Math.min(devicePixelRatio,2));
S.add(new THREE.AmbientLight(0xffffff,.3));
const k=new THREE.DirectionalLight(0xffffff,.7);k.position.set(-4,5,6);S.add(k);
const r=new THREE.PointLight(0xe0003f,3,30);r.position.set(3,-1,4);S.add(r);
const G=new THREE.Group();S.add(G);
// big red low-poly core
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(2,0),new THREE.MeshStandardMaterial({color:0x8a0022,emissive:0x300008,flatShading:true,metalness:.3,roughness:.5}));
G.add(core);
// floating shards
const sh=[],cols=[0xe0003f,0x9a9a9a,0x2a2a2a,0xff2a5f,0xcfcfcf];
for(let i=0;i<46;i++){const m=new THREE.Mesh(new THREE.TetrahedronGeometry(.1+Math.random()*.5,0),
new THREE.MeshStandardMaterial({color:cols[i%5],flatShading:true,metalness:.2,roughness:.6}));
m.position.set((Math.random()-.5)*20,(Math.random()-.5)*11,(Math.random()-.5)*8-1);
m.userData={s:(Math.random()-.5)*.02,y:Math.random()*6.28,v:.002+Math.random()*.004};
m.rotation.set(Math.random()*6,Math.random()*6,0);S.add(m);sh.push(m)}
let mx=0,my=0,t=0;const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();G.scale.setScalar(C.aspect>1.1?1:.65)}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2});
(function loop(){t+=.016;
if(!still){core.rotation.y=t*.25+mx*.4;core.rotation.x=t*.12+my*.3;G.position.y=Math.sin(t*.8)*.15;
sh.forEach(m=>{m.rotation.x+=m.userData.s+.004;m.rotation.y+=.006;m.position.y+=m.userData.v*Math.sin(t+m.userData.y);m.position.x+=m.userData.v*.5})}
S.rotation.y=mx*.08;S.rotation.x=my*.05;
sh.forEach(m=>{if(m.position.x>11)m.position.x=-11});
R.render(S,C);requestAnimationFrame(loop)})();
})();
