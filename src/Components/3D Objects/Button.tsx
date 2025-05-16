import { useRef, useState } from 'react'
import {  useFrame, Vector3 } from '@react-three/fiber'
import { Stack } from '@mui/material'
import { CylinderGeometry } from 'three'

export default function Button({ position }: { position: Vector3 }) {
  
  const ref = useRef(null)
  
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  
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

