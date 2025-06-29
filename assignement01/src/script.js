import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// === Scene Setup ===
const canvas = document.querySelector('canvas.three')
const scene = new THREE.Scene()

// Enhanced background with gradient
scene.background = new THREE.Color(0x000511)

const resolution = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, resolution.width / resolution.height, 0.1, 1000)
camera.position.set(0, 20, 35)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true,
  alpha: true
})
renderer.setSize(resolution.width, resolution.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2

// === Enhanced Controls ===
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 10
controls.maxDistance = 100
controls.maxPolarAngle = Math.PI

// === Enhanced Lighting System ===
// Ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.8)
scene.add(ambientLight)

// Point light from the central star
const starLight = new THREE.PointLight(0xffcc00, 5, 100, 1)
starLight.position.set(0, 0, 0)
starLight.castShadow = true
starLight.shadow.mapSize.width = 1024
starLight.shadow.mapSize.height = 1024
starLight.shadow.camera.near = 0.5
starLight.shadow.camera.far = 50
scene.add(starLight)

// Additional directional light for better visibility
const directionalLight = new THREE.DirectionalLight(0x8888ff, 1.2)
directionalLight.position.set(-30, 30, 30)
scene.add(directionalLight)

// === Enhanced Central Star ===
const starGeometry = new THREE.SphereGeometry(2.5, 64, 64)
const starMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xffcc00,
  emissive: 0xffaa00,
  emissiveIntensity: 0.5
})
const star = new THREE.Mesh(starGeometry, starMaterial)
scene.add(star)

// Star glow effect
const starGlowGeometry = new THREE.SphereGeometry(3.2, 32, 32)
const starGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffcc00,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending
})
const starGlow = new THREE.Mesh(starGlowGeometry, starGlowMaterial)
scene.add(starGlow)

// === Enhanced Material Creation ===
const createAdvancedMaterial = (color, roughness = 0.3, metalness = 0.0, emissive = 0x000000) => {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: roughness,
    metalness: metalness,
    emissive: emissive,
    emissiveIntensity: 0.4
  })
}

// === Enhanced Bodies with Better Materials ===
const createBody = (geometry, material) => {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

// === Enhanced Planets ===
const drelon = createBody(
  new THREE.SphereGeometry(0.5, 32, 32),
  createAdvancedMaterial(0x66ddff, 0.2, 0.1, 0x2266aa)
)

const vorka = createBody(
  new THREE.SphereGeometry(0.7, 32, 32),
  createAdvancedMaterial(0x44ff88, 0.2, 0.0, 0x226644)
)

const klynt = createBody(
  new THREE.ConeGeometry(0.5, 1, 32),
  createAdvancedMaterial(0xff6699, 0.1, 0.3, 0x992244)
)

const xoron = createBody(
  new THREE.TorusGeometry(0.4, 0.15, 16, 100),
  createAdvancedMaterial(0xff99ff, 0.1, 0.3, 0x994477)
)

const beldar = createBody(
  new THREE.SphereGeometry(1, 32, 32),
  createAdvancedMaterial(0xffaa66, 0.2, 0.0, 0x996633)
)

scene.add(drelon, vorka, klynt, xoron, beldar)

// === Enhanced Moons ===
const minar = createBody(
  new THREE.SphereGeometry(0.2, 16, 16),
  createAdvancedMaterial(0xffffff, 0.1, 0.0, 0x666666)
)

const poltu = createBody(
  new THREE.SphereGeometry(0.15, 16, 16),
  createAdvancedMaterial(0xccccff, 0.1, 0.2, 0x555588)
)

scene.add(minar, poltu)

// === Enhanced Blue Rounded Cube ===
const blueCube = createBody(
  new RoundedBoxGeometry(1, 1, 1, 5, 0.2),
  createAdvancedMaterial(0x4488ff, 0.1, 0.3, 0x224488)
)
scene.add(blueCube)

// === Orbital Trail System ===
const trailMaterials = {}
const trailGeometries = {}
const trails = {}

const createOrbitTrail = (name, radius, color) => {
  const points = []
  const segments = 128
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ))
  }
  
  trailGeometries[name] = new THREE.BufferGeometry().setFromPoints(points)
  trailMaterials[name] = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.7
  })
  
  trails[name] = new THREE.Line(trailGeometries[name], trailMaterials[name])
  scene.add(trails[name])
}

