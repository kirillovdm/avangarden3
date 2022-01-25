/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import {
	Euler, Raycaster,
	EventDispatcher,
	Vector3, Object3D
} from "../three/three.module.js";

var PointerLockControls = function ( camera, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
		domElement = document.body;

	}

	this.domElement = domElement;
	this.isLocked = false;
  let scope = this;

  let raySelect = new Raycaster();

  camera.rotation.set(0, 0, 0);

  let pitchObject = new Object3D();
  pitchObject.add(camera);

  let yawObject = new Object3D();
  yawObject.position.y = 35;
  yawObject.add(pitchObject);

	let changeEvent = { type: 'change' };
	let lockEvent = { type: 'lock' };
	let unlockEvent = { type: 'unlock' };

	// let euler = new Euler( 0, 0, 0, 'YXZ' );

	let PI_2 = Math.PI / 2;

	let vec = new Vector3();

	function onMouseMove( event ) {

		if ( scope.isLocked === false ) return;

		let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;


    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));


    // checkArt({x: movementX, y: movementY});
		// euler.setFromQuaternion( camera.quaternion );
    //
		// euler.y -= movementX * 0.002;
		// euler.x -= movementY * 0.002;
    //
		// euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );

		// camera.quaternion.setFromEuler( euler );

		scope.dispatchEvent( changeEvent );

	}

	function checkArt (mouse) {
    // Emit ray
    // raySelect.setFromCamera(mouse, camera);
    //
    // // all intersects
    // let intersects = raySelect.intersectObjects(artObject);
    //
    // if ( intersects.length > 0 ) {
    //
    //   if ( INTERSECTED != intersects[ 0 ].object ) {
    //
    //     if ( INTERSECTED ) INTERSECTED.children[0].visible = INTERSECTED.currentVisible;
    //
    //     INTERSECTED = intersects[ 0 ].object;
    //
    //     console.log(INTERSECTED)
    //     INTERSECTED.currentVisible = INTERSECTED.children[0].visible
    //     INTERSECTED.children[0].visible = true;
    //
    //   }
    //
    // } else {
    //
    //   if ( INTERSECTED ) INTERSECTED.children[0].visible = INTERSECTED.currentVisible;
    //
    //   INTERSECTED = null;
    //
    // }
    //   artPopup.visible = isInLimits();
    // if (intersects.length > 0) {
    //
    //   if (INTERSECTED !== intersects[0].object) {
    //     artPopup.visible = false;
    //     console.log('hide');
    //
    //     INTERSECTED = intersects[0].object;
    //   }
    // } else {
    //   // None selected then revert color of previous item
    //   if (INTERSECTED) {
    //
    //     artPopup.visible = true;
    //     console.log('show');
    //     INTERSECTED = null;
    //   }
    // }

  }

	function onPointerlockChange() {

		if ( document.pointerLockElement === scope.domElement ) {

			scope.dispatchEvent( lockEvent );

			scope.isLocked = true;

		} else {

			scope.dispatchEvent( unlockEvent );

			scope.isLocked = false;

		}

	}

	function onPointerlockError() {

		console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

	}


	this.connect = function () {

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.addEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.disconnect = function () {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
		document.removeEventListener( 'pointerlockerror', onPointerlockError, false );

	};

	this.dispose = function () {

		this.disconnect();

	};
  //
	// this.getObject = function () { // retaining this method for backward compatibility
  //
	// 	return camera;
  //
	// };

  this.getObject = function () {

    return yawObject;

  };

	this.getDirection = function () {

		let direction = new Vector3( 0, 0, - 1 );
    let rotation = new Euler(0, 0, 0, "YXZ");

		return function ( v ) {

      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

      v.copy(direction).applyEuler(rotation);

      return v;

			// return v.copy( direction ).applyQuaternion( camera.quaternion );

		};

	}();

	this.moveForward = function ( distance ) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up

		vec.setFromMatrixColumn( camera.matrix, 0 );

		vec.crossVectors( camera.up, vec );

		camera.position.addScaledVector( vec, distance );

	};

	this.moveRight = function ( distance ) {

		vec.setFromMatrixColumn( camera.matrix, 0 );

		camera.position.addScaledVector( vec, distance );

	};

	this.lock = function () {

		this.domElement.requestPointerLock();

	};

	this.unlock = function () {

		document.exitPointerLock();

	};

	this.connect();

};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;

export { PointerLockControls };
