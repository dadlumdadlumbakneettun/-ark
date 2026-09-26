const ROBOT_POOL = [
    { key: 'dance', label: 'DANCE' },
    { key: 'death', label: 'DEATH' },
    { key: 'jump', label: 'JUMP' },
    { key: 'no', label: 'NO' },
    { key: 'yes', label: 'YES' },
    { key: 'running', label: 'RUNNING' },
    { key: 'thumbsup', label: 'THUMBS UP' },
    { key: 'walking', label: 'WALKING' },
    { key: 'wave', label: 'WAVE' }
];

window.updateRobotButtons = function() {
    if (!robotButtonMeshes || robotButtonMeshes.length === 0) return;
    const shuffled = [...ROBOT_POOL].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 4);

    robotButtonMeshes.forEach((mesh, idx) => {
        const item = chosen[idx];
        mesh.userData.actionKey = item.key;
        mesh.userData.actionLabel = item.label;

        const ctx = mesh.userData.canvas.getContext('2d');
        ctx.clearRect(0, 0, 256, 96);
        ctx.fillStyle = 'rgba(8, 14, 22, 0.94)';
        ctx.fillRect(0, 0, 256, 96);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 5;
        ctx.strokeRect(3, 3, 250, 90);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, 240, 80);
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 26px "Courier Prime", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, 128, 48);

        mesh.material.map.needsUpdate = true;
    });
};

window.playRobotAction = function(actionKey) {
    if (robotMixer && robotActions) {
        let act = robotActions[actionKey.toLowerCase()];
        if (!act) {
            const found = Object.keys(robotActions).find(k => k.includes(actionKey.toLowerCase()));
            if (found) act = robotActions[found];
        }
        if (act) {
            if (currentRobotAction && currentRobotAction !== act) {
                currentRobotAction.fadeOut(0.2);
            }
            const oneShots = ['death', 'jump', 'no', 'yes', 'thumbsup', 'wave'];
            if (oneShots.includes(actionKey.toLowerCase())) {
                act.reset().setLoop(THREE.LoopOnce, 1);
                act.clampWhenFinished = true;
            } else {
                act.reset().setLoop(THREE.LoopRepeat);
            }
            act.fadeIn(0.2).play();
            currentRobotAction = act;
        }
    }
    window.updateRobotButtons();
};

