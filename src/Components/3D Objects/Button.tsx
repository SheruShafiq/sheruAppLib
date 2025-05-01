import { useRef, useState } from 'react'
import {  useFrame, Vector3 } from '@react-three/fiber'
import { Stack } from '@mui/material'
import { CylinderGeometry } from 'three'

export default function Button({ position }: { position: Vector3 }) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef(null)
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
      <mesh
        ref={ref}
        position={position}
        scale={clicked ? [1.5, 15, 1.5] : [1, 1, 1]}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
      
  )
}

