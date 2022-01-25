import * as THREE from './three/three.module.js'
import { AnimationMixer, Clock, AudioListener, PositionalAudio, AudioLoader } from "three";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper";

import { PointerLockControls } from './controls/PointerLockControls.js'
import { DeviceOrientationControls } from './controls/DeviceOrientationControls.js'
import { AudioEngineService } from './services/AudioEngineService.js'
import { DDSLoader } from './loaders/DDSLoader.js'
import { GLTFLoader } from './loaders/GLTFLoader.js'
// import { Water } from './objects/Water.js';
import { TWEEN } from './vendor/tween.module.min.js'
import jQuery from 'jquery'
import { createArtworkMesh, createArtwork3DObject, mainArtistsList } from "./content";
import { removeCover } from './services/services';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

let camera, scene, renderer, controls, container, audioListener, composer, glitchPass, water;
let time, delta;

let renderGlitchEffect = false;

const animMixer = new AnimationMixer();
const clock = new Clock();

let canJump = false;
const $ = jQuery;
let prevTime = performance.now()
let collisionObjects = []
let roomModel;
let camObject;
let art9, art9popup, limits, showPopup, hidePopup, isInAreaPrev;

const roomModelS = 20;
const roomModelPZ = 70;
const roomModelRY = Math.PI;

let moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false,
  isCollision = false,
  controlsEnabled = false,
  isOnFloor = false,
  jump = false,
  speed = 400,
  gravityFactor = 1,
  moveDirection = new THREE.Vector3(),
  prevDir = new THREE.Vector3(),
  floorDirection = new THREE.Vector3(0, -1, 0),
  zVector = new THREE.Vector3(0, 1, 0),
  velocity = new THREE.Vector3(),
  deg2RadFactor = Math.PI / 180,
  rayAngle1 = 20 * deg2RadFactor,
  rayAngle2 = 30 * deg2RadFactor,
  cnt = 0;

let audioContext, isAudioPlaying = false, isLoaded = false;
let isGranted = false;
let lastPageX;
let deltaPageX;
let isTouchMove = false;

const artworksVideoArr = [];
const artworksObjArr = [];
const artworksObjList = {};
const artworksVideoList = {};


if (location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

let isMobile = false //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
  isMobile = true
}

window.onload = () => {
  const AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

  if (AudioContext) {
    // Do whatever you want using the Web Audio API
    audioContext = new AudioContext;
    // ...
  } else {
    // Web Audio API is not supported
    // Alert the user
    alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
  }
  // audioContext = new AudioContext();
}


// Feature detects Navigation Timing API support.
if (window.performance) {
  // Gets the number of milliseconds since page load
  // (and rounds the result since the value must be an integer).
  var timeSincePageLoad = Math.round(performance.now());

  // Sends the timing event to Google Analytics.
  gtag('event', 'timing_complete', {
    'name': 'load',
    'value': timeSincePageLoad,
    'event_category': 'JS Dependencies'
  });
}

const rayWall = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
const artworksRay = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);
const imgLoader = new THREE.TextureLoader()
const audioLoader = new AudioLoader()

const modelsPath = '../assets/models/'
const modeFolder = '2/'
const modeName = 'Lobby_with_collision_with_artworks'
let startFromDesktop = false;


init()
animate()


