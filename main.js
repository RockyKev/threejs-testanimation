// console.log(THREE);

function init() {
  const scene = new THREE.Scene();

  const box = getBox(1, 1, 1);

  scene.add(box);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("webgl").appendChild(renderer.domElement);
  renderer.render(scene, camera);
}

init();

function getBox(w, h, d) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
