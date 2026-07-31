import './App.css'
import { useEffect } from 'react'
import pozariScreenshot from './assets/pozari/pozari-og.png'

function PozariStatus() {
  return <span className="pozari-live-status" role="status">СЛЕДЕЊЕ НА ПОЖАРИ ВО ЖИВО</span>
}

function DreamLabMark({ small = false }) {
  return (
    <span className={`brand-mark${small ? ' brand-mark--small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 44 44" focusable="false">
        <path d="M7 6h11c11 0 19 7 19 16s-8 16-19 16H7V6Zm8 7v18h3c6 0 11-3 11-9s-5-9-11-9h-3Z" />
        <path d="M24 22h13v7H24z" />
      </svg>
    </span>
  )
}

function App() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('reveal-ready')
    const revealItems = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])


  useEffect(() => {
    const scene = document.querySelector('.hero-ecosystem')
    const canvas = scene?.querySelector('.ecosystem-particle-canvas')
    if (!scene || !canvas) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touchDevice = window.matchMedia('(pointer: coarse)').matches
    const context = canvas.getContext('2d')
    const random = (() => { let seed = 48271; return () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646 })()
    const crowd = []
    const responders = []
    const connectors = []
    let width = 0
    let height = 0
    let frame = 0
    let previous = performance.now()
    let pointerX = 0
    let pointerY = 0
    let targetX = 0
    let targetY = 0
    let pointerSpeed = 0
    let pointerActive = false

    const counts = () => window.innerWidth <= 640 ? [180, 50, 18] : window.innerWidth <= 1024 ? [900, 120, 30] : [3000, 220, 40]
    const palette = ['#948b79', '#a5967c', '#b2755e', '#72786b']
    const reset = (particle, type, initial = false) => {
      particle.x = random() * width
      particle.y = random() * height
      particle.vx = (random() - .5) * (type === 'crowd' ? .035 : .05)
      particle.vy = (random() - .5) * (type === 'crowd' ? .028 : .04) - .006
      particle.ambientVx = particle.vx
      particle.ambientVy = particle.vy
      particle.size = random() < .8 ? 1 : random() < .85 ? 2 : random() < .98 ? 3 : 4
      particle.opacity = type === 'crowd' ? .16 + random() * .25 : .23 + random() * .31
      particle.depth = type === 'crowd' ? .25 + random() * .38 : type === 'responder' ? .62 + random() * .62 : .5 + random() * .7
      particle.maxLife = 9000 + random() * 15000
      particle.life = initial ? random() * particle.maxLife : 0
      particle.phase = random() * Math.PI * 2
      particle.color = palette[Math.floor(random() * palette.length)]
      particle.preferredDistance = 25 + random() * 105
      particle.attraction = .65 + random() * .85
      particle.tangent = (random() - .5) * .7
      particle.wake = 0
    }
    const fill = (pool, type, count) => {
      while (pool.length < count) { const particle = {}; reset(particle, type, true); pool.push(particle) }
      pool.length = count
    }
    const resize = () => {
      const rect = scene.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      const [crowdCount, responderCount, connectorCount] = counts()
      fill(crowd, 'crowd', crowdCount)
      fill(responders, 'responder', responderCount)
      fill(connectors, 'connector', connectorCount)
      if (!pointerActive) { targetX = width / 2; targetY = height / 2; pointerX = targetX; pointerY = targetY }
    }
    const move = (event) => {
      const rect = scene.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const movement = Math.hypot(x - targetX, y - targetY)
      pointerSpeed = Math.min(2.4, movement / 24)
      targetX = x
      targetY = y
      pointerActive = true
    }
    const leave = () => { pointerActive = false; pointerSpeed = 0; targetX = width / 2; targetY = height / 2 }
    const wrap = (particle) => {
      if (particle.x < -8) particle.x = width + 8
      if (particle.x > width + 8) particle.x = -8
      if (particle.y < -8) particle.y = height + 8
      if (particle.y > height + 8) particle.y = -8
    }
    const drawParticle = (particle, now, elapsed, type) => {
      particle.life += elapsed
      if (particle.life >= particle.maxLife) reset(particle, type)
      const envelope = Math.pow(Math.sin(Math.PI * particle.life / particle.maxLife), .68)
      const ambientX = particle.ambientVx * elapsed + Math.sin(now * .00015 + particle.phase) * .006
      const ambientY = particle.ambientVy * elapsed
      if (type === 'responder' && pointerActive) {
        const dx = targetX - particle.x
        const dy = targetY - particle.y
        const distance = Math.hypot(dx, dy) || 1
        const radius = 310
        if (distance < radius) {
          const falloff = 1 - distance / radius
          const braking = distance < 92 ? distance / 92 : 1
          const force = (.001 + falloff * .0023) * particle.attraction * particle.depth * (.8 + pointerSpeed * .16)
          const repulsion = distance < 28 ? (1 - distance / 28) * .003 : 0
          particle.vx += (dx / distance * force - dx / distance * repulsion - dy / distance * particle.tangent * .0005 * falloff) * elapsed
          particle.vy += (dy / distance * force - dy / distance * repulsion + dx / distance * particle.tangent * .0005 * falloff) * elapsed
          const damping = distance < 92 ? .82 - braking * .1 : .965
          particle.vx *= damping
          particle.vy *= damping
          const maxSpeed = (.22 + particle.depth * .2) * (1 + pointerSpeed * .2)
          const speed = Math.hypot(particle.vx, particle.vy)
          if (speed > maxSpeed) { particle.vx = particle.vx / speed * maxSpeed; particle.vy = particle.vy / speed * maxSpeed }
        }
      }
      if (type === 'connector') {
        let nearest = null
        let nearestDistance = 120
        responders.forEach((responder) => {
          const distance = Math.hypot(responder.x - particle.x, responder.y - particle.y)
          if (distance < nearestDistance) { nearestDistance = distance; nearest = responder }
        })
        if (nearest) {
          particle.wake = Math.min(1, particle.wake + .018)
          particle.vx += (nearest.vx - particle.vx) * .012
          particle.vy += (nearest.vy - particle.vy) * .012
        } else particle.wake *= .985
      }
      if (type !== 'crowd') {
        particle.vx = particle.vx * .95 + particle.ambientVx * .05
        particle.vy = particle.vy * .95 + particle.ambientVy * .05
      }
      particle.x += particle.vx * elapsed + (type === 'crowd' ? ambientX : 0)
      particle.y += particle.vy * elapsed + (type === 'crowd' ? ambientY : 0)
      wrap(particle)
      const parallax = type === 'crowd' ? .35 : type === 'responder' ? .75 : .55
      const x = particle.x + (pointerX - width / 2) * parallax * .035
      const y = particle.y + (pointerY - height / 2) * parallax * .035
      context.globalAlpha = particle.opacity * envelope * (type === 'connector' ? (.35 + particle.wake * .65) : 1)
      context.fillStyle = particle.color
      context.beginPath()
      context.arc(x, y, particle.size, 0, Math.PI * 2)
      context.fill()
    }
    const draw = (now) => {
      const elapsed = Math.min(Math.max(now - previous, 0), 48)
      previous = now
      pointerX += (targetX - pointerX) * .12
      pointerY += (targetY - pointerY) * .12
      pointerSpeed *= .9
      context.clearRect(0, 0, width, height)
      crowd.forEach((particle) => drawParticle(particle, now, elapsed, 'crowd'))
      responders.forEach((particle) => drawParticle(particle, now, elapsed, 'responder'))
      connectors.forEach((particle) => drawParticle(particle, now, elapsed, 'connector'))
      if (!reducedMotion) frame = requestAnimationFrame(draw)
    }
    resize()
    if (!reducedMotion && !touchDevice) {
      scene.addEventListener('pointermove', move)
      scene.addEventListener('pointerleave', leave)
    }
    window.addEventListener('resize', resize)
    if (!reducedMotion) frame = requestAnimationFrame(draw)
    else draw(performance.now())
    return () => { cancelAnimationFrame(frame); scene.removeEventListener('pointermove', move); scene.removeEventListener('pointerleave', leave); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => {
    const scene = document.querySelector('.hero-ecosystem')
    if (!scene) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return undefined
    const layers = scene.querySelectorAll('[data-depth]')
    const cards = [...scene.querySelectorAll('.ecosystem-panel')]
    let frame = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let pointerX = 0
    let pointerY = 0
    let active = false

    const tick = () => {
      currentX += (targetX - currentX) * 0.085
      currentY += (targetY - currentY) * 0.085
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 1)
        const x = `${(currentX * depth).toFixed(2)}px`
        const y = `${(currentY * depth).toFixed(2)}px`
        layer.style.setProperty('--parallax-x', x)
        layer.style.setProperty('--parallax-y', y)
        if (!layer.classList.contains('ecosystem-panel')) layer.style.translate = `${x} ${y}`
      })
      cards.forEach((card) => {
        if (!active) {
          card.style.setProperty('--repel-x', '0px')
          card.style.setProperty('--repel-y', '0px')
          return
        }
        const rect = card.getBoundingClientRect()
        const dx = pointerX - (rect.left + rect.width / 2)
        const dy = pointerY - (rect.top + rect.height / 2)
        const distance = Math.hypot(dx, dy)
        const radius = Math.max(rect.width, rect.height) * 0.72
        const strength = Math.max(0, 1 - distance / radius)
        card.style.setProperty('--repel-x', `${(-dx / Math.max(distance, 1) * strength * 5).toFixed(2)}px`)
        card.style.setProperty('--repel-y', `${(-dy / Math.max(distance, 1) * strength * 5).toFixed(2)}px`)
      })
      frame = requestAnimationFrame(tick)
    }

    const move = (event) => {
      const rect = scene.getBoundingClientRect()
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      pointerX = event.clientX
      pointerY = event.clientY
      active = true
    }
    const leave = () => { targetX = 0; targetY = 0; active = false }
    scene.addEventListener('pointermove', move)
    scene.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      scene.removeEventListener('pointermove', move)
      scene.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="DreamLab home">
          <DreamLabMark />
          <span className="brand-name">DreamLab</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#studio">Products</a>
          <a href="#ventures">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="availability">
          <span className="availability-dot" />
          Available for collaboration
        </div>
      </header>

      <main id="top">
        <section className="hero-section" id="studio">
          <div className="hero-copy">
            <h1 data-reveal="hero-headline">
              Building digital products
              <br />
              that solve
              <br />
              real-world problems<span className="heading-dot">.</span>
            </h1>
            <p className="hero-description" data-reveal="hero-description">
              We design and build focused software that helps people, businesses and cities through thoughtful digital products.
            </p>
            <div className="hero-actions" data-reveal="hero-actions">
              <a className="hero-action hero-action--primary" href="#ventures">Explore Products <span>↗</span></a>
              <a className="hero-action hero-action--secondary" href="#process">Our Process <span>→</span></a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-ecosystem" data-reveal="hero-art" aria-label="Connected digital product ecosystem illustration">
              <span className="ecosystem-ambient ecosystem-ambient--one" data-depth="0.55" />
              <span className="ecosystem-ambient ecosystem-ambient--two" data-depth="0.8" />
              <span className="ecosystem-ambient ecosystem-ambient--three" data-depth="0.35" />
              <canvas className="ecosystem-particle-canvas" aria-hidden="true" />
              <span className="ecosystem-grid" data-depth="0.28" />
              <span className="ecosystem-line ecosystem-line--one" data-depth="0.38" />
              <span className="ecosystem-line ecosystem-line--two" data-depth="0.38" />
              <span className="ecosystem-line ecosystem-line--three" data-depth="0.38" />
              <span className="ecosystem-node ecosystem-node--one" data-depth="0.42" />
              <span className="ecosystem-node ecosystem-node--two" data-depth="0.42" />
              <span className="ecosystem-node ecosystem-node--three" data-depth="0.42" />
              <span className="ecosystem-data-pulse ecosystem-data-pulse--one" />
              <span className="ecosystem-data-pulse ecosystem-data-pulse--two" />
              <div className="ecosystem-panel ecosystem-panel--map" data-depth="0.72">
                <span className="panel-kicker">POZARI.MK <em>LIVE</em></span>
                <b>Active fire monitoring</b>
                <span className="panel-map panel-map--pozari"><img src={pozariScreenshot} alt="Pozari.mk live wildfire map preview" /><span className="map-sweep" /></span>
                <PozariStatus />
                <span className="panel-activity"><i /><i /><i /><i /><i /><i /><i /><i /></span>
              </div>
              <div className="ecosystem-panel ecosystem-panel--city" data-depth="0.9">
                <span className="panel-kicker">PROBLEM.MK <em>ACTIVE</em></span>
                <b>Reports in the city</b>
                <span className="panel-report"><strong>12</strong><span>unresolved</span><i /></span>
                <span className="panel-progress"><i /></span>
                <span className="panel-status"><i /> Skopje · Centar <strong>just now</strong></span>
              </div>
              <div className="ecosystem-panel ecosystem-panel--service" data-depth="1.08">
                <span className="panel-kicker">KONOBAR.MK <em>ONLINE</em></span>
                <b>Service flow</b>
                <span className="panel-order"><i /><span>Table 07</span><strong>Preparing</strong></span>
                <span className="panel-progress"><i /></span>
                <span className="panel-status"><i /> 18 tables active <strong className="panel-notification">+1</strong></span>
              </div>
              <span className="ecosystem-core" data-depth="0.5"><i /><b>DL</b></span>
            </div>
          </div>
        </section>

        <section className="process-section" id="process" aria-label="Our process" data-reveal="process">
          <span data-reveal="process-label">Research.</span>
          <span className="process-arrow">→</span>
          <span data-reveal="process-label">Prototype.</span>
          <span className="process-arrow">→</span>
          <span data-reveal="process-label">Launch.</span>
          <span className="process-arrow">→</span>
          <span data-reveal="process-label">Learn.</span>
        </section>

        <section className="ventures-section" id="ventures">
          <div className="venture-grid">
            <article className="venture-card venture-card--fires" data-reveal="product-card">
              <div className="card-art card-art--fires" aria-hidden="true">
                <span className="art-orbit art-orbit--one" />
                <span className="art-orbit art-orbit--two" />
                <span className="fire-map fire-map--one" />
                <span className="fire-map fire-map--two" />
                <span className="fire-signal" />
                <span className="fire-route" />
                <span className="fire-panel"><b>LIVE MONITORING</b><strong>North zone / 04</strong><i /><i /><i /></span>
              </div>
              <div>
                <span className="card-label">LIVE</span>
                <h3>pozari.mk</h3>
                <div className="card-line" />
                <p>Wildfire intelligence platform</p>
              </div>

              <a href="#" aria-label="View pozari.mk">
                →
              </a>
            </article>

            <article className="venture-card venture-card--problems" data-reveal="product-card">
              <div className="card-art card-art--problems" aria-hidden="true">
                <span className="problem-grid" />
                <span className="problem-route" />
                <span className="problem-pin" />
                <span className="problem-panel"><b>OPEN REPORTS</b><strong>12 unresolved</strong><i /><i /><i /></span>
                <span className="problem-bars"><i /><i /><i /><i /></span>
              </div>
              <div>
                <span className="card-label">ACTIVE</span>
                <h3>problem.mk</h3>
                <div className="card-line" />
                <p>
                  City issue reporting platform
                </p>
              </div>

              <a href="#" aria-label="View problem.mk">
                →
              </a>
            </article>

            <article className="venture-card venture-card--service" data-reveal="product-card">
              <div className="card-art card-art--service" aria-hidden="true">
                <span className="service-tablet"><i /><b /><b /><b /><b /></span>
                <span className="service-order"><b>NEW ORDER</b><strong>Table 07 · Preparing</strong><i /><i /><i /></span>
                <span className="service-ring" />
              </div>
              <div>
                <span className="card-label">AVAILABLE</span>
                <h3>konobar.mk</h3>
                <div className="card-line" />
                <p>
                  Restaurant operations platform
                </p>
              </div>

              <a href="#" aria-label="View konobar.mk">
                →
              </a>
            </article>
          </div>
        </section>

      </main>

      <footer className="site-footer" id="contact" data-reveal="footer">
        <div className="footer-brand">
          <DreamLabMark small />
          <strong>DreamLab</strong>
        </div>

        <div className="footer-divider" />

        <p>© DreamLab 2026</p>
        <p>Macedonia, Europe</p>

        <div className="footer-links">
          <a href="#" aria-label="DreamLab website">
            ◎
          </a>
          <a href="#" aria-label="DreamLab LinkedIn">
            in
          </a>
          <a href="mailto:hello@dreamlab.mk" aria-label="Email DreamLab">
            ✉
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
