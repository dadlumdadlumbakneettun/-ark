window.isFridgeOpen = false;
window.isOvenOpen = false;
window.currentFridgeAngle = 0;
window.currentOvenAngle = 0;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTickSound() {
    if (!soundEnabled || !audioCtx || audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination); osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1 * masterVolume, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

function playTeddySound() {
    if (!soundEnabled || !audioCtx || audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination); osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15 * masterVolume, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.start(); osc.stop(audioCtx.currentTime + 0.2);
}

function drawPalette() {
    for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 8; x++) {
            let idx = y * 8 + x;
            drawCtx.fillStyle = paletteColors[idx]; drawCtx.fillRect(x * 64, y * 64, 64, 64);
            drawCtx.strokeStyle = '#222'; drawCtx.lineWidth = 2; drawCtx.strokeRect(x * 64, y * 64, 64, 64);
        }
    }
}

function updateCrosshair() {
    const ch = document.getElementById('crosshair');
    if (gameState === 'CHILL_ROOM') {
        ch.style.backgroundImage = "url('code/hello.png')"; ch.style.backgroundColor = 'transparent';
        ch.style.width = '30px'; ch.style.height = '30px'; ch.style.borderRadius = '0'; ch.style.boxShadow = 'none';
    } else {
        ch.style.backgroundImage = 'none'; ch.style.backgroundColor = 'rgba(255,200,100,0.8)';
        ch.style.width = '6px'; ch.style.height = '6px'; ch.style.borderRadius = '50%'; ch.style.boxShadow = '0 0 8px rgba(255,200,100,0.5)';
    }
}

function releasePointerAndRestoreCursor() {
    if (document.pointerLockElement) {
        try { document.exitPointerLock(); } catch(e) {}
    }
    document.body.style.cursor = 'auto';
    document.documentElement.style.cursor = 'auto';
    const canvas = document.getElementById('gameCanvas');
    if (canvas) canvas.style.cursor = 'auto';
}

function pickupTabletItem() {
    if (hasTablet) return;
    hasTablet = true;
    playTickSound();
    if (tabletMesh && tabletMesh.parent) {
        tabletMesh.parent.remove(tabletMesh);
    }
    objects = objects.filter(o => o.userData.type !== 'PICKUP_TABLET' && (!o.parent || o.parent.userData.type !== 'PICKUP_TABLET'));
    updateInventoryUI();
    showScreenMessage("TABLET ENVANTERE EKLENDİ! [Q]");
}

