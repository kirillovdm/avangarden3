import * as THREE from '../three/three.module'
import { PositionalAudioHelper } from '../services/PositionalAudioHelper.js'

export class AudioEngineService {

  constructor(camera, isMobile) {

    this.isAudioPlaying = false;
    this.soundObjectsPull = [];

    this.listener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();
    this.listener.rotation.x = 0;
    // this.listener.rotation.x = isMobile ? 0 : Math.PI;

    camera.add( this.listener );

    this.sceneSoundConfig = {
      innerCone: 359,
      outerCone: 359,
      gain: 0,
      refDistance: 0.5,
      maxDistance: 100,
      volume: isMobile ? 0.6 : 0.5,
    }
    this.artSoundConfig = {
      innerCone: 20,
      outerCone: 170,
      gain: 0,
      refDistance: 1,
      maxDistance: 50,
      volume: isMobile ? 0.9 : 0.7,
    }

  }

  createSoundObject(obj, conf, url, resolve) {
    const sound = new THREE.PositionalAudio( this.listener );
    this.audioLoader.load( url, ( buffer ) => {

      const lConf = {
        innerCone: conf.innerCone ? conf.innerCone : 20,
        outerCone: conf.outerCone ? conf.outerCone : 170,
        gain: conf.gain ? conf.gain : 0,
        refDistance: conf.refDistance ? conf.refDistance : 1,
        maxDistance: conf.maxDistance ? conf.maxDistance : 50,
        volume: conf.volume ? conf.volume : 1
      }

      sound.setBuffer( buffer );
      sound.setRefDistance( lConf.refDistance );
      sound.setDirectionalCone( lConf.innerCone, lConf.outerCone, lConf.gain );
      sound.setMaxDistance(lConf.maxDistance);
      sound.setVolume( lConf.volume );
      sound.setDistanceModel('linear');
      // sound.setRolloffFactor(1);
      sound.loop = true;
      sound.autoplay = true
      sound.scale.set(20, 20, 20);
      // let helper = new PositionalAudioHelper( sound, 1 );
      // sound.add( helper );
      // sound.play();
      this.soundObjectsPull.push(sound);

    }, (e) => { // on progress function
      const total = e.total;
      let percentComplete = e.loaded / total * 100;
      if (resolve && percentComplete === 100) {
        resolve('scene sound loaded'); // if scene sound loaded
      }
    });

    obj.add( sound );
  }


  filterArtObjects(obj, num) {
    const number = parseInt(num);
    if (number >= 9) return;

    switch (number) {
      case 1:
        // createSoundObject(obj, configs)
        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;
      case 5:

        break;
      case 6:

        break;
      case 7:

        break;
      case 8:

        break;
    }

    this.createSoundObject(obj, this.artSoundConfig)
  }

  createSceneSound(scene, url) {
    return new Promise((resolve) => {
      this.createSoundObject(scene, this.sceneSoundConfig, url, resolve)
    })
  }

  startAudio(audioContext) {
    if (!this.isAudioPlaying) {
      audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
        this.soundObjectsPull.forEach((soundItem) => {
          soundItem.play();
          this.isAudioPlaying = true;
        });
      });
    }
  }


}

// export { AudioEngineService }