function buildSecretRoom(){
    const wallTex=createRetroWallTexture('#223344');const floorTex=createFloorTexture('#4a2a18','#381d0f');const ceilTex=createCeilingTexture();
    const wallMat=new THREE.MeshStandardMaterial({map:wallTex,bumpMap:wallTex,bumpScale:0.03,side:THREE.DoubleSide,roughness:0.8,metalness:0.1});
    const floorMat=new THREE.MeshStandardMaterial({map:floorTex,bumpMap:floorTex,bumpScale:0.02,roughness:0.3});
    const cx=100,cz=0;
    
    secretRoomLight=new THREE.PointLight(0xffeedd,1.2,25);secretRoomLight.position.set(cx,4.0,cz);scene.add(secretRoomLight);addCeilingLamp(scene,cx,4.45,cz);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,12),floorMat);floor.rotation.x=-Math.PI/2;floor.position.set(cx,0,cz);scene.add(floor);
    const ceil=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshStandardMaterial({map:ceilTex,roughness:0.9}));ceil.rotation.x=Math.PI/2;ceil.position.set(cx,4.5,cz);scene.add(ceil);
    
    const wGeo=new THREE.PlaneGeometry(12,4.5);
    const w1=new THREE.Mesh(wGeo,wallMat);w1.position.set(cx,2.25,cz-6);scene.add(w1);
    const w2=new THREE.Mesh(wGeo,wallMat);w2.position.set(cx,2.25,cz+6);w2.rotation.y=Math.PI;scene.add(w2);
    const w3=new THREE.Mesh(wGeo,wallMat);w3.position.set(cx-6,2.25,cz);w3.rotation.y=Math.PI/2;scene.add(w3);
    const w4=new THREE.Mesh(wGeo,wallMat);w4.position.set(cx+6,2.25,cz);w4.rotation.y=-Math.PI/2;scene.add(w4);
    addTrims(scene,cx,cz);

    const doorTex=createDoorTexture(false);
    const exitDoor=new THREE.Mesh(new THREE.BoxGeometry(2.0,3.2,0.15),new THREE.MeshStandardMaterial({map:doorTex,bumpMap:doorTex,bumpScale:0.04,roughness:0.6}));
    exitDoor.position.set(cx,1.6,cz+5.85);exitDoor.rotation.y=Math.PI;exitDoor.userData={type:'GO_TO_CORRIDOR'};scene.add(exitDoor);objects.push(exitDoor);addKnob(exitDoor,true);
    const woodFrameTex=createWoodTexture('#2a1508','10,5,0');
    const eFrame=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.4,0.25),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.8}));eFrame.position.set(cx,1.7,cz+5.95);scene.add(eFrame);

    const textureLoader=new THREE.TextureLoader();
    const tabloMat2=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.5});
    textureLoader.load('code/tablo2.png',function(tex){tabloMat2.map=tex;tabloMat2.needsUpdate=true;});
    const tablo2Mesh=new THREE.Mesh(new THREE.PlaneGeometry(3.0,3.8),tabloMat2);tablo2Mesh.position.set(cx,2.35,cz-5.9);scene.add(tablo2Mesh);
    const tFrame2=new THREE.Mesh(new THREE.BoxGeometry(3.2,4.0,0.05),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.5}));tFrame2.position.set(cx,2.35,cz-5.95);scene.add(tFrame2);

    const tabloMat3=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.5});
    textureLoader.load('code/tablo3.png',function(tex){tabloMat3.map=tex;tabloMat3.needsUpdate=true;});
    const tablo3Mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.2),tabloMat3);tablo3Mesh.position.set(cx-3,2.5,cz+5.9);tablo3Mesh.rotation.y=Math.PI;scene.add(tablo3Mesh);
    const tFrame3=new THREE.Mesh(new THREE.BoxGeometry(2.0,1.4,0.05),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.5}));tFrame3.position.set(cx-3,2.5,cz+5.95);tFrame3.rotation.y=Math.PI;scene.add(tFrame3);
    
    // Çark Masası ve Göz
    const tableGroup=new THREE.Group();tableGroup.position.set(cx,0,cz);scene.add(tableGroup);
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.8,0.9,32),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.6}));leg.position.y=0.45;tableGroup.add(leg);
    const legBase=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,0.1,64),new THREE.MeshStandardMaterial({color:0x111,metalness:0.8,roughness:0.3}));legBase.position.y=0.05;tableGroup.add(legBase);
    const wheelTex=createRouletteTexture(allGames,false);
    const wheelMats=[new THREE.MeshStandardMaterial({color:0xb8860b,metalness:0.9,roughness:0.2}),new THREE.MeshStandardMaterial({map:wheelTex,roughness:0.95,metalness:0.0}),new THREE.MeshStandardMaterial({color:0x222,roughness:0.8})];
    wheelMesh=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,0.2,128),wheelMats);wheelMesh.position.y=1.0;wheelMesh.userData={type:'WHEEL_HORROR'};tableGroup.add(wheelMesh);objects.push(wheelMesh);
    const socket=new THREE.Mesh(new THREE.TorusGeometry(0.55,0.05,32,64),new THREE.MeshStandardMaterial({color:0xffd700,metalness:0.9,roughness:0.1}));socket.rotation.x=Math.PI/2;socket.position.y=1.1;tableGroup.add(socket);
    eyeGroup=new THREE.Group();eyeGroup.position.set(0,1.1,0);tableGroup.add(eyeGroup);
    const eyeTex=createEyeTexture();
    const sclera=new THREE.Mesh(new THREE.SphereGeometry(0.48,64,64),new THREE.MeshStandardMaterial({map:eyeTex,roughness:0.05,metalness:0.1,clearcoat:1.0,clearcoatRoughness:0.1}));sclera.rotation.y=-Math.PI/2;eyeGroup.add(sclera);

    const jumbotronMats=[new THREE.MeshBasicMaterial({map:imageScreenTex}),new THREE.MeshBasicMaterial({map:imageScreenTex}),new THREE.MeshStandardMaterial({color:0x222222,metalness:0.8,roughness:0.4}),new THREE.MeshStandardMaterial({color:0x222222,metalness:0.8,roughness:0.4}),new THREE.MeshBasicMaterial({map:textScreenTex}),new THREE.MeshBasicMaterial({map:textScreenTex})];
    const jumbotron=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.8,1.5),jumbotronMats);jumbotron.position.set(cx,3.2,cz);scene.add(jumbotron);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,1.3,32),new THREE.MeshStandardMaterial({color:0x111,metalness:0.9,roughness:0.2}));pole.position.set(cx,3.85,cz);scene.add(pole);

    // NOT: Duvardaki butonlar tamamen kaldırıldı.

    // Zar Masası
    const dtGroup=new THREE.Group();dtGroup.position.set(cx+4.5,0,cz+4.5);scene.add(dtGroup);
    const lGeo=new THREE.CylinderGeometry(0.1,0.05,0.8,32);const lMat=new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.7});
    for(let i of[-0.6,0.6]){for(let j of[-0.6,0.6]){const l=new THREE.Mesh(lGeo,lMat);l.position.set(i,0.4,j);dtGroup.add(l);}}
    const feltTex=createFeltTexture('#0a4a1a');
    const trayBase=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.1,1.4),new THREE.MeshStandardMaterial({map:feltTex,roughness:0.9}));trayBase.position.y=0.85;dtGroup.add(trayBase);
    const bGeoX=new THREE.BoxGeometry(1.6,0.2,0.1);const bGeoZ=new THREE.BoxGeometry(0.1,0.2,1.4);const bMat=new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.7});
    const b1=new THREE.Mesh(bGeoX,bMat);b1.position.set(0,0.95,0.75);dtGroup.add(b1);
    const b2=new THREE.Mesh(bGeoX,bMat);b2.position.set(0,0.95,-0.75);dtGroup.add(b2);
    const b3=new THREE.Mesh(bGeoZ,bMat);b3.position.set(0.75,0.95,0);dtGroup.add(b3);
    const b4=new THREE.Mesh(bGeoZ,bMat);b4.position.set(-0.75,0.95,0);dtGroup.add(b4);
    diceCtx1=document.createElement('canvas').getContext('2d');diceCtx1.canvas.width=256;diceCtx1.canvas.height=256;
    diceCtx2=document.createElement('canvas').getContext('2d');diceCtx2.canvas.width=256;diceCtx2.canvas.height=256;
    let diceTex1=new THREE.CanvasTexture(diceCtx1.canvas);let diceTex2=new THREE.CanvasTexture(diceCtx2.canvas);
    drawDiceCanvas(diceCtx1,6);drawDiceCanvas(diceCtx2,6);
    dice1Mesh=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3),new THREE.MeshStandardMaterial({map:diceTex1,roughness:0.3,metalness:0.1}));
    dice1Mesh.position.set(cx+4.15,1.05,cz+4.5);dice1Mesh.rotation.set(0,Math.PI/4,0);dice1Mesh.userData={type:'ROLL_3D_DICE'};scene.add(dice1Mesh);objects.push(dice1Mesh);
    dice2Mesh=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3),new THREE.MeshStandardMaterial({map:diceTex2,roughness:0.3,metalness:0.1}));
    dice2Mesh.position.set(cx+4.85,1.05,cz+4.4);dice2Mesh.rotation.set(0,Math.PI/6,0);dice2Mesh.userData={type:'ROLL_3D_DICE'};scene.add(dice2Mesh);objects.push(dice2Mesh);

    // Deri Kanepe
    loadModelNormalized(KH_URL + '/SheenWoodLeatherSofa/glTF-Binary/SheenWoodLeatherSofa.glb', 5.10, (sofa) => {
        sofa.position.set(cx, 0, cz - 4.4);
        sofa.rotation.y = 0;
        scene.add(sofa);
    });

    // Robot Expressive & Masa
    const rbtTableGroup = new THREE.Group();
    const rbtX = cx - 4.5, rbtZ = cz - 4.0;
    rbtTableGroup.position.set(rbtX, 0, rbtZ);
    scene.add(rbtTableGroup);

    const blkMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.8, roughness: 0.2});
    const blkTopMat = new THREE.MeshStandardMaterial({color: 0x181818, roughness: 0.3});
    const rbtLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16), blkMat);
    rbtLeg.position.y = 0.4;
    rbtTableGroup.add(rbtLeg);
    const rbtBase = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 32), blkMat);
    rbtBase.position.y = 0.02;
    rbtTableGroup.add(rbtBase);
    const rbtTop = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.05, 32), blkTopMat);
    rbtTop.position.y = 0.8;
    rbtTableGroup.add(rbtTop);

    loadModelNormalized(TJ_URL + '/RobotExpressive/RobotExpressive.glb', 0.65, (rGroup, gltf) => {
        rGroup.position.set(rbtX, 0.825, rbtZ);
        rGroup.rotation.y = Math.PI / 4;
        scene.add(rGroup);

        robotMixer = new THREE.AnimationMixer(gltf.scene);
        modelMixers.push(robotMixer);

        robotActions = {};
        if (gltf.animations) {
            gltf.animations.forEach(clip => {
                robotActions[clip.name.toLowerCase()] = robotMixer.clipAction(clip);
            });
            const def = robotActions['idle'] || robotActions['dance'] || Object.values(robotActions)[0];
            if (def) { def.play(); currentRobotAction = def; }
        }
    });

    robotButtonsGroup = new THREE.Group();
    robotButtonsGroup.position.set(rbtX, 1.75, rbtZ);
    scene.add(robotButtonsGroup);

    const btnCoords = [
        [-0.34, 0.15, 0],
        [ 0.34, 0.15, 0],
        [-0.34, -0.15, 0],
        [ 0.34, -0.15, 0]
    ];
    robotButtonMeshes = [];
    btnCoords.forEach(pos => {
        const cv = document.createElement('canvas');
        cv.width = 256; cv.height = 96;
        const tex = new THREE.CanvasTexture(cv);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        const bMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.22), mat);
        bMesh.position.set(pos[0], pos[1], pos[2]);
        bMesh.userData = { type: 'ROBOT_ACTION_BTN', canvas: cv, actionKey: '', actionLabel: '' };
        robotButtonsGroup.add(bMesh);
        objects.push(bMesh);
        robotButtonMeshes.push(bMesh);
    });
    window.updateRobotButtons();

    // TV Duvarı (Duvardaki butonlar kaldırıldı)
    const horrorWallCanvas=document.createElement('canvas');horrorWallCanvas.width=1024;horrorWallCanvas.height=512;
    window.horrorWallCtx=horrorWallCanvas.getContext('2d');
    window.horrorWallTex=new THREE.CanvasTexture(horrorWallCanvas);
    window.horrorWallTex.magFilter=THREE.LinearFilter;

    const hwTvCasing=new THREE.Mesh(new THREE.BoxGeometry(0.10,2.5,5.0),new THREE.MeshStandardMaterial({color:0x111111,roughness:0.4,metalness:0.6}));
    hwTvCasing.position.set(cx+5.95,2.6,cz-1.5);scene.add(hwTvCasing);
    const hwMat=new THREE.MeshBasicMaterial({map:window.horrorWallTex});
    const hwScreen=new THREE.Mesh(new THREE.PlaneGeometry(4.8,2.2),hwMat);
    hwScreen.position.set(cx+5.898,2.6,cz-1.5);hwScreen.rotation.y=-Math.PI/2;scene.add(hwScreen);

    window.hwImgCache={};
    window.horrorListScrollY=0;
    function getHWImg(src,cb){
        if(!src){cb(null);return;}
        if(window.hwImgCache[src]!==undefined){cb(window.hwImgCache[src]);return;}
        window.hwImgCache[src]=null;
        const img=new Image();img.crossOrigin='Anonymous';
        img.onload=()=>{window.hwImgCache[src]=img;cb(img);};
        img.onerror=()=>{window.hwImgCache[src]=false;cb(null);};
        img.src=src;
    }

    // Karartmasız, Seçilen Oyun Yazısız ve Steam ID'siz TV ekranı
    window.updateHorrorWallScreen=function(){
        const ctx=window.horrorWallCtx;
        if(window.horrorWallMode==='won'&&window.horrorWallWonGame){
            const g=window.horrorWallWonGame;
            const src=g.img||g.image||(g.steamId&&!isNaN(g.steamId)?`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steamId}/header.jpg`:null);
            const renderWon=(img)=>{
                ctx.fillStyle='#000';ctx.fillRect(0,0,1024,512);
                if(img){ctx.drawImage(img,0,0,1024,512);}
                drawWonInfo(ctx,g);
                window.horrorWallTex.needsUpdate=true;
            };
            getHWImg(src,renderWon);
            return;
        }else{
            ctx.fillStyle='#000';ctx.fillRect(0,0,1024,512);
        }
        window.horrorWallTex.needsUpdate=true;
    };

    function drawWonInfo(ctx,g){
        ctx.textAlign='center';
        function st(text,x,y,col,size,font){
            ctx.font=font||`bold ${size}px 'Courier New',monospace`;
            ctx.fillStyle='rgba(0,0,0,0.95)';ctx.fillText(text,x+2,y+2);ctx.fillText(text,x-2,y+2);ctx.fillText(text,x+2,y-2);ctx.fillText(text,x-2,y-2);
            ctx.fillStyle=col;ctx.fillText(text,x,y);
        }
        const fs=g.name.length>16?58:80;
        st(g.name,512,180,'#ffd700',fs,`bold ${fs}px 'Special Elite',cursive`);
        st('Tür: '+(g.type||''),512,270,'#aaffaa',28);
        st('Süre: '+(g.playtime||g.time||''),512,325,'#aaffaa',28);
        window.horrorWallTex.needsUpdate=true;
    }

    window.horrorWallMode='idle';
    window.updateHorrorWallScreen();
}
