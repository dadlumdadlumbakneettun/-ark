const JSD_URL = 'https://cdn.jsdelivr.net/gh';
const KH_URL  = JSD_URL + '/KhronosGroup/glTF-Sample-Assets@main/Models';
const TJ_URL  = JSD_URL + '/mrdoob/three.js@r160/examples/models/gltf';
const BB_URL  = JSD_URL + '/BabylonJS/Assets@master/meshes';

const gltfLoader = new THREE.GLTFLoader();

// İskeletli (SkinnedMesh) ve normal modellerin gerçek tepe noktalarını hesaplayan kutu hesaplayıcı
function computeMeshBoundingBox(root) {
    const box = new THREE.Box3();
    let hasMesh = false;
    root.updateMatrixWorld(true);

    root.traverse(o => {
        if (o.isSkinnedMesh && o.skeleton) {
            try {
                o.skeleton.update();
                const tempBox = new THREE.Box3();
                const pos = new THREE.Vector3();
                const count = o.geometry.attributes.position.count;
                const step = Math.max(1, Math.floor(count / 250));
                for (let i = 0; i < count; i += step) {
                    try {
                        o.boneTransform(i, pos);
                        pos.applyMatrix4(o.matrixWorld);
                        tempBox.expandByPoint(pos);
                    } catch(e) {}
                }
                if (!tempBox.isEmpty()) { box.union(tempBox); hasMesh = true; }
                else {
                    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                    const b = o.geometry.boundingBox.clone();
                    b.applyMatrix4(o.matrixWorld);
                    box.union(b);
                    hasMesh = true;
                }
            } catch(e) {
                if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
                const b = o.geometry.boundingBox.clone();
                b.applyMatrix4(o.matrixWorld);
                box.union(b);
                hasMesh = true;
            }
        } else if (o.isMesh && o.geometry) {
            if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
            const b = o.geometry.boundingBox.clone();
            b.applyMatrix4(o.matrixWorld);
            box.union(b);
            hasMesh = true;
        }
    });

    if (!hasMesh || box.isEmpty()) box.setFromObject(root);
    return box;
}

// Modelleri hedef boyuta getiren, tabanını sıfırlayan yükleyici
function loadModelNormalized(url, targetHeight, callback, forcedScale = null) {
    gltfLoader.load(url, (gltf) => {
        const model = gltf.scene;

        const lightsToRemove = [];
        model.traverse(o => {
            if (o.isLight) lightsToRemove.push(o);
        });
        lightsToRemove.forEach(l => {
            if (l.parent) l.parent.remove(l);
        });

        model.updateMatrixWorld(true);

        if (forcedScale) {
            model.scale.setScalar(forcedScale);
        } else {
            let box = computeMeshBoundingBox(model);
            let size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.y, size.x, size.z, 0.0001);
            model.scale.setScalar(targetHeight / maxDim);
        }

        model.updateMatrixWorld(true);
        let box = computeMeshBoundingBox(model);

        model.position.y = -box.min.y;
        model.position.x = -(box.min.x + box.max.x) / 2;
        model.position.z = -(box.min.z + box.max.z) / 2;

        const group = new THREE.Group();
        group.add(model);

        group.traverse(o => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                o.frustumCulled = false;
                if (o.material) {
                    const mats = Array.isArray(o.material) ? o.material : [o.material];
                    mats.forEach(m => {
                        m.side = THREE.DoubleSide;
                    });
                }
            }
        });

        if (callback) callback(group, gltf);
    }, undefined, (err) => {
        console.warn('Model yüklenemedi:', url, err);
    });
}

