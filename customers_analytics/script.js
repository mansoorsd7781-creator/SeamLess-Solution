// Sample data only (no real customers). Everything is plain JS + SVG, no libraries.
const PLAN_DATA = {
  all:{customers:2840,active:2310,churn:3.2,ltv:1840,nps:46,mix:[1450,920,470]},
  Starter:{customers:1450,active:1120,churn:5.1,ltv:420,nps:38,mix:[1450,0,0]},
  Growth:{customers:920,active:790,churn:2.6,ltv:1900,nps:48,mix:[0,920,0]},
  Enterprise:{customers:470,active:400,churn:1.1,ltv:9200,nps:57,mix:[0,0,470]}
};
const SCALE = {7:.25,30:1,90:2.7};
const NAMES = ['Northwind Labs','Orbit Retail','Pixel Forge','BlueLeaf Foods','Quanta Health','Zenith Logistics','Mango Studio','Helix Finance','Cedar & Co','Nova Learning'];
const PLANS = ['Starter','Growth','Enterprise'];
const CUSTOMERS = NAMES.map((n,i)=>({name:n,plan:PLANS[(i*7)%3],rev:[99,499,2400][(i*7)%3]+i*13,health:[92,78,35,66,88,24,71,95,52,83][i]}));
const COHORTS = [['Apr',100,82,74,69,65,62],['May',100,85,77,71,68],['Jun',100,81,72,66],['Jul',100,86,79],['Aug',100,88],['Sep',100]];
const CHANNELS = [['Organic search',34],['Referrals',26],['Paid ads',19],['Social',13],['Email',8]];
const CH_RANGE = {7:[['Organic search',29],['Referrals',22],['Paid ads',31],['Social',12],['Email',6]],30:CHANNELS,90:[['Organic search',38],['Referrals',31],['Paid ads',12],['Social',11],['Email',8]]};
const INSIGHTS = [
 'Customers who finish onboarding in their first week stay about 2x longer.',
 'Starter plan churn is the highest. A day-30 check-in email could win some of them back.',
 'Referrals bring fewer customers than search, but they stay longer and upgrade more.',
 'Accounts with a health score under 40 usually stop logging in 3 weeks before they cancel.'
];
let state = {range:30, plan:'all', tip:0};
const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString('en-US');

function kpis(){
  const d = PLAN_DATA[state.plan], r = state.range;
  const f = {7:{act:1.0,churn:.3,ltv:1.03,nps:2},30:{act:.96,churn:1,ltv:1,nps:0},90:{act:.88,churn:2.7,ltv:.96,nps:-3}}[r];
  const newCust = Math.round(d.customers*0.06*SCALE[r]);
  const items = [
    ['New customers', fmt(newCust), '+'+({7:2.4,30:4.8,90:11.6}[r])+'%', 1],
    ['Active customers', fmt(Math.round(d.active*f.act)), '+'+({7:0.6,30:3.1,90:7.8}[r])+'%', 1],
    ['Churn rate', (d.churn*f.churn).toFixed(1)+'%', '-'+({7:0.1,30:0.4,90:1.2}[r])+'%', 1],
    ['Avg. lifetime value', '$'+fmt(Math.round(d.ltv*f.ltv)), '+'+({7:0.8,30:6.2,90:9.5}[r])+'%', 1],
    ['Net promoter score', d.nps+f.nps, '+'+({7:1,30:2,90:5}[r])+' pts', 1]
  ];
  $('#kpis').innerHTML = items.map(([l,v,c,g])=>`<div class="kpi"><span>${l}</span><b>${v}</b><small class="${g?'up':'down'}">${c} vs. previous ${r} days</small></div>`).join('');
}

