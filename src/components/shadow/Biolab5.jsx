import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Lab5(props) {
  const { nodes, materials } = useGLTF('/assets/2023-04-27/v007/lab5.glb')
  return (
    <group position={[26, 0, -3.5]} {...props} dispose={null}>
      <group position={[7.193, 1.114, -7.333]} scale={0.212}>
        <mesh castShadow receiveShadow geometry={nodes.Cube198.geometry} material={materials.Screens} />
        <mesh castShadow receiveShadow geometry={nodes.Cube198_1.geometry} material={materials.BioLabTrim001} />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder044.geometry}
        material={materials.Brush_Metal}
        position={[7.049, 1.324, -7.495]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor.geometry}
        material={materials.BioLabFloor001}
        position={[5.44, 0, -2.935]}
        rotation={[0, -1.571, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.wall.geometry}
        material={materials.bioLabWall}
        position={[7.339, 1.35, 1.017]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube003.geometry}
        material={materials.generic}
        position={[1.958, 1.399, -2.542]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor001.geometry}
        material={materials.Decals}
        position={[3.344, 0.005, -3.27]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={0.613}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cupboard001.geometry}
        material={materials.generic}
        position={[0.552, 0.899, -2.257]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[1, 1, 1.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.floor001.geometry}
        material={materials['BioLabTrim001.003']}
        position={[2.641, 0.394, 0.515]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TableSetCounter031.geometry}
        material={materials.ScreenAndMetal}
        position={[3.077, 0.871, -7.696]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[1, 1, 1.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane017.geometry}
        material={materials['Brush_Metal.004']}
        position={[11.335, 1.35, -5.151]}
        rotation={[Math.PI, 1.571, 0]}
        scale={-1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.redSink.geometry}
        material={materials['Decals.002']}
        position={[0.098, 1.683, -1.549]}
        rotation={[-Math.PI, 1.396, -Math.PI]}
        scale={0.088}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.computer009.geometry}
        material={materials.glass}
        position={[5.971, 1.064, 0.497]}
        rotation={[-Math.PI, 0, -Math.PI / 2]}
        scale={0.192}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ventPart.geometry}
        material={materials.Screens}
        position={[3.579, 0.624, -3.668]}
        scale={[0.279, 0.204, 0.288]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder039.geometry}
        material={materials.labProps001}
        position={[3.714, 0.356, -4.428]}
        rotation={[Math.PI, -0.425, Math.PI]}
        scale={0.129}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pencilCup.geometry}
        material={materials.pencilCup}
        position={[3.127, 1.428, 0.891]}
        scale={[0.034, 0.046, 0.034]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.paper.geometry}
        material={materials.papers}
        position={[5.319, 0.901, 0.552]}
        rotation={[0, -0.336, 0]}
        scale={[0.415, 0.384, 0.536]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.beaker002.geometry}
        material={materials['glass.002']}
        position={[6.338, 1.458, 0.932]}
        scale={[-0.042, -0.031, -0.042]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.tubeSet.geometry}
        material={materials['glass.001']}
        position={[6.402, 0.891, -2.641]}
        rotation={[Math.PI / 2, 0, -1.892]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.roof002.geometry}
        material={materials.BioLabRoofDecal001}
        position={[0.677, 2.692, -2.66]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.roof.geometry}
        material={materials.BioLabRoof001}
        position={[5.526, 2.7, -3.951]}
        rotation={[0, -1.571, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder021.geometry}
        material={materials.BendingMachineLP}
        position={[3.425, 1.846, -3.04]}
        scale={0.102}
      />
      {/* <mesh castShadow receiveShadow geometry={nodes.Cube067.geometry} material={materials.BioLabTrim001} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder074.geometry} material={materials.glass} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cube227.geometry} material={materials['glass.002']} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cube199.geometry} material={materials.BioLabTrim001} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cube199_1.geometry} material={materials['BioLabTrim001.003']} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cube199_2.geometry} material={materials['Brush_Metal.004']} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder027.geometry} material={materials.Screens} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder027_1.geometry} material={materials.ScreenAndMetal} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder027_2.geometry} material={materials.labProps001} /> */}
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder027_3.geometry}
        material={materials['BioLabTrim001.003']}
      /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder034.geometry} material={materials.Screens} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder034_1.geometry} material={materials.ScreenAndMetal} /> */}
      {/* <mesh castShadow receiveShadow geometry={nodes.Cylinder034_2.geometry} material={materials.labProps001} /> */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder034_3.geometry}
        material={materials['BioLabTrim001.003']}
      />
      <mesh castShadow receiveShadow geometry={nodes.Cube226.geometry} material={materials.BioLabTrim001} />
      <mesh castShadow receiveShadow geometry={nodes.Cube226_1.geometry} material={materials['glass.002']} />
    </group>
  )
}
