function buildLShapeCorridor(){
    const wallTex=createRetroWallTexture();const floorTex=createFloorTexture();const ceilTex=createCeilingTexture();
    const wallMat=new THREE.MeshStandardMaterial({map:wallTex,bumpMap:wallTex,bumpScale:0.03,side:THREE.DoubleSide,roughness:0.8,metalness:0.1});
    const floorMat=new THREE.MeshStandardMaterial({map:floorTex,bumpMap:floorTex,bumpScale:0.02,roughness:0.4});
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(5,18),floorMat);floor.rotation.x=-Math.PI/2;floor.position.set(0,0,-3);scene.add(floor);
    const ceil=new THREE.Mesh(new THREE.PlaneGeometry(5,18),new THREE.MeshStandardMaterial({map:ceilTex,roughness:0.9}));ceil.rotation.x=Math.PI/2;ceil.position.set(0,4.5,-3);scene.add(ceil);
    const wallL=new THREE.Mesh(new THREE.PlaneGeometry(18,4.5),wallMat);wallL.rotation.y=Math.PI/2;wallL.position.set(-2.5,2.25,-3);scene.add(wallL);
    const wallR=new THREE.Mesh(new THREE.PlaneGeometry(18,4.5),wallMat);wallR.rotation.y=-Math.PI/2;wallR.position.set(2.5,2.25,-3);scene.add(wallR);
    const wallB=new THREE.Mesh(new THREE.PlaneGeometry(5,4.5),wallMat);wallB.position.set(0,2.25,6);scene.add(wallB);
    const wallF=new THREE.Mesh(new THREE.PlaneGeometry(5,4.5),wallMat);wallF.position.set(0,2.25,-12);scene.add(wallF);
    
    const dGeo=new THREE.BoxGeometry(2.0,3.2,0.15);
    const doorTex=createDoorTexture(false);
    const outerDoorTex=createDoorTexture(true);
    const chillDoorTex=createPinkPatternDoor();
    const doorMat=new THREE.MeshStandardMaterial({map:doorTex,bumpMap:doorTex,bumpScale:0.04,roughness:0.6});
    const woodFrameTex=createWoodTexture('#2a1508','10,5,0');
    const frameGeo=new THREE.BoxGeometry(2.4,3.4,0.25);
    const frameMat=new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.8});

    const roomDoor=new THREE.Mesh(dGeo,doorMat);roomDoor.position.set(-2.35,1.6,0);roomDoor.rotation.y=Math.PI/2;roomDoor.userData={type:'GO_TO_SECRET_ROOM'};scene.add(roomDoor);objects.push(roomDoor);addKnob(roomDoor);
    const sf=new THREE.Mesh(frameGeo,frameMat);sf.position.set(-2.45,1.7,0);sf.rotation.y=Math.PI/2;scene.add(sf);
    
    const casinoDoor=new THREE.Mesh(dGeo,doorMat);casinoDoor.position.set(2.35,1.6,0);casinoDoor.rotation.y=-Math.PI/2;casinoDoor.userData={type:'GO_TO_CASINO'};scene.add(casinoDoor);objects.push(casinoDoor);addKnob(casinoDoor);
    const cf=new THREE.Mesh(frameGeo,frameMat);cf.position.set(2.45,1.7,0);cf.rotation.y=-Math.PI/2;scene.add(cf);
    
    const mainDoor=new THREE.Mesh(dGeo,new THREE.MeshStandardMaterial({map:outerDoorTex,bumpMap:outerDoorTex,bumpScale:0.05,roughness:0.7}));mainDoor.position.set(0,1.6,-11.85);mainDoor.userData={type:'OUTER_DOOR'};scene.add(mainDoor);objects.push(mainDoor);addKnob(mainDoor);
    const of=new THREE.Mesh(frameGeo,frameMat);of.position.set(0,1.7,-11.95);scene.add(of);
    
    const chDoor=new THREE.Mesh(dGeo,new THREE.MeshStandardMaterial({map:chillDoorTex,roughness:0.4}));chDoor.position.set(0,1.6,5.85);chDoor.userData={type:'GO_TO_CHILL_ROOM'};scene.add(chDoor);objects.push(chDoor);addKnob(chDoor,true);
    const chf=new THREE.Mesh(frameGeo,frameMat);chf.position.set(0,1.7,5.95);scene.add(chf);

    const tGeo=new THREE.BoxGeometry(5,0.3,0.1);const tm=new THREE.MeshStandardMaterial({map:woodFrameTex});
    const t1=new THREE.Mesh(tGeo,tm);t1.position.set(0,0.15,-11.95);scene.add(t1);
    const t2=new THREE.Mesh(tGeo,tm);t2.position.set(0,0.15,5.95);scene.add(t2);
    const t3=new THREE.Mesh(new THREE.BoxGeometry(18,0.3,0.1),tm);t3.position.set(-2.45,0.15,-3);t3.rotation.y=Math.PI/2;scene.add(t3);
    const t4=new THREE.Mesh(new THREE.BoxGeometry(18,0.3,0.1),tm);t4.position.set(2.45,0.15,-3);t4.rotation.y=Math.PI/2;scene.add(t4);

    // Atlas Kapı & Tabela
    const atlasSignCanvas=document.createElement('canvas');atlasSignCanvas.width=512;atlasSignCanvas.height=128;const atlasSignCtx=atlasSignCanvas.getContext('2d');
    atlasSignCtx.fillStyle='#1a0a02';atlasSignCtx.fillRect(0,0,512,128);atlasSignCtx.strokeStyle='#8B6914';atlasSignCtx.lineWidth=6;atlasSignCtx.strokeRect(6,6,500,116);
    atlasSignCtx.fillStyle='#FFD700';atlasSignCtx.font="bold 54px serif";atlasSignCtx.textAlign='center';atlasSignCtx.textBaseline='middle';atlasSignCtx.fillText("Atlas'ın Odası",256,64);
    const atlasSignTex=new THREE.CanvasTexture(atlasSignCanvas);
    const atlasDoor=new THREE.Mesh(dGeo,new THREE.MeshStandardMaterial({map:doorTex,bumpMap:doorTex,bumpScale:0.04,roughness:0.6}));atlasDoor.position.set(-2.35,1.6,-7);atlasDoor.rotation.y=Math.PI/2;atlasDoor.userData={type:'GO_TO_ATLAS_ROOM'};scene.add(atlasDoor);objects.push(atlasDoor);addKnob(atlasDoor);
    const atlasFrame=new THREE.Mesh(frameGeo,frameMat);atlasFrame.position.set(-2.45,1.7,-7);atlasFrame.rotation.y=Math.PI/2;scene.add(atlasFrame);
    const atlasSign=new THREE.Mesh(new THREE.PlaneGeometry(2.0,0.38),new THREE.MeshStandardMaterial({map:atlasSignTex,roughness:0.7}));atlasSign.position.set(-2.42,3.55,-7);atlasSign.rotation.y=Math.PI/2;scene.add(atlasSign);

    const noteCanvas=document.createElement('canvas');noteCanvas.width=256;noteCanvas.height=160;const noteCtx=noteCanvas.getContext('2d');
    noteCtx.fillStyle='#f5f0dc';noteCtx.fillRect(0,0,256,160);noteCtx.fillStyle='#1a1a1a';noteCtx.font="bold 36px monospace";noteCtx.textAlign='center';noteCtx.textBaseline='middle';noteCtx.fillText("No service",128,80);
    const noteTex=new THREE.CanvasTexture(noteCanvas);
    const noteMesh=new THREE.Mesh(new THREE.PlaneGeometry(0.60,0.38),new THREE.MeshStandardMaterial({map:noteTex,roughness:0.9,side:THREE.DoubleSide}));
    noteMesh.position.set(-2.22,0.98,-6.72);noteMesh.rotation.set(0.08, Math.PI/2, 0.28);scene.add(noteMesh);

    // KORİDOR BÜSTÜ 1: NEFERTİTİ BÜSTÜ
    const nefPedestal = createPedestal(scene, -2.15, 1.75, Math.PI / 2);
    loadModelNormalized(TJ_URL + '/Nefertiti/Nefertiti.glb', 0.95, (nefGroup) => {
        nefGroup.position.set(-2.15, nefPedestal.topY, 1.75);
        nefGroup.rotation.y = Math.PI / 2;
        scene.add(nefGroup);
    });

    // KORİDOR BÜSTÜ 2: İNSAN KAFASI (Lee Perry Smith)
    const leePedestal = createPedestal(scene, 2.15, 1.75, -Math.PI / 2);
    loadModelNormalized(TJ_URL + '/LeePerrySmith/LeePerrySmith.glb', 0.90, (leeGroup) => {
        leeGroup.position.set(2.15, leePedestal.topY, 1.75);
        leeGroup.rotation.y = -Math.PI / 2;
        scene.add(leeGroup);
    });
}
