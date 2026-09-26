// Güvenli yerel SVG Placeholder oluşturucu (İnternet/CDN kaynaklı çökmeleri önler)
function getDefaultPlaceholder(name) {
  const safeName = (name || 'Oyun').replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="130" viewBox="0 0 280 130">
    <rect width="280" height="130" fill="#181324"/>
    <rect x="2" y="2" width="276" height="126" fill="none" stroke="#ffd700" stroke-width="2" stroke-opacity="0.4" rx="8"/>
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#ffd700" font-family="'Courier New', monospace" font-weight="bold" font-size="16">${safeName.substring(0, 20)}</text>
    <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="#887799" font-family="sans-serif" font-size="11">Görsel Yok</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getGameImagePath(g) {
  if (!g) return getDefaultPlaceholder('Oyun');
  if (g.img && typeof g.img === 'string' && g.img.trim()) return g.img.trim();
  if (g.image && typeof g.image === 'string' && g.image.trim()) return g.image.trim();
  if (g.steamId && !isNaN(g.steamId) && String(g.steamId).trim() !== '') {
    return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${g.steamId}/header.jpg`;
  }
  return getDefaultPlaceholder(g.name);
}

// Oyun süre metinlerini hatasız ayrıştıran fonksiyon
function getGameDurationRange(str) {
  if (!str) return { min: 1.0, max: 2.0 };
  const s = str.toLowerCase().trim();

  if (s.includes('sonsuz')) return { min: 10.0, max: 999.0 };
  if (s.includes('belirtilmedi')) return { min: 2.0, max: 4.0 };
  if (s.includes('demo')) return { min: 0.3, max: 1.0 };

  if (s.includes('30-1') || s.includes('30 - 1') || s.includes('30- 1') || s.includes('30 -1')) {
    return { min: 0.5, max: 1.0 };
  }

  if (s.includes('dakika')) {
    const m = s.match(/\d+/);
    const mins = m ? parseInt(m[0]) : 30;
    return { min: 0.1, max: mins / 60 };
  }

  if (s.includes('1') && s.includes('altı')) return { min: 0.2, max: 0.95 };
  if (s.includes('2') && s.includes('altı')) return { min: 1.0, max: 2.0 };
  if (s.includes('2') && s.includes('üstü')) return { min: 2.1, max: 4.0 };
  if (s.includes('4') && s.includes('üstü')) return { min: 4.1, max: 999.0 };
  if (s === '1 saat' || s === '1 saat.' || s === '1') return { min: 0.8, max: 1.0 };

  const numbers = s.match(/[\d\.]+/g);
  if (numbers && numbers.length >= 2) {
    const n1 = parseFloat(numbers[0]);
    const n2 = parseFloat(numbers[1]);
    return { min: Math.min(n1, n2), max: Math.max(n1, n2) };
  } else if (numbers && numbers.length === 1) {
    const n = parseFloat(numbers[0]);
    if (s.includes('üstü') || s.includes('+')) return { min: n, max: n * 2 };
    if (s.includes('altı') || s.includes('-')) return { min: n * 0.5, max: n };
    return { min: n * 0.8, max: n };
  }

  return { min: 1.0, max: 2.0 };
}

// Buton filtrelerini test eden kontrol fonksiyonu
function matchTimeFilter(game, filterKey) {
  if (!filterKey || filterKey === 'all') return true;
  const timeStr = game.playtime || game.time || '';
  const range = getGameDurationRange(timeStr);

  switch (filterKey) {
    case 'lt1': 
      return range.max <= 1.05;
    case 'gt1': 
      return range.max > 1.05 && range.min <= 2.0 && range.max <= 2.2;
    case 'gt2': 
      return range.min >= 2.0 && range.max <= 4.5;
    case 'gt4': 
      return range.max > 4.5;
    default: 
      return true;
  }
}

// Chill oyunlarını etiketlere ve tabletten seçilen süre filtresine göre getiren fonksiyon
function getFilteredChillGames() {
  let list = (typeof chillGames !== 'undefined') ? chillGames : [];
  if (window.chillTagsExcluded && window.chillTagsExcluded.size > 0) {
    list = list.filter(g => {
      if (!g.tags || g.tags.length === 0) return true;
      return !g.tags.some(t => window.chillTagsExcluded.has(t));
    });
  }
  if (tabletActiveTimeFilter && tabletActiveTimeFilter !== 'all') {
    list = list.filter(g => matchTimeFilter(g, tabletActiveTimeFilter));
  }
  return list;
}
window.getFilteredChillGames = getFilteredChillGames;

function renderTagGrid() {
  const grid = document.getElementById('tagGrid');
  if (!grid) return;
  const allTags = new Set();
  chillGames.forEach(g => { if (g.tags) g.tags.forEach(t => allTags.add(t)); });
  grid.innerHTML = '';
  allTags.forEach(tag => {
    const excluded = window.chillTagsExcluded && window.chillTagsExcluded.has(tag);
    const count = chillGames.filter(g => g.tags && g.tags.includes(tag)).length;
    const btn = document.createElement('button');
    btn.style.cssText = `padding:14px 22px;border-radius:30px;font-size:1rem;font-family:'Roboto',sans-serif;font-weight:bold;cursor:pointer;border:3px solid ${excluded?'#ff0055':'#ff66b2'};background:${excluded?'rgba(80,0,30,0.8)':'rgba(255,102,178,0.15)'};color:${excluded?'#ff4488':'#ffbbdd'};position:relative;transition:0.2s;min-width:110px;overflow:hidden;`;
    btn.innerHTML = `<span style="display:block;">${tag}</span><small style="font-size:0.7rem;opacity:0.7;">${count} oyun</small>${excluded?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(80,0,30,0.65);font-size:2rem;color:#ff2255;pointer-events:none;">✕</div>`:''}`;
    btn.onclick = () => {
      if (!window.chillTagsExcluded) window.chillTagsExcluded = new Set();
      if (window.chillTagsExcluded.has(tag)) window.chillTagsExcluded.delete(tag);
      else window.chillTagsExcluded.add(tag);
      renderTagGrid();
    };
    grid.appendChild(btn);
  });
}

window.openTagsUI = function() {
  document.exitPointerLock();
  if (activeModal) document.getElementById(activeModal).style.display = 'none';
  activeModal = 'tagsUI';
  document.getElementById('tagsUI').style.display = 'flex';
  renderTagGrid();
};

window.closeTagsUI = function() {
  document.getElementById('tagsUI').style.display = 'none';
  activeModal = null;
  if (isTabletOpen) renderTabletUI();
};

// Filtreleri hem menü ayarlarına hem de tabletten seçilen süre filtresine göre anında uygular (Kasma yapmaz)
window.applyFilters = function() {
  function getRadioValue(name) {
    const els = document.getElementsByName(name);
    for (let r of els) if (r.checked) return r.value;
    return 'all';
  }
  const anomOpt = getRadioValue('opt_anomaly');
  const japOpt = getRadioValue('opt_japan');
  const demOpt = getRadioValue('opt_demo');
  const favOpt = getRadioValue('opt_fav');
  const selectedTimes = Array.from(document.querySelectorAll('input[name="opt_time"]:checked')).map(cb => cb.value);

  let filtered = allGames.filter(g => {
    let range = getGameDurationRange(g.playtime);
    let isAnom = g.type.includes('anomali'), isJap = g.type.includes('japon'), isDem = g.type.includes('demo');
    if (favOpt === 'only' && !favoriteGames.includes(g.name)) return false;
    if (anomOpt === 'exclude' && isAnom) return false;
    if (japOpt === 'exclude' && isJap) return false;
    if (demOpt === 'exclude' && isDem) return false;
    if (selectedTimes.length > 0) {
      let match = false;
      if (selectedTimes.includes('short') && range.max <= 1.05) match = true;
      if (selectedTimes.includes('medium') && range.max > 1.05 && range.max <= 2.2) match = true;
      if (selectedTimes.includes('long') && range.max > 2.2) match = true;
      if (!match) return false;
    }
    // Tabletten seçili süre filtresini çark havuzuna bağla
    if (tabletActiveTimeFilter && tabletActiveTimeFilter !== 'all') {
      if (!matchTimeFilter(g, tabletActiveTimeFilter)) return false;
    }
    return true;
  });

  const activeOnlyFilters = [];
  if (anomOpt === 'only') activeOnlyFilters.push('anomaly');
  if (japOpt === 'only') activeOnlyFilters.push('japan');
  if (demOpt === 'only') activeOnlyFilters.push('demo');
  if (activeOnlyFilters.length > 0) {
    filtered = filtered.filter(g => {
      let isAnom = g.type.includes('anomali'), isJap = g.type.includes('japon'), isDem = g.type.includes('demo');
      let match = false;
      if (activeOnlyFilters.includes('anomaly') && isAnom) match = true;
      if (activeOnlyFilters.includes('japan') && isJap) match = true;
      if (activeOnlyFilters.includes('demo') && isDem) match = true;
      return match;
    });
  }

  gameList = filtered;
};

function startNarrative(){document.getElementById('narrative-screen').style.display='block';showDialogue('start');}
function showDialogue(nodeKey){document.removeEventListener('click',advanceDialogue);currentNextNode=null;const node=dialogueTree[nodeKey];const npcImg=document.getElementById('npc-character');if(nodeKey==='alone'||nodeKey==='stream_yes'||nodeKey==='enter')npcImg.src='code/mutluadam.png';else if(nodeKey==='not_alone'||nodeKey==='stream_no')npcImg.src='code/uzgunadam.png';else npcImg.src='code/adam.png';document.getElementById('npcText').innerHTML=node.text||"";const opts=document.getElementById('playerOptions');opts.innerHTML='';const hint=document.getElementById('click-hint');hint.style.display='none';if(node.choices&&node.choices.length>0){node.choices.forEach(choice=>{const btn=document.createElement('button');btn.className='option-btn';btn.innerText=choice.label;btn.onclick=(e)=>{e.stopPropagation();showDialogue(choice.next);};opts.appendChild(btn);});}else if(node.next){hint.style.display='block';currentNextNode=node.next;setTimeout(()=>{document.addEventListener('click',advanceDialogue,{once:true});},100);}else if(node.action){node.action();}}
function advanceDialogue(){if(currentNextNode){showDialogue(currentNextNode);}}

window.openModal=function(id){
  document.exitPointerLock();
  if(activeModal)document.getElementById(activeModal).style.display='none';
  activeModal=id;
  document.getElementById(id).style.display='flex';
};

window.closeModal=function(id){
  document.getElementById(id).style.display='none';
  activeModal=null;
};

window.onCloseFilterModal = function() {
  applyFilters();
  closeModal('filtersUI');
  if(isTabletOpen) renderTabletUI();
};

function showList(title,dataArray){
  document.getElementById('listTitle').innerText=title;
  const grid=document.getElementById('listGrid');
  grid.innerHTML='';
  dataArray.forEach(g=>{
    let heartHtml=favoriteGames.includes(g.name)?'<img class="heart-overlay" src="code/kalp.png" onerror="this.style.display=\'none\'">':'';
    let flagHtml=g.overlayIcon?`<img src="${g.overlayIcon}" class="overlay-icon" onerror="this.style.display=\'none\'">`:'';
    grid.innerHTML+=`<div class="game-item">${flagHtml}${heartHtml}<img src="${getGameImagePath(g)}" class="game-thumb" onerror="this.onerror=null;this.src=getDefaultPlaceholder('${(g.name||'').replace(/'/g, "\\'")}')"><div class="game-name">${g.name}</div></div>`;
  });
  openModal('listUI');
}

function showScreenMessage(text){
  const msg=document.getElementById('screenMessage');
  msg.innerText=text;
  msg.style.opacity=1;
  setTimeout(()=>{msg.style.opacity=0;},3000);
}

function initBlackjack(){document.getElementById('bjMessage').style.display='none';document.getElementById('bjRestart').style.display='none';document.getElementById('bjHit').disabled=false;document.getElementById('bjStand').disabled=false;deck=[];const suits=['♥','♦','♣','♠'];const values=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];for(let s of suits){for(let v of values){let weight=parseInt(v);if(v==='J'||v==='Q'||v==='K')weight=10;if(v==='A')weight=11;deck.push({v:v,s:s,w:weight,color:(s==='♥'||s==='♦')?'red':'black'});}}deck.sort(()=>Math.random()-0.5);playerHand=[deck.pop(),deck.pop()];dealerHand=[deck.pop(),deck.pop()];bjGameOver=false;renderBlackjack();}
function calcScore(hand){let score=0,aces=0;hand.forEach(c=>{score+=c.w;if(c.v==='A')aces++;});while(score>21&&aces>0){score-=10;aces--;}return score;}
function renderBlackjack(){const pDiv=document.getElementById('playerHand');pDiv.innerHTML='';playerHand.forEach(c=>pDiv.innerHTML+=`<div class="bj-card ${c.color}">${c.v}${c.s}</div>`);document.getElementById('playerScore').innerText=`Puan: ${calcScore(playerHand)}`;const dDiv=document.getElementById('dealerHand');dDiv.innerHTML='';if(bjGameOver){dealerHand.forEach(c=>dDiv.innerHTML+=`<div class="bj-card ${c.color}">${c.v}${c.s}</div>`);document.getElementById('dealerScore').innerText=`Puan: ${calcScore(dealerHand)}`;}else{dDiv.innerHTML=`<div class="bj-card ${dealerHand[0].color}">${dealerHand[0].v}${dealerHand[0].s}</div><div class="bj-card" style="background:#555;">?</div>`;document.getElementById('dealerScore').innerText=`Puan: ?`;}}
window.bjHit=function(){if(bjGameOver)return;playerHand.push(deck.pop());renderBlackjack();if(calcScore(playerHand)>21)endBlackjack("Bust! Kaybettin.");};
window.bjStand=function(){if(bjGameOver)return;while(calcScore(dealerHand)<17)dealerHand.push(deck.pop());let p=calcScore(playerHand),d=calcScore(dealerHand);if(d>21||p>d)endBlackjack("KAZANDIN!");else if(p===d)endBlackjack("Berabere.");else endBlackjack("Kasa Kazandı.");};
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
            <img src="${getGameImagePath(g)}" style="width:100%;height:75px;object-fit:cover;display:block;" onerror="this.onerror=null;this.src=getDefaultPlaceholder('${(g.name||'').replace(/'/g, "\\'")}')">
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
    const chillList = window.getFilteredChillGames();
    chillList.forEach(g => {
        if (!g) return;
        const isSelected = window.forcedChillGame && window.forcedChillGame.name === g.name;
        const card = document.createElement('div');
        card.style.cssText = `position:relative;width:160px;cursor:pointer;border:3px solid ${isSelected ? '#ff66b2' : '#1a0029'};border-radius:8px;overflow:hidden;transition:0.2s;background:#0a0015;flex-shrink:0;`;
        card.innerHTML = `
            <img src="${getGameImagePath(g)}" style="width:100%;height:75px;object-fit:cover;display:block;" onerror="this.onerror=null;this.src=getDefaultPlaceholder('${(g.name||'').replace(/'/g, "\\'")}')">
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

/* ============================================================
   TABLET KONTROLLERİ VE DETAY MODALI
   ============================================================ */
window.updateInventoryUI = function() {
  const slot1 = document.getElementById('invSlot1');
  const item1 = document.getElementById('slotItem1');
  if (hasTablet) {
    slot1.classList.add('has-item');
    item1.innerHTML = `<svg class="slot-tablet-icon" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`;
  } else {
    slot1.classList.remove('has-item');
    item1.innerHTML = '';
  }
};

window.toggleTablet = function() {
  if (!hasTablet) {
    showScreenMessage("ÖNCE ATLAS'IN ODASINDAN TABLETİ AL!");
    return;
  }
  if (isTabletOpen) {
    closeTablet();
  } else {
    openTablet();
  }
};

window.openTablet = function() {
  isTabletOpen = true;
  document.exitPointerLock();
  document.body.style.cursor = 'auto';
  document.documentElement.style.cursor = 'auto';
  const overlay = document.getElementById('tabletOverlay');
  overlay.classList.add('open');
  renderTabletUI();
};

window.closeTablet = function() {
  isTabletOpen = false;
  closeGameDetail();
  const overlay = document.getElementById('tabletOverlay');
  overlay.classList.remove('open');
  if (!activeModal && gameState !== 'OUTER_DOOR') {
    controls.lock();
  }
};

window.switchTabletTab = function(tab) {
  tabletActiveTab = tab;
  closeGameDetail();
  document.getElementById('tabHorrorBtn').classList.toggle('active', tab === 'HORROR');
  document.getElementById('tabChillBtn').classList.toggle('active', tab === 'CHILL');
  renderTabletUI();
};

// Tabletten Süre Filtresi Seçildiğinde Havuzu Anında Güncelle (0 ms Gecikme)
window.setTabletTimeFilter = function(filterKey) {
  tabletActiveTimeFilter = filterKey;
  closeGameDetail();
  const btns = document.querySelectorAll('.tab-filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  const target = document.getElementById(`tflt_${filterKey}`);
  if (target) target.classList.add('active');

  // Filtrelenmiş listeyi güncelle (Kasma yapan çark çizimi kaldırıldı)
  applyFilters();
  renderTabletUI();
};

window.dismissWonBanner = function() {
  lastWonGame = null;
  document.getElementById('tabletWonBanner').style.display = 'none';
};

window.showTabletWonGame = function(game) {
  if (!game) return;
  lastWonGame = game;
  const banner = document.getElementById('tabletWonBanner');
  const img = document.getElementById('wonBannerImg');
  const title = document.getElementById('wonBannerTitle');
  const typeBadge = document.getElementById('wonBannerType');
  const timeBadge = document.getElementById('wonBannerTime');
  const desc = document.getElementById('wonBannerDesc');

  img.src = getGameImagePath(game);
  img.onerror = function() {
    this.onerror = null;
    this.src = getDefaultPlaceholder(game.name);
  };
  title.innerText = game.name || '';
  typeBadge.innerText = game.type || 'Oyun';
  timeBadge.innerText = game.playtime || game.time || 'Bilinmiyor';
  desc.innerText = game.desc || '';

  banner.style.display = 'flex';
};

window.openGameDetail = function(game) {
  if (!game) return;
  const modal = document.getElementById('tabletDetailModal');
  const img = document.getElementById('detailModalImg');
  const title = document.getElementById('detailModalTitle');
  const typeBadge = document.getElementById('detailModalType');
  const timeBadge = document.getElementById('detailModalTime');
  const desc = document.getElementById('detailModalDesc');

  img.src = getGameImagePath(game);
  img.onerror = function() {
    this.onerror = null;
    this.src = getDefaultPlaceholder(game.name);
  };
  title.innerText = game.name || '';
  typeBadge.innerText = game.type || 'Oyun';
  timeBadge.innerText = game.playtime || game.time || 'Belirtilmedi';
  desc.innerText = game.desc || 'Bu oyun için detaylı açıklama bulunmuyor.';

  modal.style.display = 'flex';
};

window.closeGameDetail = function() {
  const modal = document.getElementById('tabletDetailModal');
  if (modal) modal.style.display = 'none';
};

function renderTabletUI() {
  let baseList = (tabletActiveTab === 'HORROR') ? allGames : chillGames;

  // Dinamik Süre Sayaçları
  let cAll = baseList.length;
  let cLt1 = 0, cGt1 = 0, cGt2 = 0, cGt4 = 0;

  baseList.forEach(g => {
    if (matchTimeFilter(g, 'lt1')) cLt1++;
    if (matchTimeFilter(g, 'gt1')) cGt1++;
    if (matchTimeFilter(g, 'gt2')) cGt2++;
    if (matchTimeFilter(g, 'gt4')) cGt4++;
  });

  const setCnt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setCnt('cnt_all', cAll);
  setCnt('cnt_lt1', cLt1);
  setCnt('cnt_gt1', cGt1);
  setCnt('cnt_gt2', cGt2);
  setCnt('cnt_gt4', cGt4);

  // Listelenecek oyunlar
  let displayList = (tabletActiveTab === 'HORROR') ? gameList : window.getFilteredChillGames();

  const grid = document.getElementById('tabletGamesGrid');
  grid.innerHTML = '';

  displayList.forEach(g => {
    if (!g || g.type === 'error') return;
    const isFav = favoriteGames.includes(g.name);
    const card = document.createElement('div');
    card.className = 't-game-card';
    card.innerHTML = `
      ${isFav ? `<img src="code/kalp.png" class="t-fav-heart" alt="Fav">` : ''}
      <img src="${getGameImagePath(g)}" class="t-game-thumb" onerror="this.onerror=null;this.src=getDefaultPlaceholder('${(g.name||'').replace(/'/g, "\\'")}')">
      <div class="t-game-info">
        <div class="t-game-name">${g.name}</div>
        <div class="t-game-sub">${(g.type || g.desc || '').substring(0, 28)}</div>
        <div class="t-game-time">${g.playtime || g.time || ''}</div>
      </div>
    `;
    card.onclick = () => {
      openGameDetail(g);
    };
    grid.appendChild(card);
  });

  if (!grid.dataset.wheelBound) {
    grid.dataset.wheelBound = "true";
    grid.addEventListener('wheel', (e) => {
      grid.scrollTop += e.deltaY;
    }, { passive: true });
  }

  if (lastWonGame) {
    showTabletWonGame(lastWonGame);
  }
}
