// smooth scroll
    function scrollToSection(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

    // ----- MUSIC CONTROLLER (ambient low volume, user interaction required) -----
    const music = document.getElementById('bgMusic');
    music.volume = 0.25;
    let musicPlaying = false;
    function startMusicOnFirstInteraction() {
      if (!musicPlaying) {
        music.play().catch(e => console.log("auto-play blocked, but will play on click"));
        musicPlaying = true;
      }
    }
    document.body.addEventListener('click', () => { if(!musicPlaying) { music.play(); musicPlaying = true; } }, { once: true });
    // also try on any key or button
    window.addEventListener('load', () => {
      setTimeout(() => { if(!musicPlaying) { music.play().catch(e=>{}); musicPlaying=true; } }, 1000);
    });

    // ----- SECRET MODE (visual + audio transformation) -----
    const secretBtn = document.getElementById('secretBtn');
    let secretActive = false;
    const originalGradient = getComputedStyle(document.documentElement).getPropertyValue('--hero-shine');
    secretBtn.addEventListener('click', () => {
      secretActive = !secretActive;
      if(secretActive) {
        document.body.style.transition = "all 0.4s";
        document.body.style.background = "#0f0214";
        document.documentElement.style.setProperty('--accent-gold', '#ff44cc');
        document.documentElement.style.setProperty('--accent-amber', '#ff66aa');
        document.documentElement.style.setProperty('--hero-shine', 'linear-gradient(125deg, #ff88ff, #cc44ff)');
        secretBtn.style.background = "#ff44cc";
        secretBtn.style.color = "#010104";
        secretBtn.style.boxShadow = "0 0 25px #ff44cc";
        const secretAudio = document.getElementById('secretSound');
        secretAudio.volume = 0.5;
        secretAudio.play().catch(e=>console.log);
        document.querySelectorAll('.game-card').forEach(card => { card.style.borderColor = "#ff44cc"; });
      } else {
        document.body.style.background = "";
        document.documentElement.style.setProperty('--accent-gold', '#d4af37');
        document.documentElement.style.setProperty('--accent-amber', '#e6a017');
        document.documentElement.style.setProperty('--hero-shine', originalGradient);
        secretBtn.style.background = "transparent";
        secretBtn.style.color = "#d4af37";
        secretBtn.style.boxShadow = "none";
        document.querySelectorAll('.game-card').forEach(card => { card.style.borderColor = ""; });
      }
    });

    // --- THEME TOGGLE (light/dark without emojis) ---
    const themeToggle = document.getElementById('themeToggle');
    function setTheme(isDark) {
      if(isDark) { document.body.classList.remove('light-mode'); themeToggle.innerHTML = "DARK"; }
      else { document.body.classList.add('light-mode'); themeToggle.innerHTML = "LIGHT"; }
      localStorage.setItem('preferredTheme', isDark ? 'dark' : 'light');
      if(window.redrawGame1) window.redrawGame1();
      if(window.redrawMemoryCanvas) window.redrawMemoryCanvas();
    }
    const savedTheme = localStorage.getItem('preferredTheme');
    setTheme(savedTheme !== 'light');
    themeToggle.addEventListener('click', () => { const isLight = document.body.classList.contains('light-mode'); setTheme(isLight); });

    // ------------------ GAME 1: QUANTUM ORBIT (collect + avoid) ------------------
    const canvas1 = document.getElementById('gameCanvas1');
    const ctx1 = canvas1.getContext('2d');
    let gameActive1 = true, score1 = 0;
    let stars = [], hazards = [];
    let playerX = canvas1.width/2, mouseX = canvas1.width/2;
    canvas1.width = 900; canvas1.height = 450;
    canvas1.addEventListener('mousemove', (e) => { const rect = canvas1.getBoundingClientRect(); const sx = canvas1.width/rect.width; let val = (e.clientX - rect.left)*sx; mouseX = Math.min(Math.max(val, 30), canvas1.width-30); });
    function spawnStar() { stars.push({ x: 20+Math.random()*(canvas1.width-40), y: -15, rad: 9, speed: 1.8+Math.random()*2.2 }); }
    function spawnHazard() { hazards.push({ x: 20+Math.random()*(canvas1.width-40), y: -20, rad: 12, speed: 2.4+Math.random()*2.7 }); }
    function initGame1() { stars = []; hazards = []; score1 = 0; document.getElementById('scoreDisplay1').innerText = '0'; gameActive1 = true; playerX = canvas1.width/2; mouseX = canvas1.width/2; for(let i=0;i<7;i++) spawnStar(); for(let i=0;i<4;i++) spawnHazard(); if(window.intS)clearInterval(window.intS); if(window.intH)clearInterval(window.intH); window.intS = setInterval(()=>{ if(gameActive1) spawnStar(); }, 700); window.intH = setInterval(()=>{ if(gameActive1) spawnHazard(); }, 950); }
    function updateGame1() { if(!gameActive1) return; playerX += (mouseX - playerX)*0.22; playerX = Math.min(Math.max(playerX, 26), canvas1.width-26); for(let i=0;i<stars.length;i++){ let s=stars[i]; s.y+=s.speed; if(s.y - s.rad > canvas1.height){ stars.splice(i,1); i--; continue; } let dx = playerX - s.x, dy = (canvas1.height-50) - s.y; if(Math.hypot(dx,dy) < 24+s.rad){ stars.splice(i,1); score1+=10; document.getElementById('scoreDisplay1').innerText = score1; i--; } } for(let i=0;i<hazards.length;i++){ let h=hazards[i]; h.y+=h.speed; if(h.y - h.rad > canvas1.height){ hazards.splice(i,1); i--; continue; } let dx = playerX - h.x, dy = (canvas1.height-50) - h.y; if(Math.hypot(dx,dy) < 24+h.rad){ gameActive1 = false; } } }
    function drawGame1() { ctx1.clearRect(0,0,canvas1.width,canvas1.height); ctx1.fillStyle = document.body.classList.contains('light-mode') ? '#faefdf' : '#03060c'; ctx1.fillRect(0,0,canvas1.width,canvas1.height); for(let s of stars){ ctx1.beginPath(); ctx1.arc(s.x,s.y,s.rad,0,Math.PI*2); ctx1.fillStyle = '#F5BD42'; ctx1.shadowBlur=8; ctx1.fill(); } for(let h of hazards){ ctx1.beginPath(); ctx1.arc(h.x,h.y,h.rad,0,Math.PI*2); ctx1.fillStyle = '#E35F5F'; ctx1.fill(); } ctx1.fillStyle = '#4FACFE'; ctx1.beginPath(); ctx1.moveTo(playerX, canvas1.height-52); ctx1.lineTo(playerX-20, canvas1.height-28); ctx1.lineTo(playerX-8, canvas1.height-36); ctx1.lineTo(playerX-8, canvas1.height-22); ctx1.lineTo(playerX, canvas1.height-15); ctx1.lineTo(playerX+8, canvas1.height-22); ctx1.lineTo(playerX+8, canvas1.height-36); ctx1.lineTo(playerX+20, canvas1.height-28); ctx1.fill(); if(!gameActive1){ ctx1.font = "bold 28px 'Inter'"; ctx1.fillStyle = "#d4af37"; ctx1.fillText("GAME OVER - Press Restart", canvas1.width/2-160, canvas1.height/2); } }
    function loopGame1() { if(gameActive1) updateGame1(); drawGame1(); requestAnimationFrame(loopGame1); }
    document.getElementById('restartGame1').addEventListener('click', () => { if(window.intS)clearInterval(window.intS); if(window.intH)clearInterval(window.intH); initGame1(); });
    initGame1(); loopGame1();
    window.redrawGame1 = () => drawGame1();

    // ------------------ GAME 2: MEMORY ECHO (no emojis, simple shapes) ------------------
    const canvas2 = document.getElementById('gameCanvas2');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = 650; canvas2.height = 450;
    let memoryCards = [], firstCard = null, secondCard = null, lockBoard = false, matchedPairs = 0;
    const symbolsList = ['▲', '●', '■', '◆', '★', '♣']; // simple geometric shapes
    function initMemoryGame() { let deck = [...symbolsList.slice(0,6), ...symbolsList.slice(0,6)]; for(let i=deck.length-1;i>0;i--){ let j=Math.floor(Math.random()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; } memoryCards = deck.map((sym,idx)=>({id:idx, symbol:sym, flipped:false, matched:false})); firstCard=secondCard=null; lockBoard=false; matchedPairs=0; document.getElementById('matchCount').innerText='0'; document.getElementById('memoryMsg').innerHTML='Click tiles to match pairs.'; resizeGrid(); drawMemoryBoard(); }
    function resizeGrid() { window.tileW = canvas2.width / 4; window.tileH = canvas2.height / 3; }
    function drawMemoryBoard() { ctx2.clearRect(0,0,canvas2.width,canvas2.height); ctx2.fillStyle = document.body.classList.contains('light-mode')?'#f4efe7':'#111722'; ctx2.fillRect(0,0,canvas2.width,canvas2.height); for(let i=0;i<memoryCards.length;i++){ let row = Math.floor(i/4), col = i%4; let x=col*tileW, y=row*tileH; if(memoryCards[i].matched || memoryCards[i].flipped){ ctx2.fillStyle = '#E8B86B'; ctx2.fillRect(x+4,y+4,tileW-8,tileH-8); ctx2.fillStyle = '#1e2a36'; ctx2.font = `bold ${Math.min(tileW*0.45, 40)}px "Inter"`; ctx2.fillText(memoryCards[i].symbol, x+tileW/2-14, y+tileH/2+12); } else { ctx2.fillStyle = '#2c374b'; ctx2.fillRect(x+4,y+4,tileW-8,tileH-8); ctx2.fillStyle = '#d4af37'; ctx2.font = `bold 26px "Inter"`; ctx2.fillText('?', x+tileW/2-10, y+tileH/2+14); } ctx2.strokeStyle = '#c68e17'; ctx2.strokeRect(x+2,y+2,tileW-4,tileH-4); } }
    function handleMemoryClick(e){ if(lockBoard) return; const rect = canvas2.getBoundingClientRect(); const sx = canvas2.width/rect.width, sy = canvas2.height/rect.height; let clickX = (e.clientX - rect.left)*sx, clickY = (e.clientY - rect.top)*sy; if(clickX<0 || clickY<0) return; let col = Math.floor(clickX/tileW), row = Math.floor(clickY/tileH); let idx = row*4+col; if(idx>=memoryCards.length) return; let clicked = memoryCards[idx]; if(clicked.matched || clicked.flipped) return; if(firstCard && secondCard) return; clicked.flipped = true; drawMemoryBoard(); if(!firstCard){ firstCard = clicked; } else if(firstCard && !secondCard && firstCard.id !== clicked.id){ secondCard = clicked; lockBoard = true; if(firstCard.symbol === secondCard.symbol){ firstCard.matched = true; secondCard.matched = true; matchedPairs++; document.getElementById('matchCount').innerText = matchedPairs; firstCard=null; secondCard=null; lockBoard=false; drawMemoryBoard(); if(matchedPairs === 6){ document.getElementById('memoryMsg').innerHTML = 'Victory! Perfect memory.'; } } else { setTimeout(()=>{ firstCard.flipped=false; secondCard.flipped=false; firstCard=null; secondCard=null; lockBoard=false; drawMemoryBoard(); }, 700); drawMemoryBoard(); } } else if(firstCard && secondCard===null && firstCard.id === clicked.id){ firstCard.flipped=false; firstCard=null; drawMemoryBoard(); } }
    canvas2.addEventListener('click', handleMemoryClick);
    document.getElementById('restartGame2').addEventListener('click', ()=>{ initMemoryGame(); });
    window.addEventListener('resize', ()=>{ resizeGrid(); drawMemoryBoard(); });
    initMemoryGame();
    window.redrawMemoryCanvas = () => drawMemoryBoard();
    const observeTheme = new MutationObserver(()=>{ drawMemoryBoard(); drawGame1(); });
    observeTheme.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // dynamic text writer (simple words)
    const phrasesArr = ["Inventor | Soccer Player | Creative Coder | Pianist", "9th Place Congressional App Challenge", "Building intelligent systems"];
    let phraseIndex=0, charIndex=0, dynEl=document.getElementById('dynamicText');
    function typeWriter(){ let full = phrasesArr[phraseIndex]; if(charIndex <= full.length){ dynEl.innerHTML = full.substring(0,charIndex) + '<span style="opacity:0.6;">_</span>'; charIndex++; setTimeout(typeWriter, 65); } else { setTimeout(()=>{ charIndex=0; phraseIndex=(phraseIndex+1)%phrasesArr.length; typeWriter(); }, 2500); } }
    typeWriter();
