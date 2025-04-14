import { Sphere } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Controllers, Hands, Interactive, useController, useXR } from '@react-three/xr'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DoubleSide, Object3D, Quaternion, Vector3 } from 'three'
import { Gesture } from '@use-gesture/vanilla'
import * as THREE from 'three'
let ControlState = {
  guiLeft: false,
  guiRight: false,
  guiForward: false,
  guiBackward: false,

  keyLeft: false,
  keyRight: false,
  keyForward: false,
  keyBackward: false,
}

export function GUI() {
  useEffect(() => {
    let hh = ({ key }) => {
      if (key === 'w') {
        ControlState.keyForward = true
      }
      if (key === 's') {
        ControlState.keyBackward = true
      }
      if (key === 'a') {
        ControlState.keyLeft = true
      }
      if (key === 'd') {
        ControlState.keyRight = true
      }
    }
    window.addEventListener('keydown', hh)
    return () => {
      window.removeEventListener('keydown', hh)
    }
  }, [])
  useEffect(() => {
    let hh = ({ key }) => {
      if (key === 'w') {
        ControlState.keyForward = false
      }
      if (key === 's') {
        ControlState.keyBackward = false
      }
      if (key === 'a') {
        ControlState.keyLeft = false
      }
      if (key === 'd') {
        ControlState.keyRight = false
      }
    }
    window.addEventListener('keyup', hh)
    return () => {
      window.removeEventListener('keyup', hh)
    }
  }, [])
  return (
    <>
      <div
        onPointerDown={() => {
          ControlState.guiForward = true
        }}
        onPointerUp={() => {
          ControlState.guiForward = false
        }}
        onPointerCancel={() => {
          ControlState.guiForward = false
        }}
        onPointerLeave={() => {
          ControlState.guiForward = false
        }}
        className=' absolute bottom-0 left-0 m-4 select-none rounded-xl bg-white p-2'
      >
        Forward
      </div>
      <div
        onPointerDown={() => {
          ControlState.guiBackward = true
        }}
        onPointerUp={() => {
          ControlState.guiBackward = false
        }}
        onPointerCancel={() => {
          ControlState.guiBackward = false
        }}
        onPointerLeave={() => {
          ControlState.guiBackward = false
        }}
        className=' absolute bottom-0 right-0 m-4 select-none rounded-xl bg-white p-2'
      >
        Backward
      </div>
    </>
  )
}

