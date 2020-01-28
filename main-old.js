function init() {
  const scene = new THREE.Scene();
  const gui = new dat.GUI(); //datgui library
  const clock = new THREE.Clock();

  const isFogOn = true;

  if (isFogOn) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.1);
  }

  const plane = getPlane(100);
  // const lighting = getPointLight(1);
  // const lighting = getSpotLight(1);
  const lighting = getDirectionalLight(1);
  const sphere = getSphere(0.05);
  const boxGrid = getBoxGrid(20, 2.5);
  // const helper = new THREE.CameraHelper(lighting.shadow.camera);
  // const ambientLighting = getAmbientLight(1);

  plane.name = "plane-1";
  boxGrid.name = "boxGrid";

  plane.rotation.x = Math.PI / 2; //THREE uses pi value
  lighting.position.x = 13;
  lighting.position.y = 10;
  lighting.position.z = 10;
  lighting.intensity = 2;

  scene.add(plane);
  lighting.add(sphere);
  scene.add(lighting);
  scene.add(boxGrid);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  //adding the camera to a controller - that controls a Z position.
  const cameraZ_Position = new THREE.Group();
  const cameraY_Position = new THREE.Group();

  const cameraX_Rotate = new THREE.Group();
  const cameraY_Rotate = new THREE.Group();
  const cameraZ_Rotate = new THREE.Group();

  //identify their names
  cameraZ_Position.name = "cameraZ_Position";
  cameraY_Position.name = "cameraY_Position";

  cameraX_Rotate.name = "cameraX_Rotate";
  cameraY_Rotate.name = "cameraY_Rotate";
  cameraZ_Rotate.name = "cameraZ_Rotate";

  //you nestle cameras inside each other
  cameraZ_Rotate.add(camera);

  cameraY_Position.add(cameraZ_Rotate);
  cameraZ_Position.add(cameraY_Position);

  cameraX_Rotate.add(cameraZ_Position);
  cameraY_Rotate.add(cameraX_Rotate);
  scene.add(cameraY_Rotate);

  //GUI
  cameraX_Rotate.rotation.x = -Math.PI / 2;
  cameraZ_Position.position.y = 1;
  cameraZ_Position.position.z = 100;

  new TWEEN.Tween({ val: 100 })
    .to({ val: -50 }, 12000)
    .onUpdate(function() {
      cameraZ_Position.position.Z = this.val;
    })
    .start();

  new TWEEN.Tween({ val: -Math.PI / 2 })
    .to({ val: 0 }, 6000)
    .delay(1000)
    .onUpdate(function() {
      cameraX_Rotate.rotation.x = this.val;
    })
    .start();

  gui.add(cameraZ_Position.position, "z", 0, 100);
  gui.add(cameraY_Rotate.rotation, "y", -Math.PI, Math.PI);
  gui.add(cameraX_Rotate.rotation, "x", -Math.PI, Math.PI);
  gui.add(cameraZ_Rotate.rotation, "z", -Math.PI, Math.PI);

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
    var obj = getBox(1, 3, 1);
    obj.position.x = i * separationMultiplier;
    obj.position.y = obj.geometry.parameters.height / 2;
    group.add(obj);
    for (var j = 1; j < amount; j++) {
      var obj = getBox(1, 3, 1);
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
  const light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  //default is -5 and 5
  light.shadow.camera.left = -40;
  light.shadow.camera.bottom = -40;
  light.shadow.camera.right = 40;
  light.shadow.camera.top = 40;

  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;

  return light;
}

function update(renderer, scene, camera, controls, clock) {
  renderer.render(scene, camera);

  controls.update();
  TWEEN.update();

  let timeElapse = clock.getElapsedTime();

  let cameraZ_Rotate = scene.getObjectByName("cameraZ_Rotate");
  cameraZ_Rotate.rotation.z =
    noise.simplex2(timeElapse * 1.5, timeElapse * 1.5) * 0.02;

  let boxGrid = scene.getObjectByName("boxGrid");
  boxGrid.children.forEach((child, index) => {
    const x = timeElapse + index;
    child.scale.y = (noise.simplex2(x, x) + 1) / 2 + 0.001; //so it has a range of 0.001 to 2);
    child.position.y = child.scale.y / 2;
  });

  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls, clock);
  });
}

var scene = init();
