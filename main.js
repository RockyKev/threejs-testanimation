function init() {
  const scene = new THREE.Scene();
  const gui = new dat.GUI(); //datgui library
  const clock = new THREE.Clock();

  const isFogOn = false;

  if (isFogOn) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.2);
  }

  const plane = getPlane(30);
  const lighting = getPointLight(1);
  // const lighting = getSpotLight(1);
  // const lighting = getDirectionalLight(1);
  const sphere = getSphere(0.05);
  const boxGrid = getBoxGrid(10, 1.5);
  const helper = new THREE.CameraHelper(lighting.shadow.camera);
  // const ambientLighting = getAmbientLight(1);
  boxGrid.name = "boxGrid";

  plane.name = "plane-1"; //give a name (id) so you can search it with getObjectByName method

  //   plane.rotation.x = 90; //THREE uses pi value
  plane.rotation.x = Math.PI / 2; //THREE uses pi value
  lighting.position.x = 13;
  lighting.position.y = 10;
  lighting.position.z = 10;
  lighting.intensity = 2;

  //two ways to add objects. One is directly to the scene. The other is through parent->child.
  //   scene.add(box);
  //   plane.add(box);

  scene.add(boxGrid);
  scene.add(plane);
  lighting.add(sphere);
  scene.add(lighting);
  scene.add(helper);
  // scene.add(ambientLighting);

  gui.add(lighting, "intensity", 0, 10); //variable, method inside, min, and max
  gui.add(lighting.position, "x", 0, 20);
  gui.add(lighting.position, "y", 0, 20);
  gui.add(lighting.position, "z", 0, 20);
  // gui.add(lighting, "penumbra", 0, 1); //only for spotlight

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
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(120, 120, 120)"); //this is fog

  document.getElementById("webgl").appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls, clock);
  return scene;
}

function getBox(w, h, d) {
  //mesh (shape and material) Default is Mesh, which has no reflection on lighting
  const geometry = new THREE.BoxGeometry(w, h, d);
  const material = new THREE.MeshPhongMaterial({
    color: "rgb(120,120,120)"
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;

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
  mesh.receiveShadow = true;

  return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
  var group = new THREE.Group();

  for (var i = 0; i < amount; i++) {
    var obj = getBox(1, 1, 1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;
    group.add(obj);
    for (var j = 1; j < amount; j++) {
      var obj = getBox(1, 1, 1);
      obj.position.x = i * separationMultiplier;
      obj.position.y = obj.geometry.parameters.height / 2;
      obj.position.z = j * separationMultiplier;
      group.add(obj);
    }
  }

  group.position.x = -(separationMultiplier * (amount - 1)) / 2;
  group.position.z = -(separationMultiplier * (amount - 1)) / 2;

  return group;
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

function getPointLight(intensity) {
  const light = new THREE.PointLight(0xfffff, intensity);
  light.castShadow = true;

  return light;
}

function getAmbientLight(intensity) {
  const light = new THREE.AmbientLight("rgb(10, 30, 50)", intensity);

  return light;
}

function getSpotLight(intensity) {
  const light = new THREE.SpotLight(0xfffff, intensity);
  light.castShadow = true;

  light.shadow.bias = 0.001;

  //this affects the shadow blur size. 1024 is the default. More cost performance.
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  return light;
}

function getDirectionalLight(intensity) {
  const light = new THREE.DirectionalLight(0xfffff, intensity);
  light.castShadow = true;

  //default is -5 and 5
  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;

  return light;
}

function update(renderer, scene, camera, controls, clock) {
  renderer.render(scene, camera);

  //   var plane = scene.getObjectByName("plane-1");
  //   plane.rotation.y += 0.001;
  //   plane.rotation.z += 0.001;

  //   scene.traverse(function(child) {
  //     child.scale.x += 0.001;
  //   });

  let timeElapse = clock.getElapsedTime();

  let boxGrid = scene.getObjectByName("boxGrid");
  boxGrid.children.forEach((child, index) => {
    // child.scale.y = (Math.sin(timeElapse * 5 + index) + 1) / 2 + 0.001; //so it has a range of 0.001 to 2);

    const x = timeElapse * 1 + index;
    child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001; //so it has a range of 0.001 to 2);

    child.position.y = child.scale.y / 2;
  });

  controls.update();

  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls, clock);
  });
}

var scene = init();

// console.log(THREE);
