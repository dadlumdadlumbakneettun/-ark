function createHeartHandle(colorHex) {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
    const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
    geometry.center();
    geometry.scale(0.005, 0.005, 0.005);
    geometry.rotateZ(Math.PI);
    geometry.rotateY(Math.PI / 2);

    const material = new THREE.MeshStandardMaterial( { color: colorHex, roughness: 0.3, metalness: 0.1 } );
    return new THREE.Mesh( geometry, material );
}

function buildKitchen(scene, cx, cz) {
    const kitchenGroup = new THREE.Group();
    kitchenGroup.position.set(cx - 5.9, 0, cz); 
    kitchenGroup.rotation.y = 0; 
    scene.add(kitchenGroup);

    const basePurpleMat = new THREE.MeshStandardMaterial({color: 0x5a3a6a, roughness: 0.8}); 
    const lightPurpleMat = new THREE.MeshStandardMaterial({color: 0x9B84B5, roughness: 0.5}); 
    const pinkHeartColor = 0xE583A6; 
    const counterTopMat = new THREE.MeshStandardMaterial({color: 0xe6e6fa, roughness: 0.2, metalness: 0.1}); 
    const darkOvenMat = new THREE.MeshStandardMaterial({color: 0x221133, roughness: 0.6, metalness: 0.4});
    const steelMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, roughness: 0.3, metalness: 0.8});
    const glassMat = new THREE.MeshStandardMaterial({color: 0x111122, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.7});
    const toeKickMat = new THREE.MeshStandardMaterial({color: 0x1a1a1a, roughness: 0.9}); 

    function createCabinetDoor(width, height, mat) {
        const doorGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.04, height, width), mat);
        doorGroup.add(base);
        const innerPanel = new THREE.Mesh(new THREE.BoxGeometry(0.01, height - 0.15, width - 0.15), new THREE.MeshStandardMaterial({color: 0x8a73a3, roughness: 0.6}));
        innerPanel.position.set(0.021, 0, 0); 
        doorGroup.add(innerPanel);
        return doorGroup;
    }

    const createLowerCabinet = (zPos) => {
        const toeKick = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 1.2), toeKickMat);
        toeKick.position.set(0.5, 0.075, zPos);
        kitchenGroup.add(toeKick);

        const cabinetBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 1.2), basePurpleMat);
        cabinetBase.position.set(0.55, 0.575, zPos);
        kitchenGroup.add(cabinetBase);

        const drawer = createCabinetDoor(1.15, 0.2, lightPurpleMat);
        drawer.position.set(1.12, 0.88, zPos);
        kitchenGroup.add(drawer);
        
        const h1 = createHeartHandle(pinkHeartColor);
        h1.position.set(1.16, 0.88, zPos);
        h1.scale.set(0.8, 0.8, 0.8); 
        kitchenGroup.add(h1);

        const door = createCabinetDoor(1.15, 0.6, lightPurpleMat);
        door.position.set(1.12, 0.45, zPos);
        kitchenGroup.add(door);

        const h2 = createHeartHandle(pinkHeartColor);
        h2.position.set(1.16, 0.6, zPos - 0.4);
        kitchenGroup.add(h2);
    };

    createLowerCabinet(-4.5);
    createLowerCabinet(-3.3);
    createLowerCabinet(-2.1);
    createLowerCabinet(0.3);
    createLowerCabinet(1.5);

    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 7.3), counterTopMat);
    counterTop.position.set(0.65, 1.04, -1.5);
    kitchenGroup.add(counterTop);

    const backsplash = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 7.3), counterTopMat);
    backsplash.position.set(0.025, 1.18, -1.5);
    kitchenGroup.add(backsplash);

    const createUpperCabinet = (zPos) => {
        const cabinetBase = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 1.2), basePurpleMat);
        cabinetBase.position.set(0.3, 3.2, zPos);
        kitchenGroup.add(cabinetBase);

        const upperDoor = createCabinetDoor(1.15, 1.15, lightPurpleMat);
        upperDoor.position.set(0.62, 3.2, zPos);
        kitchenGroup.add(upperDoor);

        const uh = createHeartHandle(pinkHeartColor);
        uh.position.set(0.66, 2.8, zPos - 0.4);
        kitchenGroup.add(uh);
    };

    createUpperCabinet(-4.5);
    createUpperCabinet(-3.3);
    createUpperCabinet(-2.1);
    createUpperCabinet(0.3);
    createUpperCabinet(1.5);

    const oZ = -0.9, fX = 0.55, ot = 0.06;
    const obBk = new THREE.Mesh(new THREE.BoxGeometry(ot, 1.0, 1.2), darkOvenMat);
    obBk.position.set(fX - 0.55 + ot/2, 0.5, oZ); kitchenGroup.add(obBk);
    const obL = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, ot), darkOvenMat);
    obL.position.set(fX, 0.5, oZ - 0.6 + ot/2); kitchenGroup.add(obL);
    const obR = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, ot), darkOvenMat);
    obR.position.set(fX, 0.5, oZ + 0.6 - ot/2); kitchenGroup.add(obR);
    const obTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, ot, 1.2), darkOvenMat);
    obTop.position.set(fX, 1.0 - ot/2, oZ); kitchenGroup.add(obTop);
    const obBot = new THREE.Mesh(new THREE.BoxGeometry(1.1, ot, 1.2), darkOvenMat);
    obBot.position.set(fX, ot/2, oZ); kitchenGroup.add(obBot);

    const ovenIM = new THREE.MeshBasicMaterial({color: 0x05020a, side: THREE.DoubleSide});
    const ovenBW = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.7), ovenIM);
    ovenBW.position.set(fX - 0.38, 0.45, oZ); ovenBW.rotation.y = Math.PI / 2; kitchenGroup.add(ovenBW);
    const ovenSL = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.7), ovenIM);
    ovenSL.position.set(fX, 0.45, oZ - 0.52); ovenSL.rotation.y = 0; kitchenGroup.add(ovenSL);
    const ovenSR = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.7), ovenIM);
    ovenSR.position.set(fX, 0.45, oZ + 0.52); ovenSR.rotation.y = Math.PI; kitchenGroup.add(ovenSR);
    const ovenCeil = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.1), ovenIM);
    ovenCeil.position.set(fX, 0.78, oZ); ovenCeil.rotation.x = Math.PI / 2; kitchenGroup.add(ovenCeil);
    const ovenFlr = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.1), ovenIM);
    ovenFlr.position.set(fX, 0.12, oZ); ovenFlr.rotation.x = -Math.PI / 2; kitchenGroup.add(ovenFlr);

    const oRack = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 1.0), steelMat);
    oRack.position.set(fX + 0.1, 0.45, oZ);
    kitchenGroup.add(oRack);

    const oHeat = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({color: 0xff4400, transparent:true, opacity:0.8}));
    oHeat.position.set(0.15, 0.45, oZ);
    oHeat.rotation.y = Math.PI / 2;
    kitchenGroup.add(oHeat);

    const stoveW = 1.1, stoveD = 1.2, stoveY = 1.085; 
    const stovePlate = new THREE.Mesh(new THREE.BoxGeometry(stoveW, 0.025, stoveD), new THREE.MeshStandardMaterial({color: 0x1a1a2e, roughness: 0.4, metalness: 0.6}));
    stovePlate.position.set(fX, stoveY, oZ);
    kitchenGroup.add(stovePlate);

    const chromeMat = new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.9, roughness: 0.2});
    const edgeT = 0.015;
    const edgeFront = new THREE.Mesh(new THREE.BoxGeometry(stoveW, edgeT, edgeT), chromeMat);
    edgeFront.position.set(fX, stoveY + 0.012, oZ + stoveD/2); kitchenGroup.add(edgeFront);
    const edgeBack = new THREE.Mesh(new THREE.BoxGeometry(stoveW, edgeT, edgeT), chromeMat);
    edgeBack.position.set(fX, stoveY + 0.012, oZ - stoveD/2); kitchenGroup.add(edgeBack);
    const edgeLeft = new THREE.Mesh(new THREE.BoxGeometry(edgeT, edgeT, stoveD), chromeMat);
    edgeLeft.position.set(fX - stoveW/2, stoveY + 0.012, oZ); kitchenGroup.add(edgeLeft);
    const edgeRight = new THREE.Mesh(new THREE.BoxGeometry(edgeT, edgeT, stoveD), chromeMat);
    edgeRight.position.set(fX + stoveW/2, stoveY + 0.012, oZ); kitchenGroup.add(edgeRight);

    const burnerMat = new THREE.MeshStandardMaterial({color: 0x0d0d0d, roughness: 0.95});
    const burnerRingMat = new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.5, roughness: 0.6});
    const bCols = [fX - 0.22, fX + 0.20], bRows = [oZ - 0.30, oZ + 0.30];
    bCols.forEach(bx => {
        bRows.forEach(bz => {
            const by = stoveY + 0.015;
            const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.018, 12, 48), burnerRingMat);
            ring1.rotation.x = Math.PI / 2; ring1.position.set(bx, by, bz); kitchenGroup.add(ring1);
            const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.012, 12, 48), burnerRingMat);
            ring2.rotation.x = Math.PI / 2; ring2.position.set(bx, by, bz); kitchenGroup.add(ring2);
            const center = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 24), burnerMat);
            center.position.set(bx, by, bz); kitchenGroup.add(center);
            for (let a = 0; a < 4; a++) {
                const bar = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.008, 0.012), burnerMat);
                bar.rotation.y = (Math.PI / 4) * a; bar.position.set(bx, by + 0.005, bz); kitchenGroup.add(bar);
            }
        });
    });

    const panelMat = new THREE.MeshStandardMaterial({color: 0x2a1a3a, roughness: 0.5, metalness: 0.3});
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.10, stoveD), panelMat);
    panel.position.set(fX + stoveW/2 - 0.025, stoveY + 0.06, oZ); kitchenGroup.add(panel);
    const panelTop = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.008, stoveD + 0.01), chromeMat);
    panelTop.position.set(fX + stoveW/2 - 0.025, stoveY + 0.112, oZ); kitchenGroup.add(panelTop);

    const knobMat = new THREE.MeshStandardMaterial({color: pinkHeartColor, roughness: 0.2, metalness: 0.3});
    const knobRimMat = new THREE.MeshStandardMaterial({color: 0xdddddd, metalness: 0.9, roughness: 0.1});
    const knobZPositions = [oZ - 0.42, oZ - 0.14, oZ + 0.14, oZ + 0.42];
    knobZPositions.forEach(kz => {
        const kx = fX + stoveW/2 + 0.012; const ky = stoveY + 0.072;
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.012, 24), knobRimMat);
        rim.rotation.z = Math.PI / 2; rim.position.set(kx - 0.004, ky, kz); kitchenGroup.add(rim);
        const knobBody = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.050, 0.055, 24), knobMat);
        knobBody.rotation.z = Math.PI / 2; knobBody.position.set(kx + 0.018, ky, kz); kitchenGroup.add(knobBody);
    });

    window.ovenDoorHinge = new THREE.Group();
    window.ovenDoorHinge.position.set(1.1, 0.1, oZ); 
    kitchenGroup.add(window.ovenDoorHinge);

    const ovenDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 1.2), darkOvenMat);
    ovenDoorFrame.position.set(0.025, 0.35, 0); ovenDoorFrame.userData = {type: 'TOGGLE_OVEN'};
    window.ovenDoorHinge.add(ovenDoorFrame); objects.push(ovenDoorFrame);

    const ovenGlass = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.9), glassMat);
    ovenGlass.position.set(0.025, 0.35, 0); ovenGlass.userData = {type: 'TOGGLE_OVEN'};
    window.ovenDoorHinge.add(ovenGlass); objects.push(ovenGlass);

    const oHandle = createHeartHandle(pinkHeartColor);
    oHandle.position.set(0.08, 0.6, 0);
    window.ovenDoorHinge.add(oHandle);

    const gapFiller = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 1.2), darkOvenMat);
    gapFiller.position.set(fX + 0.55, 0.89, oZ); kitchenGroup.add(gapFiller);

    const hoodGroup = new THREE.Group(); hoodGroup.position.set(0.6, 2.0, oZ); kitchenGroup.add(hoodGroup);
    const hoodMain = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 1.2), steelMat); hoodGroup.add(hoodMain);
    const hoodSlant = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.8, 0.6, 4), steelMat);
    hoodSlant.rotation.y = Math.PI / 4; hoodSlant.position.set(-0.2, 0.4, 0); hoodGroup.add(hoodSlant);
    const hoodPipe = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), steelMat);
    hoodPipe.position.set(-0.2, 1.6, 0); hoodGroup.add(hoodPipe);

    const fZ = 3.3, frX = 0.6, t = 0.06;
    const fbBack = new THREE.Mesh(new THREE.BoxGeometry(t, 4.0, 1.8), basePurpleMat);
    fbBack.position.set(frX - 0.6 + t/2, 2.0, fZ); kitchenGroup.add(fbBack);
    const fbLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, t), basePurpleMat);
    fbLeft.position.set(frX, 2.0, fZ - 0.9 + t/2); kitchenGroup.add(fbLeft);
    const fbRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, t), basePurpleMat);
    fbRight.position.set(frX, 2.0, fZ + 0.9 - t/2); kitchenGroup.add(fbRight);
    const fbTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, t, 1.8), basePurpleMat);
    fbTop.position.set(frX, 4.0 - t/2, fZ); kitchenGroup.add(fbTop);
    const fbBot = new THREE.Mesh(new THREE.BoxGeometry(1.2, t, 1.8), basePurpleMat);
    fbBot.position.set(frX, t/2, fZ); kitchenGroup.add(fbBot);

    const fridgeIM = new THREE.MeshStandardMaterial({color: 0xf0e6f5, roughness: 0.5, side: THREE.FrontSide});
    const fbiBk = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 4.0), fridgeIM);
    fbiBk.position.set(frX - 0.6 + t + 0.01, 2.0, fZ); fbiBk.rotation.y = Math.PI / 2; kitchenGroup.add(fbiBk);
    const fbiL = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 4.0), fridgeIM);
    fbiL.position.set(frX, 2.0, fZ - 0.9 + t + 0.01); fbiL.rotation.y = 0; kitchenGroup.add(fbiL);
    const fbiR = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 4.0), fridgeIM);
    fbiR.position.set(frX, 2.0, fZ + 0.9 - t - 0.01); fbiR.rotation.y = Math.PI; kitchenGroup.add(fbiR);
    const fbiTop = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.8), fridgeIM);
    fbiTop.position.set(frX, 4.0 - t - 0.01, fZ); fbiTop.rotation.x = Math.PI / 2; kitchenGroup.add(fbiTop);
    const fbiBot = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.8), fridgeIM);
    fbiBot.position.set(frX, t + 0.01, fZ); fbiBot.rotation.x = -Math.PI / 2; kitchenGroup.add(fbiBot);

    const shelfMat = new THREE.MeshStandardMaterial({color: 0xddffff, transparent: true, opacity: 0.6, roughness: 0.1});
    for(let y = 0.8; y <= 3.2; y += 0.8) {
        const fShelf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.02, 1.5), shelfMat);
        fShelf.position.set(frX + 0.1, y, fZ); kitchenGroup.add(fShelf);
    }

    window.fridgeDoorHinge = new THREE.Group();
    window.fridgeDoorHinge.position.set(frX + 0.6, 2.0, fZ - 0.9); 
    kitchenGroup.add(window.fridgeDoorHinge);

    const fridgeDoor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.0, 1.8), lightPurpleMat);
    fridgeDoor.position.set(0.05, 0, 0.9); fridgeDoor.userData = {type: 'TOGGLE_FRIDGE'};
    window.fridgeDoorHinge.add(fridgeDoor); objects.push(fridgeDoor);

    const fHandle = createHeartHandle(pinkHeartColor);
    fHandle.position.set(0.12, -0.2, 1.6); fHandle.scale.set(1.5, 1.5, 1.5);
    window.fridgeDoorHinge.add(fHandle);
}

