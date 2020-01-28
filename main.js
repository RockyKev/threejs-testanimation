// console.log(THREE);

function init() {
  const scene = new THREE.Scene();

  const gui = new dat.GUI(); //datgui library

  var isFogOn = false;

  if (isFogOn) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
  }

  const box = getBox(1, 1, 1);
  const plane = getPlane(20);
  const pointLight = getPointLight(1);
  const sphere = getSphere(0.05);

  plane.name = "plane-1"; //give a name (id) so you can search it with getObjectByName method

  box.position.y = box.geometry.parameters.height / 2; //originally 0.5. Remember origin is center.
  //   plane.rotation.x = 90; //THREE uses pi value
  plane.rotation.x = Math.PI / 2; //THREE uses pi value
  pointLight.position.y = 2;
  pointLight.intensity = 2;

  gui.add(pointLight, "intensity", 0, 10); //variable, method inside, min, and max
  gui.add(pointLight.position, "y", 0, 5);

  //two ways to add objects. One is directly to the scene. The other is through parent->child.
  //   scene.add(box);
  //   plane.add(box);

  scene.add(box);
  scene.add(plane);
  pointLight.add(sphere);
  scene.add(pointLight);

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
  renderer.setClearColor("rgb(120, 120, 120)"); //this is fog

  document.getElementById("webgl").appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);
  return scene;
}

function getPointLight(intensity) {
  const light = new THREE.PointLight(0xfffff, intensity);

  return light;
}

function getBox(w, h, d) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)"
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getSphere(size) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.SphereGeometry(size, 24, 24); //size, width, and height (or how many faces)
  const material = new THREE.MeshBasicMaterial({
    color: "rgb(255,255,255)"
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getPlane(size) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)",
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function update(renderer, scene, camera, controls) {
  renderer.render(scene, camera);

  //   var plane = scene.getObjectByName("plane-1");
  //   plane.rotation.y += 0.001;
  //   plane.rotation.z += 0.001;

  //   scene.traverse(function(child) {
  //     child.scale.x += 0.001;
  //   });

  controls.update();

  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls);
  });
}

var scene = init();