// === Orbit Parameters with Trail Creation ===
const orbits = {
  drelon: { radius: 5, speed: 0.5, color: 0x66ddff },
  vorka:  { radius: 7, speed: 0.3, color: 0x44ff88 },
  klynt:  { radius: 9, speed: 0.25, color: 0xff6699 },
  xoron:  { radius: 11, speed: 0.4, color: 0xff99ff },
  beldar: { radius: 13, speed: 0.2, color: 0xffaa66 },
  minar:  { radius: 1.2, speed: 1.1, color: 0xffffff },
  poltu:  { radius: 1.4, speed: 1.3, color: 0xccccff },
  blueCube: { radius: 16, speed: 0.22, color: 0x4488ff }
}

// Create orbital trails
Object.keys(orbits).forEach(name => {
  if (name !== 'minar' && name !== 'poltu') { // Moons orbit around planets, not the star
    createOrbitTrail(name, orbits[name].radius, orbits[name].color)
  }
})

// === Planet Data for UI ===
const planetData = {
  star: {
    name: "Central Star",
    description: "A massive stellar body providing light and energy to the entire Zynthar system. Its intense gravitational field keeps all planets in stable orbits.",
    radius: "N/A",
    speed: "Stationary",
    type: "G-type Star"
  },
  drelon: {
    name: "Drelon",
    description: "A crystalline water world with azure oceans and floating crystal formations. The closest planet to the central star, it experiences intense stellar radiation.",
    radius: "5 AU",
    speed: "0.5 rad/s",
    type: "Aquatic Planet"
  },
  vorka: {
    name: "Vorka",
    description: "A lush forest planet teeming with exotic vegetation. Its green atmosphere is rich in oxygen, supporting diverse alien life forms.",
    radius: "7 AU",
    speed: "0.3 rad/s",
    type: "Forest World"
  },
  klynt: {
    name: "Klynt",
    description: "A mysterious cone-shaped planet with unknown origins. Its unique geometry suggests artificial construction by an ancient civilization.",
    radius: "9 AU",
    speed: "0.25 rad/s",
    type: "Artificial World"
  },
  xoron: {
    name: "Xoron",
    description: "A ring-shaped planet with a hollow center. Massive electromagnetic fields create stunning aurora displays across its metallic surface.",
    radius: "11 AU",
    speed: "0.4 rad/s",
    type: "Ring Planet"
  },
  beldar: {
    name: "Beldar",
    description: "The largest planet in the system, Beldar is a gas giant with swirling orange storms. Its immense gravity influences nearby orbital mechanics.",
    radius: "13 AU",
    speed: "0.2 rad/s",
    type: "Gas Giant"
  },
  bluecube: {
    name: "Mysterious Artifact",
    description: "An enigmatic blue cube of unknown origin, possibly a remnant of an ancient alien technology. It maintains a perfect orbit despite its unnatural shape.",
    radius: "16 AU",
    speed: "0.22 rad/s",
    type: "Alien Artifact"
  }
}

// === Interactive Features ===
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Planet objects for raycasting
const interactiveObjects = [star, drelon, vorka, klynt, xoron, beldar, blueCube]
const objectNames = ['star', 'drelon', 'vorka', 'klynt', 'xoron', 'beldar', 'bluecube']

// Mouse event handlers
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(interactiveObjects)
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object
    const objectIndex = interactiveObjects.indexOf(clickedObject)
    const planetKey = objectNames[objectIndex]
    
    showPlanetDetails(planetKey)
  }
}

function showPlanetDetails(planetKey) {
  const details = planetData[planetKey]
  const detailsElement = document.getElementById('planetDetails')
  
  document.getElementById('planetTitle').textContent = details.name
  document.getElementById('planetDescription').textContent = details.description
  document.getElementById('orbitalRadius').textContent = details.radius
  document.getElementById('orbitalSpeed').textContent = details.speed
  document.getElementById('planetType').textContent = details.type
  
  detailsElement.style.display = 'block'
}