function buildChillRoom(){
    const cx=0,cz=100;
    initChillWallBase();
    const floorTex=createFloorTexture('#ffb3c6','#ffc2d1');
    const ceilTex=createCeilingTexture();
    const floorMat=new THREE.MeshStandardMaterial({map:floorTex,roughness:0.8});
    
    const light=new THREE.PointLight(0xffd5e2, 0.75, 22);
    light.position.set(cx, 3.8, cz);
    scene.add(light);
    addCeilingLamp(scene, cx, 4.45, cz);
    
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(12,12),floorMat);
    floor.rotation.x=-Math.PI/2;floor.position.set(cx,0,cz);scene.add(floor);
    const ceil=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.MeshStandardMaterial({map:ceilTex,roughness:0.9}));
    ceil.rotation.x=Math.PI/2;ceil.position.set(cx,4.5,cz);scene.add(ceil);
    
    const wGeo=new THREE.PlaneGeometry(12,4.5);
    const wallTransforms=[{x:cx,z:cz-6,ry:0},{x:cx,z:cz+6,ry:Math.PI},{x:cx-6,z:cz,ry:Math.PI/2},{x:cx+6,z:cz,ry:-Math.PI/2}];
    wallTransforms.forEach(wt=>{
        const c=document.createElement('canvas');c.width=2048;c.height=2048;
        const cCtx=c.getContext('2d');cCtx.drawImage(chillWallBaseCanvas,0,0);
        const tex=new THREE.CanvasTexture(c);
        const mat=new THREE.MeshStandardMaterial({map:tex,side:THREE.DoubleSide,roughness:0.6});
        const w=new THREE.Mesh(wGeo,mat);
        w.position.set(wt.x,2.25,wt.z);w.rotation.y=wt.ry;w.userData={type:'PAINTABLE_WALL',ctx:cCtx,tex:tex};
        scene.add(w);objects.push(w);chillWalls.push(w);
    });
    
    const rbTex=createRainbowTexture();
    const rbMat=new THREE.MeshBasicMaterial({map:rbTex,transparent:true,side:THREE.DoubleSide});
    const rainbowPlane=new THREE.Mesh(new THREE.PlaneGeometry(6,3),rbMat);
    rainbowPlane.position.set(cx,3.0,cz+5.9);rainbowPlane.rotation.y=Math.PI;scene.add(rainbowPlane);
    
    const chillDoorTex=createPinkPatternDoor();
    const exitDoor=new THREE.Mesh(new THREE.BoxGeometry(2.0,3.2,0.15),new THREE.MeshStandardMaterial({map:chillDoorTex,roughness:0.5}));
    exitDoor.position.set(cx,1.6,cz-5.85);exitDoor.scale.x=-1;exitDoor.userData={type:'GO_TO_CORRIDOR'};
    scene.add(exitDoor);objects.push(exitDoor);addKnob(exitDoor,false);

    // Ayıcık & Masası
    const bearX=cx+4.5, bearZ=cz-4.5;
    const bearTable=new THREE.Group();bearTable.position.set(bearX,0,bearZ);scene.add(bearTable);
    const btLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.8,16),new THREE.MeshStandardMaterial({color:0xffffff}));btLeg.position.y=0.4;bearTable.add(btLeg);
    const btTop=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.05,32),new THREE.MeshStandardMaterial({color:0xffccdd}));btTop.position.y=0.8;bearTable.add(btTop);

    const bearGroup=new THREE.Group();bearGroup.position.set(bearX,0.85,bearZ);bearGroup.rotation.y=-Math.PI/3;scene.add(bearGroup);
    const bMainMat=new THREE.MeshStandardMaterial({color:0xff99bb,roughness:0.9});
    const bLightMat=new THREE.MeshStandardMaterial({color:0xffe6f0,roughness:0.8});
    const bDarkMat=new THREE.MeshStandardMaterial({color:0x111111,roughness:0.4,metalness:0.2});

    const bodyGeo=new THREE.SphereGeometry(0.18,32,32);bodyGeo.scale(1,1.2,1);
    const bearBody=new THREE.Mesh(bodyGeo,bMainMat);bearBody.position.y=0.18;bearBody.userData={type:'CLICK_TEDDY'};bearGroup.add(bearBody);objects.push(bearBody);
    const belly=new THREE.Mesh(new THREE.SphereGeometry(0.14,32,32),bLightMat);belly.scale.set(1,1.2,0.5);belly.position.set(0,0.16,0.11);bearGroup.add(belly);
    const bearHead=new THREE.Mesh(new THREE.SphereGeometry(0.15,32,32),bMainMat);bearHead.position.set(0,0.45,0);bearHead.userData={type:'CLICK_TEDDY'};bearGroup.add(bearHead);objects.push(bearHead);

    const earGeo=new THREE.SphereGeometry(0.05,16,16);const inEarGeo=new THREE.SphereGeometry(0.03,16,16);inEarGeo.scale(1,1,0.3);
    const earL=new THREE.Mesh(earGeo,bMainMat);earL.position.set(-0.11,0.56,-0.02);bearGroup.add(earL);
    const inEarL=new THREE.Mesh(inEarGeo,bLightMat);inEarL.position.set(-0.11,0.56,0.02);bearGroup.add(inEarL);
    const earR=new THREE.Mesh(earGeo,bMainMat);earR.position.set(0.11,0.56,-0.02);bearGroup.add(earR);
    const inEarR=new THREE.Mesh(inEarGeo,bLightMat);inEarR.position.set(0.11,0.56,0.02);bearGroup.add(inEarR);
    const snout=new THREE.Mesh(new THREE.SphereGeometry(0.06,32,32),bLightMat);snout.scale.set(1.2,0.8,1);snout.position.set(0,0.40,0.13);bearGroup.add(snout);
    const nose=new THREE.Mesh(new THREE.SphereGeometry(0.02,16,16),bDarkMat);nose.position.set(0,0.43,0.185);nose.scale.set(1.2,0.8,1);bearGroup.add(nose);
    const eyeGeo=new THREE.SphereGeometry(0.015,16,16);
    const eyeL=new THREE.Mesh(eyeGeo,bDarkMat);eyeL.position.set(-0.06,0.48,0.12);bearGroup.add(eyeL);
    const eyeR=new THREE.Mesh(eyeGeo,bDarkMat);eyeR.position.set(0.06,0.48,0.12);bearGroup.add(eyeR);

    const mouthGeo=new THREE.TorusGeometry(0.02,0.004,8,16,Math.PI);const mouth=new THREE.Mesh(mouthGeo,bDarkMat);mouth.position.set(0,0.38,0.18);mouth.rotation.z=Math.PI;bearGroup.add(mouth);
    const armGeo=new THREE.SphereGeometry(0.04,16,16);armGeo.scale(1,2.5,1);
    const armL=new THREE.Mesh(armGeo,bMainMat);armL.position.set(-0.16,0.25,0.05);armL.rotation.z=Math.PI/4;armL.rotation.x=Math.PI/6;bearGroup.add(armL);
    const armR=new THREE.Mesh(armGeo,bMainMat);armR.position.set(0.16,0.25,0.05);armR.rotation.z=-Math.PI/4;armR.rotation.x=Math.PI/6;bearGroup.add(armR);
    const legGeo=new THREE.SphereGeometry(0.05,16,16);legGeo.scale(1,2.0,1);
    const legL=new THREE.Mesh(legGeo,bMainMat);legL.position.set(-0.12,0.08,0.12);legL.rotation.x=Math.PI/2.2;legL.rotation.z=-Math.PI/8;bearGroup.add(legL);
    const legR=new THREE.Mesh(legGeo,bMainMat);legR.position.set(0.12,0.08,0.12);legR.rotation.x=Math.PI/2.2;legR.rotation.z=Math.PI/8;bearGroup.add(legR);

    // Çizim Paleti & Kol
    drawCanvas=document.createElement('canvas');drawCanvas.width=512;drawCanvas.height=128;drawCtx=drawCanvas.getContext('2d');
    drawPalette();drawTexture=new THREE.CanvasTexture(drawCanvas);
    const drawBoard=new THREE.Mesh(new THREE.PlaneGeometry(1.5,0.375),new THREE.MeshBasicMaterial({map:drawTexture}));
    drawBoard.position.set(cx+5.4,1.2,cz);drawBoard.rotation.set(-Math.PI/6,-Math.PI/2,0,'YXZ');drawBoard.userData={type:'COLOR_PALETTE'};scene.add(drawBoard);objects.push(drawBoard);
    const easelStand=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,1.5),new THREE.MeshStandardMaterial({color:0x885533}));easelStand.position.set(cx+5.6,0.6,cz);scene.add(easelStand);
    
    const leverGroup=new THREE.Group();leverGroup.position.set(cx+5.9,1.5,cz-1.0);leverGroup.rotation.y=-Math.PI/2;scene.add(leverGroup);
    const leverBase=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.25,0.25),new THREE.MeshStandardMaterial({color:0x555566,roughness:0.4,metalness:0.7}));leverGroup.add(leverBase);
    window.leverPivot=new THREE.Group();window.leverPivot.position.set(0.05,0.08,0);leverGroup.add(window.leverPivot);
    const rod=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.45,16),new THREE.MeshStandardMaterial({color:0xcc2244,roughness:0.3,metalness:0.6}));rod.position.set(0,0.225,0);window.leverPivot.add(rod);
    const ball=new THREE.Mesh(new THREE.SphereGeometry(0.06,32,32),new THREE.MeshStandardMaterial({color:0xff3366,roughness:0.2,metalness:0.1}));ball.position.set(0,0.47,0);window.leverPivot.add(ball);
    const clrBtn=new THREE.Mesh(new THREE.SphereGeometry(0.09,16,16),new THREE.MeshStandardMaterial({color:0xff3366,transparent:true,opacity:0.0}));clrBtn.position.set(0,0.47,0);window.leverPivot.add(clrBtn);
    window.leverPivot.userData={type:'BTN_CLEAR_DRAW',originalZ:cz+1.0,isPressed:false};clrBtn.userData={type:'BTN_CLEAR_DRAW',originalZ:cz+1.0,isPressed:false};objects.push(clrBtn);

    // Çark Masası & Gülen Yüz
    const tableGroup=new THREE.Group();tableGroup.position.set(cx,0,cz);scene.add(tableGroup);
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.8,0.9,32),new THREE.MeshStandardMaterial({color:'#ff9999',roughness:0.6}));leg.position.y=0.45;tableGroup.add(leg);
    const wheelTex=createRouletteTexture(window.getFilteredChillGames?window.getFilteredChillGames():chillGames,true);
    const wheelMats=[new THREE.MeshStandardMaterial({color:'#ff66b2',roughness:0.5}),new THREE.MeshStandardMaterial({map:wheelTex,roughness:0.9}),new THREE.MeshStandardMaterial({color:'#ffcc99',roughness:0.8})];
    chillWheelMesh=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,0.2,128),wheelMats);chillWheelMesh.position.y=1.0;chillWheelMesh.userData={type:'WHEEL_CHILL'};tableGroup.add(chillWheelMesh);objects.push(chillWheelMesh);
    smileyGroup=new THREE.Group();smileyGroup.position.set(0,1.1,0);tableGroup.add(smileyGroup);
    const smTex=createSmileyTexture();
    const smileyMesh=new THREE.Mesh(new THREE.SphereGeometry(0.48,64,64),new THREE.MeshStandardMaterial({map:smTex,roughness:0.4,metalness:0.1}));smileyMesh.rotation.y=-Math.PI/2;smileyGroup.add(smileyMesh);

    const cJumbotronMats=[new THREE.MeshBasicMaterial({map:chillScreenTex}),new THREE.MeshBasicMaterial({map:chillScreenTex}),new THREE.MeshStandardMaterial({color:0xff9999}),new THREE.MeshStandardMaterial({color:0xff9999}),new THREE.MeshBasicMaterial({map:chillScreenTex}),new THREE.MeshBasicMaterial({map:chillScreenTex})];
    const chillJumbo=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.8,1.5),cJumbotronMats);chillJumbo.position.set(cx,3.2,cz);scene.add(chillJumbo);
    const cPole=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,1.3,32),new THREE.MeshStandardMaterial({color:0xffb3c6}));cPole.position.set(cx,3.85,cz);scene.add(cPole);
    chillScreens=[cJumbotronMats[0],cJumbotronMats[1],cJumbotronMats[4],cJumbotronMats[5]];

    // Chill TV Duvarı
    const chillWallCanvas2=document.createElement('canvas');chillWallCanvas2.width=1024;chillWallCanvas2.height=512;
    window.chillWallCtx2=chillWallCanvas2.getContext('2d');window.chillWallTex2=new THREE.CanvasTexture(chillWallCanvas2);window.chillWallTex2.magFilter=THREE.LinearFilter;
    const cwTvCasing=new THREE.Mesh(new THREE.BoxGeometry(0.22,2.3,4.3),new THREE.MeshStandardMaterial({color:0xdd44aa,roughness:0.4,metalness:0.3}));cwTvCasing.position.set(cx+5.89,2.8,cz+2.5);scene.add(cwTvCasing);
    const cwScreen2=new THREE.Mesh(new THREE.PlaneGeometry(4.0,2.0),new THREE.MeshBasicMaterial({map:window.chillWallTex2}));cwScreen2.position.set(cx+5.77,2.8,cz+2.5);cwScreen2.rotation.y=-Math.PI/2;scene.add(cwScreen2);

    const chillBtnGroup=new THREE.Group();chillBtnGroup.position.set(cx+5.95,1.2,cz+2.5);chillBtnGroup.rotation.y=-Math.PI/2;scene.add(chillBtnGroup);
    const chillBtnPanel=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.4,0.1),new THREE.MeshStandardMaterial({color:0xff66b2,roughness:0.4,metalness:0.3}));chillBtnGroup.add(chillBtnPanel);
    const chillBtn=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.07,32).rotateX(Math.PI/2),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.2,metalness:0.2}));
    chillBtn.position.set(0,0,0.06);chillBtn.userData={type:'BTN_CHILL_LIST',originalZ:0.06,isPressed:false};chillBtnGroup.add(chillBtn);objects.push(chillBtn);

    window.cwImgCache={};
    function getCWImg(src,cb){
        if(!src){cb(null);return;}
        if(window.cwImgCache[src]!==undefined){cb(window.cwImgCache[src]);return;}
        window.cwImgCache[src]=null;
        const img=new Image();img.crossOrigin='Anonymous';
        img.onload=()=>{window.cwImgCache[src]=img;cb(img);};
        img.onerror=()=>{window.cwImgCache[src]=false;cb(null);};
        img.src=src;
    }
    function stChill(ctx,text,x,y,col,size,font){
        ctx.font=font||`bold ${size}px 'Courier New',monospace`;ctx.textAlign='center';
        ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillText(text,x+1,y+1);ctx.fillStyle=col;ctx.fillText(text,x,y);
    }
    window.chillListScrollY=0;
    window.updateChillWallScreen=function(){
        const ctx=window.chillWallCtx2;
        if(window.chillWallMode==='list'){
            const list=window.getFilteredChillGames?window.getFilteredChillGames():(window.chillWallListData||chillGames);
            const THUMB_W=130,THUMB_H=62,ITEM_H=74,START_Y=62;
            const visCount=Math.floor((512-START_Y)/ITEM_H);
            const startIdx=Math.max(0,Math.floor((window.chillListScrollY||0)/ITEM_H));
            ctx.fillStyle='#fff0f5';ctx.fillRect(0,0,1024,512);
            ctx.fillStyle='rgba(255,100,180,0.1)';for(let i=0;i<512;i+=10)ctx.fillRect(0,i,1024,5);
            stChill(ctx,'✿ ÇARKTAKI OYUNLAR ✿',512,40,'#cc0066',30);
            ctx.fillStyle='#ff99cc';ctx.fillRect(50,50,924,2);
            for(let i=startIdx;i<Math.min(list.length,startIdx+visCount+1);i++){
                const yBase=START_Y+(i-startIdx)*ITEM_H;if(yBase>512)break;
                const g=list[i];
                ctx.fillStyle=i%2===0?'rgba(255,200,220,0.5)':'rgba(255,180,210,0.3)';ctx.fillRect(0,yBase,1024,ITEM_H-2);
                const src=g.img||g.image||(g.steamId&&!isNaN(g.steamId)?`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steamId}/header.jpg`:null);
                const ci=src?window.cwImgCache[src]:undefined;
                if(ci){ctx.drawImage(ci,8,yBase+5,THUMB_W,THUMB_H);}
                else if(src&&ci===undefined){getCWImg(src,()=>{if(window.chillWallMode==='list')window.updateChillWallScreen();});}
                else{ctx.fillStyle='#ffccdd';ctx.fillRect(8,yBase+5,THUMB_W,THUMB_H);}
                const nm=g.name.length>30?g.name.substring(0,28)+'…':g.name;
                ctx.textAlign='left';ctx.fillStyle='rgba(0,0,0,0.8)';ctx.font="bold 19px 'Courier New',monospace";ctx.fillText(nm,149,yBase+33);
                ctx.fillStyle='#880044';ctx.fillText(nm,148,yBase+32);
                const sub=(g.desc||g.type||'').substring(0,40);const sub2=g.time||g.playtime||'';
                ctx.fillStyle='rgba(0,0,0,0.7)';ctx.font="12px 'Courier New',monospace";ctx.fillText(sub,148.5,yBase+55.5);
                ctx.fillStyle='#cc0055';ctx.fillText(sub,148,yBase+55);
                if(sub2){ctx.fillStyle='#ff6699';ctx.fillText(sub2,840,yBase+55);}
            }
            if(list.length>visCount){const bH=Math.max(20,(visCount/list.length)*440);const bY=50+((window.chillListScrollY||0)/(Math.max(1,list.length-visCount)*ITEM_H))*360;ctx.fillStyle='rgba(200,0,100,0.5)';ctx.fillRect(1012,bY,12,bH);}
        }else if(window.chillWallMode==='won'&&window.chillWallWonGame){
            const g=window.chillWallWonGame;
            const src=g.img||g.image||(g.steamId&&!isNaN(g.steamId)?`https://cdn.cloudflare.steamstatic.com/steam/apps/${g.steamId}/header.jpg`:null);
            const renderC=(img)=>{
                ctx.fillStyle='#ffb3c6';ctx.fillRect(0,0,1024,512);
                if(img){ctx.drawImage(img,0,0,1024,512);ctx.fillStyle='rgba(255,150,200,0.55)';ctx.fillRect(0,0,1024,512);}
                stChill(ctx,'♥ KAZANILAN OYUN ♥',512,70,'#ffffff',30);
                const fs=g.name.length>16?54:72;stChill(ctx,g.name,512,190,'#fff0f5',fs,`bold ${fs}px 'Special Elite',cursive`);
                stChill(ctx,(g.desc||g.type||'').substring(0,50),512,275,'#ffe0f0',22);
                stChill(ctx,'Süre: '+(g.time||g.playtime||''),512,315,'#ffe0f0',22);
                ctx.fillStyle='rgba(200,0,100,0.5)';ctx.fillRect(80,340,864,2);
                stChill(ctx,'Steam\'de ara: '+g.name.substring(0,30),512,375,'#ffccdd',20);
                window.chillWallTex2.needsUpdate=true;
            };
            getCWImg(src,renderC);return;
        }else{
            ctx.fillStyle='#ffe0ee';ctx.fillRect(0,0,1024,512);
            ctx.fillStyle='rgba(255,150,200,0.15)';for(let i=0;i<512;i+=14)ctx.fillRect(0,i,1024,7);
            stChill(ctx,'✿',512,170,'#ff66b2',80);stChill(ctx,'ÇARKI ÇEVİR!',512,280,'#cc0055',38);stChill(ctx,'Atlassya',512,340,'#aa0044',28);
        }
        window.chillWallTex2.needsUpdate=true;
    };
    window.chillWallMode='idle';
    window.updateChillWallScreen();

    // Korse Büstü
    const corsetX = cx + 4.2, corsetZ = cz + 4.5;
    const corsetAngle = Math.atan2(cx - corsetX, cz - corsetZ);
    const corsetPedestal = createPedestal(scene, corsetX, corsetZ, corsetAngle);
    loadModelNormalized(KH_URL + '/Corset/glTF-Binary/Corset.glb', 1.10, (corsetGroup) => {
        corsetGroup.position.set(corsetX, corsetPedestal.topY, corsetZ);
        corsetGroup.rotation.y = corsetAngle;
        scene.add(corsetGroup);
    });

    buildKitchen(scene, cx, cz);
}
