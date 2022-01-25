import SusanneTheEnd from '../../assets/videos/susanne_the_end.mp4';
import EdouardPlasma from '../../assets/videos/edouard_plasma.mp4';
import Biorhythm from '../../assets/videos/biorhythm.mp4';
import HeskboAudio from '../../assets/audio/heskbo.mp3';
import Socia from '../../assets/videos/socia.mp4';
import Balloon from '../../assets/videos/balloon_anim.glb';
import WorldTimurProko from '../../assets/videos/world_timur_proko.mp4';
import DanielAutomatic from '../../assets/videos/daniel_automatic_towards.mp4';
import Pogwar from '../../assets/videos/pogwar.mp4';
import Hauk_1 from '../../assets/videos/hauk_1.mp4';
import Hauk_2 from '../../assets/videos/hauk_2.mp4';
import Hauk_3 from '../../assets/videos/hauk_3.mp4';
import VlasBelov from '../../assets/videos/vlas_belov_comp.glb';
import Digitral from '../../assets/videos/digitral_matheos_georgios.mp4';
import MironBeautifulWorld from '../../assets/videos/miron_beautiful_world.mp4';
import MironDivercity from '../../assets/videos/miron_divercity.mp4';
import Omega from '../../assets/videos/omega.mp4';
import * as THREE from '../three/three.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import EdouardPlasma from '../../assets/videos/edouard_plasma.mp4';
// import EdouardPlasma from '../../assets/videos/edouard_plasma.mp4';

const glbLoader = new GLTFLoader();


const createVideoMaterial = async (videoBlobObjectURL, id) => {
  const video = document.createElement('video');
  video.playsinline = true;
  video.muted = true;
  video.loop = true;
  video.preload = 'auto';
  video.setAttribute('id', `videoAtlas_${id}`);
  // setVideoTextureID(videoTextureID + 1);
  video.setAttribute('playsinline', 'true');
  video.setAttribute('muted', 'true');
  video.setAttribute('preload', 'auto');
  video.setAttribute('loop', 'true');

  video.src = videoBlobObjectURL;

  // set styles so works with iOS 13 but basically not visible
  video.style.display = 'block';
  video.style.position = 'absolute';
  video.style.top = '0px';
  video.style.left = '0px';
  video.style.opacity = '0.01';
  video.style.zIndex = '-100';

  const documentBody = document.querySelector('body');
  documentBody.appendChild(video);
  video.play();

  const videoTexture = await new THREE.VideoTexture(video);
  videoTexture.flipY = true;
  videoTexture.minFilter = THREE.LinearFilter;

  return new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
};

//
export const initTextures = (renderer, loaded) => {
  let assetsCounter = 0;
  const textureLoader = new THREE.TextureLoader();
  mainArtistsList.forEach((e) => {
    textureLoader.load(e.artwork.link, (tex) => {
      renderer.initTexture(tex);
    }, () => {
      if (assetsCounter === mainArtistsList.length) {
        loaded();
        console.log('all assets loaded');
      } else {
        console.log(`asset ${ e.name } loaded`);
        assetsCounter ++;
      }
    });
  });
}

export const createArtworkMesh = async (asset, id) => {
  const videoMaterial = await createVideoMaterial(asset.link, id);
  const meshWidth = (asset.width / 300) * asset.scale;
  const meshHeight = (asset.height / 300) * asset.scale;
  console.log(meshWidth, meshHeight)
  const geometry = new THREE.PlaneGeometry(meshWidth, meshHeight);
  return new THREE.Mesh( geometry, videoMaterial );
}

export const createArtwork3DObject = async (asset, loaded) => {
  await glbLoader.load( asset.link,
    ( gltf ) => {
      loaded(gltf);
      // gltf.animations.play(); // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
    }
  );
}