// UI Event Listeners
document.addEventListener('click', onMouseClick, false)

document.getElementById('closePlanetDetails').addEventListener('click', () => {
  document.getElementById('planetDetails').style.display = 'none'
})

document.getElementById('toggleTrails').addEventListener('click', () => {
  Object.values(trails).forEach(trail => {
    trail.visible = !trail.visible
  })
})

document.getElementById('toggleLabels').addEventListener('click', () => {
  labelsVisible = !labelsVisible
  const button = document.getElementById('toggleLabels')
  button.textContent = labelsVisible ? 'Hide Planet Names' : 'Show Planet Names'
})

document.getElementById('resetCamera').addEventListener('click', () => {
  controls.reset()
  camera.position.set(0, 20, 35)
})

// Planet item hover effects
document.querySelectorAll('.planet-item').forEach(item => {
  item.addEventListener('click', () => {
    const planetKey = item.getAttribute('data-planet')
    showPlanetDetails(planetKey)
  })
})

// === Time and Speed Control System ===
const clock = new THREE.Clock()
let timeSpeed = 1.0
let isPaused = false
let simulationTime = 0
let startDate = new Date(4057, 3, 27) // April 27, 4057 (month is 0-indexed)

// Planet labels
const planetLabels = {}
const planetNames = {
  star: "Central Star",
  drelon: "Drelon",
  vorka: "Vorka", 
  klynt: "Klynt",
  xoron: "Xoron",
  beldar: "Beldar",
  blueCube: "Artifact"
}
let labelsVisible = true

// Create planet labels
function createPlanetLabels() {
  Object.keys(planetNames).forEach(key => {
    const label = document.createElement('div')
    label.className = 'planet-label'
    label.textContent = planetNames[key]
    label.style.display = 'none'
    document.body.appendChild(label)
    planetLabels[key] = label
  })
}

// Update planet label positions
function updatePlanetLabels() {
  const planets = { star, drelon, vorka, klynt, xoron, beldar, blueCube }
  
  Object.keys(planetLabels).forEach(key => {
    const planet = planets[key]
    const label = planetLabels[key]
    
    if (planet) {
      const vector = new THREE.Vector3()
      planet.getWorldPosition(vector)
      vector.project(camera)
      
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight
      
      // Only show label if planet is in front of camera and labels are enabled
      if (vector.z < 1 && labelsVisible) {
        label.style.display = 'block'
        label.style.left = (x + 10) + 'px'
        label.style.top = (y - 10) + 'px'
      } else {
        label.style.display = 'none'
      }
    }
  })
}

// Date calculation functions
function updateDateDisplay() {
  const daysPerYear = 365
  const daysPassed = Math.floor(simulationTime / 10) // 10 time units = 1 day
  const currentDate = new Date(startDate.getTime())
  currentDate.setDate(currentDate.getDate() + daysPassed)
  
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"]
  
  const dateString = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
  document.getElementById('currentDate').textContent = dateString
}

function updateSpeedDisplay() {
  const speedText = timeSpeed === 0 ? 'Paused' : 
                   timeSpeed > 0 ? `${timeSpeed.toFixed(1)}x Forward` : 
                   `${Math.abs(timeSpeed).toFixed(1)}x Reverse`
  document.getElementById('speedDisplay').textContent = speedText
}

