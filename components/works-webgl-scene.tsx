'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Soft floating particles with rainbow colors - matches site palette
function FloatingParticles({ 
  mousePosition, 
  scrollY,
  hoveredIndex,
  hoveredPosition,
}: { 
  mousePosition: { x: number; y: number }
  scrollY: number
  hoveredIndex: number | null
  hoveredPosition: { x: number; y: number } | null
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const particleCount = 60

  const [positions, colors, originalPositions, baseColors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    const origPos = new Float32Array(particleCount * 3)
    const baseCols = new Float32Array(particleCount * 3)

    // Site's soft rainbow palette
    const palette = [
      new THREE.Color('oklch(0.75 0.15 330)'), // Soft Pink
      new THREE.Color('oklch(0.75 0.12 25)'),  // Soft Coral
      new THREE.Color('oklch(0.8 0.1 80)'),    // Soft Yellow
      new THREE.Color('oklch(0.75 0.1 150)'),  // Soft Teal
      new THREE.Color('oklch(0.7 0.12 220)'),  // Soft Blue
      new THREE.Color('oklch(0.7 0.15 280)'),  // Soft Purple
    ]

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 8 - 3

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      origPos[i * 3] = x
      origPos[i * 3 + 1] = y
      origPos[i * 3 + 2] = z

      const color = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
      baseCols[i * 3] = color.r
      baseCols[i * 3 + 1] = color.g
      baseCols[i * 3 + 2] = color.b
    }

    return [pos, col, origPos, baseCols]
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const colorAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const origX = originalPositions[i3]
      const origY = originalPositions[i3 + 1]
      const origZ = originalPositions[i3 + 2]

      // Base gentle floating animation
      let targetX = origX + Math.sin(time * 0.2 + i * 0.5) * 0.4
      let targetY = origY + Math.cos(time * 0.15 + i * 0.3) * 0.3
      let targetZ = origZ + Math.sin(time * 0.1 + i * 0.2) * 0.2

      // Mouse influence - subtle
      targetX += mousePosition.x * 0.2
      targetY += mousePosition.y * 0.2

      // Scroll parallax
      targetY -= scrollY * 0.0003

      // Hover effect - particles strongly gather and cycle rainbow colors
      if (hoveredIndex !== null && hoveredPosition) {
        const hoverX = hoveredPosition.x * viewport.width * 0.5
        const hoverY = hoveredPosition.y * viewport.height * 0.5
        
        const dx = hoverX - positionAttr.array[i3]
        const dy = hoverY - positionAttr.array[i3 + 1]
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 10) {
          const attraction = Math.max(0, 1 - dist / 10) * 0.15
          targetX += dx * attraction
          targetY += dy * attraction
          
          // Cycle through rainbow colors based on time and particle index
          const hue = (time * 0.5 + i * 0.15) % 1
          const saturation = 0.8
          const lightness = 0.65 + attraction * 0.2
          
          // HSL to RGB conversion
          const c = (1 - Math.abs(2 * lightness - 1)) * saturation
          const x = c * (1 - Math.abs((hue * 6) % 2 - 1))
          const m = lightness - c / 2
          
          let r = 0, g = 0, b = 0
          if (hue < 1/6) { r = c; g = x; b = 0 }
          else if (hue < 2/6) { r = x; g = c; b = 0 }
          else if (hue < 3/6) { r = 0; g = c; b = x }
          else if (hue < 4/6) { r = 0; g = x; b = c }
          else if (hue < 5/6) { r = x; g = 0; b = c }
          else { r = c; g = 0; b = x }
          
          colorAttr.array[i3] = r + m
          colorAttr.array[i3 + 1] = g + m
          colorAttr.array[i3 + 2] = b + m
        } else {
          colorAttr.array[i3] = baseColors[i3]
          colorAttr.array[i3 + 1] = baseColors[i3 + 1]
          colorAttr.array[i3 + 2] = baseColors[i3 + 2]
        }
      } else {
        colorAttr.array[i3] = baseColors[i3]
        colorAttr.array[i3 + 1] = baseColors[i3 + 1]
        colorAttr.array[i3 + 2] = baseColors[i3 + 2]
      }

      // Smooth lerp to target
      positionAttr.array[i3] = THREE.MathUtils.lerp(positionAttr.array[i3], targetX, 0.015)
      positionAttr.array[i3 + 1] = THREE.MathUtils.lerp(positionAttr.array[i3 + 1], targetY, 0.015)
      positionAttr.array[i3 + 2] = THREE.MathUtils.lerp(positionAttr.array[i3 + 2], targetZ, 0.015)
    }

    positionAttr.needsUpdate = true
    colorAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.15}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Soft gradient orb - subtle background element
