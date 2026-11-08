/* fiesta.js — confeti + globos reventables al terminar un examen.
   Sin dependencias. Llama window.fiesta() para lanzar la celebración.
   Los globos se revientan al dar clic y sueltan confeti desde su interior. */
(function(){
  "use strict";
  const COLORS = ["#ff5fa2","#1aa6b7","#ffb020","#2ecc71","#7c3aed","#ff5a5a","#2b6cff"];
  let canvas, ctx, parts = [], raf = 0, styled = false;

  function injectCSS(){
    if(styled) return; styled = true;
    const css = `
    .fiesta-globo{position:fixed;bottom:-130px;width:48px;height:60px;border:0;padding:0;cursor:pointer;
      border-radius:50% 50% 50% 50%/55% 55% 45% 45%;z-index:9998;
      background:radial-gradient(circle at 32% 28%, rgba(255,255,255,.75), var(--c) 46%);
      box-shadow:inset -5px -7px rgba(0,0,0,.14);
      animation:fiesta-sube var(--dur,12s) linear forwards}
    .fiesta-globo::after{content:"";position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
      border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid var(--c)}
    .fiesta-globo .hilo{position:absolute;top:100%;left:50%;width:1px;height:44px;background:rgba(0,0,0,.22)}
    .fiesta-globo:active{transform:scale(.92)}
    @keyframes fiesta-sube{from{transform:translateY(0)}to{transform:translateY(calc(-100vh - 200px))}}
    @media (prefers-reduced-motion:reduce){.fiesta-globo{animation-duration:20s}}`;
    const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);
  }

  function ensureCanvas(){
    if(canvas) return;
    canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize(); addEventListener("resize", resize);
  }
  function resize(){ if(canvas){ canvas.width = innerWidth; canvas.height = innerHeight; } }

  function emit(x, y, n){
    for(let i=0;i<n;i++){
      const a = Math.random()*Math.PI*2, sp = 3 + Math.random()*8;
      parts.push({ x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp - 4,
        g:0.14 + Math.random()*0.12, s:6 + Math.random()*6,
        rot:Math.random()*6.28, vr:(Math.random()-0.5)*0.4,
        c:COLORS[(Math.random()*COLORS.length)|0], life:0, max:90 + Math.random()*50 });
    }
    if(!raf) loop();
  }

  function loop(){
    raf = requestAnimationFrame(loop);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts = parts.filter(p=>p.life < p.max && p.y < canvas.height + 40);
    for(const p of parts){
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr; p.life++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life/p.max);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.6);
      ctx.restore();
    }
    if(parts.length === 0){ cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0,0,canvas.width,canvas.height); }
  }

  function pop(b){
    const r = b.getBoundingClientRect();
    emit(r.left + r.width/2, r.top + r.height/2, 45);  // confeti desde el interior del globo
    b.remove();
  }
  function balloon(x, color){
    const b = document.createElement("button");
    b.className = "fiesta-globo";
    b.setAttribute("aria-label", "Globo: toca para reventar");
    b.title = "¡Reviéntame!";
    b.style.setProperty("--c", color);
    b.style.setProperty("--dur", (10 + Math.random()*6) + "s");
    b.style.left = x + "px";
    b.innerHTML = '<span class="hilo"></span>';
    b.addEventListener("click", ()=>pop(b));
    b.addEventListener("animationend", ()=>b.remove());
    document.body.appendChild(b);
  }

  window.fiesta = function(){
    injectCSS(); ensureCanvas();
    // ráfaga de confeti
    emit(innerWidth/2,  innerHeight*0.28, 130);
    emit(innerWidth*0.15, innerHeight*0.32, 55);
    emit(innerWidth*0.85, innerHeight*0.32, 55);
    // globos que suben (clic = reventar)
    for(let i=0;i<7;i++){
      balloon(16 + Math.random()*(innerWidth-80), COLORS[(Math.random()*COLORS.length)|0]);
    }
  };
})();
