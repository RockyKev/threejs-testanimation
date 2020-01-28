# Lynda.com -> Three.js

https://www.lynda.com/JavaScript-tutorials/Create-ground-plane/586668/633294-4.html?srchtrk=index%3a1%0alinktypeid%3a2%0aq%3athreejs%0apage%3a1%0as%3arelevance%0asa%3atrue%0aproducttypeid%3a2

## Lighting

Point light

## Material

MeshStandardMaterial
is a physically based material, creates relaistic results
computationally more expensive.
What Unreal uses.

## Texture Maps

Texture map = Flat 2d images that are mapped on materials.
bumpmap = it adds texture
roughnessMap = more texture

Environment Map = It uses cubemap -> https://www.oreilly.com/library/view/unity-virtual-reality/9781788478809/assets/78ce7543-9205-4ef8-9d59-52b9e69e89d8.jpg

## More libraries

### dat.gui

This is to create that widget nav bar to move variables around

https://github.com/dataarts/dat.gui

### This is to allow you to rotate your camera around

orbit
three.js-master\examples\js\controls\

### Math - Like Sin. It randomizes and creates a noise.

perlin.js
https://github.com/josephg/noisejs

### Tween JS

https://github.com/tweenjs/tween.js/

### 3d Modeling places to find

Turbo Squid
SketchFab
clara.io

Pay attention to license, file size, model mesh density, file formats, availability of textures.

3DS supports = FBX, OBJ, and STL

you have to use the coorespinding loader examples
three.js-master\examples\js\loaders\
