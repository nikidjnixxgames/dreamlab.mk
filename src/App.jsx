import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SiteHeader, { DreamLabMark } from './SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import ProductCard from './components/ProductCard.jsx'

function PozariStatus() {
  const { t } = useTranslation()
  return <span className="pozari-live-status" role="status">{t('heroPreview.pozariLive')}</span>
}

const latestPozariDetections = [
  { location: 'Skopje', time: '03:07 · 24/08/26', count: '19 detections' },
  { location: 'Veles', time: '03:07 · 24/08/26', count: '9 detections' },
  { location: 'Bitola', time: '03:07 · 24/08/26', count: '13 detections' },
]

const scrollToSection = (id) => {
  const target = document.getElementById(id)
  const header = document.querySelector('.site-header')

  if (!target) return

  const headerHeight = header?.getBoundingClientRect().height ?? 0
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: 'smooth',
  })
}

function handleSectionClick(id, event) {
  event.preventDefault()
  scrollToSection(id)
}

function CountUpMetric({ value, suffix = '', label }) {
  const [isVisible, setIsVisible] = useState(false)
  const metricRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      setIsVisible(true)
    }, { threshold: 0.35 })

    if (metricRef.current) observer.observe(metricRef.current)
    return () => observer.disconnect()
  }, [value])

  return <div className={`metric-card${isVisible ? ' is-visible' : ''}`} ref={metricRef}><strong>{value}{suffix}</strong><span>{label}</span></div>
}