function growth(){
  const n = state.range===7?7:state.range===30?10:12, W=620, H=240, p=34;
  const base = PLAN_DATA[state.plan].customers/ (state.plan==='all'?1:1.6);
  const add = Array.from({length:n},(_,i)=>Math.round(base*0.03*SCALE[state.range]*(1+Math.sin(i*1.3)*.25+i*.03)));
  const lost = add.map(v=>Math.round(v*PLAN_DATA[state.plan].churn/9));
  const max = Math.max(...add)*1.15;
  const x = i=>p+i*(W-2*p)/(n-1), y = v=>H-p-(v/max)*(H-2*p);
  const line = a=>a.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const grid = [0,.5,1].map(t=>`<line x1="${p}" x2="${W-p}" y1="${y(max*t/1.15*1.15)}" y2="${y(max*t/1.15*1.15)}" stroke="var(--line)"/>`).join('');
  $('#growth').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="New versus churned customers">${grid}
   <path d="${line(add)} L${x(n-1)},${H-p} L${x(0)},${H-p}Z" fill="#635bff" opacity=".12"/>
   <path d="${line(add)}" fill="none" stroke="#635bff" stroke-width="3" stroke-linecap="round"/>
   <path d="${line(lost)}" fill="none" stroke="#e5484d" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 6"/>
   <text x="${p}" y="16" font-size="12" fill="#635bff">New customers</text><text x="${p+110}" y="16" font-size="12" fill="#e5484d">Churned</text></svg>`;
}

function donut(){
  const mix = {7:[1500,880,440],30:[1450,920,470],90:[1380,960,520]}[state.range], tot = mix.reduce((a,b)=>a+b), cols=['#8178ff','#16a36f','#d99a1c'];
  let off = 0; const r=54, c=2*Math.PI*r;
  const arcs = mix.map((v,i)=>{const len=v/tot*c, s=`<circle r="${r}" cx="70" cy="70" fill="none" stroke="${cols[i]}" stroke-width="22" stroke-dasharray="${len} ${c-len}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)" opacity="${state.plan==='all'||PLANS[i]===state.plan?1:.2}"/>`; off+=len; return s;}).join('');
  $('#donut').innerHTML = `<svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="Customers by plan">${arcs}</svg>
   <div class="legend">${PLANS.map((p,i)=>`<div><i style="background:${cols[i]}"></i>${p} · ${Math.round(mix[i]/tot*100)}%</div>`).join('')}</div>`;
}

function cohort(){
  const head = '<tr><th>Signup month</th>'+['Month 0','M1','M2','M3','M4','M5'].map(h=>`<th>${h}</th>`).join('')+'</tr>';
  const body = COHORTS.map(r=>`<tr><td>${r[0]}</td>`+Array.from({length:6},(_,i)=>{
    const v=r[i+1]; if(v===undefined) return '<td></td>';
    return `<td style="background:rgba(99,91,255,${((v-55)/45*.85+.1).toFixed(2)});color:${v>75?'#fff':'inherit'}">${v}%</td>`}).join('')+'</tr>').join('');
  $('#cohort').innerHTML = head+body;
}

function channels(){
  const CH = CH_RANGE[state.range];
  $('#channels').innerHTML = CH.map(([n,v])=>`<div class="bar"><div><span style="all:unset">${n}</span><b>${v}%</b></div><span data-w="${v*2.6}"></span></div>`).join('');
  requestAnimationFrame(()=>document.querySelectorAll('.bar > span').forEach(e=>e.style.width=e.dataset.w+'%'));
}

function table(){
  const q = $('#search').value.toLowerCase();
  const list = CUSTOMERS.filter(c=>(state.plan==='all'||c.plan===state.plan)&&c.name.toLowerCase().includes(q)).sort((a,b)=>b.health-a.health);
  $('#rows').innerHTML = list.length ? list.map(c=>{
    const [cls,label,col] = c.health>=70?['good','Healthy','#16a36f']:c.health>=45?['watch','Needs attention','#d99a1c']:['risk','At risk','#e5484d'];
    return `<tr><td><b>${c.name}</b></td><td>${c.plan}</td><td>$${fmt(c.rev)}</td><td><span class="meter"><i style="width:${c.health}%;background:${col}"></i></span>${c.health}</td><td><span class="pill ${cls}">${label}</span></td></tr>`}).join('')
    : '<tr><td colspan="5">No customers match. Clear the search or change the plan filter.</td></tr>';
}

function insight(){ $('#insight').textContent = INSIGHTS[state.tip % INSIGHTS.length]; }
function render(){ kpis(); growth(); donut(); channels(); table(); }

document.querySelectorAll('#range button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#range button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  state.range = +b.dataset.r; render();
}));
$('#plan').addEventListener('change',e=>{state.plan=e.target.value; render();});
$('#search').addEventListener('input',table);
$('#shuffle').addEventListener('click',()=>{state.tip++; insight();});
render(); cohort(); insight();

/* ---------- "Ask your data" demo assistant (rule-based, no API) ---------- */
const CHIPS = ['Who is at risk?','What is the churn rate?','Best channel?','Top customer by revenue?','Summarize this period'];
function answer(q){
  q = q.toLowerCase();
  const d = PLAN_DATA[state.plan], r = state.range;
  const pool = CUSTOMERS.filter(c=>state.plan==='all'||c.plan===state.plan);
  const churn = (d.churn*{7:.3,30:1,90:2.7}[r]).toFixed(1);
  const topCh = [...CH_RANGE[r]].sort((a,b)=>b[1]-a[1])[0];
  const risk = pool.filter(c=>c.health<45).sort((a,b)=>a.health-b.health);
  const top = [...pool].sort((a,b)=>b.rev-a.rev)[0];
  if(/risk|danger|leave|cancel/.test(q)) return risk.length ? 'These accounts are at risk:\n'+risk.map(c=>`${c.name} (health ${c.health}, ${c.plan})`).join('\n')+'\nReach out to them this week.' : 'No accounts are at risk for this plan.';
  if(/churn/.test(q)) return `Churn rate for the last ${r} days is ${churn}%. That is the share of customers who cancelled in this period.`;
  if(/channel|source|come from|acquisition/.test(q)) return `${topCh[0]} brings the most customers (${topCh[1]}%) in the last ${r} days.`;
  if(/revenue|top|biggest|best customer/.test(q)) return top ? `${top.name} pays the most: $${fmt(top.rev)} per month on the ${top.plan} plan.` : 'No customers match the current filter.';
  if(/retention|cohort/.test(q)) return 'The Aug signup group retains best: 88% are still active after 1 month.';
  if(/health/.test(q)) return 'Health score (0-100) shows how likely a customer is to stay. Under 45 means at risk, 70 and above is healthy.';
  if(/summar|overview|report/.test(q)) return `Last ${r} days (${state.plan==='all'?'all plans':state.plan}):\n- ${fmt(Math.round(d.customers*0.06*SCALE[r]))} new customers\n- Churn ${churn}%\n- Top channel: ${topCh[0]}\n- ${risk.length} account(s) at risk`;
  return 'I can answer about churn, at-risk accounts, acquisition channels, top customers, retention, or give a summary. Try one of the suggestions below.';
}
function say(text, who){
  const m = document.createElement('div'); m.className = 'msg '+who; m.textContent = text;
  $('#msgs').appendChild(m); $('#msgs').scrollTop = $('#msgs').scrollHeight;
}
function ask(q){
  if(!q.trim()) return;
  say(q,'me');
  setTimeout(()=>say(answer(q),'bot'),450);
}
function toggleChat(open){
  $('#chat').hidden = !open; $('#chatBtn').setAttribute('aria-expanded', open);
  if(open) $('#chatInput').focus();
}
$('#chips').innerHTML = CHIPS.map(c=>`<button type="button">${c}</button>`).join('');
$('#chips').addEventListener('click',e=>{ if(e.target.tagName==='BUTTON') ask(e.target.textContent); });
$('#chatForm').addEventListener('submit',e=>{ e.preventDefault(); ask($('#chatInput').value); $('#chatInput').value=''; });
$('#chatBtn').addEventListener('click',()=>toggleChat($('#chat').hidden));
$('#chatClose').addEventListener('click',()=>toggleChat(false));
say('Hi! Ask me about your customers. I use the filters you picked above.','bot');
