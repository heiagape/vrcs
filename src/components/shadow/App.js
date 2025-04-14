import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, createPortal, render, useFrame, useThree, useLoader } from '@react-three/fiber'
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
  Text,
} from '@react-three/drei'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { easing } from 'maath'
import { Hospital } from './Hospital.jsx'
//import { Lab } from './Biolab4.jsx'
import { Lab4 } from './Biobank.jsx'
import { Lab5 } from './Biolab5.jsx'
import { Tmobile } from './r6.jsx'
// import { CameraHelper } from 'th
import { VRButton, XR, useController, useXR, Interactive } from '@react-three/xr'
import { GUI, Walker, ModelSwitchButtons } from './Walker.jsx'
import { DoubleSide, MeshBasicMaterial, RepeatWrapping, VideoTexture } from 'three'
import { LightingFile } from './LightingFile/LightingFile.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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

function MiniModelScene({ models, onSelectModel }) {
  const spacing = 2
  // Load all icon models
  const tmobileIcon = useLoader(GLTFLoader, '/assets/2023-04-27/v007/TM_Icon.glb')
  const hospitalIcon = useLoader(GLTFLoader, '/assets/2023-04-27/v007/CUHK_Icon.glb')
  const lab02Icon = useLoader(GLTFLoader, '/assets/2023-04-27/v007/Lab02_Icon.glb')
  const lab1bIcon = useLoader(GLTFLoader, '/assets/2023-04-27/v007/Lab_1A_Icon.glb')
  const hkstpIcon = useLoader(GLTFLoader, '/assets/2023-04-27/v007/HKSTP_Icon.glb')

  // Add VR controller interaction state
  const [hoveredIcon, setHoveredIcon] = useState(null)
  const { isPresenting } = useXR()

  const renderModelIcon = (model, index) => {
    const basePosition = [index * spacing - (models.length * spacing) / 2 + 1, 0, -4]
    const textColor = hoveredIcon === model ? 'blue' : 'black'

    let modelObject = null
    if (model === 'STP Labs') {
      modelObject = hkstpIcon
    } else if (model === 'Tmobile') {
      modelObject = tmobileIcon
    } else if (model === 'Hospital') {
      modelObject = hospitalIcon
    } else if (model === 'Lab1') {
      modelObject = lab02Icon
    } else if (model === 'Lab2') {
      modelObject = lab1bIcon
    }

    return (
      <group key={model} position={basePosition} onClick={() => !isPresenting && onSelectModel(model)}>
        {modelObject ? (
          <Interactive
            onSelectStart={() => isPresenting && onSelectModel(model)}
            onHover={() => setHoveredIcon(model)}
            onBlur={() => setHoveredIcon(null)}
          >
            <primitive
              object={modelObject.scene.clone()}
              scale={0.3}
              position={[0, -0.3, 0]}
              rotation={[0, Math.PI, 0]}
            />
          </Interactive>
        ) : (
          <Box args={[0.3, 0.3, 0.3]}>
            <meshStandardMaterial color='#666666' />
          </Box>
        )}
        <Text position={[0, 0.7, 0]} fontSize={0.15} color={textColor} anchorX='center' anchorY='middle'>
          {model}
        </Text>
      </group>
    )
  }

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {models.map((model, index) => renderModelIcon(model, index))}
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
  const models = ['STP Labs', 'Hospital', 'Tmobile']
  const [activeModel, setActiveModel] = useState(null)
  const [isSelecting, setIsSelecting] = useState(true)
  const [subMenu, setSubMenu] = useState(null)

  const handleModelSelect = (model) => {
    if (model === 'STP Labs') {
      setSubMenu('STP Labs')
      setActiveModel(null)
    } else {
      setActiveModel(model)
      setIsSelecting(false)
    }
  }

  // Add keyboard control for returning to model selection
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'c') {
        setIsSelecting(true)
        setActiveModel(null)
        setSubMenu(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Add effect to handle activeModel changes
  useEffect(() => {
    if (activeModel === null && !subMenu) {
      setIsSelecting(true)
    }
  }, [activeModel, subMenu])

  const renderModel = () => {
    if (!activeModel) return null
    switch (activeModel) {
      case 'Lab1':
        return <Lab4 />
      case 'Lab2':
        return <Lab5 />
      case 'Hospital':
        return <Hospital />
      case 'Tmobile':
        return <Tmobile />
      default:
        return null
    }
  }

  const getDisplayModels = () => {
    if (subMenu === 'STP Labs') {
      return ['Lab1', 'Lab2']
    }
    return models
  }

  return (
    <>
      <Canvas
        gl={{ logarithmicDepthBuffer: true }}
        onCreated={(st) => {
          st.gl.useLegacyLights = true
        }}
        shadows
        camera={{ position: [0, 1.6, 3], fov: 80 }}
      >
        <XR foveation={1}>
          <Walker startAt={[0, 0.7, 0.1]} setActiveModel={setActiveModel} resetRotation={isSelecting}>
            {isSelecting ? (
              <MiniModelScene models={getDisplayModels()} onSelectModel={handleModelSelect} />
            ) : (
              <group rotation={[0, 1.73, 0]}>
                <group position={[30, 0, -2]}>
                  <group rotation={[0, Math.PI * 1.0, 0]}>
                    <group position={[0, 0, 3]}>{renderModel()}</group>
                  </group>
                </group>
              </group>
            )}
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

        <Sky inclination={0.52} scale={320} />
        <LightingFile background={true} url={`/venice_sunset_1k.hdr`}></LightingFile>
      </Canvas>
      <GUI />
      <VRButton />
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
