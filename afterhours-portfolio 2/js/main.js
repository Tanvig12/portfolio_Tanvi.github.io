const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const store={get(){try{return JSON.parse(localStorage.getItem("ah-found")||"[]")}catch(e){return[]}},set(a){try{localStorage.setItem("ah-found",JSON.stringify(a))}catch(e){}}};
let found=new Set(store.get());
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),3200)}
function secret(id,msg){if(msg)toast(msg);if(!found.has(id)){found.add(id);store.set([...found]);$("#count").textContent=`Secrets found: ${found.size} of 10`;if(found.size===10)setTimeout(()=>toast("You found all ten. Thanks for looking closely."),3400)}}
$("#count").textContent=`Secrets found: ${found.size} of 10`;$("#yr").textContent=new Date().getFullYear();

/* hero wall text */
const words=["const mood = 'caffeinated';","// TODO: sleep","git commit -m 'fix, finally'","while(awake){ build(); }","npm run dev","console.log('hi');","<main>still compiling</main>","// it works, don’t touch it","if(deadline){ panic(); }","SELECT coffee FROM desk;","TODO: refactor tomorrow","// why does this work?","git push origin night-shift","localhost:5173"];
$("#under").append(...Array.from({length:26},(_,i)=>el("span","",words[i%words.length])));
const hero=$("#hero");
hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();hero.style.setProperty("--mx",e.clientX-r.left+"px");hero.style.setProperty("--my",e.clientY-r.top+"px")});

/* story words */
const sw=CONTENT.story.split(" ");$("#story").append(...sw.map((w,i)=>{const s=el("span","w",w+(i<sw.length-1?" ":""));return s}));
const wEls=$$("#story .w");

/* projects */
const plist=$("#plist"),pane=$("#pane");let cur=0;
CONTENT.projects.forEach((p,i)=>{const li=el("li");const b=el("button");b.type="button";b.setAttribute("role","tab");b.id="t"+i;b.append(el("span","",p.name),el("small","",p.year));b.onclick=()=>show(i,true);b.onkeydown=e=>{const n=CONTENT.projects.length;if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const j=(i+(e.key==="ArrowDown"?1:n-1))%n;$("#t"+j).focus();show(j,true)}};li.append(b);plist.append(li)});
function show(i,anim){cur=i;const p=CONTENT.projects[i];$$("#plist button").forEach((b,j)=>{b.setAttribute("aria-selected",j===i);b.tabIndex=j===i?0:-1});pane.setAttribute("aria-labelledby","t"+i);
pane.replaceChildren();const sh=el("div","shot",p.placeholder?"Screenshot or demo goes here":"Preview");const body=el("div","body");
if(p.todo)body.append(el("span","ph","to add: "+p.todo));
body.append(el("h3","",p.name),el("p","",p.summary));const ul=el("ul","tags");p.stack.forEach(s=>ul.append(el("li","",s)));body.append(ul);
const dl=el("dl","cs");[["Role",p.role],["Problem",p.problem],["Approach",p.approach],["Result",p.result]].forEach(([k,v])=>{if(v){dl.append(el("dt","",k),el("dd","",v))}});if(dl.children.length)body.append(dl);
if(p.links.length){const d=el("div");d.style.cssText="display:flex;gap:.6rem;margin-top:1.4rem;flex-wrap:wrap";p.links.forEach(l=>{const a=el("a","btn",l.label);a.href=l.url;a.target="_blank";a.rel="noopener";d.append(a)});body.append(d)}
pane.append(sh,body);if(anim&&!RM){pane.classList.remove("swap");void pane.offsetWidth;pane.classList.add("swap")}}
show(0,false);