function GradientOrb({ 
  hoveredIndex, 
  mousePosition 
}: { 
  hoveredIndex: number | null
  mousePosition: { x: number; y: number }
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHovered: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHovered;
        varying vec2 vUv;
        
        // HSL to RGB
        vec3 hsl2rgb(float h, float s, float l) {
          float c = (1.0 - abs(2.0 * l - 1.0)) * s;
          float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
          float m = l - c / 2.0;
          vec3 rgb;
          if (h < 1.0/6.0) rgb = vec3(c, x, 0.0);
          else if (h < 2.0/6.0) rgb = vec3(x, c, 0.0);
          else if (h < 3.0/6.0) rgb = vec3(0.0, c, x);
          else if (h < 4.0/6.0) rgb = vec3(0.0, x, c);
          else if (h < 5.0/6.0) rgb = vec3(x, 0.0, c);
          else rgb = vec3(c, 0.0, x);
          return rgb + m;
        }
        
        void main() {
          vec2 center = vec2(0.5);
          float dist = distance(vUv, center);
          
          // Soft radial gradient
          float gradient = smoothstep(0.5, 0.0, dist);
          
          // Rainbow gradient that cycles on hover
          float hue = mod(uTime * 0.15 + vUv.x * 0.5 + vUv.y * 0.3, 1.0);
          float saturation = 0.4 + uHovered * 0.4;
          float lightness = 0.85 - uHovered * 0.1;
          
          vec3 rainbowColor = hsl2rgb(hue, saturation, lightness);
          
          // Soft pastel base colors
          vec3 pink = vec3(0.95, 0.85, 0.9);
          vec3 lavender = vec3(0.9, 0.88, 0.98);
          float baseMix = sin(uTime * 0.3 + vUv.x * 2.0) * 0.5 + 0.5;
          vec3 baseColor = mix(pink, lavender, baseMix);
          
          // Blend between base and rainbow based on hover
          vec3 color = mix(baseColor, rainbowColor, uHovered * 0.7);
          
          float alpha = gradient * (0.12 + uHovered * 0.2);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }, [])

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return
    const time = state.clock.getElapsedTime()

    materialRef.current.uniforms.uTime.value = time

    // Smooth hover transition
    const targetHovered = hoveredIndex !== null ? 1 : 0
    materialRef.current.uniforms.uHovered.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHovered.value,
      targetHovered,
      0.03
    )

    // Gentle floating
    meshRef.current.position.x = Math.sin(time * 0.1) * 1 + mousePosition.x * 0.3
    meshRef.current.position.y = Math.cos(time * 0.08) * 0.8 + mousePosition.y * 0.3

    // Scale on hover
    const targetScale = hoveredIndex !== null ? 1.15 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.02)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[18, 18, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} />
    </mesh>
  )
}

// Scene content
function SceneContent({ 
  hoveredIndex, 
  scrollY,
  hoveredPosition,
}: { 
  hoveredIndex: number | null
  scrollY: number
  hoveredPosition: { x: number; y: number } | null
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useFrame((state) => {
    setMousePosition({
      x: state.mouse.x,
      y: state.mouse.y,
    })
  })

  return (
    <>
      <FloatingParticles 
        mousePosition={mousePosition} 
        scrollY={scrollY} 
        hoveredIndex={hoveredIndex}
        hoveredPosition={hoveredPosition}
      />
      <GradientOrb hoveredIndex={hoveredIndex} mousePosition={mousePosition} />
    </>
  )
}

// Main WebGL scene component
export function WorksWebGLScene({ 
  hoveredIndex,
  hoveredPosition,
}: { 
  hoveredIndex: number | null
  hoveredPosition: { x: number; y: number } | null
}) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent 
          hoveredIndex={hoveredIndex} 
          scrollY={scrollY} 
          hoveredPosition={hoveredPosition}
        />
      </Canvas>
    </div>
  )
}
