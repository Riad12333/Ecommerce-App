import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiChevronDown, FiCpu, FiHeadphones, FiMonitor, FiMousePointer, FiPlay, FiSmartphone } from 'react-icons/fi'

const products = [
  { label: 'Smartphones', icon: FiSmartphone, color: 'cyan' },
  { label: 'Audio', icon: FiHeadphones, color: 'violet' },
  { label: 'Gaming', icon: FiMousePointer, color: 'pink' },
  { label: 'Computing', icon: FiCpu, color: 'blue' },
  { label: 'TV & maison', icon: FiMonitor, color: 'teal' },
]

const ImmersiveHero = () => {
  const sceneRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return undefined
    const handleMove = (event) => {
      const bounds = scene.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      scene.style.setProperty('--tilt-x', `${y * -8}deg`)
      scene.style.setProperty('--tilt-y', `${x * 10}deg`)
      scene.style.setProperty('--pointer-x', `${x * 18}px`)
      scene.style.setProperty('--pointer-y', `${y * 12}px`)
    }
    const reset = () => {
      scene.style.setProperty('--tilt-x', '0deg')
      scene.style.setProperty('--tilt-y', '0deg')
      scene.style.setProperty('--pointer-x', '0px')
      scene.style.setProperty('--pointer-y', '0px')
    }
    scene.addEventListener('pointermove', handleMove)
    scene.addEventListener('pointerleave', reset)
    return () => {
      scene.removeEventListener('pointermove', handleMove)
      scene.removeEventListener('pointerleave', reset)
    }
  }, [])

  return (
    <section className='immersive-hero' ref={sceneRef} aria-labelledby='hero-title'>
      <div className='hero-grid' aria-hidden='true' />
      <div className='hero-stars' aria-hidden='true'><span /><span /><span /><span /><span /></div>
      <div className='hero-copy'>
        <p className='eyebrow'><span className='eyebrow-pulse' /> MADJID LABS · ALGERIA 2030</p>
        <h1 id='hero-title'>La technologie<br /><strong>prend vie.</strong></h1>
        <p className='hero-description'>Explorez une nouvelle dimension du shopping. Des objets iconiques, une expérience immersive et la puissance de l&apos;innovation entre vos mains.</p>
        <div className='hero-actions'>
          <Link to='/product-category?category=mobiles' className='hero-primary'>Explorer la collection <FiArrowUpRight /></Link>
          <button type='button' className='hero-secondary'><span className='play-icon'><FiPlay /></span> Voir le film</button>
        </div>
        <div className='hero-stats'><div><strong>24h</strong><span>livraison express</span></div><div><strong>4.9/5</strong><span>avis clients</span></div><div><strong>100%</strong><span>produits garantis</span></div></div>
      </div>
      <div className='hero-object' aria-label='Présentation interactive du produit phare'>
        <div className='orbit orbit-one' /><div className='orbit orbit-two' />
        <div className='product-halo' />
        <div className='floating-device'>
          <div className='device-camera'><i /><i /><i /></div>
          <div className='device-logo'>M</div>
          <div className='device-reflection' />
        </div>
        <div className='object-label label-top'><span>01</span> PRECISION IN EVERY DETAIL</div>
        <div className='object-label label-bottom'>NOUVELLE<br /><b>DIMENSION</b><small>360° interactive view</small></div>
      </div>
      <div className='hero-dock'>
        <div className='dock-heading'><span>CATÉGORIES</span><FiChevronDown /></div>
        <div className='dock-items'>
          {products.map(({ label, icon: Icon, color }, index) => (
            <button type='button' key={label} className={`dock-item ${active === index ? 'is-active' : ''} dock-${color}`} onClick={() => setActive(index)} aria-pressed={active === index}>
              <Icon /><span>{label}</span><small>0{index + 1}</small>
            </button>
          ))}
        </div>
      </div>
      <div className='scroll-cue'><span>SCROLL TO DISCOVER</span><div /></div>
    </section>
  )
}

export default ImmersiveHero
