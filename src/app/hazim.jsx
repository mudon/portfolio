import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useGraph, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export default function Model(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/portfolio/public/hazim/hazim.gltf')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone)
  const { actions } = useAnimations(animations, group)

  const dialogues = ['Hi! I\’m Muhammad Hazim 👋', 'Let\'s create web applications together.', 'Reach me: muhammadhazim57@gmail.com | +6014-5197269']
  const [displayedText, setDisplayedText] = useState('')
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [typing, setTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  const TYPING_SPEED = 50
  const DELETING_SPEED = 45
  const PAUSE_BEFORE_DELETE = 1000
  const CURSOR_BLINK_INTERVAL = 500

  // 🎬 Play the waving animation automatically
  useEffect(() => {
    const action = actions['waving']
    if (action) {
      action.reset().fadeIn(0.5).play()
    } else {
      console.warn('⚠️ Animation "waving" not found in GLTF file')
    }
    return () => action?.fadeOut(0.5)
  }, [actions])

  // 🖋 Typing + deleting effect
  useEffect(() => {
    const currentText = dialogues[currentDialogueIndex]
    let timeout

    if (typing) {
      if (displayedText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1))
        }, TYPING_SPEED)
      } else {
        timeout = setTimeout(() => setTyping(false), PAUSE_BEFORE_DELETE)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length - 1))
        }, DELETING_SPEED)
      } else {
        setCurrentDialogueIndex((prev) => (prev + 1) % dialogues.length)
        setTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, typing, currentDialogueIndex])

  // 🔹 Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, CURSOR_BLINK_INTERVAL)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <group ref={group} {...props} dispose={null}>
      <style jsx>
        {`
          @keyframes pulse-glow {
            0% {
              box-shadow: 
                0 0 20px rgba(76, 201, 240, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -2px 0 rgba(0, 0, 0, 0.4);
            }
            100% {
              box-shadow: 
                0 0 30px rgba(76, 201, 240, 0.6),
                0 0 40px rgba(76, 201, 240, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 -2px 0 rgba(0, 0, 0, 0.4);
            }
          }

          @keyframes border-pulse {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.02);
            }
          }
        `}
      </style>
      <group>
        <group name="hazim-base">
          <primitive object={nodes.Hips} />
          <skinnedMesh
            name="model"
            geometry={nodes.model.geometry}
            material={nodes.model.material}
            skeleton={nodes.model.skeleton}
          />
        </group>

        {/* 🗨️ Dialogue Box with auto-wrapping */}
        <Html
          position={[0, 2.5, 0]}
          center
          style={{
            fontFamily: 'var(--font-pixelify), monospace',
            position: 'relative',
            background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
            color: '#e6e6e6',
            padding: '16px 20px',
            borderRadius: '16px',
            fontSize: '17px', // Slightly smaller for better wrapping
            lineHeight: '1.5',
            whiteSpace: 'normal', // Changed from 'nowrap' to 'normal'
            wordWrap: 'break-word', // Allow breaking long words
            overflowWrap: 'break-word', // Modern alternative
            border: '3px solid rgba(139, 92, 246, 0.6)',
            boxShadow: `
              0 0 20px rgba(76, 201, 240, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -2px 0 rgba(0, 0, 0, 0.4)
            `,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            maxWidth: '300px', // Maximum width
            minWidth: '200px', // Minimum width
            width: 'auto', // Auto width based on content
            textAlign: 'center',
            animation: 'pulse-glow 2s ease-in-out infinite alternate'
          }}
        >
          {/* Dialogue Text Container */}
          <div style={{ 
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'min-content'
          }}>
            {/* Split text into lines for better control */}
            <div style={{
              display: 'inline-block',
              textAlign: 'center',
              wordBreak: 'break-word', // Break long words if needed
              overflow: 'visible'
            }}>
              {displayedText}
              <span style={{ 
                opacity: showCursor ? 1 : 0,
                color: 'rgba(139, 92, 246, 0.6)',
                fontWeight: 'bold',
                marginLeft: '2px'
              }}>█</span>
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            width: '12px',
            height: '12px',
            borderLeft: '2px solid rgba(139, 92, 246, 0.6)',
            borderTop: '2px solid rgba(139, 92, 246, 0.6)',
            borderRadius: '2px 0 0 0'
          }} />
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '12px',
            height: '12px',
            borderRight: '2px solid rgba(139, 92, 246, 0.6)',
            borderTop: '2px solid rgba(139, 92, 246, 0.6)',
            borderRadius: '0 2px 0 0'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            width: '12px',
            height: '12px',
            borderLeft: '2px solid rgba(139, 92, 246, 0.6)',
            borderBottom: '2px solid rgba(139, 92, 246, 0.6)',
            borderRadius: '0 0 0 2px'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            width: '12px',
            height: '12px',
            borderRight: '2px solid rgba(139, 92, 246, 0.6)',
            borderBottom: '2px solid rgba(139, 92, 246, 0.6)',
            borderRadius: '0 0 2px 0'
          }} />

          {/* Animated Border Glow */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: '18px',
            border: '1px solid rgba(76, 201, 240, 0.3)',
            animation: 'border-pulse 3s ease-in-out infinite',
            pointerEvents: 'none'
          }} />

          {/* Speech Triangle Pointer */}
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '12px solid #1a1a2e',
            filter: 'drop-shadow(0 2px 4px rgba(76, 201, 240, 0.3))'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-18px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '12px solid rgba(139, 92, 246, 0.6)',
            zIndex: -1
          }} />
        </Html>
      </group>
    </group>
  )
}

useGLTF.preload('/portfolio/public/hazim/hazim.gltf')