function init () {

  // ============== SCENE SETUPS =====================

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000)
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff);
  if (!isMobile) {
    scene.fog = new THREE.Fog(0xfcf5e8, 600, 1200);
  }
  container = document.body
  // camera.add( audioListener );

  // ============ LIGHTS ===================================
  let ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  // ============ AUDIO ===============================
  const audioManager = new AudioEngineService(camera, isMobile);
  audioListener = new AudioListener();

  // ============ CONTROLS ==================================
  let blocker = document.getElementById('blocker')
  let instructions = document.getElementById('blocker')

  if (isMobile) {

    speed = 500;

    const touchPanel = $('.touch-control-panel')
    touchPanel.removeClass('hide');
    $('.mobile-controls').removeClass('hide');
    $('body').addClass('mobile');
    $('.absolute-white-cover').addClass('hide');

    controls = new DeviceOrientationControls(camera, true)

    $('#blocker').on('click', () => {
      $('body').addClass('start');
      instructions.style.display = 'none'
      blocker.style.display = 'none'
      controlsEnabled = true
      audioManager.startAudio(audioContext);
      if (!isGranted) {
        getOrientationPermit()

        gtag('event', 'startAppFromMobile', {
          'event_category': 'Mobile'
        });
      }
    })

    $('.close-btn').on('touchstart', () => {
      instructions.style.display = 'block'
      blocker.style.display = ''
      controlsEnabled = false
      $('body').removeClass('start');
    });

    const moveForvardBtn = $('.arrow.top')
    const moveRightBtn = $('.arrow.right')
    const moveBackBtn = $('.arrow.bottom')
    const moveLeftBtn = $('.arrow.left')

    moveForvardBtn.on('touchstart', (e) => {
      e.preventDefault()
      moveForward = true
    })
    moveForvardBtn.on('touchend', (e) => {
      e.preventDefault()
      moveForward = false
    })
    moveRightBtn.on('touchstart', (e) => {
      e.preventDefault()
      moveRight = true
    })
    moveRightBtn.on('touchend', (e) => {
      e.preventDefault()
      moveRight = false
    })
    moveBackBtn.on('touchstart', (e) => {
      e.preventDefault()
      moveBackward = true
    })
    moveBackBtn.on('touchend', (e) => {
      e.preventDefault()
      moveBackward = false
    })
    moveLeftBtn.on('touchstart', (e) => {
      e.preventDefault()
      moveLeft = true
    })
    moveLeftBtn.on('touchend', (e) => {
      e.preventDefault()
      moveLeft = false
    })


    document.addEventListener("touchstart", e => {
      isTouchMove = false
      lastPageX = e.pageX
    }, false)


    document.addEventListener("touchmove", e => {
      // isTouchMove = true
      controls.enabled = false
      console.log('move');
      deltaPageX = lastPageX - e.pageX
      const angle = Math.PI / 180 * deltaPageX / 4;
      // camera.rotation.y -= angle;

      controls.setOffsetX(angle);

      // camera.updateProjectionMatrix()

      lastPageX = e.pageX
      controls.enabled = true
    }, false)
    //
    document.addEventListener("touchend", e => {
      isTouchMove = false
      controls.enabled = true
    }, false)


  } else
  {

    $('.absolute-white-cover').addClass('hide');

    controls = new PointerLockControls(camera, container)
    camObject = controls.getObject()

    instructions.addEventListener('click', function () {
      controls.lock()
      audioManager.startAudio(audioContext);
      if (startFromDesktop) {

        gtag('event', 'startAppFromDesktop', {
          'event_category': 'Desktop'
        });
      }

    }, false)

    controls.addEventListener('lock', function () {

      instructions.style.display = 'none'
      blocker.style.display = 'none'
      controlsEnabled = true

      $('body').addClass('start');

    })
    controls.addEventListener('unlock', function () {

      blocker.style.display = 'block'
      instructions.style.display = ''

      controlsEnabled = false

      $('body').removeClass('start');

    })

    scene.add(controls.getObject())

    let onKeyDown = function (event) {
      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          moveForward = true
          break

        case 37: // left
        case 65: // a
          moveLeft = true
          break

        case 40: // down
        case 83: // s
          moveBackward = true
          break

        case 39: // right
        case 68: // d
          moveRight = true
          break

        case 32: // space // space
          if (isOnFloor && !jump) {
            jump = true
            velocity.y = 35
          }
          break

      }

    }
    let onKeyUp = function (event) {

      switch (event.keyCode) {

        case 38: // up
        case 87: // w
          moveForward = false
          break

        case 37: // left
        case 65: // a
          moveLeft = false
          break

        case 40: // down
        case 83: // s
          moveBackward = false
          break

        case 39: // right
        case 68: // d
          moveRight = false
          break

      }

    }

    document.addEventListener('keydown', onKeyDown, false)
    document.addEventListener('keyup', onKeyUp, false)
  }



  // ============ MODEL LOADER GLB =================

  let loadingText = $('#black-cover .text')
  let whiteCover = $('.white-cover')

  const onProgress = function (xhr) {
    const total = 25800000;
    // if (xhr.lengthComputable) {
    let percentComplete = xhr.loaded / total * 100
    let percentText = Math.round(percentComplete, 2)
    // console.log(percentText + '% downloaded')

    if ( percentText >= 100) {
      percentText = 99;
    }
    // Change loading % text
    loadingText.text(percentText + '')

    whiteCover.css("width", `${percentText + 1}%`);
    // }
  }

  const onError = function (error) { console.log(error) }
  const manager = new THREE.LoadingManager()
  manager.addHandler(/\.dds$/i, new DDSLoader())
  const loaderGLB = new GLTFLoader(manager)

  // Sky 360
  imgLoader.load(`${modelsPath}env/sea_env.jpg`, (texture) => {
    let sphereGeometry = new THREE.SphereGeometry(1000, 60, 40)
    let sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    sphereMaterial.dithering = true;
    sphereMaterial.castShadow = false;
    sphereGeometry.scale(-1, 1, 1)
    let mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(mesh)
    mesh.position.set(0, 0, roomModelPZ);
  })

  // Water
  // if (!isMobile) {
  //     const waterGeometry = new THREE.PlaneBufferGeometry( 2300, 2300 );
  //
  //     water = new Water(
  //       waterGeometry,
  //       {
  //         textureWidth: 128,
  //         textureHeight: 128,
  //         waterNormals: new THREE.TextureLoader().load( `${modelsPath}env/waternormals.jpg`, function ( texture ) {
  //
  //           texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //
  //         } ),
  //         alpha: 0.8,
  //         sunDirection: new THREE.Vector3(),
  //         sunColor: 0xfcf5e8,
  //         waterColor: 0xf3faf8,
  //         distortionScale: 1.7,
  //         fog: scene.fog !== undefined
  //       }
  //     );
  //
  //     water.rotation.x = - Math.PI / 2;
  //     water.position.y = - 10;
  //
  //     scene.add( water );
  // }

  // const loader = new THREE.CubeTextureLoader();
  // const texture = loader.load([
  //   'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
  //   'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
  //   'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
  //   'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
  //   'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
  //   'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
  // ]);
  // scene.background = texture;

  // Env map
  // let reflectionCube = new THREE.CubeTextureLoader()
  //   .setPath(`${modelsPath}env/`)
  //   .load([
  //     'posx.jpg',
  //     'negx.jpg',
  //     'posy.jpg',
  //     'negy.jpg',
  //     'posz.jpg',
  //     'negz.jpg'
  //   ])



  const setupArtworks = async (artworksGroup) => {
    await artworksGroup.traverse((child) => {
      mainArtistsList.forEach(async (item) => {

        // Setup VIDEO Artworks
        if (child.name === item.id && item.artwork.type === 'video') {
          const artworkMesh = await createArtworkMesh(item.artwork, item.id);
          artworkMesh.rotation.x = -Math.PI / 2;
          artworkMesh.translateX(item.artwork.translate.x);
          artworksVideoArr.push(artworkMesh);
          Object.assign(artworksVideoList, {
            [item.id]: {
              object: artworkMesh,
              viewed: false
            },
          })
          // if (item.id === 'matheos_georgios') {
          //   scene.getObjectByName('tree').material.displacementMap = artworkMesh.material.map;
          //   scene.getObjectByName('tree').material.displacementScale = 0.2;
          //   scene.getObjectByName('tree').material.map = artworkMesh.material.map;
          // }
          child.children[0].visible = false;
          child.add(artworkMesh);
        }

        // Setup GLB Artworks
        if (child.name === item.id && item.artwork.type === 'glb') {
          createArtwork3DObject(item.artwork, (gltf) => {
            console.log(gltf);
            const obj = gltf.scene;
            obj.name = item.id;
            if (gltf.animations[ 0 ]) animMixer.clipAction( gltf.animations[ 0 ], gltf.scene ).play();
            obj.scale.set(item.artwork.scale, item.artwork.scale, item.artwork.scale);
            artworksObjArr.push(obj);
            Object.assign(artworksObjList, {
              [item.id]: {
                object: obj,
                viewed: false
              }
            })
            child.children[0].visible = false;
            child.add(obj);
          });
        }

        // Setup Audio Artworks
        if (child.name === item.id && item.artwork.type === 'audio') {
            child.children[0].visible = false;

            // const positionAudio = new PositionalAudio( audioListener );
            // audioLoader.load( item.artwork.link, ( buffer ) => {
            //   positionAudio.setBuffer( buffer );
            //   positionAudio.setRefDistance( 5 );
            //   positionAudio.play();
            // });
            //
            // const helper = new PositionalAudioHelper( positionalAudio );

          audioManager.createSceneSound(child, item.artwork.link).then(() => {
            isLoaded = true;
            loadingText.text('100');
            removeCover();
          });
        }
      });
    })
  }




  loaderGLB.load(`${modelsPath}${modeFolder}${modeName}.glb`, (gltf) => {
    roomModel = gltf.scene
    roomModel.scale.set(roomModelS, roomModelS, roomModelS);
    roomModel.rotation.y = roomModelRY;
    roomModel.position.z = roomModelPZ;

    // roomModel.visible = false;

    roomModel.children.forEach((child) => {
      if (child.name === 'artworks') {
        setupArtworks(child);
      }
      if (child instanceof THREE.Mesh) {

        // child.material.envMap = reflectionCube
        // child.material.envMapIntensity = 0.8

        let childName = child.name.split('_');
        if (childName[0] === 'art') {
          audioManager.filterArtObjects(child, childName[1])
        }

        if (child.name === "collision") {
          child.visible = false;
          child.material.opacity = 0;
          collisionObjects.push(child)
        }

        if (child.name === "walls") {
          child.material.emissive = new THREE.Color(0xd8d0c3);
          child.material.emissiveIntensity = 0.5;
        }

        if (child.name === "glass") {
          child.visible = false;
        }

        // child.material.receiveShadow = true;
        // child.material.castShadow = true;

      }

    })

    scene.add(gltf.scene)

  }, onProgress, onError)






  // ================= RENDERER ====================

  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputEncoding = THREE.sRGBEncoding;
  // renderer.gammaOutput = true;
  // renderer.gammaFactor = 2.2;
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap
  // renderer.shadowMapSoft = true
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)


} // init end

