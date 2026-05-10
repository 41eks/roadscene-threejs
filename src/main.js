import * as THREE from 'three';
import Stat from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


const w = window.innerWidth;
const h = window.innerHeight;
const stat = new Stat();


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.set(0, 0.5, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));


scene.add(new THREE.AmbientLight(0xffffff, 0.2))
const dLight = new THREE.DirectionalLight(0xffffff);
dLight.position.set(0, 1, 1);
scene.add(dLight);







const groudW = 50;
const groudH = 10;

const ground = new THREE.Group()

const roadGroup = new THREE.Group();
const roadPlaneG = new THREE.PlaneGeometry(2, groudH);
const roadPlaneM = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const roadPlane = new THREE.Mesh(roadPlaneG, roadPlaneM);

const leftLine = new THREE.Mesh(
  new THREE.PlaneGeometry(0.1, groudH),
  new THREE.MeshBasicMaterial( 0xffffff)
)

leftLine.position.set(-0.8, 0, 0.0001);

const rightLine = leftLine.clone();
rightLine.position.set(0.8, 0, 0.0001);

const dashLineGroup = new THREE.Group();
const dashNum = 24;
for (let i = dashNum; i--;) {
  const m = new THREE.MeshBasicMaterial(0xffffff );
  const g = new THREE.PlaneGeometry(0.1, 0.3);
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(0, -groudH / 2 + i * 0.5, 0.001);
  dashLineGroup.add(mesh);
}

const frontGrass = new THREE.Mesh(
  new THREE.PlaneGeometry(groudW, groudH / 2),
  new THREE.MeshStandardMaterial({ color: 0x61974b })
)
frontGrass.position.set(0, -groudH / 4, -0.001);
const backGrass = new THREE.Mesh(
  new THREE.PlaneGeometry(groudW, groudH / 2),
  new THREE.MeshStandardMaterial({ color: 0xb1d744 })
)
backGrass.position.set(0, groudH / 4, -0.001);


roadGroup.add(roadPlane, leftLine, rightLine, dashLineGroup);
ground.add(roadGroup, frontGrass, backGrass);
ground.rotateX(-Math.PI / 2);
scene.add(ground);


const treeGroup = new THREE.Group();
const leftTreeGroup = new THREE.Group();
const singleTreeGroup = new THREE.Group();
const treeTop = new THREE.Mesh(
  new THREE.ConeGeometry(0.2, 0.2, 5),
  new THREE.MeshStandardMaterial({ color: 0x64a525 })
)
const treeMid = new THREE.Mesh(
  new THREE.ConeGeometry(0.3, 0.3, 5)
  , new THREE.MeshStandardMaterial({ color: 0x64a525 })
)
const treeBottom = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 0.4),
  new THREE.MeshStandardMaterial({ color: 0x7a5753 })

)
const treeShadow = new THREE.Mesh(
  new THREE.CircleGeometry(0.3, 5),
  new THREE.MeshBasicMaterial({ color: 0x203d22 })
)
treeTop.position.y = 0.55
treeMid.position.y = 0.4
treeBottom.position.y = 0.2
treeShadow.rotateX(-Math.PI / 2);
singleTreeGroup.add(treeTop, treeMid, treeBottom, treeShadow);
singleTreeGroup.scale.set(0.5, 0.5, 0.5);

const treeNuum = 20;
for (let i = treeNuum; i--;) {
  const tree = singleTreeGroup.clone();
  tree.position.set(-1.2, 0, -groudH / 2 + i * 0.5);
  leftTreeGroup.add(tree);
}

const rightTreeGroup = leftTreeGroup.clone();
rightTreeGroup.position.x = 1.2 * 2;

treeGroup.add(leftTreeGroup, rightTreeGroup);
scene.add(treeGroup);



const buildingGroup = new THREE.Group();
const buildingNum = 20;
const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x75d1c2 });
for (let i = buildingNum; i--;) {
  const width = Math.random() + 1
  const height = Math.random() + 1
  const deep = Math.random()
  const buildingGeometry = new THREE.BoxGeometry(width, height, deep);
  const mesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
  mesh.position.set(
    -groudW / 2 + i * 2 + (Math.random() - 0.5) * 3,
    height / 2,
    -groudH / 2 
  )
  buildingGroup.add(mesh);
};
scene.add(buildingGroup);


const cloudGroup = new THREE.Group();
const cloudMaterial = new THREE.MeshBasicMaterial(0xffffff);
const cloud1= new THREE.Mesh(new THREE.SphereGeometry(0.6),cloudMaterial)
const cloud2= new THREE.Mesh(new THREE.SphereGeometry(0.8),cloudMaterial)
const cloud3= new THREE.Mesh(new THREE.SphereGeometry(1),cloudMaterial)
const cloud4= new THREE.Mesh(new THREE.SphereGeometry(0.7),cloudMaterial)
const cloud5= new THREE.Mesh(new THREE.SphereGeometry(0.5),cloudMaterial)
cloud1.position.set(-1.6,-0.05,0)
cloud2.position.set(-1,-0.1,0)
cloud4.position.set(1,0,0)
cloud5.position.set(1.4,0,0);
cloudGroup.add(cloud1,cloud2,cloud3,cloud4,cloud5);
cloudGroup.position.set(0,3,-groudH/2-2)
scene.add(cloudGroup);







const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x95e4e8);
renderer.shadowMap.enabled = true;
// renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(stat.dom);

const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
tick();

function tick() { 
  const time = clock.getElapsedTime();
  dashLineGroup.position.y = -time*0.2%3;
  treeGroup.position.z =time*0.2%3;
  cloudGroup.position.x = Math.sin(time*0.1)*7
  
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
  camera.updateProjectionMatrix();
  stat.update();
  controls.update();
}