function onMouseDown() {
    if (!controls.isLocked) return;
    if (interactTarget) {
        const type = interactTarget.userData.type || (interactTarget.parent && interactTarget.parent.userData.type);
        if (type === 'PICKUP_TABLET') {
            pickupTabletItem();
        } else if (type === 'ROBOT_ACTION_BTN') {
            playTickSound();
            window.playRobotAction(interactTarget.userData.actionKey);
        } else if (type === 'TOGGLE_COMMERCIAL_FRIDGE') {
            playTickSound();
            if (window.commercialFridgeAction) {
                window.commercialFridgeAction.stop().reset().play();
            }
        } else if (type === 'GO_TO_SECRET_ROOM') {
            gameState = 'SECRET_ROOM'; scene.fog.near = 15; controls.getObject().position.set(100, 2.0, 4); camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0, 'YXZ')); velocity.set(0, 0, 0); updateCrosshair();
        } else if (type === 'GO_TO_CASINO') {
            gameState = 'CASINO_ROOM'; scene.fog.near = 15; controls.getObject().position.set(-100, 2.0, -4); camera.quaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0, 'YXZ')); velocity.set(0, 0, 0); updateCrosshair();
        } else if (type === 'GO_TO_CHILL_ROOM') {
            gameState = 'CHILL_ROOM'; scene.fog.near = 30; controls.getObject().position.set(0, 2.0, 96); camera.quaternion.setFromEuler(new THREE.Euler(0, Math.PI, 0, 'YXZ')); velocity.set(0, 0, 0); updateCrosshair();
        } else if (type === 'GO_TO_ATLAS_ROOM') {
            gameState = 'ATLAS_ROOM'; scene.fog.near = 20; controls.getObject().position.set(2.4, 2.0, -97.9); camera.quaternion.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0, 'YXZ')); velocity.set(0, 0, 0); updateCrosshair();
        } else if (type === 'GO_TO_CORRIDOR') {
            const returnZ = gameState === 'ATLAS_ROOM' ? -7 : 2;
            gameState = 'CORRIDOR'; scene.fog.near = 5; controls.getObject().position.set(0, 2.0, returnZ); camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0, 'YXZ')); velocity.set(0, 0, 0); updateCrosshair();
        } else if (type === 'OUTER_DOOR') {
            gameState = 'OUTER_DOOR'; controls.unlock(); document.getElementById('blocker').style.display = 'none'; startNarrative();
        } else if (type && type.startsWith('WHEEL')) {
            isDraggingWheel = true; winningGame = null; activeWheelType = type;
        } else if (type === 'PLAY_BLACKJACK') {
            initBlackjack(); openModal('blackjackUI');
        } else if (type === 'CLICK_TEDDY') {
            const aboneAudio = new Audio('code/abone.m4a');
            aboneAudio.volume = masterVolume;
            aboneAudio.play().catch(()=>{});
        } else if (type === 'TOGGLE_FRIDGE') {
            window.isFridgeOpen = !window.isFridgeOpen; playTickSound();
        } else if (type === 'TOGGLE_OVEN') {
            window.isOvenOpen = !window.isOvenOpen; playTickSound();
        } else if (type === 'COLOR_PALETTE') {
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            let ins = raycaster.intersectObject(interactTarget);
            if (ins.length > 0) {
                let uv = ins[0].uv, colX = Math.floor(uv.x * 8), colY = Math.floor((1 - uv.y) * 2), idx = colY * 8 + colX;
                if (idx >= 0 && idx < 16) currentColor = paletteColors[idx];
            }
        } else if (type === 'PAINTABLE_WALL') {
            isDrawing = true; raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            let ins = raycaster.intersectObjects(chillWalls);
            if (ins.length > 0) lastDrawUV = { x: ins[0].uv.x * 2048, y: (1 - ins[0].uv.y) * 2048, wall: ins[0].object };
        } else if (type === 'BTN_CLEAR_DRAW') {
            if (window.leverPivot && !window.leverPivot.userData.isPressed) {
                window.leverPivot.userData.isPressed = true;
                const leverDown = () => {
                    if (window.leverPivot.rotation.x < Math.PI / 2.2) {
                        window.leverPivot.rotation.x += 0.12;
                        requestAnimationFrame(leverDown);
                    } else {
                        chillWalls.forEach(w => { w.userData.ctx.drawImage(chillWallBaseCanvas, 0, 0); w.userData.tex.needsUpdate = true; });
                        setTimeout(() => {
                            const leverUp = () => {
                                if (window.leverPivot.rotation.x > 0) {
                                    window.leverPivot.rotation.x -= 0.07;
                                    if (window.leverPivot.rotation.x < 0) window.leverPivot.rotation.x = 0;
                                    requestAnimationFrame(leverUp);
                                } else {
                                    window.leverPivot.userData.isPressed = false;
                                }
                            };
                            leverUp();
                        }, 250);
                    }
                };
                leverDown();
            }
        } else if (type === 'ROLL_3D_DICE') {
            if (!hasWonBlackjack) { showScreenMessage("ÖNCE BLACKJACK KAZAN!"); return; }
            if (isRollingDice) return;
            isRollingDice = true; let ticks = 0;
            const rollInterval = setInterval(() => {
                let v1 = Math.floor(Math.random() * 6) + 1, v2 = Math.floor(Math.random() * 6) + 1;
                drawDiceCanvas(diceCtx1, v1); dice1Mesh.material.map.needsUpdate = true;
                drawDiceCanvas(diceCtx2, v2); dice2Mesh.material.map.needsUpdate = true;
                playTickSound(); ticks++;
                if (ticks > 15) { clearInterval(rollInterval); isRollingDice = false; luckyBonus = (v1 + v2) * 2; showScreenMessage(`ŞANSIN %${luckyBonus} ARTTI!`); }
            }, 80);
        }
    }
}

function onMouseUp() { isDraggingWheel = false; isDrawing = false; lastDrawUV = null; }