// =========== SERVICE FUNCTIONS ===============

function getOrientationPermit () {
  DeviceOrientationEvent.requestPermission()
    .then(response => {
      if (response === 'granted') {
        window.addEventListener('deviceorientation', setOrientationControls, true)
        isGranted = true;
      } else {
        alert('Open website on the new tab and press ALLOW to Access Motion');
      }
    })
    .catch()
}

// Adds different controls if seen on mobile.
function setOrientationControls (e) {
  // If device orientation is not available, return.
  if (!e.alpha) {
    return
  }

  controls = new DeviceOrientationControls(camera, true)
  // Create controls for mobile.
  controls.connect()
  controls.update()
  controlsEnable()
  // fullscreen();
  // element.addEventListener('click', fullscreen, false)
  window.removeEventListener('deviceorientation', setOrientationControls, true)
}

function isEnabled () {
  return controlsEnabled
}

// Enables the movement
function controlsEnable () {
  controlsEnabled = true
}

// Disables the movement and sets the velocity to zero.
function controlsDisable () {
  controlsEnabled = false
  velocity.x = 0
  velocity.y = 0
  velocity.z = 0
  moveForward = false
  moveBackward = false
  moveLeft = false
  moveRight = false
}




// ============= MOVE COLLISIONS ==============

function move (camObject, delta) {
  let cnt = 0;

  // Set speed and move-direction
  velocity.x -= velocity.x * 10.0 * delta
  velocity.z -= velocity.z * 10.0 * delta

  if (moveForward) {
    velocity.z -= speed * delta
  } else if (moveBackward) {
    velocity.z += speed * delta
  }

  if (moveLeft) {
    velocity.x -= speed * delta
  } else if (moveRight) {
    velocity.x += speed * delta
  }

  if (velocity.x > 0) {
    moveDirection.x = 1
  } else if (velocity.x < 0) {
    moveDirection.x = -1
  } else {
    moveDirection.x = 0
  }

  if (velocity.z > 0) {
    moveDirection.z = 1
  } else if (velocity.z < 0) {
    moveDirection.z = -1
  } else {
    moveDirection.z = 0
  }

  // // set origin and direction of the raycaster
  // raycasterFloor.set(camera.position, floorDirection)
  // floorCollisions = raycasterFloor.intersectObjects(collisionObjects, true)
  // isOnFloor = !!floorCollisions.length
  //
  // if (isOnFloor) {
  //   gravityFactor = 1
  //   // On the floor and not jumping
  //   if (velocity.y < 0) {  // Avoid sinking in the floor
  //     velocity.y = 0
  //     jump = false
  //   }
  //
  //   if (!jump) {
  //     // Calculte how deep we are stuck in the floor. Between 0 and 5 is OK.
  //     floorOffset = Math.max(0, raycasterFloor.far - floorCollisions[0].distance - 0.2)
  //
  //     if (floorOffset) {
  //       velocity.y = Math.min(floorOffset * 20, floorOffset / delta)
  //     }
  //   }
  //
  // } else {
  //
  //   velocity.y -= (10 * delta * gravityFactor)
  //   gravityFactor += 6
  //
  //   // Stop the movement when raising into the air and not jumping
  //   if (!jump && velocity.y > 0) {
  //     velocity.y = 0
  //   }
  // }

  if (moveDirection.length() > 0) {
    cnt = 0
    // Set the length of the collision-detection. Ensure that the ray is not shorter than the travel-distance
    rayWall.far = Math.max(speed / 20, velocity.length() * delta)
    // The ray is used twice in each frame. After the first scanning, it is rotated for the second scan.
    // rotate the move-direction by the camera-angle minus the half angle (20 deg)
    moveDirection.applyAxisAngle(zVector, camObject.rotation.y - rayAngle1)
    // set origin and direction of the raycaster
    rayWall.set(camObject.position, moveDirection)
    // detect collisions.
    cnt += rayWall.intersectObjects(collisionObjects, true).length
    // rotate the move-direction by the full angle (40 deg)
    moveDirection.applyAxisAngle(zVector, rayAngle2)
    // set origin and direction of the raycaster
    rayWall.set(camObject.position, moveDirection)
    // detect collisions.
    cnt += rayWall.intersectObjects(collisionObjects, true).length

    isCollision = cnt > 0
  }

  // Do not move on collision.
  if (isCollision) {
    velocity.x = 0
    velocity.z = 0
  } else {
    camObject.translateX(velocity.x * delta)
    camObject.translateZ(velocity.z * delta)
  }

  // if (isInPopUpArea()) {
  // } else {
  //   const tween2 = new TWEEN.Tween(art9popup.material).to({opacity: 0}, 1).start();
  // }
  // art9popup.visible = isInPopUpArea();

  camObject.position.y = 50;

  // const isInAreyNow = isInPopUpArea();
  // if (isInAreyNow !== isInAreaPrev) {
  //   isInPopUpArea() ? showPopup.start() : hidePopup.start();
  //   isInAreaPrev = isInAreyNow;
  // }

}


