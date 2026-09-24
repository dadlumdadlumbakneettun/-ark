function buildAtlasRoom() {
    const cx = 0, cz = -100;

    // Zemin, Duvar ve Tavan Dokuları
    const floorTex = createFloorTexture('#362213', '#24140a');
    const wallTex = createRetroWallTexture('#dfd3b9'); // Bej Duvarlar
    const ceilTex = createCeilingTexture();

    const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.5 });
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85, side: THREE.DoubleSide });
    const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.9 });

    // Asla Kararmayan Parlak Mavi Ayna & Pencere Camı
    const mirrorBlueMat = new THREE.MeshBasicMaterial({
        color: 0x5b9bd5,
        side: THREE.DoubleSide
    });

    // Gardıroptaki Gri Ayna Malzemesi
    const solidGrayMirrorMat = new THREE.MeshBasicMaterial({
        color: 0x8a949f,
        side: THREE.DoubleSide
    });

    // Kulp Malzemesi
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xc5c8cc, metalness: 0.5, roughness: 0.3 });

    // Oda Boyutları
    const roomW = 6.4, roomD = 6.4;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.set(cx, 0, cz); scene.add(floor);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilMat);
    ceil.rotation.x = Math.PI / 2; ceil.position.set(cx, 3.8, cz); scene.add(ceil);

    // Bej Duvarlar
    const wTop = new THREE.Mesh(new THREE.PlaneGeometry(roomW, 3.8), wallMat); 
    wTop.position.set(cx, 1.9, cz - roomD/2); scene.add(wTop);

    const wBottom = new THREE.Mesh(new THREE.PlaneGeometry(roomW, 3.8), wallMat); 
    wBottom.position.set(cx, 1.9, cz + roomD/2); wBottom.rotation.y = Math.PI; scene.add(wBottom);

    const wLeft = new THREE.Mesh(new THREE.PlaneGeometry(roomD, 3.8), wallMat); 
    wLeft.position.set(cx - roomW/2, 1.9, cz); wLeft.rotation.y = Math.PI / 2; scene.add(wLeft);

    const wRight = new THREE.Mesh(new THREE.PlaneGeometry(roomD, 3.8), wallMat); 
    wRight.position.set(cx + roomW/2, 1.9, cz); wRight.rotation.y = -Math.PI / 2; scene.add(wRight);

    // ==========================================
    // 1. KISALTILMIŞ VE YUKARI KALDIRILMIŞ MAKROME SARKIT AVİZE
    // (Kafa hizasından yukarıda: 2.75m - 3.35m bandında asılı)
    // ==========================================
    const chandelierGroup = new THREE.Group();
    const macrameRopeMat = new THREE.MeshStandardMaterial({ color: 0xf6f3eb, roughness: 0.9 });
    const ceilingCapMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4 });

    const ceilingCap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 24), ceilingCapMat);
    ceilingCap.position.set(0, 3.78, 0); chandelierGroup.add(ceilingCap);

    // Kısaltılmış Askı İpi (0.45m boyunda)
    const cordLength = 0.45;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, cordLength, 12), macrameRopeMat);
    cord.position.set(0, 3.8 - cordLength / 2, 0); chandelierGroup.add(cord);

    // Avizenin Başlangıç Noktası (Tavana Yakın: Y = 3.35m)
    const lampCenterY = 3.8 - cordLength;

    const upperRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.016, 16, 32), macrameRopeMat);
    upperRing.rotation.x = Math.PI / 2; upperRing.position.set(0, lampCenterY, 0); chandelierGroup.add(upperRing);

    const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.018, 16, 32), macrameRopeMat);
    lowerRing.rotation.x = Math.PI / 2; lowerRing.position.set(0, lampCenterY - 0.32, 0); chandelierGroup.add(lowerRing);

    const strandCount = 32;
    for (let i = 0; i < strandCount; i++) {
        const angle = (i / strandCount) * Math.PI * 2;
        const x1 = Math.cos(angle) * 0.24, z1 = Math.sin(angle) * 0.24;
        const x2 = Math.cos(angle) * 0.36, z2 = Math.sin(angle) * 0.36;

        const strandGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.35, 8);
        const strand = new THREE.Mesh(strandGeo, macrameRopeMat);
        strand.position.set((x1 + x2) / 2, lampCenterY - 0.16, (z1 + z2) / 2);
        strand.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x2 - x1, -0.32, z2 - z1).normalize());
        chandelierGroup.add(strand);

        if (i % 2 === 0) {
            const crossGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.22, 6);
            const crossStrand = new THREE.Mesh(crossGeo, macrameRopeMat);
            crossStrand.position.set((x1 + x2)/2, lampCenterY - 0.12, (z1 + z2)/2);
            crossStrand.rotation.z = Math.PI / 4;
            chandelierGroup.add(crossStrand);
        }

        // Püsküller (En alt ucu Y = 2.78m'de sonlanır, kafaya asla değmez)
        const fringeLen = 0.22 + (i % 3) * 0.06;
        const fringe = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.004, fringeLen, 8), macrameRopeMat);
        fringe.position.set(x2, lampCenterY - 0.32 - fringeLen / 2, z2);
        chandelierGroup.add(fringe);

        const tasselKnot = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), macrameRopeMat);
        tasselKnot.position.set(x2, lampCenterY - 0.32 - fringeLen, z2);
        chandelierGroup.add(tasselKnot);
    }

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfffbee }));
    bulb.position.set(0, lampCenterY - 0.16, 0); chandelierGroup.add(bulb);

    const macrameLight = new THREE.PointLight(0xffeedd, 1.25, 20);
    macrameLight.position.set(0, lampCenterY - 0.16, 0); chandelierGroup.add(macrameLight);

    chandelierGroup.position.set(cx, 0, cz);
    scene.add(chandelierGroup);

    // ==========================================
    // SOL DUVARDAKİ MAVİ PENCERE
    // ==========================================
    const windowGroup = new THREE.Group();
    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.6), mirrorBlueMat);
    winGlass.position.set(0, 0, 0.04); windowGroup.add(winGlass);

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4 });
    const winFrameOuter = new THREE.Mesh(new THREE.BoxGeometry(2.15, 1.75, 0.07), frameMat); windowGroup.add(winFrameOuter);
    const winBarV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.6, 0.08), frameMat); windowGroup.add(winBarV);
    const winBarH = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.08), frameMat); windowGroup.add(winBarH);
    const winSill = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.07, 0.22), new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3 }));
    winSill.position.set(0, -0.88, 0.09); windowGroup.add(winSill);

    windowGroup.position.set(cx - roomW/2 + 0.04, 2.1, cz);
    windowGroup.rotation.y = Math.PI / 2;
    scene.add(windowGroup);

    // ==========================================
    // ÇIKIŞ KAPISI (Ahşap Dokulu)
    // ==========================================
    const doorGroup = new THREE.Group();
    doorGroup.position.set(cx + roomW/2 - 0.08, 1.45, cz + 2.1);

    const roomDoorTex = createDoorTexture(false);
    const exitDoorMat = new THREE.MeshStandardMaterial({ map: roomDoorTex, roughness: 0.6 });
    const exitDoor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.9, 1.35), exitDoorMat);
    exitDoor.userData = { type: 'GO_TO_CORRIDOR' };
    doorGroup.add(exitDoor);
    objects.push(exitDoor);

    const woodFrameTex = createWoodTexture('#2a1508', '10,5,0');
    const dFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.05, 1.48), new THREE.MeshStandardMaterial({ map: woodFrameTex, roughness: 0.7 }));
    doorGroup.add(dFrame);

    const dHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 }));
    dHandle.rotation.x = Math.PI / 2; dHandle.position.set(-0.06, 0, 0.48); doorGroup.add(dHandle);
    scene.add(doorGroup);

    // ==========================================
    // 3'LÜ BEYAZ GARDIROP (Ortada Gri Ayna)
    // ==========================================
    const wardrobeGroup = new THREE.Group();
    const wBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });

    const wDepth = 0.85;
    const doorW = 1.05;
    const wLength = doorW * 3;

    const wCarcass = new THREE.Mesh(new THREE.BoxGeometry(wDepth, 3.3, wLength), wBodyMat);
    wCarcass.position.set(0, 1.65, 0); wardrobeGroup.add(wCarcass);

    // 1. Sol Kapak
    const door1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.2, doorW - 0.02), new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.2 }));
    door1.position.set(-wDepth/2 - 0.02, 1.65, -doorW); wardrobeGroup.add(door1);
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.65, 0.02), handleMat);
    h1.position.set(-wDepth/2 - 0.045, 1.65, -doorW + doorW/2 - 0.1); wardrobeGroup.add(h1);

    // 2. Orta Kapak (Gri Ayna)
    const door2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.2, doorW - 0.02), new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.2 }));
    door2.position.set(-wDepth/2 - 0.02, 1.65, 0); wardrobeGroup.add(door2);
    const mirrorWardrobe = new THREE.Mesh(new THREE.PlaneGeometry(doorW - 0.08, 3.0), solidGrayMirrorMat);
    mirrorWardrobe.position.set(-wDepth/2 - 0.045, 1.65, 0);
    mirrorWardrobe.rotation.y = -Math.PI / 2;
    wardrobeGroup.add(mirrorWardrobe);
    const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.65, 0.02), handleMat);
    h2.position.set(-wDepth/2 - 0.05, 1.65, doorW/2 - 0.1); wardrobeGroup.add(h2);

    // 3. Sağ Kapak
    const door3 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.2, doorW - 0.02), new THREE.MeshStandardMaterial({ color: 0xf8f8f8, roughness: 0.2 }));
    door3.position.set(-wDepth/2 - 0.02, 1.65, doorW); wardrobeGroup.add(door3);
    const h3 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.65, 0.02), handleMat);
    h3.position.set(-wDepth/2 - 0.045, 1.65, doorW - doorW/2 + 0.1); wardrobeGroup.add(h3);

    wardrobeGroup.position.set(cx + roomW/2 - wDepth/2, 0, cz - roomD/2 + wLength/2);
    scene.add(wardrobeGroup);

    // ==========================================
    // DİKEY KİTAPLIK (Alttaki Dolap Uzun)
    // ==========================================
    const bookcaseGroup = new THREE.Group();
    const bcDepth = 0.75, bcWidth = 1.05, bcHeight = 3.3;

    const bcBack = new THREE.Mesh(new THREE.BoxGeometry(0.03, bcHeight, bcWidth), wBodyMat);
    bcBack.position.set(bcDepth/2 - 0.015, bcHeight/2, 0); bookcaseGroup.add(bcBack);

    const bcSideL = new THREE.Mesh(new THREE.BoxGeometry(bcDepth, bcHeight, 0.03), wBodyMat);
    bcSideL.position.set(0, bcHeight/2, -bcWidth/2 + 0.015); bookcaseGroup.add(bcSideL);
    const bcSideR = new THREE.Mesh(new THREE.BoxGeometry(bcDepth, bcHeight, 0.03), wBodyMat);
    bcSideR.position.set(0, bcHeight/2, bcWidth/2 - 0.015); bookcaseGroup.add(bcSideR);

    const bcTopP = new THREE.Mesh(new THREE.BoxGeometry(bcDepth, 0.03, bcWidth), wBodyMat);
    bcTopP.position.set(0, bcHeight - 0.015, 0); bookcaseGroup.add(bcTopP);
    const bcBottomP = new THREE.Mesh(new THREE.BoxGeometry(bcDepth, 0.03, bcWidth), wBodyMat);
    bcBottomP.position.set(0, 0.015, 0); bookcaseGroup.add(bcBottomP);

    // Uzatılmış Alt Dolap (Y: 0 - 1.22m)
    const cabinetHeight = 1.22;
    const bcDoor = new THREE.Mesh(new THREE.BoxGeometry(0.03, cabinetHeight - 0.04, bcWidth - 0.07), new THREE.MeshStandardMaterial({ color: 0xf6f6f6, roughness: 0.2 }));
    bcDoor.position.set(-bcDepth/2 + 0.015, cabinetHeight / 2, 0); bookcaseGroup.add(bcDoor);
    const bcDoorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.35, 0.02), handleMat);
    bcDoorHandle.position.set(-bcDepth/2 - 0.01, cabinetHeight / 2 + 0.15, bcWidth/2 - 0.15); bookcaseGroup.add(bcDoorHandle);

    for (let i = 0; i < 2; i++) {
        const bcDraw = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.27, bcWidth - 0.07), new THREE.MeshStandardMaterial({ color: 0xf9f9f9, roughness: 0.2 }));
        bcDraw.position.set(-bcDepth/2 + 0.015, 1.37 + i * 0.3, 0); bookcaseGroup.add(bcDraw);
        const bcDrawH = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.45), handleMat);
        bcDrawH.position.set(-bcDepth/2 - 0.01, 1.37 + i * 0.3, 0); bookcaseGroup.add(bcDrawH);
    }

    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const bookColors = [0x992222, 0x225588, 0x2e6b34, 0xd4af37, 0x553377, 0xc44536, 0x3d5a80];
    for (let s = 0; s < 3; s++) {
        const shelfY = 1.85 + s * 0.46;
        const shelfPlate = new THREE.Mesh(new THREE.BoxGeometry(bcDepth - 0.04, 0.03, bcWidth - 0.06), shelfMat);
        shelfPlate.position.set(-0.01, shelfY, 0); bookcaseGroup.add(shelfPlate);

        for (let b = 0; b < 7; b++) {
            const bMat = new THREE.MeshStandardMaterial({ color: bookColors[(s * 4 + b) % bookColors.length] });
            const book = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.30 + (b % 2)*0.06, 0.065), bMat);
            book.position.set(0.02, shelfY + 0.18, -bcWidth/2 + 0.14 + b * 0.11);
            bookcaseGroup.add(book);
        }
    }

    const bcZ = (cz - roomD/2 + wLength) + bcWidth/2 + 0.08;
    bookcaseGroup.position.set(cx + roomW/2 - bcDepth/2, 0, bcZ);
    scene.add(bookcaseGroup);

    // ==========================================
    // BENEKLİ YATAK (#D3CECD Renk)
    // ==========================================
    const bedGroup = new THREE.Group();
    const bedFrameMat = new THREE.MeshStandardMaterial({ color: 0x181820, roughness: 0.5 });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });

    const bedCanvas = document.createElement('canvas'); bedCanvas.width = 512; bedCanvas.height = 512;
    const bCtx = bedCanvas.getContext('2d');
    bCtx.fillStyle = '#D3CECD'; bCtx.fillRect(0, 0, 512, 512);
    bCtx.fillStyle = '#9e9796';
    for (let y = 14; y < 512; y += 28) {
        for (let x = 14; x < 512; x += 28) {
            const jX = (Math.random() - 0.5) * 6;
            const jY = (Math.random() - 0.5) * 6;
            const r = Math.random() * 2 + 3.5;
            bCtx.beginPath();
            bCtx.arc(x + jX, y + jY, r, 0, Math.PI * 2);
            bCtx.fill();
        }
    }
    const spottedBedTex = new THREE.CanvasTexture(bedCanvas);
    spottedBedTex.wrapS = spottedBedTex.wrapT = THREE.RepeatWrapping;
    spottedBedTex.repeat.set(3, 3);
    const spottedSheetMat = new THREE.MeshStandardMaterial({ map: spottedBedTex, roughness: 0.6 });
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xD3CECD, roughness: 0.85 });

    const bedLen = 4.1, bedWidth = 2.1;

    const bHead = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.7, bedWidth), bedFrameMat);
    bHead.position.set(-bedLen/2 + 0.09, 0.85, 0); bedGroup.add(bHead);

    const bFrame = new THREE.Mesh(new THREE.BoxGeometry(bedLen - 0.18, 0.36, bedWidth), bedFrameMat);
    bFrame.position.set(0.09, 0.18, 0); bedGroup.add(bFrame);

    const bMattress = new THREE.Mesh(new THREE.BoxGeometry(bedLen - 0.24, 0.32, bedWidth - 0.06), mattressMat);
    bMattress.position.set(0.06, 0.44, 0); bedGroup.add(bMattress);

    const bSheet = new THREE.Mesh(new THREE.BoxGeometry(bedLen * 0.65, 0.33, bedWidth - 0.04), spottedSheetMat);
    bSheet.position.set(0.15, 0.45, 0); bedGroup.add(bSheet);

    for (let side of [-0.55, 0.55]) {
        const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.75), pillowMat);
        p1.position.set(-bedLen/2 + 0.55, 0.66, side); p1.rotation.z = -0.2; bedGroup.add(p1);
        const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.7), pillowMat);
        p2.position.set(-bedLen/2 + 0.82, 0.64, side); bedGroup.add(p2);
    }

    bedGroup.position.set(cx - roomW/2 + bedLen/2, 0, cz - roomD/2 + bedWidth/2);
    scene.add(bedGroup);

    // Sehpa & Lamba
    const tableGroup = new THREE.Group();
    const sehpaTop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 32), new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.6 }));
    sehpaTop.position.y = 0.58; tableGroup.add(sehpaTop);
    const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.85 });
    const sehpaLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.56), deskLegMat);
    sehpaLeg.position.y = 0.29; tableGroup.add(sehpaLeg);
    const sehpaFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 32), deskLegMat);
    sehpaFoot.position.y = 0.02; tableGroup.add(sehpaFoot);

    const lampFoot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85 }));
    lampFoot.position.y = 0.63; tableGroup.add(lampFoot);
    const lampRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.38), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85 }));
    lampRod.position.y = 0.82; tableGroup.add(lampRod);
    const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 0.26, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xffeedd, roughness: 0.9, side: THREE.DoubleSide }));
    lampShade.position.y = 0.98; tableGroup.add(lampShade);

    const warmLampLight = new THREE.PointLight(0xffb055, 0.75, 8);
    warmLampLight.position.set(0, 1.05, 0); tableGroup.add(warmLampLight);

    tableGroup.position.set(cx - roomW/2 + 0.42, 0, cz - roomD/2 + bedWidth + 0.45);
    scene.add(tableGroup);

    // ==========================================
    // 2. BİLGİSAYAR MASASI (ÜÇ EKRANIN HEPSİ TAM KOLTUĞA DÖNÜK)
    // ==========================================
    const deskGroup = new THREE.Group();
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.35 });

    const deskW = 2.7, deskD = 1.1;
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(deskW, 0.08, deskD), deskMat);
    tableTop.position.set(0, 0.8, 0); deskGroup.add(tableTop);

    for (let xPos of [-deskW/2 + 0.1, deskW/2 - 0.1]) {
        for (let zPos of [-deskD/2 + 0.1, deskD/2 - 0.1]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.8), deskLegMat);
            leg.position.set(xPos, 0.4, zPos); deskGroup.add(leg);
        }
    }

    function createMonitorScreen(text, bgColor, textColor, isPortrait = false) {
        const c = document.createElement('canvas'); 
        c.width = isPortrait ? 280 : 512; 
        c.height = isPortrait ? 512 : 280;
        const ctx = c.getContext('2d');
        ctx.fillStyle = bgColor; ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < c.height; i += 6) ctx.fillRect(0, i, c.width, 2);
        ctx.fillStyle = textColor; ctx.font = isPortrait ? 'bold 30px monospace' : 'bold 36px monospace'; 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, c.width / 2, c.height / 2);
        return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) });
    }

    const scrGeoHorizontal = new THREE.BoxGeometry(0.85, 0.5, 0.04);
    const scrGeoVertical = new THREE.BoxGeometry(0.5, 0.85, 0.04);
    const mFrameMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.8 });

    // 1. SOL EKRAN (DİKEY - DUVAR TARAFI): İçeriye doğru tam koltuğa dönük (rotation.y = -0.42)
    const mLeft = new THREE.Mesh(scrGeoVertical, [mFrameMat, mFrameMat, mFrameMat, mFrameMat, mFrameMat, createMonitorScreen('LIVE CHAT / CODE', '#1c0d29', '#ff3399', true)]);
    mLeft.position.set(-0.76, 1.32, 0.24); 
    mLeft.rotation.y = -0.42; // Tam koltuğa bakar
    deskGroup.add(mLeft);
    const sPoleL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45), mFrameMat); 
    sPoleL.position.set(-0.76, 0.98, 0.24); deskGroup.add(sPoleL);

    // 2. ORTA EKRAN (YATAY): Tam karşıya doğrudan koltuğa bakar (rotation.y = 0)
    const mCenter = new THREE.Mesh(scrGeoHorizontal, [mFrameMat, mFrameMat, mFrameMat, mFrameMat, mFrameMat, createMonitorScreen('ATLAS DESKTOP', '#0b1320', '#00e5ff')]);
    mCenter.position.set(0.0, 1.2, 0.18); 
    mCenter.rotation.y = 0; // Koltuğa doğrudan dik
    deskGroup.add(mCenter);
    const sPoleC = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), mFrameMat); 
    sPoleC.position.set(0.0, 0.95, 0.18); deskGroup.add(sPoleC);

    // 3. SAĞ EKRAN (YATAY): İçeriye doğru tam koltuğa dönük (rotation.y = +0.42)
    const mRight = new THREE.Mesh(scrGeoHorizontal, [mFrameMat, mFrameMat, mFrameMat, mFrameMat, mFrameMat, createMonitorScreen('STREAM / OBS', '#0f2419', '#00ff88')]);
    mRight.position.set(0.82, 1.2, 0.24); 
    mRight.rotation.y = 0.42; // Tam koltuğa bakar
    deskGroup.add(mRight);
    const sPoleR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), mFrameMat); 
    sPoleR.position.set(0.82, 0.95, 0.24); deskGroup.add(sPoleR);

    // Mousepad
    const pad = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.015, 0.44), new THREE.MeshStandardMaterial({ color: 0x181818 }));
    pad.position.set(0.0, 0.845, -0.15); deskGroup.add(pad);

    // Klavye
    const kb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.18), new THREE.MeshStandardMaterial({ color: 0x2b2b2b }));
    kb.position.set(0.12, 0.865, -0.15); deskGroup.add(kb);

    // Beyaz Fare
    const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.14), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }));
    mouse.position.set(-0.32, 0.865, -0.15); deskGroup.add(mouse);

    // Kasa
    const pcCase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.68, 0.6), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.2 }));
    pcCase.position.set(-deskW/2 + 0.22, 1.18, 0.18); deskGroup.add(pcCase);

    const pcRgb = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.6), new THREE.MeshBasicMaterial({ color: 0xaa00ff, side: THREE.DoubleSide }));
    pcRgb.position.set(-deskW/2 + 0.39, 1.18, 0.18); pcRgb.rotation.y = Math.PI / 2; deskGroup.add(pcRgb);
    const rgbPointLight = new THREE.PointLight(0x00f0ff, 0.5, 2.5);
    rgbPointLight.position.set(-deskW/2 + 0.45, 1.18, 0.18); deskGroup.add(rgbPointLight);

    deskGroup.position.set(cx - roomW/2 + deskW/2, 0, cz + roomD/2 - deskD/2);
    scene.add(deskGroup);

    // ==========================================
    // 4'LÜ ÇEKMECE & ÜSTÜNDE MAVİ AYNA
    // ==========================================
    const dresserGroup = new THREE.Group();
    const dWidth = 1.65, dHeight = 1.15, dDepth = 0.65;

    const dBase = new THREE.Mesh(new THREE.BoxGeometry(dWidth, dHeight, dDepth), wBodyMat);
    dBase.position.y = dHeight / 2; dresserGroup.add(dBase);

    const drawerH = dHeight / 4;
    const handleW = 0.75;

    for (let i = 0; i < 4; i++) {
        const coverY = i * drawerH + drawerH / 2;
        const cCover = new THREE.Mesh(new THREE.BoxGeometry(dWidth, drawerH - 0.008, 0.035), new THREE.MeshStandardMaterial({ color: 0xf7f7f7, roughness: 0.2 }));
        cCover.position.set(0, coverY, -dDepth / 2 - 0.018);
        dresserGroup.add(cCover);

        const cHandle = new THREE.Mesh(new THREE.BoxGeometry(handleW, 0.025, 0.03), handleMat);
        cHandle.position.set(0, coverY, -dDepth / 2 - 0.045);
        dresserGroup.add(cHandle);
    }

    const dresserX = (cx - roomW/2 + deskW) + dWidth/2 + 0.12;
    dresserGroup.position.set(dresserX, 0, cz + roomD/2 - dDepth/2);
    scene.add(dresserGroup);

    // Mavi Ayna
    const mirrorH = 1.05;
    const wallMirrorGroup = new THREE.Group();
    const dMirror = new THREE.Mesh(new THREE.PlaneGeometry(dWidth, mirrorH), mirrorBlueMat);
    dMirror.position.set(0, 0, 0.04);
    wallMirrorGroup.add(dMirror);

    const dMirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(dWidth + 0.04, mirrorH + 0.04, 0.06), frameMat);
    wallMirrorGroup.add(dMirrorFrame);

    wallMirrorGroup.position.set(dresserX, dHeight + mirrorH/2 + 0.04, cz + roomD/2 - 0.04);
    scene.add(wallMirrorGroup);

    // ==========================================
    // DUVARDAKİ DİKEY SİYAH PANEL
    // ==========================================
    const blackPanelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.95 });
    const panelBottomY = dHeight;
    const panelTopY = 2.6;
    const panelHeight = panelTopY - panelBottomY;
    const panelWidth = 1.05;
    const panelThickness = 0.06;

    const blackPanel = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, panelHeight, panelThickness), blackPanelMat);
    const panelX = dresserX + dWidth/2 + panelWidth/2 + 0.28;
    blackPanel.position.set(panelX, panelBottomY + panelHeight/2, cz + roomD/2 - panelThickness/2);
    scene.add(blackPanel);

    // ==========================================
    // KOLTUK
    // ==========================================
    const chairGroup = new THREE.Group();
    const cSkinMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.5 });

    const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.62), cSkinMat);
    cSeat.position.y = 0.54; chairGroup.add(cSeat);
    const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.9, 0.1), cSkinMat);
    cBack.position.set(0, 1.0, -0.26); cBack.rotation.x = -0.12; chairGroup.add(cBack);
    const cCushion = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.08), handleMat);
    cCushion.position.set(0, 1.3, -0.22); chairGroup.add(cCushion);
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.38), cSkinMat); armL.position.set(-0.36, 0.68, -0.06); chairGroup.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.38), cSkinMat); armR.position.set(0.36, 0.68, -0.06); chairGroup.add(armR);
    const cStem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42), deskLegMat); cStem.position.y = 0.26; chairGroup.add(cStem);
    const cBaseStar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.06, 5), deskLegMat); cBaseStar.position.y = 0.06; chairGroup.add(cBaseStar);

    chairGroup.position.set(cx - roomW/2 + deskW/2, 0, cz + roomD/2 - deskD - 0.45);
    scene.add(chairGroup);
}
