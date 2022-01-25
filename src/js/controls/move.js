

// ============= MOVE COLLISIONS ==============
let isCollision = false;
export const move = (camObject, delta) => {
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