// Çark durduğunda filtrelenmiş aktif havuzdan oyun seçimi yapar
function calculateWinningGame(type) {
    if (type === 'HORROR') {
        const pool = (typeof gameList !== 'undefined' && gameList.length > 0) ? gameList : allGames;
        let validList = pool.filter(g => g.type !== 'error');
        if (validList.length === 0) validList = allGames;

        let index = Math.floor(Math.random() * validList.length);

        if (luckyBonus > 0) {
            if (Math.random() * 100 < luckyBonus) {
                const favIndices = []; validList.forEach((g, i) => { if (favoriteGames.includes(g.name)) favIndices.push(i); });
                if (favIndices.length > 0) {
                    index = favIndices[Math.floor(Math.random() * favIndices.length)];
                }
            }
            luckyBonus = 0;
        }

        if (window.forcedHorrorGame) {
            const fi = validList.findIndex(g => g.name === window.forcedHorrorGame.name);
            if (fi >= 0) index = fi;
            window.forcedHorrorGame = null;
        }

        winningGame = validList[index];
        cachedGameImage.crossOrigin = "Anonymous";
        cachedGameImage.src = getGameImagePath(winningGame);

        if (window.showTabletWonGame) window.showTabletWonGame(winningGame);

        if (window.updateHorrorWallScreen) {
            window.horrorWallMode = 'won';
            window.horrorWallWonGame = winningGame;
            window.updateHorrorWallScreen();
        }
    } else if (type === 'CHILL') {
        const chillPool = window.getFilteredChillGames();
        let validList = chillPool.length > 0 ? chillPool : chillGames;

        let index = Math.floor(Math.random() * validList.length);

        if (window.forcedChillGame) {
            const fi = validList.findIndex(g => g.name === window.forcedChillGame.name);
            if (fi >= 0) index = fi;
            window.forcedChillGame = null;
        }

        chillWonGame = validList[index];

        if (window.showTabletWonGame) window.showTabletWonGame(chillWonGame);

        if (window.updateChillWallScreen) {
            window.chillWallMode = 'won';
            window.chillWallWonGame = chillWonGame;
            window.updateChillWallScreen();
        }

        let img = new Image(); img.crossOrigin = "Anonymous"; img.src = getGameImagePath(chillWonGame);
        img.onload = () => {
            chillScreenCtx.drawImage(img, 0, 0, 1024, 512);
            chillScreenCtx.fillStyle = '#ffd700'; chillScreenCtx.font = "bold 60px 'Special Elite', cursive";
            chillScreenCtx.textAlign = "center"; chillScreenCtx.textBaseline = "middle"; chillScreenCtx.fillText(chillWonGame.name, 512, 446);
            chillScreenTex.needsUpdate = true;
        };
        img.onerror = () => {
            chillScreenCtx.fillStyle = '#ffb3c6'; chillScreenCtx.fillRect(0, 0, 1024, 512); chillScreenCtx.fillStyle = '#000';
            chillScreenCtx.font = "bold 60px 'Special Elite', cursive"; chillScreenCtx.textAlign = "center"; chillScreenCtx.textBaseline = "middle";
            chillScreenCtx.fillText(chillWonGame.name, 512, 256); chillScreenTex.needsUpdate = true;
        };
    }
}

// Jumbotron ekranı güncelleme
function updateScreen(time) {
    if (!textScreenCtx || !imageScreenCtx) return;
    if (time - lastScreenUpdate > 100) {
        lastScreenUpdate = time;
        textScreenCtx.fillStyle = '#0a0000'; textScreenCtx.fillRect(0, 0, 1024, 512);
        textScreenCtx.textAlign = "center"; textScreenCtx.textBaseline = "middle";
        if (winningGame) {
            let fontSize = winningGame.name.length > 12 ? 70 : 100;
            textScreenCtx.font = `bold ${fontSize}px 'Special Elite', cursive`; 
            textScreenCtx.fillStyle = '#ffd700'; 
            textScreenCtx.fillText(winningGame.name, 512, 256);
        } else if (isHorrorSpinning) {
            textScreenCtx.font = "bold 100px 'Courier New', monospace"; textScreenCtx.fillStyle = Math.random() > 0.2 ? '#ff2222' : '#ffffff';
            textScreenCtx.fillText(["SPINNING...", "SEARCHING...", "ANALYZING..."][Math.floor(Math.random() * 3)], 512, 256);
        } else {
            textScreenCtx.font = "bold 100px 'Courier New', monospace"; textScreenCtx.fillStyle = '#ff2222'; textScreenCtx.fillText("SPIN THE WHEEL", 512, 256);
        }
        
        imageScreenCtx.fillStyle = '#0a0000'; imageScreenCtx.fillRect(0, 0, 1024, 512);
        if (winningGame && cachedGameImage.complete) { 
            imageScreenCtx.drawImage(cachedGameImage, 0, 0, 1024, 512); 
        } else {
            imageScreenCtx.font = "bold 80px 'Courier New', monospace"; imageScreenCtx.fillStyle = '#ff2222'; imageScreenCtx.textAlign = "center";
            imageScreenCtx.fillText(["NO SIGNAL", "SYSTEM ERROR", "AWAITING..."][Math.floor(Math.random() * 3)], 512, 256);
        }
        textScreenTex.needsUpdate = true; imageScreenTex.needsUpdate = true;
    }
}