export const mainArtistsList = [
  {
    id: 'susanne_the_end',
    name: 'Susanne Layla Petersen',
    website: 'www.glasslabs.works',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: SusanneTheEnd,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 854,
      height: 480
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд',
  },
  {
    id: 'edouard_plasma',
    name: 'Edouar Duvernay',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: EdouardPlasma,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 854,
      height: 480
    },
    interaction: '"VR очки в галерее, надеваешь - смотришь видео',
  },
  {
    id: 'biorhythm',
    name: 'BIORHYTHM',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Biorhythm,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480,
      price: '2.5 ETH'
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд',
  },
  {
    id: 'heskbo',
    name: 'Heskbo',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'audio',
      concept: 'Reality meets virtuality',
      link: HeskboAudio,
    },
    interaction: 'Рядом с креслом саунд система, садишься в кресло. нажимаешь - темнота и надпись Close your eyes and listen',
  },
  {
    id: 'socia',
    name: 'Socia',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Socia,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: '',
  },
  {
    id: 'timur_proko',
    name: 'Timur Proko',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: WorldTimurProko,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'После просмотра AR объекты летают за окном',
  },
  {
    id: 'timur_proko_balloon',
    name: 'Timur Proko',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'glb',
      concept: 'Reality meets virtuality',
      link: Balloon,
      scale: 0,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'После просмотра AR объекты летают за окном',
  },
  // {
  //   id: 'timur_proko_blue',
  //   name: 'Timur Proko',
  //   website: '',
  //   instagram: '@glasslabs_art',
  //   email: 'studio@glasslabs.com',
  //   about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
  //   artwork: {
  //     title: 'The End of the World as we know it',
  //     type: 'video',
  //     concept: 'Reality meets virtuality',
  //     link: BlueShape,
  //     scale: 1,
  //     translate: { x:0, y:0, z:0 },
  //     width: 853,
  //     height: 480
  //   },
  //   interaction: 'После просмотра AR объекты летают за окном',
  // },
  {
    id: 'daniel_bryden',
    name: 'Daniel Bryden',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: DanielAutomatic,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд',
  },
  {
    id: 'katarzyna_maria',
    name: 'Katarzyna Kałaniuk, Maria Strzelecka',
    website: '',
    instagram: '@kalaniukk, @mariastrze',
    email: 'kalaniuk.katarzyna@gmail.com, maria.strzelecka123@gmail.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'Pogwar',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Pogwar,
      price: '2500 EUR',
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд'
  },
  {
    id: 'anton_hauk_1',
    name: 'Anton Hauk',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Hauk_1,
      scale: 0.6,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд',
  },
  {
    id: 'anton_hauk_2',
    name: 'Anton Hauk',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Hauk_2,
      scale: 0.6,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд',
  },
  {
    id: 'vlas_belov',
    name: 'Vlas Belov',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'glb',
      concept: 'Reality meets virtuality',
      scale: 0.86,
      translate: { x:0, y:0, z:0 },
      link: VlasBelov,
    },
    interaction: 'Скульптура с договором может ли разворачиваться по текстуре? тогда ныряешь и там видео перформанса подписать?"',
  },
  {
    id: 'matheos_georgios',
    name: 'Matheos & Georgios (Matheos Zaharopoulos and Georgios Varoutsos)',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Digitral,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 853,
      height: 480
    },
    interaction: 'Видео на стене, по клику на весь экран. Когда отходишь этот эффект в галерее в этом месте держиться несколько секунд',
  },
  {
    id: 'yura_miron',
    name: 'Yura Miron',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: MironBeautifulWorld,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 480,
      height: 480
    },
    artwork_additional: [MironDivercity],
    interaction: '',
  },
  {
    id: 'yura_miron_2',
    name: 'Yura Miron',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: MironDivercity,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 480,
      height: 480
    },
    interaction: '',
  },
  {
    id: 'omega',
    name: 'Omega',
    website: '',
    instagram: '@glasslabs_art',
    email: 'studio@glasslabs.com',
    about: 'Susanne Layla Petersen is a digital artist based in Frederiksberg, Denmark.',
    artwork: {
      title: 'The End of the World as we know it',
      type: 'video',
      concept: 'Reality meets virtuality',
      link: Omega,
      scale: 1,
      translate: { x:0, y:0, z:0 },
      width: 480,
      height: 480
    },
    interaction: 'Видео с "рукой" отсылает на маску в нашем инстаграм, люди постят с # и лучшее публикуем',
  },
];