// function isInPopUpArea() {
//   // check if the camera is in the popup area.
//   const ctrlPos = isMobile ? camera.position : controls.getObject().position;
//   const inLimitsX = ctrlPos.x > limits.xMin && ctrlPos.x < limits.zMax;
//   const inLimitsZ = ctrlPos.z > limits.zMin && ctrlPos.z < limits.zMax;
//
//   return inLimitsX && inLimitsZ;
// }

const artworkInterAction = (intObj) => {
  console.log(intObj.parent.name);
  console.log(artworksVideoList[intObj.parent.name]);
  const viewed = artworksVideoList[intObj.parent.name].viewed;
  !viewed ? artworksVideoList[intObj.parent.name].viewed = true : false;

  if (viewed) return;

  // Kirill check one-time intersaction here:
  // check "artworksVideoList" object
  // show / hide corespondent UI for each artist
  // console.log(artworksVideoList, viewed);

  switch (intObj.parent.name) {
    case 'susanne_the_end':
      renderGlitchEffect = true;
      setTimeout(() => renderGlitchEffect = false, 4000);
      break;

    case 'timur_proko':
      artworksObjList[`${intObj.parent.name}_balloon`].object.scale.set(1, 1, 1)
      break;

  }
}


let intersected = false, intersectedEl, iObj;
const checkVideoArtworksIntersect = () => {
  artworksRay.setFromCamera( mouse, camera );
  intersectedEl = artworksRay.intersectObjects( artworksVideoArr )[0];

    if (!intersected && intersectedEl) {
      if (intersectedEl.distance > 80) return;
      iObj = intersectedEl.object;
      iObj.material.map.image.muted = false;

      artworkInterAction(iObj);

      intersected = true;
    }

    if (intersected && !intersectedEl) {
      intersected = false;
      iObj.material.map.image.muted = true;
    }

}



// postprocessing

composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

glitchPass = new GlitchPass();
composer.addPass( glitchPass );



// ==============  ANIMATION AND RESIZE ==============

function onWindowResize () {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

}

function animate () {

  // setTimeout(() => {
  requestAnimationFrame(animate)
  // }, 1000 / 30)

  time = performance.now()

  if (controlsEnabled) {
    // delta = Math.min(1, (time - prevTime) / 1000)
    // delta = (time - prevTime) / 1000
    // water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    checkVideoArtworksIntersect();

    var delta = clock.getDelta();
    if ( animMixer ) animMixer.update( delta );

    if (isMobile) {
      controls.update();
      move(camera, delta)
    } else {
      // water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
      move(camObject, delta)
    }
    prevTime = time

    TWEEN.update(time)

    artworksVideoArr.forEach((i) => i.needsUpdate = true);
  }



  if ( renderGlitchEffect ) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }

}