function init() {
    scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0502); scene.fog = new THREE.FogExp2(0x0a0502, 0.05);
    camera = new THREE.PerspectiveCamera(userFov, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(new THREE.AmbientLight(0x403020, 1.2));
    const mainLight = new THREE.PointLight(0xf0b050, 1.3, 20); mainLight.position.set(0, 4.0, 0); scene.add(mainLight);
    addCeilingLamp(scene, 0, 4.45, 0);
    controls = new THREE.PointerLockControls(camera, document.body);
    const blocker = document.getElementById('blocker');

    document.body.addEventListener('click', function (event) {
        if (activeModal || isTabletOpen || gameState === 'OUTER_DOOR') return;
        if (!controls.isLocked) {
            initAudio();
            if (isFirstStart) {
                document.getElementById('instructions').style.border = 'none'; document.getElementById('instructions').style.background = 'transparent';
                document.getElementById('instructions').style.boxShadow = 'none'; document.querySelector('.hint').style.display = 'none';
                isFirstStart = false; blocker.style.display = 'none';
            }
            controls.lock();
        }
    });

    controls.addEventListener('lock', function () { 
        blocker.style.display = 'none'; 
    });

    controls.addEventListener('unlock', function () { 
        releasePointerAndRestoreCursor();
        if (gameState === 'OUTER_DOOR' || isFirstStart || isTabletOpen) return; 
        if (!activeModal) openModal('escMenuUI'); 
    });

    window.addEventListener('blur', releasePointerAndRestoreCursor);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) releasePointerAndRestoreCursor();
    });
    document.addEventListener('pointerlockchange', () => {
        if (!document.pointerLockElement) releasePointerAndRestoreCursor();
    });
    document.addEventListener('pointerlockerror', releasePointerAndRestoreCursor);

    scene.add(controls.getObject()); controls.getObject().position.set(0, 2.0, 5);

    document.addEventListener('keydown', e => {
        if (e.code === 'Escape') { 
            if (isTabletOpen) {
                closeTablet();
                return;
            }
            if (activeModal) { 
                closeModal(activeModal); 
                if (gameState !== 'OUTER_DOOR') controls.lock(); 
            } else { 
                controls.unlock(); 
                releasePointerAndRestoreCursor();
            } 
        }

        // Q Tuşu: Tableti Aç / Kapat
        if (e.code === 'KeyQ') {
            toggleTablet();
        }

        // E Tuşu: Eşya Al (Tableti Yerden Alma)
        if (e.code === 'KeyE') {
            if (interactTarget) {
                const type = interactTarget.userData.type || (interactTarget.parent && interactTarget.parent.userData.type);
                if (type === 'PICKUP_TABLET') {
                    pickupTabletItem();
                }
            }
        }

        const _ch = (e.key || '').toLowerCase();
        if ('aezakmı'.indexOf(_ch) !== -1) {
            _pickerSeq += _ch;
            if (_pickerSeq.length > 7) _pickerSeq = _pickerSeq.slice(-7);
            if (_pickerSeq === 'aezakmı') { _pickerSeq = ''; if(window.openPickerUI) window.openPickerUI(); }
        } else if (_ch.length === 1) { _pickerSeq = ''; }

        switch (e.code) {
            case 'ArrowUp': case 'KeyW': moveForward = true; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
            case 'ArrowDown': case 'KeyS': moveBackward = true; break;
            case 'ArrowRight': case 'KeyD': moveRight = true; break;
            case 'Space': if (canJump && !isCrouching) { velocity.y += 12; canJump = false; } break;
            case 'ShiftLeft': case 'ShiftRight': isCrouching = true; break;
        }
    });

    document.addEventListener('keyup', e => {
        switch (e.code) {
            case 'ArrowUp': case 'KeyW': moveForward = false; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
            case 'ArrowDown': case 'KeyS': moveBackward = false; break;
            case 'ArrowRight': case 'KeyD': moveRight = false; break;
            case 'ShiftLeft': case 'ShiftRight': isCrouching = false; break;
        }
    });

    document.addEventListener('mousemove', e => {
        if (controls.isLocked) {
            let mx = e.movementX || 0, my = e.movementY || 0;
            let eu = new THREE.Euler(0, 0, 0, 'YXZ'); eu.setFromQuaternion(camera.quaternion);
            eu.y -= mx * 0.002 * (userSens - 1); eu.x -= my * 0.002 * (userSens - 1);
            eu.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, eu.x)); camera.quaternion.setFromEuler(eu);
            
            if (isDraggingWheel) {
                if (activeWheelType === 'WHEEL_HORROR') { horrorVelocity += mx * 0.005; isHorrorSpinning = true; winningGame = null; }
                else if (activeWheelType === 'WHEEL_CHILL') { chillVelocity += mx * 0.005; isChillSpinning = true; chillWonGame = null; }
            }
            if (isDrawing) {
                raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); let ins = raycaster.intersectObjects(chillWalls);
                if (ins.length > 0) {
                    let targetWall = ins[0].object; let uv = ins[0].uv; let cX = uv.x * 2048, cY = (1 - uv.y) * 2048;
                    let ctx = targetWall.userData.ctx; ctx.strokeStyle = currentColor; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath();
                    if (lastDrawUV && lastDrawUV.wall === targetWall) { ctx.moveTo(lastDrawUV.x, lastDrawUV.y); } else { ctx.moveTo(cX, cY); }
                    ctx.lineTo(cX, cY); ctx.stroke(); targetWall.userData.tex.needsUpdate = true; lastDrawUV = { x: cX, y: cY, wall: targetWall };
                } else { lastDrawUV = null; }
            }
        }
    });

    document.getElementById('inpSens').value = userSens; document.getElementById('inpFov').value = userFov; document.getElementById('inpVol').value = masterVolume;
    document.getElementById('inpSens').addEventListener('input', e => { userSens = parseFloat(e.target.value); localStorage.setItem('atl_sens', userSens); });
    document.getElementById('inpFov').addEventListener('input', e => { userFov = parseInt(e.target.value); camera.fov = userFov; camera.updateProjectionMatrix(); localStorage.setItem('atl_fov', userFov); });
    document.getElementById('inpVol').addEventListener('input', e => { masterVolume = parseFloat(e.target.value); localStorage.setItem('atl_vol', masterVolume); });
    
    const els = document.querySelectorAll('.ui-modal input[type="radio"],.ui-modal input[type="checkbox"]');
    els.forEach(el => {
        el.addEventListener('change', e => { 
            if (el.name === 'opt_sound') soundEnabled = document.getElementById('sound_on').checked; 
            else { 
                applyFilters(); 
            } 
        });
    });
    soundEnabled = document.getElementById('sound_on').checked; 

    const c1 = document.createElement('canvas'); c1.width = 1024; c1.height = 512;
    textScreenCtx = c1.getContext('2d'); textScreenTex = new THREE.CanvasTexture(c1); textScreenTex.magFilter = THREE.NearestFilter;
    const c2 = document.createElement('canvas'); c2.width = 1024; c2.height = 512;
    imageScreenCtx = c2.getContext('2d'); imageScreenTex = new THREE.CanvasTexture(c2); imageScreenTex.magFilter = THREE.LinearFilter;
    chillScreenCanvas = document.createElement('canvas'); chillScreenCanvas.width = 1024; chillScreenCanvas.height = 512;
    chillScreenCtx = chillScreenCanvas.getContext('2d'); chillScreenCtx.fillStyle = '#222'; chillScreenCtx.fillRect(0, 0, 1024, 512);
    chillScreenTex = new THREE.CanvasTexture(chillScreenCanvas);

    buildLShapeCorridor();
    buildSecretRoom();
    buildCasinoRoom();
    buildChillRoom();
    buildAtlasRoom();
    initFox();
    updateInventoryUI();

    // Başlangıç filtre havuzunu oluştur
    applyFilters();

    window.dvdX=50;window.dvdY=50;window.dvdVx=1.5;window.dvdVy=1.0;window.dvdColor='#ff2222';
    raycaster = new THREE.Raycaster(); 
    document.addEventListener('mousedown', onMouseDown); 
    document.addEventListener('mouseup', onMouseUp);

    renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

    setInterval(() => {
        if (gameState !== 'CHILL_ROOM' || chillWonGame) return;
        const cList = window.getFilteredChillGames();
        let g = cList[Math.floor(Math.random() * cList.length)];
        if (!g) return;
        let img = new Image(); img.crossOrigin = "Anonymous"; img.src = getGameImagePath(g);
        img.onload = () => {
            chillScreenCtx.drawImage(img, 0, 0, 1024, 512); 
            chillScreenTex.needsUpdate = true;
        };
    }, 3000);
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now(); const delta = (time - prevTime) / 1000;

    modelMixers.forEach(m => m.update(delta));

    if (isDiscoMode && secretRoomLight) { const hue = (time * 0.001) % 1; secretRoomLight.color.setHSL(hue, 1, 0.5); secretRoomLight.intensity = 2.5; }

    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta; velocity.z -= velocity.z * 10.0 * delta; velocity.y -= 40.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward); direction.x = Number(moveRight) - Number(moveLeft); direction.normalize();
        const speedMult = isCrouching ? 20.0 : 50.0;
        if (moveForward || moveBackward) velocity.z -= direction.z * speedMult * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speedMult * delta;
        controls.moveRight(-velocity.x * delta); controls.moveForward(-velocity.z * delta); controls.getObject().position.y += (velocity.y * delta);

        let pos = controls.getObject().position, camOffset = isCrouching ? 1.2 : 2.0, groundY = 0;

        if (gameState === 'SECRET_ROOM') {
            let distToWheel = Math.sqrt((pos.x - 100) ** 2 + pos.z ** 2);
            if (distToWheel < 2.4) { if (pos.y - camOffset >= 1.1) { groundY = 1.2; } else { let push = 2.4 - distToWheel; pos.x += (pos.x - 100) / distToWheel * push; pos.z += pos.z / distToWheel * push; } }
            let inDiceX = pos.x > 103.7 && pos.x < 105.3, inDiceZ = pos.z > 3.7 && pos.z < 5.3;
            if (inDiceX && inDiceZ) {
                if (pos.y - camOffset >= 0.7) { groundY = 0.8; } else {
                    let dx1 = pos.x - 103.7, dx2 = 105.3 - pos.x, dz1 = pos.z - 3.7, dz2 = 5.3 - pos.z; let min = Math.min(dx1, dx2, dz1, dz2);
                    if (min === dx1) pos.x -= dx1; else if (min === dx2) pos.x += dx2; else if (min === dz1) pos.z -= dz1; else pos.z += dz2;
                }
            }
        } else if (gameState === 'CASINO_ROOM') {
            let inTableX = pos.x > -101.6 && pos.x < -98.4, inTableZ = pos.z > -0.6 && pos.z < 2.6;
            if (inTableX && inTableZ) {
                if (pos.y - camOffset >= 0.7) { groundY = 0.8; } else {
                    let dx1 = pos.x - -101.6, dx2 = -98.4 - pos.x, dz1 = pos.z - -0.6, dz2 = 2.6 - pos.z; let min = Math.min(dx1, dx2, dz1, dz2);
                    if (min === dx1) pos.x -= dx1; else if (min === dx2) pos.x += dx2; else if (min === dz1) pos.z -= dz1; else pos.z += dz2;
                }
            }
        } else if (gameState === 'CHILL_ROOM') {
            let distToWheel = Math.sqrt(pos.x ** 2 + (pos.z - 100) ** 2);
            if (distToWheel < 2.4) { if (pos.y - camOffset >= 1.1) { groundY = 1.2; } else { let push = 2.4 - distToWheel; pos.x += pos.x / distToWheel * push; pos.z += (pos.z - 100) / distToWheel * push; } }
            if (pos.x < -4.5) { 
                if (pos.z > 95.4 && pos.z < 104.5) { pos.x = -4.5; } 
            }
        }

        let targetCamY = groundY + camOffset, isGrounded = (pos.y - targetCamY) <= 0.05;
        if (isGrounded && velocity.y <= 0) {
            velocity.y = 0; let spd = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
            if (spd > 0.5) { headBobTimer += delta * (isCrouching ? 8 : 12); let targetBob = Math.sin(headBobTimer) * (isCrouching ? 0.04 : 0.08); currentBob += (targetBob - currentBob) * delta * 10; }
            else { currentBob += (0 - currentBob) * delta * 10; headBobTimer = 0; }
            pos.y = targetCamY + currentBob; if (!isCrouching) canJump = true;
        } else if (isCrouching && pos.y > targetCamY && velocity.y === 0) {
            pos.y -= 5 * delta; if (pos.y < targetCamY) pos.y = targetCamY;
        }

        const pad = 0.8;
        if (gameState === 'CORRIDOR') {
            if (pos.z > 6 - pad) pos.z = 6 - pad; if (pos.z < -12 + pad) pos.z = -12 + pad; if (pos.x < -2.5 + pad) pos.x = -2.5 + pad; if (pos.x > 2.5 - pad) pos.x = 2.5 - pad;
        } else if (gameState === 'SECRET_ROOM') {
            if (pos.x < 94 + pad) pos.x = 94 + pad; if (pos.x > 106 - 0.5) pos.x = 106 - 0.5; if (pos.z < -6 + pad) pos.z = -6 + pad; if (pos.z > 6 - pad) pos.z = 6 - pad;
        } else if (gameState === 'CASINO_ROOM') {
            if (pos.x < -106 + pad) pos.x = -106 + pad; if (pos.x > -94 - pad) pos.x = -94 - pad; if (pos.z < -6 + pad) pos.z = -6 + pad; if (pos.z > 6 - pad) pos.z = 6 - pad;
        } else if (gameState === 'CHILL_ROOM') {
            if (pos.x < -6 + pad) pos.x = -6 + pad; if (pos.x > 6 - pad) pos.x = 6 - pad; if (pos.z < 94 + pad) pos.z = 94 + pad; if (pos.z > 106 - pad) pos.z = 106 - pad;
        } else if (gameState === 'ATLAS_ROOM') {
            if (pos.x < -3.2 + pad) pos.x = -3.2 + pad;
            if (pos.x > 3.2 - pad) pos.x = 3.2 - pad;
            if (pos.z < -103.2 + pad) pos.z = -103.2 + pad;
            if (pos.z > -96.8 - pad) pos.z = -96.8 - pad;
        }

        if (foxGroup) {
            const playerPos = controls.getObject().position;
            const dx = playerPos.x - foxGroup.position.x;
            const dz = playerPos.z - foxGroup.position.z;
            const distXZ = Math.hypot(dx, dz);
            
            if (distXZ > 25.0) {
                foxGroup.position.set(playerPos.x - 1.5, 0, playerPos.z - 1.5);
            } else if (distXZ > 2.0) {
                const targetYaw = Math.atan2(dx, dz);
                let diff = targetYaw - foxGroup.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI) diff -= Math.PI * 2;
                foxGroup.rotation.y += diff * Math.min(1.0, 5.0 * delta);

                const speed = 2.4 * delta;
                foxGroup.position.x += Math.sin(foxGroup.rotation.y) * speed;
                foxGroup.position.z += Math.cos(foxGroup.rotation.y) * speed;

                if (foxWalkAction && foxWalkAction.paused) {
                    foxWalkAction.paused = false;
                }
            } else {
                if (foxWalkAction && !foxWalkAction.paused) {
                    foxWalkAction.paused = true;
                }
                if (distXZ > 0.8) {
                    const targetYaw = Math.atan2(dx, dz);
                    let diff = targetYaw - foxGroup.rotation.y;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    if (Math.abs(diff) > 0.15) {
                        foxGroup.rotation.y += diff * Math.min(1.0, 3.0 * delta);
                    }
                }
            }
        }

        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera); const intersects = raycaster.intersectObjects(objects);
        const interactText = document.getElementById('interactText');

        if (intersects.length > 0 && intersects[0].distance < 6.0) {
            interactTarget = intersects[0].object; 
            const targetType = interactTarget.userData.type || (interactTarget.parent && interactTarget.parent.userData.type);
            if (targetType === 'PICKUP_TABLET') {
                interactText.style.display = 'block';
                interactText.innerText = '[ E: Tableti Al ]';
            } else if (targetType === 'ROLL_3D_DICE') { 
                interactText.style.display = 'block'; 
                interactText.innerText = hasWonBlackjack ? '[ Zarları At ]' : '[ Önce Blackjack Kazan ]'; 
            } else if (targetType === 'TOGGLE_COMMERCIAL_FRIDGE') {
                interactText.style.display = 'block';
                interactText.innerText = '[ Dolabı Aç ]';
            } else { 
                interactText.style.display = 'none'; 
            }
        } else { 
            interactTarget = null; 
            interactText.style.display = 'none'; 
            if (!isDrawing) isDraggingWheel = false; 
        }
    }

    prevTime = time;

    if (robotButtonsGroup && gameState === 'SECRET_ROOM') {
        robotButtonsGroup.lookAt(camera.position);
    }

    let targetWheel = activeWheelType === 'WHEEL_CHILL' ? chillWheelMesh : wheelMesh;
    if (targetWheel) {
        if (isDraggingWheel) {
            targetWheel.rotation.y += (activeWheelType === 'WHEEL_CHILL' ? chillVelocity : horrorVelocity);
            if (activeWheelType === 'WHEEL_CHILL') chillVelocity *= 0.85; else horrorVelocity *= 0.85;
        } else {
            const oldRot = targetWheel.rotation.y; let currentVel = activeWheelType === 'WHEEL_CHILL' ? chillVelocity : horrorVelocity;
            targetWheel.rotation.y += currentVel; currentVel *= 0.992;
            if (activeWheelType === 'WHEEL_CHILL') chillVelocity = currentVel; else horrorVelocity = currentVel;
            let isSpinning = activeWheelType === 'WHEEL_CHILL' ? isChillSpinning : isHorrorSpinning;
            if (isSpinning) {
                let list = activeWheelType === 'WHEEL_CHILL' ? chillGames : allGames; const slice = (2 * Math.PI) / list.length;
                if (Math.floor(oldRot / slice) !== Math.floor(targetWheel.rotation.y / slice)) playTickSound();
            }
            if (isSpinning && Math.abs(currentVel) < 0.0005) {
                if (activeWheelType === 'WHEEL_CHILL') { chillVelocity = 0; isChillSpinning = false; calculateWinningGame('CHILL'); }
                else { horrorVelocity = 0; isHorrorSpinning = false; calculateWinningGame('HORROR'); }
            }
        }
    }

    if (window.fridgeDoorHinge) {
        let targetFridgeAngle = window.isFridgeOpen ? Math.PI / 1.8 : 0; 
        window.currentFridgeAngle += (targetFridgeAngle - window.currentFridgeAngle) * 10 * delta;
        window.fridgeDoorHinge.rotation.y = window.currentFridgeAngle;
    }

    if (window.ovenDoorHinge) {
        let targetOvenAngle = window.isOvenOpen ? -Math.PI / 2.2 : 0;
        window.currentOvenAngle += (targetOvenAngle - window.currentOvenAngle) * 10 * delta;
        window.ovenDoorHinge.rotation.z = window.currentOvenAngle; 
    }

    const cameraWorldPos = new THREE.Vector3(); camera.getWorldPosition(cameraWorldPos);
    if (time > nextJitterTime) { eyeJitter.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 3); nextJitterTime = time + 200 + Math.random() * 1000; }
    eyeTarget.lerp(cameraWorldPos.clone().add(eyeJitter), 0.15);
    
    if (eyeGroup && gameState === 'SECRET_ROOM') eyeGroup.lookAt(eyeTarget);
    if (smileyGroup && gameState === 'CHILL_ROOM') smileyGroup.lookAt(eyeTarget);
    if (gameState === 'SECRET_ROOM') updateScreen(time);

    if (gameState === 'CHILL_ROOM') {
        chillScreens.forEach(mat => mat.color.setHex(0xffffff));
    }

    renderer.render(scene, camera);
}

init();
animate();
