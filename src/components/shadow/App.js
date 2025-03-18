import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber'
import {
  SoftShadows,
  Float,
  CameraControls,
  Sky,
  PerformanceMonitor,
  OrbitControls,
  useHelper,
  Environment,
  Box,
  useVideoTexture,
  useTexture,
} from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { easing } from 'maath'
import { Hospital } from './Hospital.jsx'
import { Lab } from './Biolab4.jsx'
import { Lab4 } from './Biobank.jsx'
// import { CameraHelper } from 'three'
import { VRButton, XR } from '@react-three/xr'
import { GUI, Walker } from './Walker.jsx'
import { DoubleSide, MeshBasicMaterial, RepeatWrapping, VideoTexture } from 'three'
import { LightingFile } from './LightingFile/LightingFile.js'
// import { ParticleRelay } from '../Particles/ParticleEngine/CoreEngine.jsx'

function Light() {
  let dirL = useRef()
  const ref = useRef()
  // let lerp = new Object3D()
  useFrame((state, delta) => {
    // ref.current.getWorldPosition(lerp.position)

    // let raycaster = state.raycaster
    // raycaster.setFromCamera(state.mouse, state.camera)
    // let [pts] = raycaster.intersectObject(state.scene, true)
    // if (pts) {
    //   lerp.lookAt(pts.point.x, pts.point.y, pts.point.z)
    //   // ortho.current.target.set(pts.point.x, pts.point.y, pts.point.z)
    // }
    // ref.current.quaternion.slerp(lerp.quaternion, 0.1)
    //
    easing.dampE(
      ref.current.rotation,
      [(state.pointer.y * Math.PI) / 5, (state.pointer.x * Math.PI) / 5, 0],
      0.25,
      delta,
    )
  })
  let ortho = useRef()
  // useHelper(ortho, CameraHelper, '#ff0000')
  return (
    <group position={[-10, 5, -10]} ref={ref}>
      <directionalLight
        color={'#f48d2e'}
        ref={dirL}
        position={[-5, 5, -5]}
        castShadow
        intensity={2}
        shadow-mapSize={2048}
        shadow-bias={-0.002}
      >
        <orthographicCamera ref={ortho} attach='shadow-camera' args={[-33.3, 33.3, 33.3, -33.3, 0.1, 50]} />
      </directionalLight>
    </group>
  )
}

export default function App() {
  const { impl, debug, enabled, samples, ...config } = useControls({
    debug: true,
    enabled: true,
    size: { value: 35, min: 0, max: 100, step: 0.1 },
    focus: { value: 0.5, min: 0, max: 2, step: 0.1 },
  })

  return (
    <>
      <Canvas
        gl={{ logarithmicDepthBuffer: true }}
        onCreated={(st) => {
          st.gl.useLegacyLights = true
        }}
        shadows
        camera={{ position: [5, 2, 10], fov: 80 }}
      >
        <XR foveation={1}>
          <Walker startAt={[0, 0.7, 0.1]}>
            <group rotation={[0, 1.73, 0]}>
              <group position={[30, 0, -2]}>
                <group rotation={[0, Math.PI * 1.0, 0]}>
                  <group position={[0, 0, 3]}>
                    <Lab4></Lab4>
                    {/* */}
                  </group>
                </group>
              </group>
            </group>
          </Walker>
        </XR>

        {debug && process.env.NODE_ENV === 'development' && (
          <>
            <Perf position='top-left' />
            <PerformanceMonitor />
          </>
        )}
        {enabled && <SoftShadows {...config} samples={6} />}

        <Light />

        {/*  */}

        {/* <Room scale={0.5} position={[0, -1, 0]} /> */}
        <Sky inclination={0.52} scale={320} />

        <LightingFile background={true} url={`/venice_sunset_1k.hdr`}></LightingFile>

        {/* <Environment files={`/venice_sunset_1k.hdr`} background></Environment> */}
      </Canvas>
      <GUI></GUI>
      <VRButton></VRButton>
      {/* <div className=' absolute bottom-24 right-0 m-4 select-none rounded-xl p-2 text-xs opacity-50'>
        <>
          <a href={`https://reunite.digital`} target='_blank'>
            Agape
          </a>{' '}
          + hyg
        </>
      </div> */}
    </>
  )
}

// function Sphere({ color = "hotpink", floatIntensity = 15, position = [0, 5, -8], scale = 1 }) {
//   return (
//     <Float floatIntensity={floatIntensity}>
//       <mesh castShadow position={position} scale={scale}>
//         <sphereGeometry />
//         <meshBasicMaterial color={color} roughness={1} />
//       </mesh>
//     </Float>
//   )
// }
// ;<Hospital
//   BigScreen={function BigScreen({ bigScreen }) {
//     let video = useMemo(() => {
//       return document.createElement('video')
//     }, [])
//     useEffect(() => {
//       video.src = `/assets/2023-04-27/v007/movie-compressed.mp4`

//       video.muted = true
//       video.onplay = () => {
//         let texture = new VideoTexture(video)
//         texture.wrapS = texture.wrapT = RepeatWrapping
//         texture.rotation = Math.PI * -0.5
//         texture.repeat.set(-1, 1)
//         texture.needsUpdate = true
//         bigScreen.material = new MeshBasicMaterial({
//           map: texture,
//           color: '#ffffff',
//         })
//         texture.needsUpdate = true
//       }
//       video.autoplay = true
//       video.playsInline = true
//     }, [video, bigScreen])

//     let texture = useTexture(
//       `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M3 22v-20l18 10-18 10z"/></svg>`,
//     )

//     // return (
//     //   <>
//     //     {/*  */}
//     //     {createPortal(
//     //       <Box
//     //         position={[0, 5.3, 0.3]}
//     //         onClick={(ev) => {
//     //           video.play()
//     //           ev.object.visible = false
//     //         }}
//     //         scale={[0.3 * 1 * 0.5, 1 * 0.5, 0.01]}
//     //       >
//     //         <meshBasicMaterial
//     //           color={'#ff0000'}
//     //           transparent={true}
//     //           map={texture}
//     //         ></meshBasicMaterial>
//     //       </Box>,
//     //       bigScreen,
//     //     )}
//     //   </>
//     // )
//   }}
//   scale={1}
// />