function FutureCardLink({ to, children, className = '' }) {
  return <Link to={to || '/'} className={`future-card-link${className ? ` ${className}` : ''}`}>{children}</Link>
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <button className={`back-to-top${visible ? ' is-visible' : ''}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
}

function App() {
  const { t, i18n } = useTranslation()
  const pozariImage = i18n.language === 'mk' ? '/og-image.png' : '/pozarimk_mk.png'
  const location = useLocation()

  useEffect(() => {
    const targetId = location.state?.scrollTo || location.state?.section
    if (!targetId) return
    const frame = window.requestAnimationFrame(() => targetId === 'top' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : scrollToSection(targetId))
    window.history.replaceState({}, '', '/')
    return () => window.cancelAnimationFrame(frame)
  }, [location.state])

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
    if (window.matchMedia('(max-width: 767px)').matches) return undefined
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
      <SiteHeader />

      <main id="top">
        <section className="hero-section" id="studio">
          <div className="hero-copy">
            <h1 data-reveal="hero-headline">
              {t('hero.titleLine1')}
              <br />
              {t('hero.titleLine2')}
              <br />
              {t('hero.titleLine3')}<span className="heading-dot">.</span>
            </h1>
            <p className="hero-description" data-reveal="hero-description">
              {t('hero.description')}
            </p>
            <div className="hero-actions" data-reveal="hero-actions">
              <a className="hero-action hero-action--primary" href="#products" onClick={(event) => handleSectionClick('products', event)}>{t('hero.explore')} <span>↗</span></a>
              <a className="hero-action hero-action--secondary" href="/" onClick={(event) => handleSectionClick('process', event)}>{t('hero.process')} <span>→</span></a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-ecosystem desktop-hero-products" data-reveal="hero-art" aria-label="Connected digital product ecosystem illustration">
              <span className="ecosystem-ambient ecosystem-ambient--one" data-depth="0.55" />
              <span className="ecosystem-ambient ecosystem-ambient--two" data-depth="0.8" />
              <span className="ecosystem-ambient ecosystem-ambient--three" data-depth="0.35" />
              <canvas className="ecosystem-particle-canvas" aria-hidden="true" />
              <span className="ecosystem-grid" data-depth="0.28" />
              <span className="ecosystem-line ecosystem-line--one" data-depth="0.38" />
              <span className="ecosystem-line ecosystem-line--two" data-depth="0.38" />
              <span className="ecosystem-line ecosystem-line--three" data-depth="0.38" />
              <span className="ecosystem-node ecosystem-node--one" data-depth="0.42" />
              <span className="ecosystem-node ecosystem-node--three" data-depth="0.42" />
              <span className="ecosystem-data-pulse ecosystem-data-pulse--one" />
              <span className="ecosystem-data-pulse ecosystem-data-pulse--two" />
              <div className="ecosystem-panel ecosystem-panel--map hero-product-card--pozari" data-depth="0.72">
                <span className="panel-kicker">POZARI.MK <em>LIVE</em></span>
                <b>{t('heroPreview.pozariTitle')}</b>
                <span className="panel-map panel-map--pozari"><img src={pozariImage} alt={i18n.language === 'mk' ? 'Pozari.mk платформа за следење пожари' : 'Pozari.mk wildfire monitoring platform'} /></span>
                <PozariStatus />
                <div className="pozari-detections">
                  <span className="pozari-detections-title">{t('heroPreview.latest')}</span>
                  <div className="pozari-detections-grid">
                    {latestPozariDetections.map((detection) => (
                      <article className="pozari-detection" key={detection.location}>
                        <div className="detection-header">
                          <div className="detection-title-group">
                            <span className="detection-dot" />
                            <span className="detection-city" title={t(`heroPreview.cities.${detection.location}`)}>{t(`heroPreview.cities.${detection.location}`)}</span>
                          </div>
                          <span className="detection-arrow">→</span>
                        </div>
                        <small>{detection.time}</small>
                        <strong>{detection.count.replace(' detections', '')} {t('heroPreview.detections')}</strong>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ecosystem-panel ecosystem-panel--service hero-product-card--captionlab" data-depth="1.08">
                <span className="panel-kicker captionlab-kicker">CAPTIONLAB.MK <em>LIVE</em></span>
                <b className="captionlab-title">{t('heroPreview.captionTitle')}</b>
                <div className="captionlab-compare">
                  <div className="captionlab-video captionlab-video--before"><span>{t('heroPreview.before')}</span><i className="captionlab-scene" /><strong /></div>
                  <button className="captionlab-divider" aria-label="Compare before and after">→</button>
                <div className="captionlab-video captionlab-video--after"><span>{t('heroPreview.after')}</span><i className="captionlab-scene" /><strong>{t('heroPreview.captionResultLine1')}<br />{t('heroPreview.captionResultLine2')}</strong></div>
                </div>
                <p className="captionlab-description">{t('heroPreview.captionDescription')}<br />{t('heroPreview.captionDescription2')}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="products" aria-label="Products">
        <section className="products-section" aria-label="Live products">
          <div className="venture-grid">
            <ProductCard kind="pozari" domain="POZARI.MK" title="Wildfire Intelligence Platform" description="Live fire monitoring, citizen reporting, and real-time situational awareness." cta="Explore Pozari.mk">
              <div className="pozari-product-preview"><img src={pozariImage} alt={i18n.language === 'mk' ? 'Pozari.mk платформа за следење пожари' : 'Pozari.mk wildfire monitoring platform'} /></div>
            </ProductCard>
            <ProductCard kind="captionlab" domain="CAPTIONLAB.MK" title="Professional Macedonian Captions" description="From speech to polished animated subtitles in just a few minutes." cta="Explore CaptionLab.mk">
              <div className="captionlab-product-preview">
                <div className="captionlab-product-video captionlab-product-video--before"><span>BEFORE</span><i className="captionlab-scene" /><strong /></div>
                <span className="captionlab-product-divider" aria-hidden="true">→</span>
                  <div className="captionlab-product-video captionlab-product-video--after"><span>{t('heroPreview.after')}</span><i className="captionlab-scene" /><strong>{t('heroPreview.captionResultLine1')}<br />{t('heroPreview.captionResultLine2')}</strong></div>
              </div>
            </ProductCard>
          </div>
        </section>

        <section className="coming-next" aria-labelledby="coming-next-title">
          <span className="coming-next__eyebrow">{t('coming.eyebrow')}</span>
          <h2 id="coming-next-title">{t('coming.title')}</h2>
          <div className="future-product-grid">
            <FutureCardLink to="/products/konobar" className="future-product-card">
              <img className="future-card__reference future-card__reference--konobar" src="/comingsoon1.jpeg" alt="Konobar NFC waiter system preview" />
              <span className="future-card__overlay future-card__overlay--more">{t('coming.more')} <span aria-hidden="true">→</span></span>
            </FutureCardLink>
            <article className="future-product-card">
              <img className="future-card__reference future-card__reference--problem" src="/comingsoon2.jpeg" alt="Problem city reporting preview" />
              <span className="future-card__overlay"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>{t('coming.confidential')}</span>
            </article>
            <article className="future-product-card">
              <img className="future-card__reference future-card__reference--youdidwhat" src="/comingsoon3.jpeg" alt="YouDidWhat shared chores preview" />
              <span className="future-card__overlay"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>{t('coming.confidential')}</span>
            </article>
          </div>
        </section>
        </section>

        <section className="process-section" id="process" aria-label="Our process" data-reveal="process">
          <span data-reveal="process-label">{t('process.research')}</span>
          <span className="process-arrow">→</span>
          <span data-reveal="process-label">{t('process.prototype')}</span>
          <span className="process-arrow">→</span>
          <span data-reveal="process-label">{t('process.launch')}</span>
          <span className="process-arrow">→</span>
          <span data-reveal="process-label">{t('process.learn')}</span>
        </section>

        <section className="metrics-section" aria-label="DreamLab by the numbers">
          <CountUpMetric value={2017} label={t('about.founded')} />
          <CountUpMetric value={500} suffix="+" label={t('about.clients')} />
          <CountUpMetric value={10000} suffix="+" label={t('about.videos')} />
        </section>

        <section className="ventures-section" id="ventures">
          <div className="story-intro">
            <div className="about-heading-wrap">
              <p className="about-heading-eyebrow">{i18n.language === 'mk' ? 'НАШАТА ПРИКАЗНА' : 'OUR STORY'}</p>
              <h2 className="about-title">
                {i18n.language === 'mk' ? t('about.title') : <>From creative<br />production<br />to digital<br />products.</>}
              </h2>
            </div>
            <div className="story-copy">
              {t('about.paragraphs', { returnObjects: true }).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

        </section>

      </main>

      <SiteFooter />
      <BackToTop />
    </div>
  )
}

export default App
