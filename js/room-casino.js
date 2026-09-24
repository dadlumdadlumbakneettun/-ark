function buildCasinoRoom(){
    const wallTex=createRetroWallTexture('#2e3a2e');const floorTex=createFloorTexture('#1a0f05','#110a02');const ceilTex=createCeilingTexture();
    const wallMat=new THREE.MeshStandardMaterial({map:wallTex,bumpMap:wallTex,bumpScale:0.03,side:THREE.DoubleSide,roughness:0.8,metalness:0.1});
    const floorMat=new THREE.MeshStandardMaterial({map:floorTex,bumpMap:floorTex,bumpScale:0.02,roughness:0.3});
    const cx=-100,cz=0;
    
    const light=new THREE.PointLight(0xffddaa,1.2,25);light.position.set(cx,4.0,cz);scene.add(light);addCeilingLamp(scene,cx,4.45,cz);
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
    exitDoor.position.set(cx,1.6,cz-5.85);exitDoor.rotation.y=Math.PI;exitDoor.userData={type:'GO_TO_CORRIDOR'};scene.add(exitDoor);objects.push(exitDoor);addKnob(exitDoor,true);
    const woodFrameTex=createWoodTexture('#2a1508','10,5,0');
    const eFrame=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.4,0.25),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.8}));eFrame.position.set(cx,1.7,cz-5.95);scene.add(eFrame);

    const textureLoader=new THREE.TextureLoader();
    const tabloMat1=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.5});
    textureLoader.load('code/tablo1.png',function(tex){tabloMat1.map=tex;tabloMat1.needsUpdate=true;});
    const tablo1Mesh=new THREE.Mesh(new THREE.PlaneGeometry(3.0,3.8),tabloMat1);tablo1Mesh.position.set(cx-5.9,2.35,cz);tablo1Mesh.rotation.y=Math.PI/2;scene.add(tablo1Mesh);
    const tFrame1=new THREE.Mesh(new THREE.BoxGeometry(3.2,4.0,0.05),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.5}));tFrame1.position.set(cx-5.95,2.35,cz);tFrame1.rotation.y=Math.PI/2;scene.add(tFrame1);

    // Blackjack Masası
    const feltTex=createFeltTexture('#0a4a1a');
    const bjTable=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,0.1,64),new THREE.MeshStandardMaterial({map:feltTex,roughness:0.9}));bjTable.position.set(cx,0.8,cz+1);bjTable.userData={type:'PLAY_BLACKJACK'};scene.add(bjTable);objects.push(bjTable);
    const leatherTex=createLeatherTexture('#1a0d05');
    const rim=new THREE.Mesh(new THREE.TorusGeometry(1.5,0.15,32,64),new THREE.MeshStandardMaterial({map:leatherTex,roughness:0.7}));rim.position.set(cx,0.85,cz+1);rim.rotation.x=Math.PI/2;scene.add(rim);
    const pLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.6,0.8,64),new THREE.MeshStandardMaterial({map:woodFrameTex,roughness:0.7}));pLeg.position.set(cx,0.4,cz+1);scene.add(pLeg);
    const pBase=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.0,0.1,64),new THREE.MeshStandardMaterial({map:leatherTex,roughness:0.8}));pBase.position.set(cx,0.05,cz+1);scene.add(pBase);

    // Kartlar
    const cardBackTex=createCardBackTexture();const cardBackMat=new THREE.MeshStandardMaterial({map:cardBackTex,roughness:0.8});const cardGeo=new THREE.BoxGeometry(0.2,0.01,0.3);
    const deck=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.1,0.3),cardBackMat);deck.position.set(cx+0.6,0.9,cz+0.8);deck.rotation.y=Math.PI/5;scene.add(deck);
    const cardA_tex=createCardTexture('A♠','#000');
    const cardA_mat=[new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({map:cardA_tex,roughness:0.8}),new THREE.MeshStandardMaterial({map:cardBackTex}),new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({color:0xffffff})];
    const c1=new THREE.Mesh(cardGeo,cardA_mat);c1.position.set(cx-0.1,0.86,cz+1.6);c1.rotation.y=0.1;scene.add(c1);
    const cardK_tex=createCardTexture('K♥','#d00');
    const cardK_mat=[new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({map:cardK_tex,roughness:0.8}),new THREE.MeshStandardMaterial({map:cardBackTex}),new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({color:0xffffff})];
    const c2=new THREE.Mesh(cardGeo,cardK_mat);c2.position.set(cx+0.1,0.86,cz+1.65);c2.rotation.y=-0.15;scene.add(c2);
    const c3=new THREE.Mesh(cardGeo,cardBackMat);c3.position.set(cx-0.1,0.86,cz+0.4);scene.add(c3);
    const card7_tex=createCardTexture('7♣','#000');
    const card7_mat=[new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({map:card7_tex,roughness:0.8}),new THREE.MeshStandardMaterial({map:cardBackTex}),new THREE.MeshStandardMaterial({color:0xffffff}),new THREE.MeshStandardMaterial({color:0xffffff})];
    const c4=new THREE.Mesh(cardGeo,card7_mat);c4.position.set(cx+0.1,0.86,cz+0.45);c4.rotation.y=0.2;scene.add(c4);

    // Ticari Buzdolabı
    window.commercialFridgeAction = null;
    loadModelNormalized(KH_URL + '/CommercialRefrigerator/glTF-Binary/CommercialRefrigerator.glb', 3.2, (fridge, gltf) => {
        fridge.position.set(cx + 4.9, 0, cz - 2.0);
        fridge.rotation.y = -Math.PI / 2;
        scene.add(fridge);

        gltf.scene.traverse(o => {
            if (o.isMesh) {
                o.userData = { type: 'TOGGLE_COMMERCIAL_FRIDGE' };
                objects.push(o);
            }
        });

        if (gltf.animations && gltf.animations.length > 0) {
            const fridgeMixer = new THREE.AnimationMixer(gltf.scene);
            modelMixers.push(fridgeMixer);
            window.commercialFridgeAction = fridgeMixer.clipAction(gltf.animations[0]);
            window.commercialFridgeAction.setLoop(THREE.LoopOnce);
            window.commercialFridgeAction.clampWhenFinished = true;
        }
    });

    // Kadife Kanepe & Koltuklar
    loadModelNormalized(KH_URL + '/GlamVelvetSofa/glTF-Binary/GlamVelvetSofa.glb', 4.40, (sofa) => {
        sofa.position.set(cx - 4.8, 0, cz);
        sofa.rotation.y = Math.PI / 2;
        scene.add(sofa);
    });

    loadModelNormalized(KH_URL + '/ChairDamaskPurplegold/glTF-Binary/ChairDamaskPurplegold.glb', 1.15, (chairL) => {
        chairL.position.set(cx - 1.85, 0, cz + 1.0);
        chairL.rotation.y = Math.PI / 2;
        scene.add(chairL);
    });
    loadModelNormalized(KH_URL + '/ChairDamaskPurplegold/glTF-Binary/ChairDamaskPurplegold.glb', 1.15, (chairR) => {
        chairR.position.set(cx + 1.85, 0, cz + 1.0);
        chairR.rotation.y = -Math.PI / 2;
        scene.add(chairR);
    });

    // Michelle (Dans)
    loadModelNormalized(TJ_URL + '/Michelle.glb', 1.98, (mGroup, gltf) => {
        mGroup.position.set(cx - 2.6, 0, cz + 3.2);
        mGroup.rotation.y = Math.PI / 4;
        scene.add(mGroup);

        if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            modelMixers.push(mixer);
            const danceClip = gltf.animations.find(c => c.name.toLowerCase().includes('dance')) || gltf.animations[0];
            const act = mixer.clipAction(danceClip);
            act.setLoop(THREE.LoopRepeat);
            act.play();
        }
    });

    // Genç Kadın (HVGirl)
    loadModelNormalized(BB_URL + '/HVGirl.glb', 1.75, (gGroup, gltf) => {
        gGroup.position.set(cx + 2.6, 0, cz + 3.2);
        gGroup.rotation.y = -Math.PI / 4;
        scene.add(gGroup);

        if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            modelMixers.push(mixer);
            const danceClip = gltf.animations.find(c => {
                const n = c.name.toLowerCase();
                return n.includes('samba') || n.includes('dance');
            }) || gltf.animations[0];
            const act = mixer.clipAction(danceClip);
            act.setLoop(THREE.LoopRepeat);
            act.play();
        }
    }, 0.105);

    // Uzaylı Büstü (Alien)
    const alienX = cx - 4.8, alienZ = cz + 4.8;
    const alienAngle = Math.atan2(cx - alienX, (cz + 1.0) - alienZ);
    const alienPedestal = createPedestal(scene, alienX, alienZ, alienAngle);
    loadModelNormalized(BB_URL + '/alien.glb', 1.25, (alienGroup, gltf) => {
        alienGroup.position.set(alienX, alienPedestal.topY, alienZ);
        alienGroup.rotation.y = alienAngle;
        scene.add(alienGroup);

        if (gltf.animations && gltf.animations.length > 0) {
            const alienMixer = new THREE.AnimationMixer(gltf.scene);
            modelMixers.push(alienMixer);
            const idleClip = gltf.animations.find(c => c.name.toLowerCase().includes('idle')) || gltf.animations[0];
            const alienAction = alienMixer.clipAction(idleClip);
            alienAction.setLoop(THREE.LoopRepeat);
            alienAction.play();
        }
    });
}
