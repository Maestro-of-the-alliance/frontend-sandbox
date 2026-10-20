(function(){
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var world=document.documentElement.dataset.world||"";
var cv=document.getElementById("sky");
var mx=.5,my=.5,sy=0;
addEventListener("pointermove",function(e){mx=e.clientX/innerWidth;my=e.clientY/innerHeight;pxy.x=e.clientX;pxy.y=e.clientY});
addEventListener("scroll",function(){sy=scrollY},{passive:true});
var pxy={x:-99,y:-99};
if(cv){var x=cv.getContext("2d"),W,H,D=1,S={};
 function size(){D=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*D;H=cv.height=innerHeight*D;S={};init()}
 function R(a){a=a||1;S.r=(S.r||7)*16807%2147483647;return S.r/2147483647*a}
 function init(){S.r=11;var i;
  if(world==="dawn"){S.m=[];for(i=0;i<40;i++)S.m.push({x:R(W),y:R(H),s:R(2)+.5,v:R(.4)+.1})}
  if(world==="aurora"){S.o=[];for(i=0;i<7;i++)S.o.push({x:R(W),y:R(H),r:R(160*D)+90*D,p:R(6.28),c:i%2?"0,200,220":"110,120,255"})}
  if(world==="city"){S.st=[];for(i=0;i<110;i++)S.st.push({x:R(W),y:R(H*.5),r:R(1.4*D)+.4*D});S.L=[];for(var l=0;l<4;l++){var a=[],xx=-50;while(xx<W*1.6){var w=(30+R(60))*D*(1+(3-l)*.15),h=(60+R(190))*D*(1+(3-l)*.12);a.push([xx,w,h]);xx+=w+R(10)*D}S.L.push(a)}}
  if(world==="flow"){S.p=[];for(i=0;i<170;i++)S.p.push({x:R(W),y:R(H),a:R(1)});x.fillStyle="#eaf8f0";x.fillRect(0,0,W,H)}
  if(world==="orbit"){}
  if(world==="halftone"){}
  if(world==="surveil"){S.b=[];for(i=0;i<5;i++)S.b.push({x:R(W),y:R(H),w:R(120*D)+60*D,h:R(150*D)+80*D,vx:(R(2)-1)*.5*D,vy:(R(2)-1)*.4*D})}
 }
 size();addEventListener("resize",size);
 var F={
 dawn:function(t){var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#7fc3f5");g.addColorStop(.6,"#cdeaff");g.addColorStop(1,"#fff0c9");x.fillStyle=g;x.fillRect(0,0,W,H);
  var cx=W*(.5+(mx-.5)*.04),cy=H*.9-Math.min(sy,1500)*.08*D,r=Math.min(W,H)*.34;
  x.save();x.translate(cx,cy);x.rotate(t/18000);for(var i=0;i<28;i++){x.rotate(6.2832/28);x.fillStyle="rgba(255,196,60,"+(i%2?.14:.07)+")";x.beginPath();x.moveTo(0,0);x.lineTo(W*1.2,-W*.05);x.lineTo(W*1.2,W*.05);x.fill()}x.restore();
  var sg=x.createRadialGradient(cx,cy,r*.2,cx,cy,r*1.5);sg.addColorStop(0,"rgba(255,244,190,1)");sg.addColorStop(.35,"rgba(255,200,70,.55)");sg.addColorStop(1,"rgba(255,200,70,0)");x.fillStyle=sg;x.fillRect(0,0,W,H);
  x.fillStyle="#ffcf3f";x.beginPath();x.arc(cx,cy,r*.55,0,6.2832);x.fill();
  S.m.forEach(function(m){m.y-=m.v*D*.4;if(m.y<0)m.y=H;x.fillStyle="rgba(255,255,255,.7)";x.fillRect(m.x+Math.sin(t/900+m.y*.01)*8,m.y,m.s*D,m.s*D)})},
 aurora:function(t){x.fillStyle="#04141f";x.fillRect(0,0,W,H);x.globalCompositeOperation="lighter";
  S.o.forEach(function(o,i){var px=o.x+Math.sin(t/3000+o.p)*80*D+(mx-.5)*60*D*(i%3),py=o.y+Math.cos(t/3400+o.p)*60*D;var g=x.createRadialGradient(px,py,0,px,py,o.r);g.addColorStop(0,"rgba("+o.c+",.28)");g.addColorStop(1,"rgba("+o.c+",0)");x.fillStyle=g;x.fillRect(px-o.r,py-o.r,o.r*2,o.r*2)});
  for(var k=0;k<3;k++){x.beginPath();for(var i=0;i<=W;i+=12*D){var y=H*(.22+k*.12)+Math.sin(i/(220*D)+t/1800+k*2)*60*D+Math.sin(i/(90*D)-t/1100)*14*D;i?x.lineTo(i,y):x.moveTo(i,y)}x.strokeStyle=["rgba(60,255,200,.22)","rgba(60,200,255,.18)","rgba(150,120,255,.2)"][k];x.lineWidth=22*D;x.shadowColor=x.strokeStyle;x.shadowBlur=50*D;x.stroke();x.shadowBlur=0}
  x.globalCompositeOperation="source-over"},
 city:function(t){var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2a0b4a");g.addColorStop(.5,"#b8346a");g.addColorStop(.8,"#ff7a3d");g.addColorStop(1,"#ffd06a");x.fillStyle=g;x.fillRect(0,0,W,H);
  S.st.forEach(function(s){x.fillStyle="rgba(255,255,255,"+(.5+.5*Math.sin(t/700+s.x)).toFixed(2)+")";x.fillRect(s.x,s.y,s.r,s.r)});
  var sunY=H*.78+Math.min(sy,900)*.2*D;x.fillStyle="#fff1b0";x.beginPath();x.arc(W*.5,sunY,Math.min(W,H)*.2,0,6.2832);x.fill();
  var cols=["#5b1d5e","#3e1550","#2a0e40","#170830"];S.L.forEach(function(L,l){var par=(l+1)*.12,off=-(sy*par*D)-(mx-.5)*40*D*(l+1)/4;x.fillStyle=cols[l];var base=H*(.78+l*.06);
   L.forEach(function(b){var bx=((b[0]+off)%(W*1.6)+W*1.6)%(W*1.6)-80;x.fillRect(bx,base-b[2],b[1],b[2]+H)});
   if(l>=2){x.fillStyle="rgba(255,214,120,.8)";L.forEach(function(b,i){var bx=((b[0]+off)%(W*1.6)+W*1.6)%(W*1.6)-80;for(var yy=base-b[2]+10*D;yy<base-6*D;yy+=14*D)for(var xx=bx+6*D;xx<bx+b[1]-6*D;xx+=12*D)if(((xx*7+yy*13+i)|0)%5<2)x.fillRect(xx,yy,4*D,6*D)})}})},
 blueprint:function(t){x.fillStyle="#0e3a6b";x.fillRect(0,0,W,H);x.lineWidth=1;var m=24*D,ox=-(sy*.3*D)%m;
  x.strokeStyle="rgba(255,255,255,.07)";x.beginPath();for(var i=0;i<W;i+=m){x.moveTo(i,0);x.lineTo(i,H)}for(var j=ox;j<H;j+=m){x.moveTo(0,j);x.lineTo(W,j)}x.stroke();
  x.strokeStyle="rgba(255,255,255,.17)";x.beginPath();for(i=0;i<W;i+=m*5){x.moveTo(i,0);x.lineTo(i,H)}for(j=ox;j<H;j+=m*5){x.moveTo(0,j);x.lineTo(W,j)}x.stroke();
  x.save();x.translate(W*.82,H*.3);x.strokeStyle="rgba(255,255,255,.2)";x.setLineDash([6*D,10*D]);for(i=1;i<4;i++){x.beginPath();x.arc(0,0,i*70*D,0,6.2832);x.stroke()}x.rotate(t/6000);x.setLineDash([]);x.beginPath();x.moveTo(-230*D,0);x.lineTo(230*D,0);x.moveTo(0,-230*D);x.lineTo(0,230*D);x.stroke();x.restore();
  var px=pxy.x*D,py=pxy.y*D;if(px>0){x.strokeStyle="rgba(255,226,140,.8)";x.setLineDash([4*D,6*D]);x.beginPath();x.moveTo(px,0);x.lineTo(px,H);x.moveTo(0,py);x.lineTo(W,py);x.stroke();x.setLineDash([]);x.fillStyle="#ffe28c";x.font=(12*D)+"px 'IBM Plex Mono',monospace";x.fillText("x "+Math.round(px/D)+"  y "+Math.round(py/D+sy),px+10*D,py-10*D)}},
 flow:function(t){x.fillStyle="rgba(234,248,240,.07)";x.fillRect(0,0,W,H);S.p.forEach(function(p){var a=Math.sin(p.x*.0019/D+t/5000)*3+Math.cos(p.y*.0023/D-t/6000)*3;var nx=p.x+Math.cos(a)*1.6*D,ny=p.y+Math.sin(a)*1.6*D;x.strokeStyle="rgba("+(20+p.a*30|0)+","+(150+p.a*70|0)+","+(110+p.a*40|0)+",.5)";x.lineWidth=1.4*D;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(nx,ny);x.stroke();p.x=nx;p.y=ny;if(p.x<0||p.x>W||p.y<0||p.y>H){p.x=Math.random()*W;p.y=Math.random()*H}})},
 orbit:function(t){var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#1d0818");g.addColorStop(1,"#3a1230");x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation="lighter";var r=Math.min(W,H)*.42,a=t/5000,sep=r*(.55+.25*Math.sin(t/4000)),cx=W/2,cy=H*.42-Math.min(sy,800)*.1*D;
  [[Math.cos(a)*sep,Math.sin(a)*sep,"0,190,220"],[-Math.cos(a)*sep,-Math.sin(a)*sep,"255,170,70"]].forEach(function(o){var g2=x.createRadialGradient(cx+o[0],cy+o[1],0,cx+o[0],cy+o[1],r);g2.addColorStop(0,"rgba("+o[2]+",.55)");g2.addColorStop(.7,"rgba("+o[2]+",.12)");g2.addColorStop(1,"rgba("+o[2]+",0)");x.fillStyle=g2;x.fillRect(0,0,W,H)});x.globalCompositeOperation="source-over";
  x.strokeStyle="rgba(255,200,170,.12)";for(var i=1;i<6;i++){x.beginPath();x.arc(cx,cy,r*i*.3,0,6.2832);x.stroke()}},
 halftone:function(t){x.fillStyle="#170a2e";x.fillRect(0,0,W,H);var m=26*D,i,j;for(i=0;i<W+m;i+=m)for(j=0;j<H+m;j+=m){var xx=i+(((j/m)|0)%2?m/2:0),d=Math.hypot(xx-mx*W,j-my*H),w=.5+.5*Math.sin(xx*.006/D+j*.004/D+t/900-d*.004/D),r=(2+w*9)*D*(1-Math.min(.6,d/(W*1.4)));x.fillStyle=((i/m+(j/m|0))%3===0)?"rgba(255,61,154,.8)":((i/m|0)%4===1?"rgba(255,225,74,.55)":"rgba(120,70,230,.7)");x.beginPath();x.arc(xx,j,Math.max(.5,r),0,6.2832);x.fill()}},
 surveil:function(t){x.fillStyle="#050405";x.fillRect(0,0,W,H);x.strokeStyle="rgba(255,42,60,.1)";var m=40*D;x.beginPath();for(var i=0;i<W;i+=m){x.moveTo(i,0);x.lineTo(i,H)}for(var j=0;j<H;j+=m){x.moveTo(0,j);x.lineTo(W,j)}x.stroke();
  var by=((t/9)%(H+200*D))-100*D;var g=x.createLinearGradient(0,by-80*D,0,by+80*D);g.addColorStop(0,"rgba(255,42,60,0)");g.addColorStop(.5,"rgba(255,42,60,.18)");g.addColorStop(1,"rgba(255,42,60,0)");x.fillStyle=g;x.fillRect(0,by-80*D,W,160*D);
  x.font=(11*D)+"px 'IBM Plex Mono',monospace";S.b.forEach(function(b,i){b.x+=b.vx;b.y+=b.vy;if(b.x<0||b.x>W-b.w)b.vx*=-1;if(b.y<0||b.y>H-b.h)b.vy*=-1;x.strokeStyle="rgba(255,42,60,.45)";x.lineWidth=1.5*D;x.strokeRect(b.x,b.y,b.w,b.h);x.fillStyle="rgba(255,42,60,.7)";x.fillText("SUBJECT "+(i+1)+" / NO CONSENT",b.x+4*D,b.y-6*D)});
  var px=pxy.x*D,py=pxy.y*D;if(px>0){x.strokeStyle="#ff2a3c";x.lineWidth=2*D;x.beginPath();x.arc(px,py,26*D,0,6.2832);x.moveTo(px-40*D,py);x.lineTo(px-14*D,py);x.moveTo(px+14*D,py);x.lineTo(px+40*D,py);x.moveTo(px,py-40*D);x.lineTo(px,py-14*D);x.moveTo(px,py+14*D);x.lineTo(px,py+40*D);x.stroke();x.fillStyle="#ff2a3c";x.fillText("TRACKING  UNREGISTERED",px+32*D,py+46*D)}}
 };
 var fr=F[world]||F.aurora,t0=0;
 function loop(t){fr(t);if(!RM)requestAnimationFrame(loop)}
 requestAnimationFrame(loop);
}
/* video overview poster: soft moving light in the page's accent */
document.querySelectorAll(".vid").forEach(function(v){
 var scr=v.querySelector(".scr"),c=v.querySelector("canvas"),yt=v.dataset.yt,cs=getComputedStyle(document.documentElement);
 if(c){var q=c.getContext("2d"),a1=(cs.getPropertyValue("--acc")||"#fc0").trim(),a2=(cs.getPropertyValue("--accl")||"#fff").trim(),bg=(cs.getPropertyValue("--stage")||"#0b1030").trim();
  function pf(t){var w=c.width=c.clientWidth||640,h=c.clientHeight||360;c.height=h;q.fillStyle=bg;q.fillRect(0,0,w,h);
   [[a1,.0,.9],[a2,2.1,.6]].forEach(function(o,i){var px=w*(.5+.28*Math.sin(t/2400+o[1])),py=h*(.5+.22*Math.cos(t/2900+o[1])),r=h*(.9-i*.2),g=q.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,o[0]);g.addColorStop(1,"rgba(0,0,0,0)");q.globalAlpha=.42;q.fillStyle=g;q.fillRect(0,0,w,h)});q.globalAlpha=1;
   if(!RM)requestAnimationFrame(pf)}requestAnimationFrame(pf);}
 scr.addEventListener("click",function(){
  if(yt){scr.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+yt+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Video overview"></iframe>';}
  else v.classList.toggle("say");});
 scr.setAttribute("tabindex","0");scr.setAttribute("role","button");scr.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();scr.click()}});
});
/* GOLIATH interference */
if(!RM){var heavy=world==="surveil";var gl=document.createElement("canvas");gl.id="gl";gl.setAttribute("aria-hidden","true");document.body.appendChild(gl);
 var chip=document.createElement("div");chip.className="gchip";chip.setAttribute("aria-hidden","true");chip.textContent="THE GRID // signal interference";document.body.appendChild(chip);
 var g=gl.getContext("2d");function gs(){gl.width=innerWidth;gl.height=innerHeight}gs();addEventListener("resize",gs);
 function burst(){var n=0,dur=7+Math.floor(Math.random()*(heavy?14:7));document.body.classList.add("gx");
  var tg=[].slice.call(document.querySelectorAll(".sheet,.card,.vid,.stage,.glass"));var pick=tg[Math.floor(Math.random()*tg.length)];if(pick){pick.classList.add("gj");setTimeout(function(){pick.classList.remove("gj")},350)}
  (function f(){g.clearRect(0,0,gl.width,gl.height);n++;
   if(n<dur){g.fillStyle="rgba(255,30,50,.07)";g.fillRect(0,0,gl.width,gl.height);
    for(var i=0;i<5+Math.random()*6;i++){var y=Math.random()*gl.height,h=2+Math.random()*26;g.fillStyle=Math.random()<.5?"rgba(255,42,60,.28)":"rgba(0,229,255,.2)";g.fillRect(Math.random()*40-20,y,gl.width,h)}
    for(var k=0;k<60;k++){g.fillStyle="rgba(255,255,255,"+Math.random()*.35+")";g.fillRect(Math.random()*gl.width,Math.random()*gl.height,Math.random()*60+4,1)}
    requestAnimationFrame(f)}else{g.clearRect(0,0,gl.width,gl.height);document.body.classList.remove("gx");}})();
  setTimeout(burst,(heavy?2500:5000)+Math.random()*(heavy?3000:7000))}
 setTimeout(burst,2500);}
})();

/* Fit long titles: shrink h1.title until no single word is wider than its box, so words never split mid-word. */
(function(){
var h=document.querySelector("h1.title");if(!h)return;
function fit(){h.style.fontSize="";var t=h.firstChild;if(!t||t.nodeType!==3)return;
 var s=t.textContent,base=parseFloat(getComputedStyle(h).fontSize),f=base,n=0;
 function widest(){var m=0,i=0,parts=s.split(/(\s+)/);for(var k=0;k<parts.length;k++){var w=parts[k];if(w.trim()){var r=document.createRange();r.setStart(t,i);r.setEnd(t,i+w.length);var b=r.getBoundingClientRect();if(b.width>m)m=b.width}i+=w.length}return m}
 var cs=getComputedStyle(h),box=Math.min(h.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),document.documentElement.clientWidth-h.getBoundingClientRect().left-16);
 while(widest()>box&&n<40){f*=.95;h.style.fontSize=f+"px";n++}}
var to;function go(){clearTimeout(to);to=setTimeout(fit,60)}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);fit();addEventListener("resize",go);
})();