/* skills */
const fl=$("#filters"),sk=$("#sk");const groups=["All",...Object.keys(CONTENT.skills)];let g="All";
function drawSk(){sk.replaceChildren();Object.entries(CONTENT.skills).forEach(([k,v])=>{if(g==="All"||g===k)v.forEach((s,i)=>{const c=el("span","chip",s);c.style.animationDelay=i*40+"ms";sk.append(c)})});if(CONTENT.skillsPlaceholder)sk.append(el("span","ph","placeholder: list your real skills in CONTENT.skills"))}
groups.forEach(n=>{const b=el("button","",n);b.type="button";b.setAttribute("aria-pressed",n===g);b.onclick=()=>{g=n;$$("button",fl).forEach(x=>x.setAttribute("aria-pressed",x.textContent===n));drawSk()};fl.append(b)});drawSk();

/* timeline */
const tl=$("#tl");CONTENT.path.forEach(p=>{const li=el("li","rv");if(p.placeholder)li.append(el("span","ph","placeholder"),el("br"));li.append(el("time","",p.date),el("h3","",p.title),el("p","",p.text));tl.append(li)});

/* contact */
$("#form").addEventListener("submit",e=>{e.preventDefault();const n=$("#n").value.trim(),m=$("#msg").value.trim(),s=$("#fs");s.className="";
if(!n||!m){s.className="err";s.textContent="Add your name and a message, then send again.";return}
if(!CONTENT.email){s.className="err";s.textContent="Nothing was sent. The site owner hasn’t added an email address yet.";return}
location.href=`mailto:${CONTENT.email}?subject=${encodeURIComponent("Hello from "+n)}&body=${encodeURIComponent(m)}`;s.className="ok";s.textContent="Your email app should open now. The message is only sent once you send it there."});

/* nav */
const mb=$("#menu"),nl=$("#nl");mb.onclick=()=>{const o=nl.classList.toggle("open");mb.setAttribute("aria-expanded",o)};$$("a",nl).forEach(a=>a.onclick=()=>{nl.classList.remove("open");mb.setAttribute("aria-expanded","false")});

/* reveals + chapters */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
$$(".rv").forEach((e,i)=>{e.style.setProperty("--i",i%3);io.observe(e)});
const chIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){document.documentElement.dataset.ch=e.target.dataset.ch;$$("nav a").forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+e.target.id))}}),{rootMargin:"-45% 0px -50% 0px"});
$$("[data-ch]").forEach(s=>chIO.observe(s));

/* scroll-linked */
const intro=$("#about"),tlist=$("#tl");let tick=false;
function frame(){tick=false;const y=scrollY,vh=innerHeight,max=document.documentElement.scrollHeight-vh;
document.documentElement.style.setProperty("--p",max>0?Math.min(1,y/max):0);
hero.style.setProperty("--s",Math.min(1,y/vh));
const r=intro.getBoundingClientRect(),ip=Math.min(1,Math.max(0,-r.top/(r.height-vh)));const n=Math.round(ip*1.1*wEls.length);wEls.forEach((w,i)=>w.classList.toggle("on",RM||i<n));
const t=tlist.getBoundingClientRect(),tp=Math.min(1,Math.max(0,(vh*.65-t.top)/t.height));tlist.style.setProperty("--tp",tp);}
addEventListener("scroll",()=>{if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});addEventListener("resize",frame);frame();

