(function(){var c=document.getElementById("lbg");if(!c)return;var x=c.getContext("2d"),W,H,D,st=[],mx=.5,my=.5,sh=null,t0=performance.now(),RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
function size(){D=Math.min(devicePixelRatio||1,2);W=c.width=innerWidth*D;H=c.height=innerHeight*D;st=[];for(var i=0;i<Math.round(innerWidth*innerHeight/4200);i++)st.push({x:Math.random()*W,y:Math.random()*H*.7,r:(Math.random()*1.4+.4)*D,p:Math.random()*6.28,s:Math.random()*2+.6})}
size();addEventListener("resize",size);addEventListener("pointermove",function(e){mx=e.clientX/innerWidth;my=e.clientY/innerHeight});
function f(now){var t=now-t0,rise=RM?1:Math.min(1,t/3200),e=1-Math.pow(1-rise,3);
 var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#060a22");g.addColorStop(.42,"#1b1b5c");g.addColorStop(.7,"#7a2c7c");g.addColorStop(.86,"#e0556a");g.addColorStop(1,"#ffb454");x.fillStyle=g;x.fillRect(0,0,W,H);
 var cx=W*(.5+(mx-.5)*.03),cy=H*(.5+.5*(1-e))+ (my-.5)*H*.02,R=Math.min(W,H)*.62;
 x.save();x.translate(cx,cy);x.rotate(t/26000);for(var i=0;i<30;i++){x.rotate(6.2832/30);x.fillStyle="rgba(255,196,90,"+(i%2?.09:.04)+")";x.beginPath();x.moveTo(0,0);x.lineTo(Math.max(W,H),-Math.max(W,H)*.04);x.lineTo(Math.max(W,H),Math.max(W,H)*.04);x.fill()}x.restore();
 var sg=x.createRadialGradient(cx,cy,R*.1,cx,cy,R*1.25);sg.addColorStop(0,"rgba(255,236,170,.95)");sg.addColorStop(.3,"rgba(255,176,70,.55)");sg.addColorStop(.65,"rgba(255,90,90,.2)");sg.addColorStop(1,"rgba(255,90,90,0)");x.fillStyle=sg;x.fillRect(0,0,W,H);
 for(var k=0;k<st.length;k++){var s=st[k],a=(.35+.65*Math.sin(t/650*s.s+s.p))*Math.max(0,1-s.y/(H*.62))*(1-e*.35);x.fillStyle="rgba(255,255,255,"+Math.max(0,a).toFixed(2)+")";x.fillRect(s.x+(mx-.5)*-12*s.r,s.y,s.r,s.r)}
 if(!RM){if(!sh&&Math.random()<.003)sh={x:Math.random()*W*.7,y:Math.random()*H*.25,l:0};if(sh){sh.l+=16*D;sh.x+=16*D*1.3;sh.y+=16*D*.5;x.strokeStyle="rgba(255,244,210,"+Math.max(0,1-sh.l/(260*D))+")";x.lineWidth=2*D;x.beginPath();x.moveTo(sh.x,sh.y);x.lineTo(sh.x-sh.l*.7,sh.y-sh.l*.27);x.stroke();if(sh.l>260*D)sh=null}requestAnimationFrame(f)}}
requestAnimationFrame(f)})();
