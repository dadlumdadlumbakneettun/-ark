function getGameImagePath(g){if(g.img)return g.img;if(g.image)return g.image;if(g.steamId&&!isNaN(g.steamId))return `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steamId}/header.jpg`;return `https://via.placeholder.com/280x130/1a0229/FFD700?text=${encodeURIComponent(g.name)}`;}


function getFilteredChillGames(){
  if(!window.chillTagsExcluded||window.chillTagsExcluded.size===0)return chillGames;
  return chillGames.filter(g=>{
    if(!g.tags||g.tags.length===0)return true;
    return !g.tags.some(t=>window.chillTagsExcluded.has(t));
  });
}
window.getFilteredChillGames=getFilteredChillGames;

function renderTagGrid(){
  const grid=document.getElementById('tagGrid');
  if(!grid)return;
  const allTags=new Set();
  chillGames.forEach(g=>{if(g.tags)g.tags.forEach(t=>allTags.add(t));});
  grid.innerHTML='';
  allTags.forEach(tag=>{
    const excluded=window.chillTagsExcluded&&window.chillTagsExcluded.has(tag);
    const count=chillGames.filter(g=>g.tags&&g.tags.includes(tag)).length;
    const btn=document.createElement('button');
    btn.style.cssText=`padding:14px 22px;border-radius:30px;font-size:1rem;font-family:'Roboto',sans-serif;font-weight:bold;cursor:pointer;border:3px solid ${excluded?'#ff0055':'#ff66b2'};background:${excluded?'rgba(80,0,30,0.8)':'rgba(255,102,178,0.15)'};color:${excluded?'#ff4488':'#ffbbdd'};position:relative;transition:0.2s;min-width:110px;overflow:hidden;`;
    btn.innerHTML=`<span style="display:block;">${tag}</span><small style="font-size:0.7rem;opacity:0.7;">${count} oyun</small>${excluded?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(80,0,30,0.65);font-size:2rem;color:#ff2255;pointer-events:none;">✕</div>`:''}`;
    btn.onclick=()=>{
      if(!window.chillTagsExcluded)window.chillTagsExcluded=new Set();
      if(window.chillTagsExcluded.has(tag))window.chillTagsExcluded.delete(tag);
      else window.chillTagsExcluded.add(tag);
      renderTagGrid();
    };
    grid.appendChild(btn);
  });
}

window.openTagsUI=function(){
  document.exitPointerLock();
  if(activeModal)document.getElementById(activeModal).style.display='none';
  activeModal='tagsUI';
  document.getElementById('tagsUI').style.display='flex';
  renderTagGrid();
}
window.closeTagsUI=function(){
  document.getElementById('tagsUI').style.display='none';
  activeModal=null;
  
  if(window.updateChillWallScreen){
    window.chillWallListData=window.getFilteredChillGames();
    if(window.chillWallMode==='list')window.updateChillWallScreen();
  }
  
  if(typeof createRouletteTexture==='function'&&typeof chillWheelMesh!=='undefined'&&chillWheelMesh){
    const newTex=createRouletteTexture(window.getFilteredChillGames(),true);
    chillWheelMesh.material[1].map=newTex;
    chillWheelMesh.material[1].needsUpdate=true;
  }
}
window.applyFilters=function(){function getRadioValue(name){const els=document.getElementsByName(name);for(let r of els)if(r.checked)return r.value;return 'all';}const anomOpt=getRadioValue('opt_anomaly'),japOpt=getRadioValue('opt_japan'),demOpt=getRadioValue('opt_demo'),favOpt=getRadioValue('opt_fav');const selectedTimes=Array.from(document.querySelectorAll('input[name="opt_time"]:checked')).map(cb=>cb.value);let filtered=allGames.filter(g=>{let durStr=g.playtime.toLowerCase();let maxVal=0;let matches=durStr.match(/[\d\.]+/g);if(matches){maxVal=Math.max(...matches.map(n=>parseFloat(n)));if(durStr.includes('dakika')&&maxVal>10)maxVal=maxVal/60;}if(durStr.includes('sonsuz'))maxVal=999;let isAnom=g.type.includes('anomali'),isJap=g.type.includes('japon'),isDem=g.type.includes('demo');if(favOpt==='only'&&!favoriteGames.includes(g.name))return false;if(anomOpt==='exclude'&&isAnom)return false;if(japOpt==='exclude'&&isJap)return false;if(demOpt==='exclude'&&isDem)return false;if(selectedTimes.length>0){let match=false;if(selectedTimes.includes('short')&&maxVal<1)match=true;if(selectedTimes.includes('medium')&&maxVal>=1&&maxVal<=2)match=true;if(selectedTimes.includes('long')&&maxVal>2)match=true;if(!match)return false;}return true;});const activeOnlyFilters=[];if(anomOpt==='only')activeOnlyFilters.push('anomaly');if(japOpt==='only')activeOnlyFilters.push('japan');if(demOpt==='only')activeOnlyFilters.push('demo');if(activeOnlyFilters.length>0){filtered=filtered.filter(g=>{let isAnom=g.type.includes('anomali'),isJap=g.type.includes('japon'),isDem=g.type.includes('demo');let match=false;if(activeOnlyFilters.includes('anomaly')&&isAnom)match=true;if(activeOnlyFilters.includes('japan')&&isJap)match=true;if(activeOnlyFilters.includes('demo')&&isDem)match=true;return match;});}gameList=filtered.length>0?filtered:[{name:'OYUN KALMADI',type:'error'}];};
function startNarrative(){document.getElementById('narrative-screen').style.display='block';showDialogue('start');}
function showDialogue(nodeKey){document.removeEventListener('click',advanceDialogue);currentNextNode=null;const node=dialogueTree[nodeKey];const npcImg=document.getElementById('npc-character');if(nodeKey==='alone'||nodeKey==='stream_yes'||nodeKey==='enter')npcImg.src='code/mutluadam.png';else if(nodeKey==='not_alone'||nodeKey==='stream_no')npcImg.src='code/uzgunadam.png';else npcImg.src='code/adam.png';document.getElementById('npcText').innerHTML=node.text||"";const opts=document.getElementById('playerOptions');opts.innerHTML='';const hint=document.getElementById('click-hint');hint.style.display='none';if(node.choices&&node.choices.length>0){node.choices.forEach(choice=>{const btn=document.createElement('button');btn.className='option-btn';btn.innerText=choice.label;btn.onclick=(e)=>{e.stopPropagation();showDialogue(choice.next);};opts.appendChild(btn);});}else if(node.next){hint.style.display='block';currentNextNode=node.next;setTimeout(()=>{document.addEventListener('click',advanceDialogue,{once:true});},100);}else if(node.action){node.action();}}
function advanceDialogue(){if(currentNextNode){showDialogue(currentNextNode);}}
window.openModal=function(id){document.exitPointerLock();if(activeModal)document.getElementById(activeModal).style.display='none';activeModal=id;document.getElementById(id).style.display='flex';}
window.closeModal=function(id){document.getElementById(id).style.display='none';activeModal=null;}
function showList(title,dataArray){document.getElementById('listTitle').innerText=title;const grid=document.getElementById('listGrid');grid.innerHTML='';dataArray.forEach(g=>{let heartHtml=favoriteGames.includes(g.name)?'<img class="heart-overlay" src="code/kalp.png" onerror="this.style.display=\'none\'">':'';let flagHtml=g.overlayIcon?`<img src="${g.overlayIcon}" class="overlay-icon" onerror="this.style.display=\'none\'">`:'';grid.innerHTML+=`<div class="game-item">${flagHtml}${heartHtml}<img src="${getGameImagePath(g)}" class="game-thumb" onerror="this.src='https://via.placeholder.com/280x130/1a0229/FFD700?text=Resim'"><div class="game-name">${g.name}</div></div>`;});openModal('listUI');}
function showScreenMessage(text){const msg=document.getElementById('screenMessage');msg.innerText=text;msg.style.opacity=1;setTimeout(()=>{msg.style.opacity=0;},3000);}
function initBlackjack(){document.getElementById('bjMessage').style.display='none';document.getElementById('bjRestart').style.display='none';document.getElementById('bjHit').disabled=false;document.getElementById('bjStand').disabled=false;deck=[];const suits=['♥','♦','♣','♠'];const values=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];for(let s of suits){for(let v of values){let weight=parseInt(v);if(v==='J'||v==='Q'||v==='K')weight=10;if(v==='A')weight=11;deck.push({v:v,s:s,w:weight,color:(s==='♥'||s==='♦')?'red':'black'});}}deck.sort(()=>Math.random()-0.5);playerHand=[deck.pop(),deck.pop()];dealerHand=[deck.pop(),deck.pop()];bjGameOver=false;renderBlackjack();}
function calcScore(hand){let score=0,aces=0;hand.forEach(c=>{score+=c.w;if(c.v==='A')aces++;});while(score>21&&aces>0){score-=10;aces--;}return score;}
function renderBlackjack(){const pDiv=document.getElementById('playerHand');pDiv.innerHTML='';playerHand.forEach(c=>pDiv.innerHTML+=`<div class="bj-card ${c.color}">${c.v}${c.s}</div>`);document.getElementById('playerScore').innerText=`Puan: ${calcScore(playerHand)}`;const dDiv=document.getElementById('dealerHand');dDiv.innerHTML='';if(bjGameOver){dealerHand.forEach(c=>dDiv.innerHTML+=`<div class="bj-card ${c.color}">${c.v}${c.s}</div>`);document.getElementById('dealerScore').innerText=`Puan: ${calcScore(dealerHand)}`;}else{dDiv.innerHTML=`<div class="bj-card ${dealerHand[0].color}">${dealerHand[0].v}${dealerHand[0].s}</div><div class="bj-card" style="background:#555;">?</div>`;document.getElementById('dealerScore').innerText=`Puan: ?`;}}
window.bjHit=function(){if(bjGameOver)return;playerHand.push(deck.pop());renderBlackjack();if(calcScore(playerHand)>21)endBlackjack("Bust! Kaybettin.");}
window.bjStand=function(){if(bjGameOver)return;while(calcScore(dealerHand)<17)dealerHand.push(deck.pop());let p=calcScore(playerHand),d=calcScore(dealerHand);if(d>21||p>d)endBlackjack("KAZANDIN!");else if(p===d)endBlackjack("Berabere.");else endBlackjack("Kasa Kazandı.");}
function endBlackjack(msg){bjGameOver=true;renderBlackjack();document.getElementById('bjHit').disabled=true;document.getElementById('bjStand').disabled=true;document.getElementById('bjRestart').style.display='inline-block';const mDiv=document.getElementById('bjMessage');mDiv.innerText=msg;mDiv.style.display='block';if(msg==="KAZANDIN!"){hasWonBlackjack=true;mDiv.innerHTML+="<br><span style='font-size:18px;color:#FFD700;'>Zar Masası Kilidi Açıldı!</span>";}}

window.openPickerUI = function() {
    document.exitPointerLock();
    if(activeModal) document.getElementById(activeModal).style.display='none';
    activeModal = 'pickerUI';
    document.getElementById('pickerUI').style.display = 'flex';
    renderPickerUI();
};

window.closePickerUI = function() {
    document.getElementById('pickerUI').style.display = 'none';
    activeModal = null;
};

function renderPickerUI() {
    const horrorGrid = document.getElementById('pickerHorrorGrid');
    const chillGrid = document.getElementById('pickerChillGrid');
    if (!horrorGrid || !chillGrid) return;

    const horrorBadge = document.getElementById('pickerHorrorBadge');
    const chillBadge = document.getElementById('pickerChillBadge');

    horrorGrid.innerHTML = '';
    (typeof gameList !== 'undefined' ? gameList : []).forEach(g => {
        if (!g || g.type === 'error') return;
        const isSelected = window.forcedHorrorGame && window.forcedHorrorGame.name === g.name;
        const card = document.createElement('div');
        card.style.cssText = `position:relative;width:160px;cursor:pointer;border:3px solid ${isSelected ? '#ff2222' : '#330000'};border-radius:8px;overflow:hidden;transition:0.2s;background:#0a0000;flex-shrink:0;`;
        card.innerHTML = `
            <img src="${getGameImagePath(g)}" style="width:100%;height:75px;object-fit:cover;display:block;" onerror="this.src='https://via.placeholder.com/160x75/1a0000/ff2222?text=?'">
            <div style="padding:6px 8px;font-size:0.72rem;font-family:'Roboto',sans-serif;font-weight:bold;color:${isSelected ? '#ff4444' : '#ccaaaa'};text-transform:uppercase;line-height:1.2;">${g.name}</div>
            ${isSelected ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(180,0,0,0.45);font-size:3rem;color:#ff2222;pointer-events:none;">✓</div>` : ''}
        `;
        card.onmouseenter = () => { card.style.transform = 'scale(1.05)'; card.style.borderColor = '#ff4444'; };
        card.onmouseleave = () => { card.style.transform = ''; card.style.borderColor = isSelected ? '#ff2222' : '#330000'; };
        card.onclick = () => {
            window.forcedHorrorGame = isSelected ? null : g;
            if (horrorBadge) horrorBadge.textContent = window.forcedHorrorGame ? `✓ ${window.forcedHorrorGame.name}` : 'Seçilmedi';
            renderPickerUI();
        };
        horrorGrid.appendChild(card);
    });

    chillGrid.innerHTML = '';
    const chillList = window.getFilteredChillGames ? window.getFilteredChillGames() : (typeof chillGames !== 'undefined' ? chillGames : []);
    chillList.forEach(g => {
        if (!g) return;
        const isSelected = window.forcedChillGame && window.forcedChillGame.name === g.name;
        const card = document.createElement('div');
        card.style.cssText = `position:relative;width:160px;cursor:pointer;border:3px solid ${isSelected ? '#ff66b2' : '#1a0029'};border-radius:8px;overflow:hidden;transition:0.2s;background:#0a0015;flex-shrink:0;`;
        card.innerHTML = `
            <img src="${getGameImagePath(g)}" style="width:100%;height:75px;object-fit:cover;display:block;" onerror="this.src='https://via.placeholder.com/160x75/1a0029/ff66b2?text=?'">
            <div style="padding:6px 8px;font-size:0.72rem;font-family:'Roboto',sans-serif;font-weight:bold;color:${isSelected ? '#ff88cc' : '#cc99bb'};text-transform:uppercase;line-height:1.2;">${g.name}</div>
            ${isSelected ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(150,0,80,0.45);font-size:3rem;color:#ff66b2;pointer-events:none;">✓</div>` : ''}
        `;
        card.onmouseenter = () => { card.style.transform = 'scale(1.05)'; card.style.borderColor = '#ff66b2'; };
        card.onmouseleave = () => { card.style.transform = ''; card.style.borderColor = isSelected ? '#ff66b2' : '#1a0029'; };
        card.onclick = () => {
            window.forcedChillGame = isSelected ? null : g;
            if (chillBadge) chillBadge.textContent = window.forcedChillGame ? `✓ ${window.forcedChillGame.name}` : 'Seçilmedi';
            renderPickerUI();
        };
        chillGrid.appendChild(card);
    });

    if (horrorBadge) horrorBadge.textContent = window.forcedHorrorGame ? `✓ ${window.forcedHorrorGame.name}` : 'Seçilmedi';
    if (chillBadge) chillBadge.textContent = window.forcedChillGame ? `✓ ${window.forcedChillGame.name}` : 'Seçilmedi';
}