// Mermer ve altın varaklı sergi kaidesi
function createPedestal(scene, x, z, rotY = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x1c1a1a, roughness: 0.35, metalness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.85 });

    const base1 = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.56), darkStoneMat);
    base1.position.y = 0.04;
    group.add(base1);

    const goldBaseTrim = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.03, 0.50), goldMat);
    goldBaseTrim.position.y = 0.095;
    group.add(goldBaseTrim);

    const column = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.94, 0.42), darkStoneMat);
    column.position.y = 0.58;
    group.add(column);

    const goldTopTrim = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.46), goldMat);
    goldTopTrim.position.y = 1.065;
    group.add(goldTopTrim);

    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.06, 0.54), darkStoneMat);
    topPlate.position.y = 1.11;
    group.add(topPlate);

    scene.add(group);
    return { group, topY: 1.14 };
}

function addCeilingLamp(scene,cx,cy,cz){
    const lampGroup=new THREE.Group();lampGroup.position.set(cx,cy,cz);
    const base=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.05,16),new THREE.MeshStandardMaterial({color:0x222222,metalness:0.8,roughness:0.3}));
    base.position.y=0;lampGroup.add(base);
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.12,16,16),new THREE.MeshBasicMaterial({color:0xffdd88}));
    bulb.position.y=-0.08;lampGroup.add(bulb);
    scene.add(lampGroup);
}

function addTrims(scene,cx,cz){
    const texWood=createWoodTexture('#1a0a02','10,5,0');
    const trimMat=new THREE.MeshStandardMaterial({map:texWood,roughness:0.9,bumpMap:texWood,bumpScale:0.02});
    const bGeo=new THREE.BoxGeometry(12,0.3,0.1);const cGeo=new THREE.BoxGeometry(12,0.2,0.2);
    const b1=new THREE.Mesh(bGeo,trimMat);b1.position.set(cx,0.15,cz-5.95);scene.add(b1);
    const b2=new THREE.Mesh(bGeo,trimMat);b2.position.set(cx,0.15,cz+5.95);scene.add(b2);
    const b3=new THREE.Mesh(bGeo,trimMat);b3.position.set(cx-5.95,0.15,cz);b3.rotation.y=Math.PI/2;scene.add(b3);
    const b4=new THREE.Mesh(bGeo,trimMat);b4.position.set(cx+5.95,0.15,cz);b4.rotation.y=Math.PI/2;scene.add(b4);
    const c1=new THREE.Mesh(cGeo,trimMat);c1.position.set(cx,4.4,cz-5.9);scene.add(c1);
    const c2=new THREE.Mesh(cGeo,trimMat);c2.position.set(cx,4.4,cz+5.9);scene.add(c2);
    const c3=new THREE.Mesh(cGeo,trimMat);c3.position.set(cx-5.9,4.4,cz);c3.rotation.y=Math.PI/2;scene.add(c3);
    const c4=new THREE.Mesh(cGeo,trimMat);c4.position.set(cx+5.9,4.4,cz);c4.rotation.y=Math.PI/2;scene.add(c4);
}

function addKnob(d, flip=false){
    const kG=new THREE.SphereGeometry(0.08,32,32);
    const kM=new THREE.MeshStandardMaterial({color:0xd4af37,metalness:0.9,roughness:0.3});
    const k1=new THREE.Mesh(kG,kM);k1.position.set(0.75,0,0.12);
    const k2=new THREE.Mesh(kG,kM);k2.position.set(-0.75,0,-0.12);
    d.add(k1);d.add(k2);
}

// Oyuncuyu Takip Eden Tilki
function initFox() {
    loadModelNormalized(KH_URL + '/Fox/glTF-Binary/Fox.glb', 1.4, (fGroup, gltf) => {
        foxGroup = fGroup;
        foxGroup.position.set(0, 0, 2);
        scene.add(foxGroup);

        const mixer = new THREE.AnimationMixer(gltf.scene);
        modelMixers.push(mixer);
        if (gltf.animations && gltf.animations.length > 0) {
            const walkClip = gltf.animations.find(c => c.name.toLowerCase().includes('walk')) || gltf.animations[1] || gltf.animations[0];
            foxWalkAction = mixer.clipAction(walkClip);
            foxWalkAction.play();
        }
    });
}
