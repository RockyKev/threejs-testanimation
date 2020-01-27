// console.log(THREE);

function init() {
  const scene = new THREE.Scene();

  const box = getBox(1, 1, 1);
  const plane = getPlane(4);

  box.position.y = box.geometry.parameters.height / 2; //originally 0.5. Remember origin is center.
  //   plane.rotation.x = 90; //THREE uses pi value
  plane.rotation.x = Math.PI / 2; //THREE uses pi value

  scene.add(box);
  scene.add(plane);
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

function getBox(w, h, d) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getPlane(size) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

init();