// === Enhanced Animation Loop ===
function animate() {
  const deltaTime = clock.getDelta()
  
  if (!isPaused) {
    simulationTime += deltaTime * timeSpeed
  }
  
  const t = simulationTime
  
  // Enhanced star animation with pulsing
  star.rotation.y = t * 0.1
  starGlow.rotation.y = -t * 0.05
  starGlow.rotation.z = t * 0.02
  
  // Pulsing star light intensity
  starLight.intensity = 2 + Math.sin(t * 2) * 0.3
  
  // Planet animations with enhanced rotation
  drelon.position.set(
    Math.cos(t * orbits.drelon.speed) * orbits.drelon.radius,
    Math.sin(t * 0.2) * 0.5, // Slight vertical oscillation
    Math.sin(t * orbits.drelon.speed) * orbits.drelon.radius
  )
  drelon.rotation.y = t * 1.2
  drelon.rotation.x = t * 0.3
  
  vorka.position.set(
    Math.cos(t * orbits.vorka.speed) * orbits.vorka.radius,
    Math.sin(t * 0.15) * 0.3,
    Math.sin(t * orbits.vorka.speed) * orbits.vorka.radius
  )
  vorka.rotation.y = t * 0.8
  vorka.rotation.z = t * 0.2
  
  klynt.position.set(
    Math.cos(t * orbits.klynt.speed) * orbits.klynt.radius,
    Math.sin(t * 0.1) * 0.2,
    Math.sin(t * orbits.klynt.speed) * orbits.klynt.radius
  )
  klynt.rotation.y = t * 1.5
  klynt.rotation.x = Math.sin(t * 0.5) * 0.3
  
  xoron.position.set(
    Math.cos(t * orbits.xoron.speed) * orbits.xoron.radius,
    Math.sin(t * 0.08) * 0.4,
    Math.sin(t * orbits.xoron.speed) * orbits.xoron.radius
  )
  xoron.rotation.y = t * 2
  xoron.rotation.x = t * 0.8
  xoron.rotation.z = t * 0.4
  
  beldar.position.set(
    Math.cos(t * orbits.beldar.speed) * orbits.beldar.radius,
    Math.sin(t * 0.05) * 0.1,
    Math.sin(t * orbits.beldar.speed) * orbits.beldar.radius
  )
  beldar.rotation.y = t * 0.6
  beldar.rotation.z = t * 0.1
  
  // Enhanced moon animations
  minar.position.set(
    vorka.position.x + Math.cos(t * orbits.minar.speed) * orbits.minar.radius,
    vorka.position.y + Math.sin(t * orbits.minar.speed * 0.5) * 0.2,
    vorka.position.z + Math.sin(t * orbits.minar.speed) * orbits.minar.radius
  )
  minar.rotation.y = t * 2
  
  poltu.position.set(
    klynt.position.x + Math.cos(t * orbits.poltu.speed) * orbits.poltu.radius,
    klynt.position.y + Math.sin(t * orbits.poltu.speed * 0.3) * 0.3,
    klynt.position.z + Math.sin(t * orbits.poltu.speed) * orbits.poltu.radius
  )
  poltu.rotation.y = t * 1.8
  poltu.rotation.x = t * 0.5
  
  // Enhanced blue cube animation
  blueCube.position.set(
    Math.cos(t * orbits.blueCube.speed) * orbits.blueCube.radius,
    Math.sin(t * 0.03) * 1,
    Math.sin(t * orbits.blueCube.speed) * orbits.blueCube.radius
  )
  blueCube.rotation.y = t * 0.5
  blueCube.rotation.x = t * 0.3
  blueCube.rotation.z = t * 0.7
  
  // Update planet labels and UI
  updatePlanetLabels()
  updateDateDisplay()
  updateSpeedDisplay()
  
  // Update controls and render
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

// === Responsive Design ===
function handleResize() {
  resolution.width = window.innerWidth
  resolution.height = window.innerHeight
  
  camera.aspect = resolution.width / resolution.height
  camera.updateProjectionMatrix()
  
  renderer.setSize(resolution.width, resolution.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

window.addEventListener('resize', handleResize, false)

// === Time Control Event Listeners ===
document.getElementById('increaseSpeed').addEventListener('click', () => {
  timeSpeed = Math.min(timeSpeed + 0.5, 5.0)
})

document.getElementById('decreaseSpeed').addEventListener('click', () => {
  timeSpeed = Math.max(timeSpeed - 0.5, -5.0)
})

document.getElementById('pauseTime').addEventListener('click', () => {
  isPaused = !isPaused
  const button = document.getElementById('pauseTime')
  button.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause'
})

// Initialize planet labels and start animation
createPlanetLabels()
animate()