const act=$("#act");CONTENT.activities.forEach(a=>{const c=el("div","ac rv");c.append(el("h3","",a.name),el("span","role",a.role),el("p","",a.text));if(a.todo)c.append(el("span","ph","to confirm: "+a.todo));act.append(c);io.observe(c)});
$("#mqt").textContent=Array(6).fill("HTML  /  CSS  /  JavaScript  /  Python  /  FastAPI  /  Git  /  AI").join("  /  ");
const bd=$("#badge");if(bd&&!RM){const bi=bd.firstElementChild;bd.addEventListener("pointermove",e=>{const r=bd.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;bi.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg)`;bi.style.setProperty("--gx",(x+.5)*100+"%");bi.style.setProperty("--gy",(y+.5)*100+"%")});bd.addEventListener("pointerleave",()=>bi.style.transform="")}
pane.addEventListener("pointermove",e=>{const r=pane.getBoundingClientRect();pane.style.setProperty("--gx",e.clientX-r.left+"px");pane.style.setProperty("--gy",e.clientY-r.top+"px")});
addEventListener("scroll",()=>document.documentElement.style.setProperty("--sy",scrollY),{passive:true});
const str=$("#str");CONTENT.strengths.forEach(a=>{const c=el("div","ac rv");c.append(el("h3","",a.name),el("p","",a.text));str.append(c);io.observe(c)});
const LK=[["GitHub",CONTENT.github],["LinkedIn",CONTENT.linkedin]];
LK.forEach(([n,u])=>{["#links","#flinks"].forEach((t,i)=>{const a=el("a",i?"":"btn",n);a.href=u;a.target="_blank";a.rel="noopener";$(t).append(a)})});
$("#resumeBtn").addEventListener("click",e=>{e.preventDefault();fetch(CONTENT.resume,{method:"HEAD"}).then(r=>{if(!r.ok)throw 0;const a=document.createElement("a");a.href=CONTENT.resume;a.download="Tanvi-Gupta-Resume.pdf";a.click()}).catch(()=>toast("Resume coming soon."))});
const rot=$("#rot"),rl=["CvPrep, an AI resume builder and ATS checker","web apps","AI-powered tools"];let ri=0;if(!RM)setInterval(()=>{rot.style.opacity=0;setTimeout(()=>{ri=(ri+1)%rl.length;rot.textContent=rl[ri];rot.style.opacity=1},350)},2800);
const clk=$("#clk");function clock(){const f=new Intl.DateTimeFormat("en-IN",{hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:"Asia/Kolkata"}).format(new Date()),h=+f.slice(0,2);clk.textContent=f+" IST, "+(h>=18||h<6?"after hours":"daytime")}clock();setInterval(clock,30000);
const m2=$("#mqt2");m2.textContent=Array(5).fill("useful  /  accessible  /  impactful").join("  /  ");
function mq2(){if(RM){m2.style.transform="translateX(-200px)";return}const r=m2.parentElement.getBoundingClientRect();m2.style.transform=`translateX(${-2400+(innerHeight-r.top)*.6}px)`}addEventListener("scroll",mq2,{passive:true});mq2();
const pal=$("#pal"),pi=$("#pi"),pl=$("#pl"),go=h=>{location.hash=h};
const ACT=[["Projects",()=>go("#work")],["Skills",()=>go("#skills")],["Beyond the code",()=>go("#beyond")],["Learning path",()=>go("#path")],["Contact",()=>go("#contact")],["Open GitHub",()=>open(CONTENT.github,"_blank","noopener")],["Open LinkedIn",()=>open(CONTENT.linkedin,"_blank","noopener")],["Toggle lamp",()=>hero.classList.toggle("lamp")],["Toggle night mode",()=>$("#moon").click()]];
function drawPal(){const q=pi.value.toLowerCase();pl.replaceChildren();ACT.filter(a=>a[0].toLowerCase().includes(q)).forEach((a,i)=>{const li=el("li"),b=el("button",i?"":"sel",a[0]);b.type="button";b.onclick=()=>{pal.close();a[1]()};li.append(b);pl.append(li)})}
function openPal(){pi.value="";drawPal();pal.showModal();pi.focus()}
pi.addEventListener("input",drawPal);pi.addEventListener("keydown",e=>{if(e.key==="Enter"){const b=$("#pl button");if(b)b.click()}});pal.addEventListener("click",e=>{if(e.target===pal)pal.close()});$("#kbtn").onclick=openPal;
addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();pal.open?pal.close():openPal()}});
const ring=$("#cur");if(matchMedia("(pointer:fine)").matches&&!RM){let cx=0,cy=0,tx=0,ty=0;addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;ring.classList.add("on")});document.addEventListener("pointerover",e=>ring.classList.toggle("big",!!e.target.closest("a,button,input,textarea")));(function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;ring.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})()}
const bio=$("#bio");CONTENT.bio.forEach(t=>bio.append(el("p","",t)));
let curTheme=document.documentElement.dataset.theme=="day"?"dark":(document.documentElement.dataset.theme||"dark");
function applyTheme(t){document.documentElement.dataset.theme=t;$("#theme").setAttribute("aria-label",t==="light"?"Switch to dark theme":"Switch to light theme")}applyTheme(curTheme);
$("#theme").onclick=()=>{curTheme=curTheme==="light"?"dark":"light";applyTheme(curTheme);try{localStorage.setItem("ah-theme",curTheme)}catch(e){}};
let ac,master,sOn=false;const snd=$("#snd");
function sndUi(){snd.setAttribute("aria-pressed",sOn);snd.setAttribute("aria-label",sOn?"Ambient sound on. Turn off":"Ambient sound off. Turn on");snd.classList.toggle("on",sOn)}
async function sndOn(){try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=0;const lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=700;[110,164.81,220,277.18].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.type="sine";o.frequency.value=f;o.detune.value=(i-1.5)*6;g.gain.value=.25;l.frequency.value=.05+i*.03;lg.gain.value=.12;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(lp);o.start();l.start()});lp.connect(master);master.connect(ac.destination)}await ac.resume();master.gain.cancelScheduledValues(ac.currentTime);master.gain.linearRampToValueAtTime(.12,ac.currentTime+1.5);sOn=true;toast("Ambient sound on. Click the speaker to stop.")}catch(e){sOn=false;toast("Sound isn’t available in this browser.")}sndUi()}
function sndOff(){if(ac){master.gain.cancelScheduledValues(ac.currentTime);master.gain.linearRampToValueAtTime(0,ac.currentTime+.6);setTimeout(()=>{if(!sOn)ac.suspend()},700)}sOn=false;sndUi()}
snd.onclick=()=>sOn?sndOff():sndOn();document.addEventListener("visibilitychange",()=>{if(document.hidden&&sOn)sndOff()});

const AR=$("#arena"),WR=$("#cubeWrap"),rig=$("#rig"),hmsg=$("#hmsg"),hbt=$("#heart"),hc=$("#hc");
const N=48,GAP=1.08,FACE=[["",.04],["rotateY(180deg)",.3],["rotateY(90deg)",.16],["rotateY(-90deg)",.24],["rotateX(90deg)",0],["rotateX(-90deg)",.34]];
const LAV=["#C4B5FD","#DDD6FE","#A78BFA","#EDE9FE"],ROSE=["#F9A8D4","#FBCFE8","#F472B6","#FDF2F8"];
const cmp=(a,b)=>a.y-b.y||a.x-b.x||a.z-b.z,lay={cube:[],heart:[]};
for(let z=0;z<3;z++)for(let y=0;y<4;y++)for(let x=0;x<4;x++)lay.cube.push({x:x-1.5,y:y-1.5,z:z-1});
[".XX...XX.","XXXX.XXXX","XXXXXXXXX","XXXXXXXXX",".XXXXXXX.","..XXXXX..","...XXX...","....X...."].forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==="X")lay.heart.push({x:i-4,y:j-3.5,z:0})}));
lay.heart.push({x:-1,y:-1.5,z:1},{x:1,y:-1.5,z:1});lay.cube.sort(cmp);lay.heart.sort(cmp);
const scatter=()=>Array.from({length:N},()=>({x:(Math.random()-.5)*9,y:(Math.random()-.5)*6,z:(Math.random()-.5)*5}));
let S=34;const faceEls=[];
const blocks=lay.cube.map((p,i)=>{const b=el("div","vb");b.style.setProperty("--c",LAV[i%4]);FACE.forEach(([t,sh])=>{const f=el("div","vf");f.style.setProperty("--sh",sh);b.append(f);faceEls.push([f,t])});rig.append(b);return{b,i,cur:{x:0,y:0,z:0,rx:0,ry:0},from:null,to:null,spin:[(Math.random()-.5)*900,(Math.random()-.5)*900],arc:1+Math.random()*2}});
function place(o,p){o.b.style.transform=`translate3d(${p.x*S*GAP}px,${p.y*S*GAP}px,${p.z*S*GAP}px) rotateX(${p.rx||0}deg) rotateY(${p.ry||0}deg)`}
function fit(){S=Math.max(18,Math.min(34,Math.floor(AR.clientWidth/11))||34);AR.style.setProperty("--S",S+"px");faceEls.forEach(([f,t])=>f.style.transform=`${t} translateZ(${S/2}px)`);blocks.forEach(o=>place(o,o.cur))}
const sc0=scatter();blocks.forEach((o,i)=>{o.cur=RM?{...lay.cube[i],rx:0,ry:0}:{...sc0[i],rx:0,ry:0}});fit();addEventListener("resize",fit);
let shape="cube",anim=null,vis=false,raf=0,rx=-24,ry=32,drag=null,dtile=null,first=true,hvT={x:0,y:0},hv={x:0,y:0};
const DUR=RM?1:1300;
function paintRig(){rig.style.transform=`rotateX(${rx+hv.y}deg) rotateY(${ry+hv.x}deg)`}paintRig();
function kick(){if(vis&&!raf)raf=requestAnimationFrame(vframe)}
function morph(tg,done){ry=((ry+180)%360+360)%360-180;blocks.forEach((o,i)=>{o.from={...o.cur};o.to={...tg[i],rx:0,ry:0}});
 if(!vis||RM){blocks.forEach(o=>{o.cur={...o.to};place(o,o.cur)});anim=null;if(done)done();return}
 anim={t0:performance.now(),done};kick()}
function vframe(now){raf=0;
 if(anim){let alive=false;blocks.forEach(o=>{const t=Math.max(0,Math.min(1,(now-anim.t0-o.i*14)/DUR)),u=t-1,e=t>=1?1:1+2.2*u*u*u+1.2*u*u,w=Math.sin(Math.PI*t),f=o.from,g=o.to;if(t<1)alive=true;
  place(o,{x:f.x+(g.x-f.x)*e,y:f.y+(g.y-f.y)*e,z:f.z+(g.z-f.z)*e+w*o.arc*2,rx:f.rx+(g.rx-f.rx)*e+o.spin[0]*w,ry:f.ry+(g.ry-f.ry)*e+o.spin[1]*w});if(t>=1)o.cur={...g}});
  if(!alive){const d=anim.done;anim=null;if(d)d()}}
 if(!drag){if(shape==="heart"){rx+=(-4-rx)*.05;ry+=(Math.sin(now/1400)*18-ry)*.05}else if(!RM)ry+=.15}
 hv.x+=(hvT.x-hv.x)*.1;hv.y+=(hvT.y-hv.y)*.1;paintRig();
 if(vis&&(anim||drag||!RM))raf=requestAnimationFrame(vframe)}
new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v){vis=true;if(first){first=false;morph(lay.cube)}kick()}else vis=false},{threshold:.2}).observe(AR);
function recolor(pal){blocks.forEach((o,i)=>o.b.style.setProperty("--c",pal[(i*5+(i>>2))%4]))}
function setHeartUi(h){hbt.setAttribute("aria-pressed",h);hbt.textContent=h?"Back to cube":"Make a heart";hc.setAttribute("aria-label",h?"Turn the heart back into a cube":"Turn the cube into a heart")}
function toggleHeart(){if(anim)return;const h=shape==="cube";shape=h?"heart":"cube";hmsg.classList.remove("on");hmsg.textContent=h?"Made with curiosity ♡":"";recolor(h?ROSE:LAV);setHeartUi(h);morph(lay[shape],()=>{if(h){hmsg.classList.add("on");secret("heart","Made with curiosity ♡")}})}
function scramble(){if(anim)return;const s=shape;hmsg.classList.remove("on");morph(scatter(),()=>{const all=[...LAV,...ROSE,"#FFFFFF"];blocks.forEach(o=>o.b.style.setProperty("--c",all[Math.floor(Math.random()*all.length)]));morph(lay[s],()=>{if(s==="heart")hmsg.classList.add("on")})});secret("scramble","Scrambled. Solving it isn’t part of the portfolio, sorry.")}
function resetAll(){if(anim)return;shape="cube";hmsg.classList.remove("on");recolor(LAV);setHeartUi(false);rx=-24;ry=32;morph(lay.cube);$$(".dr").forEach(resetBlock)}
WR.addEventListener("pointerdown",e=>{dtile=e.target.closest(".vb");drag={x:e.clientX,y:e.clientY,m:0};WR.setPointerCapture(e.pointerId);$("#dh").classList.add("gone");kick()});
WR.addEventListener("pointermove",e=>{if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;ry+=dx*.6;rx=Math.max(-80,Math.min(80,rx-dy*.6));drag.m+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;kick()}else if(e.pointerType==="mouse"){const r=WR.getBoundingClientRect();hvT={x:((e.clientX-r.left)/r.width-.5)*14,y:-((e.clientY-r.top)/r.height-.5)*10};kick()}});
WR.addEventListener("pointerup",()=>{if(drag&&drag.m<6&&dtile){const t=dtile;t.classList.add("pulse");setTimeout(()=>t.classList.remove("pulse"),300)}drag=null});
WR.addEventListener("pointercancel",()=>{drag=null});WR.addEventListener("pointerleave",()=>{hvT={x:0,y:0};kick()});
WR.addEventListener("keydown",e=>{const d={ArrowLeft:[0,-15],ArrowRight:[0,15],ArrowUp:[-15,0],ArrowDown:[15,0]}[e.key];if(d){e.preventDefault();rx+=d[0];ry+=d[1];kick();paintRig()}else if(e.key==="Enter"){e.preventDefault();toggleHeart()}});
hbt.onclick=toggleHeart;hc.onclick=toggleHeart;$("#scr").onclick=scramble;$("#rst").onclick=resetAll;
const arena=$("#arena"),HOME=[["</>",8,12],["{ }",78,16],["py",14,66],["AI",70,64]];
function resetBlock(b){b.style.left=b.dataset.x+"%";b.style.top=b.dataset.y+"%";b.style.transform=""}
HOME.slice(0,matchMedia("(max-width:640px)").matches?2:4).forEach(([t,x,y])=>{const b=el("div","dr",t);b.tabIndex=0;b.setAttribute("role","img");b.setAttribute("aria-label","Draggable block "+t+". Arrow keys move it");b.dataset.x=x;b.dataset.y=y;resetBlock(b);arena.append(b);let o=null,n=0;
b.addEventListener("pointerdown",e=>{const r=b.getBoundingClientRect();o={dx:e.clientX-r.left,dy:e.clientY-r.top,px:e.clientX};b.setPointerCapture(e.pointerId);b.classList.add("drag")});
b.addEventListener("pointermove",e=>{if(!o)return;const a=arena.getBoundingClientRect();b.style.left=Math.max(0,Math.min(a.width-b.offsetWidth,e.clientX-a.left-o.dx))+"px";b.style.top=Math.max(0,Math.min(a.height-b.offsetHeight,e.clientY-a.top-o.dy))+"px";b.style.transform=`rotate(${Math.max(-18,Math.min(18,(e.clientX-o.px)*.4))}deg)`;o.px=e.clientX});
const end=()=>{if(o){o=null;b.classList.remove("drag");b.style.transform=""}};b.addEventListener("pointerup",end);b.addEventListener("pointercancel",end);
b.addEventListener("click",()=>{if(++n===7){n=0;secret("blocks","Okay, okay, the "+t+" block is flattered.")}});
b.addEventListener("keydown",e=>{const d={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]}[e.key];if(!d)return;e.preventDefault();b.style.left=Math.max(0,Math.min(arena.clientWidth-b.offsetWidth,b.offsetLeft+d[0]))+"px";b.style.top=Math.max(0,Math.min(arena.clientHeight-b.offsetHeight,b.offsetTop+d[1]))+"px"})});
const gp=$("#gp"),ga=$("#garena");let gsc=0,gtl=20,gT=null,gS=null,gRun=false;
function gStop(){gRun=false;clearInterval(gT);clearInterval(gS);ga.replaceChildren();$("#gstart").textContent=gsc?"Play again":"Start"}
function gOpen(o){gp.hidden=!o;$("#gbtn").setAttribute("aria-expanded",o);if(!o)gStop()}
function gStart(){gStop();gsc=0;gtl=20;gRun=true;$("#gs").textContent="Score 0";$("#gt").textContent="20s";$("#gstart").textContent="Restart";
gS=setInterval(()=>{const b=el("button","bug");b.setAttribute("aria-label","Squash bug");b.style.left=Math.random()*82+"%";b.style.top=Math.random()*72+"%";b.onclick=()=>{gsc++;$("#gs").textContent="Score "+gsc;b.remove();if(gsc===10)secret("game","Ten bugs squashed. Ship it.")};ga.append(b);setTimeout(()=>b.remove(),1100)},RM?900:650);
gT=setInterval(()=>{gtl--;$("#gt").textContent=gtl+"s";if(gtl<=0){const s=gsc;gStop();toast("Time. You squashed "+s+" bugs.")}},1000)}
const gm=$("#gm");gm.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")gOpen(true)});gm.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse"&&!gRun)gOpen(false)});
$("#gbtn").onclick=()=>gOpen(gp.hidden);$("#gx").onclick=()=>gOpen(false);$("#gstart").onclick=gStart;document.addEventListener("visibilitychange",()=>{if(document.hidden&&gRun)gStop()});
/* ===== secrets ===== */
// 1 Konami code: daybreak theme (repeat to switch back)
const K=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let ki=0,typed="";
addEventListener("keydown",e=>{if(/INPUT|TEXTAREA/.test(e.target.tagName))return;const k=e.key.length===1?e.key.toLowerCase():e.key;
ki=k===K[ki]?ki+1:(k===K[0]?1:0);
if(ki===K.length){ki=0;const d=document.documentElement,on=d.dataset.theme!=="day";if(on)d.dataset.theme="day";else applyTheme(curTheme);secret("konami",on?"Lamp light on. Enter the code again to go back.":"Back to the dark.")}
if(k==="l"&&!e.ctrlKey&&!e.metaKey){hero.classList.toggle("lamp");secret("lamp",hero.classList.contains("lamp")?"Lamp on. Press L to switch it off.":"Lamp off.")}
if(k==="Escape"){document.body.classList.remove("night");hero.classList.remove("lamp");applyTheme(curTheme)}
if(e.key.length===1){typed=(typed+k).slice(-5);if(typed==="hello")secret("hello","Hello, you. Glad you’re here.")}});
// 2 logo x5
let lc=0,lt;$("#logo").addEventListener("click",()=>{lc++;clearTimeout(lt);lt=setTimeout(()=>lc=0,1500);if(lc===5){lc=0;secret("logo","The logo has feelings too. Please stop.")}});
// 3 sleepy creature after idle
const cr=$("#critter");let it;const wake=()=>{clearTimeout(it);cr.classList.remove("up");it=setTimeout(()=>cr.classList.add("up"),25000)};
["pointermove","keydown","scroll","touchstart"].forEach(ev=>addEventListener(ev,wake,{passive:true}));wake();
cr.onclick=()=>{secret("critter","Purr. It goes back to sleep.");cr.classList.remove("up")};
// 4 night mode
$("#moon").onclick=()=>{const on=document.body.classList.toggle("night");secret("night",on?"Goodnight, Tanvi. Press Esc or click the moon to wake up.":"Good morning.")};