export function Walker({ startAt = [0, 0, 0.1], children, setActiveModel, resetRotation }) {
  ///
  let [ctrler, setCtrler] = useState(false)

  const {
    // An array of connected `XRController`
    controllers,
    // Whether the XR device is presenting in an XR session
    isPresenting,
    // Whether hand tracking inputs are active
    isHandTracking,
    // A THREE.Group representing the XR viewer or player
    player,
    // The active `XRSession`
    session,
    // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
    foveation,
    // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
    referenceSpace,
  } = useXR()

  const models = ['Lab4', 'Lab5', 'Hospital']

  let camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.position.fromArray(startAt)
    camera.lookAt(startAt[0], startAt[1], startAt[2] - 1)
    camera.rotation.x = 0
    camera.rotation.z = 0

    if (player) {
      player.position.copy(camera.position)
      player.quaternion.copy(camera.quaternion)
    }
  }, [camera, player, startAt])

  useEffect(() => {
    console.log('Connected Controllers:', controllers)
  }, [controllers])

  let left = useMemo(() => {
    return new Object3D()
  }, [])

  let right = useMemo(() => {
    return new Object3D()
  }, [])

  const rightController = useController('right')
  const leftController = useController('left')
  const prevButtonStates = useRef([false, false])

  useFrame(() => {
    if (rightController?.inputSource?.gamepad) {
      const { buttons } = rightController.inputSource.gamepad
      console.log('Right Controller Buttons:', buttons) // Debugging

      const aPressed = buttons[4]?.pressed
      const bPressed = buttons[5]?.pressed

      // Return to main menu on A or B button press
      if ((aPressed && !prevButtonStates.current[0]) || (bPressed && !prevButtonStates.current[1])) {
        console.log('A/B button pressed - returning to main menu')
        setActiveModel(null)
        prevButtonStates.current[0] = aPressed
        prevButtonStates.current[1] = bPressed
      } else if (!aPressed && prevButtonStates.current[0]) {
        prevButtonStates.current[0] = false
      } else if (!bPressed && prevButtonStates.current[1]) {
        prevButtonStates.current[1] = false
      }
    }
  })

  // let player = useXR((s) => s.player);
  // let session = useXR((s) => s.session);
  let pt = useMemo(() => {
    return new Vector3(0, 0, 0).fromArray(startAt)
  }, [startAt])

  let isDown = useRef(false)

  let temp = new Vector3()
  let chasing = new Vector3()
  let keydown = useMemo(() => {
    let keydown = {
      wKey: true,
    }

    return keydown
  }, [])

  let gl = useThree((s) => s.gl)
  let proxy = useMemo(() => {
    return new Object3D()
  }, [])

  // Add raycaster for collision detection
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const scene = useThree((state) => state.scene)
  const collisionDistance = 1.0 // Minimum distance to maintain from objects

  let up = new Vector3(0, 1, 0)
  let speed = 0.2
  useFrame(({ camera }, dt) => {
    // Store original position for collision check
    const originalPosition = camera.position.clone()
    let hasCollision = false

    // Only allow movement if not in VR mode menu selection
    if (!resetRotation) {
      if (ControlState.keyBackward || ControlState.guiBackward) {
        temp.set(0, 0, 1)
        temp.applyAxisAngle(up, proxy.rotation.y)
        camera.position.addScaledVector(temp, 10 * dt * speed)

        // Check collision
        raycaster.set(camera.position, temp.normalize())
        const intersects = raycaster.intersectObjects(scene.children, true)
        if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
          hasCollision = true
        }
      }
      if (ControlState.keyForward || ControlState.guiForward) {
        temp.set(0, 0, -1)
        temp.applyAxisAngle(up, proxy.rotation.y)
        camera.position.addScaledVector(temp, 10 * dt * speed)

        // Check collision
        raycaster.set(camera.position, temp.normalize())
        const intersects = raycaster.intersectObjects(scene.children, true)
        if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
          hasCollision = true
        }
      }

      if (ControlState.keyLeft || ControlState.guiLeft) {
        temp.set(0, 0, -1)
        temp.applyAxisAngle(up, proxy.rotation.y + Math.PI * 0.5)
        camera.position.addScaledVector(temp, 10 * dt * speed)

        // Check collision
        raycaster.set(camera.position, temp.normalize())
        const intersects = raycaster.intersectObjects(scene.children, true)
        if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
          hasCollision = true
        }
      }

      if (ControlState.keyRight || ControlState.guiRight) {
        temp.set(0, 0, -1)
        temp.applyAxisAngle(up, proxy.rotation.y + Math.PI * -0.5)
        camera.position.addScaledVector(temp, 10 * dt * speed)

        // Check collision
        raycaster.set(camera.position, temp.normalize())
        const intersects = raycaster.intersectObjects(scene.children, true)
        if (intersects.length > 0 && intersects[0].distance < collisionDistance) {
          hasCollision = true
        }
      }
    }

    // If collision detected, revert to original position
    if (hasCollision) {
      camera.position.copy(originalPosition)
    }
  })

  useEffect(() => {
    let x = new Vector3(1, 0, 1)
    gl.domElement.style.touchAction = 'none'
    gl.domElement.style.userSelect = 'none'
    let gg = new Gesture(
      gl.domElement,
      {
        onDrag: (event) => {
          event.cancelable && event.preventDefault()
          /** @type {import("@use-gesture/vanilla").AnyHandlerEventTypes} */
          event = event

          if (event.active) {
            proxy.rotation.y += event.delta[0] / 250
          }
        }, //Handler<'drag', check<T, 'drag'>>;
        onDragStart: (event) => {
          event.cancelable && event.preventDefault()
          /** @type {import("@use-gesture/vanilla").AnyHandlerEventTypes} */
          event = event
        }, //Handler<'drag', check<T, 'drag'>>;
        onDragEnd: (event) => {
          event.cancelable && event.preventDefault()
          /** @type {import("@use-gesture/vanilla").AnyHandlerEventTypes} */
          event = event
        }, //Handler<'drag', check<T, 'drag'>>;
      },
      {
        eventOptions: {
          passive: false,
        },
        drag: {
          preventScrollAxis: 'y',
          preventDefault: true,
          preventScroll: true,
        },
      },
    )

    return () => {
      gg.destroy()
    }
  }, [gl, proxy.rotation])

  useFrame(() => {
    if (!session) {
      camera.quaternion.slerp(proxy.quaternion, 0.1)
    }
  })

  // useEffect(() => {
  //   if (!session) {
  //     camera.position.y = 1.45
  //     // Optionally, reset the player's position if applicable
  //     if (player) {
  //       player.position.y = 0.0
  //     }
  //   }
  // }, [session, player, camera, pt])

  // Add effect to handle rotation reset
  useEffect(() => {
    if (resetRotation) {
      proxy.rotation.y = 0
    }
  }, [resetRotation, proxy])

  //
  useFrame(({ camera, mouse, scene }, dt) => {
    // Add velocity tracking with damping

    if (isDown.current) {
      temp.set(0, 0, -1)

      if (ctrler === leftController) {
        temp.set(0, 0, 1)
        temp.applyQuaternion(ctrler.controller.quaternion)
      }

      if (ctrler === rightController) {
        temp.set(0, 0, -1)
        temp.applyQuaternion(ctrler.controller.quaternion)
      }
      temp.y = 0.0

      pt.addScaledVector(temp, 10 * dt * speed)
    }

    if (player && session) {
      // Always lerp the player to the target position for smooth movement
      // but use a higher coefficient when not moving to stop more quickly
      const lerpFactor = isDown.current ? 0.9 : 1.0 // Higher value means quicker stop
      pt.y = 0.0

      player.position.lerp(pt, lerpFactor)
      chasing.copy(player.position)
      camera.position.lerp(chasing, lerpFactor)
    }
    if (!player && !session) {
      pt.y = 1.0
    }

    // let q = new Quaternion()
    // left.getWorldQuaternion(q)
    // console.log(q);
  })

  // const leftController = useController('left')
  // console.log(leftController)
  return (
    <group>
      <Controllers />
      <Hands />

      <Interactive
        onSelectStart={(event) => {
          setCtrler(event.target)
          console.log(event)
          isDown.current = true
        }}
        onSelectEnd={(event) => {
          setCtrler(event.target)
          isDown.current = false
          console.log(event)
        }}
        onSelect={(event) => {
          //
          let target = event.intersection
          if (target) {
            // setCtrler(event.target)
            // pt.copy(target.point)
          }
        }}
      >
        <Sphere visible={false} scale={1000}>
          <meshStandardMaterial roughness={0} side={DoubleSide}></meshStandardMaterial>
        </Sphere>
        {children}
      </Interactive>
    </group>
  )
}
