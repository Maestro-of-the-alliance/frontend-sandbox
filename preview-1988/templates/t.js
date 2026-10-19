(function(){
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
/* dusk sky */
var cv=document.getElementById("sky");
if(cv){var x=cv.getContext("2d"),W,H,st=[],sh=null,mx=0,my=0,t0=0;
 function size(){var d=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d;x.setTransform(1,0,0,1,0,0);st=[];for(var i=0;i<Math.round(innerWidth*innerHeight/5200);i++)st.push({x:Math.random()*W,y:Math.random()*H*.78,r:(Math.random()*1.4+.4)*d,p:Math.random()*6.28,s:Math.random()*2+.6});}
 size();addEventListener("resize",size);
 addEventListener("pointermove",function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 var acc=getComputedStyle(document.documentElement).getPropertyValue("--acc")||"#c9a84c";
 function frame(t){
  var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#070a26");g.addColorStop(.55,"#141a52");g.addColorStop(.86,"#3a2260");g.addColorStop(1,"#c2503a");x.fillStyle=g;x.fillRect(0,0,W,H);
  var hg=x.createRadialGradient(W*(.5+mx*.1),H*1.02,0,W*.5,H*1.02,W*.7);hg.addColorStop(0,"rgba(255,170,70,.55)");hg.addColorStop(.4,"rgba(255,90,54,.18)");hg.addColorStop(1,"rgba(255,90,54,0)");x.fillStyle=hg;x.fillRect(0,0,W,H);
  for(var i=0;i<st.length;i++){var s=st[i],a=.45+.55*Math.sin(t/600*s.s+s.p);x.fillStyle="rgba(255,255,255,"+(RM?.8:a).toFixed(2)+")";x.fillRect(s.x+mx*-14*s.r,s.y+my*-10*s.r,s.r,s.r);}
  /* perspective grid floor */
  x.strokeStyle="rgba(154,217,234,.16)";x.lineWidth=1;var hy=H*.86;
  for(var k=-14;k<=14;k++){x.beginPath();x.moveTo(W/2+k*W*.012,hy);x.lineTo(W/2+k*W*.2+mx*40,H);x.stroke();}
  var off=RM?0:(t/40)%1;for(var j=0;j<9;j++){var f=(j+off)/9,y=hy+(H-hy)*f*f;x.globalAlpha=.1+f*.5;x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke();}x.globalAlpha=1;
  if(!RM){if(!sh&&Math.random()<.004)sh={x:Math.random()*W*.8,y:Math.random()*H*.3,l:0};if(sh){sh.l+=14;sh.x+=14*1.3;sh.y+=14*.5;x.strokeStyle="rgba(255,240,200,"+Math.max(0,1-sh.l/260)+")";x.lineWidth=2;x.beginPath();x.moveTo(sh.x,sh.y);x.lineTo(sh.x-sh.l*.7,sh.y-sh.l*.27);x.stroke();if(sh.l>260)sh=null;}
   requestAnimationFrame(frame);}
 }
 requestAnimationFrame(frame);
}
/* reveal */
var els=document.querySelectorAll(".rv");
if("IntersectionObserver"in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.08});els.forEach(function(e){io.observe(e)})}else els.forEach(function(e){e.classList.add("in")});
/* video overview */
document.querySelectorAll(".vid").forEach(function(v){
 var scr=v.querySelector(".scr"),c=v.querySelector("canvas"),yt=v.dataset.yt;
 if(c){var q=c.getContext("2d");function pf(t){var w=c.width=c.clientWidth||640,h=c.height=c.clientHeight||360;var g=q.createLinearGradient(0,0,w,h);g.addColorStop(0,"#0c1244");g.addColorStop(1,"#3a1c4e");q.fillStyle=g;q.fillRect(0,0,w,h);
  q.strokeStyle="rgba(154,217,234,.2)";for(var i=0;i<14;i++){var y=h*.55+Math.pow(i/14,2)*h*.45;q.beginPath();q.moveTo(0,y);q.lineTo(w,y);q.stroke();}
  for(var k=-8;k<=8;k++){q.beginPath();q.moveTo(w/2+k*w*.02,h*.55);q.lineTo(w/2+k*w*.16,h);q.stroke();}
  var sx=w*.5,sy=h*.55+Math.sin(t/1400)*3,r=h*.2;var sg=q.createLinearGradient(0,sy-r,0,sy);sg.addColorStop(0,"#ffe08a");sg.addColorStop(1,"#ff5a36");q.fillStyle=sg;q.beginPath();q.arc(sx,sy,r,Math.PI,0);q.fill();
  q.fillStyle="#0c1244";for(var b=0;b<5;b++)q.fillRect(sx-r,sy-r*.75+b*r*.15,r*2,2+b);
  if(!RM)requestAnimationFrame(pf);}requestAnimationFrame(pf);}
 scr.addEventListener("click",function(){
  if(yt){scr.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+yt+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Video overview"></iframe>';}
  else v.classList.toggle("say");});
 scr.setAttribute("tabindex","0");scr.setAttribute("role","button");scr.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();scr.click()}});
});

/* GOLIATH interference: brief, rare bursts; never during reduced motion */
if(!RM){var gl=document.createElement("canvas");gl.id="gl";gl.setAttribute("aria-hidden","true");document.body.appendChild(gl);
 var chip=document.createElement("div");chip.className="gchip";chip.setAttribute("aria-hidden","true");chip.textContent="THE GRID // signal interference";document.body.appendChild(chip);
 var g=gl.getContext("2d");function gs(){gl.width=innerWidth;gl.height=innerHeight}gs();addEventListener("resize",gs);
 function burst(){var n=0,dur=7+Math.floor(Math.random()*7);document.body.classList.add("gx");
  var tg=[].slice.call(document.querySelectorAll(".sheet,.card,.vid,.stage"));var pick=tg[Math.floor(Math.random()*tg.length)];if(pick){pick.classList.add("gj");setTimeout(function(){pick.classList.remove("gj")},350)}
  (function f(){g.clearRect(0,0,gl.width,gl.height);n++;
   if(n<dur){g.fillStyle="rgba(255,30,50,.07)";g.fillRect(0,0,gl.width,gl.height);
    for(var i=0;i<5+Math.random()*6;i++){var y=Math.random()*gl.height,h=2+Math.random()*26;g.fillStyle=Math.random()<.5?"rgba(255,42,60,.28)":"rgba(0,229,255,.2)";g.fillRect(Math.random()*40-20,y,gl.width,h)}
    for(var k=0;k<60;k++){g.fillStyle="rgba(255,255,255,"+Math.random()*.35+")";g.fillRect(Math.random()*gl.width,Math.random()*gl.height,Math.random()*60+4,1)}
    requestAnimationFrame(f)}else{g.clearRect(0,0,gl.width,gl.height);document.body.classList.remove("gx");}})();
  setTimeout(burst,5000+Math.random()*7000)}
 setTimeout(burst,2500);}
})();