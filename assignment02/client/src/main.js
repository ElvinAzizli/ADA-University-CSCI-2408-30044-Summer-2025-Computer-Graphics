import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Renderer configuration
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue background
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Add renderer to DOM
const appContainer = document.getElementById('app');
if (appContainer) {
    appContainer.appendChild(renderer.domElement);
    console.log('Renderer canvas added to DOM');
} else {
    document.body.appendChild(renderer.domElement);
    console.log('Renderer canvas added to body');
}

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

// Camera position
camera.position.set(10, 8, 10);
camera.lookAt(0, 0, 0);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('/textures/grass.png', 
    (texture) => console.log('Grass texture loaded successfully'),
    (progress) => console.log('Grass texture loading progress:', progress),
    (error) => console.error('Grass texture loading error:', error)
);
const woodTexture = textureLoader.load('/textures/wood.jpg',
    (texture) => console.log('Wood texture loaded successfully'),
    (progress) => console.log('Wood texture loading progress:', progress),
    (error) => console.error('Wood texture loading error:', error)
);
const pathTexture = textureLoader.load('/textures/asphalt.png',
    (texture) => console.log('Path texture loaded successfully'),
    (progress) => console.log('Path texture loading progress:', progress),
    (error) => console.error('Path texture loading error:', error)
);

// Configure grass texture
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);

// Configure wood texture
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;

// Configure path texture
pathTexture.wrapS = THREE.RepeatWrapping;
pathTexture.wrapT = THREE.RepeatWrapping;
pathTexture.repeat.set(8, 2);

// Ground with proper thickness
const groundGeometry = new THREE.BoxGeometry(40, 2, 40); // Made it a box with 2 units height
const groundMaterial = new THREE.MeshPhysicalMaterial({
    map: grassTexture,
    roughness: 0.8,
    metalness: 0.1,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -1; // Position it so the top surface is at y=0
ground.receiveShadow = true;
ground.castShadow = true;
scene.add(ground);

// Create park paths
function createPath(x, z, width, length, rotation = 0) {
    const pathGeometry = new THREE.PlaneGeometry(width, length);
    const pathMaterial = new THREE.MeshPhysicalMaterial({
        map: pathTexture,
        roughness: 0.7,
        metalness: 0.1,
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.rotation.z = rotation;
    path.position.set(x, 0.02, z);
    path.receiveShadow = true;
    scene.add(path);
    return path;
}

// Add park paths
const mainPath = createPath(0, 0, 3, 40, 0); // Main path across the garden
const sidePath1 = createPath(-10, 0, 2, 20, Math.PI / 2); // Side path 1
const sidePath2 = createPath(10, 0, 2, 20, Math.PI / 2); // Side path 2

// Tree creation
function createTree(x, z, scale = 1) {
    const treeGroup = new THREE.Group();
    
    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 3 * scale, 8);
    const trunkMaterial = new THREE.MeshPhysicalMaterial({
        map: woodTexture,
        roughness: 0.9,
        metalness: 0.1,
        color: 0x8B4513,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5 * scale;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    // Tree leaves
    const leavesGeometry = new THREE.SphereGeometry(2 * scale, 8, 6);
    const leavesMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x228B22,
        roughness: 0.7,
        metalness: 0.0,
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 3.5 * scale;
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    treeGroup.add(leaves);
    
    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
    
    return treeGroup;
}

// Create multiple trees positioned strategically
const tree1 = createTree(-8, -8, 1.2);
const tree2 = createTree(8, -8, 0.8);
const tree3 = createTree(-6, 8, 1.0);
const tree4 = createTree(15, 5, 0.9);
const tree5 = createTree(-15, -2, 1.1);
const tree6 = createTree(3, 12, 0.7);
const tree7 = createTree(-12, -10, 1.0);

// Bench creation
function createBench(x, z, rotation = 0) {
    const benchGroup = new THREE.Group();
    
    // Bench seat
    const seatGeometry = new THREE.BoxGeometry(3, 0.2, 1);
    const seatMaterial = new THREE.MeshPhysicalMaterial({
        map: woodTexture,
        roughness: 0.6,
        metalness: 0.2,
        color: 0xD2691E,
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = 1;
    seat.castShadow = true;
    seat.receiveShadow = true;
    benchGroup.add(seat);
    
    // Bench back
    const backGeometry = new THREE.BoxGeometry(3, 1.5, 0.1);
    const back = new THREE.Mesh(backGeometry, seatMaterial);
    back.position.y = 1.5;
    back.position.z = -0.45;
    back.castShadow = true;
    back.receiveShadow = true;
    benchGroup.add(back);
    
    // Bench legs
    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const legMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B4513,
        roughness: 0.8,
        metalness: 0.3,
    });
    
    const positions = [
        [-1.3, 0.5, 0.4],
        [1.3, 0.5, 0.4],
        [-1.3, 0.5, -0.4],
        [1.3, 0.5, -0.4],
    ];
    
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        leg.receiveShadow = true;
        benchGroup.add(leg);
    });
    
    benchGroup.position.set(x, 0, z);
    benchGroup.rotation.y = rotation;
    scene.add(benchGroup);
    
    return benchGroup;
}

// Create multiple benches positioned around the garden
const bench1 = createBench(6, -6, 0); // First bench moved further from main path
const bench2 = createBench(-4, 4, Math.PI / 4); // Second bench moved further from side path
const bench3 = createBench(-8, -5, Math.PI / 2); // Third bench near trees area
const bench4 = createBench(14, -3, -Math.PI / 6); // Fourth bench in corner area
const bench5 = createBench(-14, 6, Math.PI / 3); // Fifth bench opposite side

// Pond creation
function createPond(x, z, radius = 3) {
    const pondGroup = new THREE.Group();
    
    // Pond water - deep sea blue
    const pondGeometry = new THREE.CircleGeometry(radius, 64);
    const pondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x006994, // Deep sea blue
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.8,
    });
    const pond = new THREE.Mesh(pondGeometry, pondMaterial);
    pond.rotation.x = -Math.PI / 2;
    pond.position.y = 0.05;
    pond.receiveShadow = true;
    pondGroup.add(pond);
    
    // Pond rim - wider for depth effect
    const rimGeometry = new THREE.RingGeometry(radius, radius + 0.5, 32);
    const rimMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B7355,
        roughness: 0.8,
        metalness: 0.2,
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.1;
    rim.castShadow = true;
    rim.receiveShadow = true;
    pondGroup.add(rim);
    
    // Inner pool wall for depth effect
    const wallGeometry = new THREE.CylinderGeometry(radius, radius, 0.5, 32);
    const wallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x654321,
        roughness: 0.9,
        metalness: 0.1,
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = -0.25;
    wall.castShadow = true;
    wall.receiveShadow = true;
    pondGroup.add(wall);
    
    // Small fountain statue - centered
    const statueGroup = new THREE.Group();
    
    // Statue base - smaller
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 8);
    const baseMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x708090,
        roughness: 0.7,
        metalness: 0.3,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.4;
    base.castShadow = true;
    base.receiveShadow = true;
    statueGroup.add(base);
    
    // Statue pillar - smaller
    const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 8);
    const pillar = new THREE.Mesh(pillarGeometry, baseMaterial);
    pillar.position.y = 1.3;
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    statueGroup.add(pillar);
    
    // Water spout - smaller
    const spoutGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.3, 8);
    const spout = new THREE.Mesh(spoutGeometry, baseMaterial);
    spout.position.y = 1.9;
    spout.castShadow = true;
    spout.receiveShadow = true;
    statueGroup.add(spout);
    
    // Small fountain water stream
    const waterfallGeometry = new THREE.CylinderGeometry(0.03, 0.05, 1.5, 16);
    const waterfallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x006994,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
    });
    const waterfall = new THREE.Mesh(waterfallGeometry, waterfallMaterial);
    waterfall.position.y = 1.1;
    waterfall.castShadow = false;
    waterfall.receiveShadow = false;
    statueGroup.add(waterfall);
    
    // Small water splash effect at base
    const splashGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const splashMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x006994,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
    });
    const splash = new THREE.Mesh(splashGeometry, splashMaterial);
    splash.position.y = 0.1;
    splash.scale.set(1, 0.3, 1);
    statueGroup.add(splash);
    
    // Position statue at center of pond
    statueGroup.position.set(0, 0, 0);
    pondGroup.add(statueGroup);
    
    pondGroup.position.set(x, 0, z);
    scene.add(pondGroup);
    
    return { group: pondGroup, water: pond, waterfall: waterfall, splash: splash };
}

// Create pond positioned further from the road with larger size
const pond = createPond(9, 7, 4);

// Decorative stones around pond
function createStone(x, z, scale = 1) {
    const stoneGeometry = new THREE.SphereGeometry(0.3 * scale, 8, 6);
    const stoneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x708090,
        roughness: 0.9,
        metalness: 0.1,
    });
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.set(x, 0.15 * scale, z);
    stone.scale.y = 0.6;
    stone.castShadow = true;
    stone.receiveShadow = true;
    scene.add(stone);
    return stone;
}

// Create stones around pond
const stones = [];
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 3.5;
    const x = 9 + Math.cos(angle) * distance; // Updated to match new pond position
    const z = 7 + Math.sin(angle) * distance; // Updated to match new pond position
    stones.push(createStone(x, z, 0.5 + Math.random() * 0.5));
}

// Flowers
function createFlower(x, z, color = 0xFF69B4) {
    const flowerGroup = new THREE.Group();
    
    // Flower stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4);
    const stemMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x228B22,
        roughness: 0.8,
        metalness: 0.1,
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.25;
    stem.castShadow = true;
    flowerGroup.add(stem);
    
    // Flower petals
    const petalGeometry = new THREE.SphereGeometry(0.1, 6, 4);
    const petalMaterial = new THREE.MeshPhysicalMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.0,
    });
    
    // Create petals in a circle
    for (let i = 0; i < 6; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (i / 6) * Math.PI * 2;
        petal.position.set(Math.cos(angle) * 0.15, 0.5, Math.sin(angle) * 0.15);
        petal.castShadow = true;
        flowerGroup.add(petal);
    }
    
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.05, 8, 6);
    const centerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFFD700,
        roughness: 0.2,
        metalness: 0.0,
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.5;
    center.castShadow = true;
    flowerGroup.add(center);
    
    flowerGroup.position.set(x, 0, z);
    scene.add(flowerGroup);
    
    return flowerGroup;
}

// Create flowers strategically positioned around the garden
const flowers = [];
const flowerColors = [0xFF69B4, 0xFF4500, 0x9370DB, 0x00CED1, 0xFFD700];

// Predefined flower positions avoiding roads and pond
const flowerPositions = [
    // Around benches and trees
    {x: 4, z: -9, color: 0xFF69B4},
    {x: -6, z: 2, color: 0xFF4500},
    {x: -10, z: -6, color: 0x9370DB},
    {x: 12, z: -5, color: 0x00CED1},
    {x: -12, z: 8, color: 0xFFD700},
    {x: 5, z: 10, color: 0xFF69B4},
    // Additional scattered flowers
    {x: -5, z: -12, color: 0x9370DB},
    {x: 16, z: 2, color: 0xFF4500},
    {x: -16, z: -8, color: 0x00CED1},
    {x: 2, z: -13, color: 0xFFD700},
    {x: -3, z: 11, color: 0xFF69B4},
    {x: 13, z: 8, color: 0x9370DB},
    {x: -13, z: 3, color: 0xFF4500},
    {x: 7, z: -12, color: 0x00CED1},
    {x: -7, z: -14, color: 0xFFD700},
    // More flowers for fuller garden
    {x: 11, z: 12, color: 0xFF69B4},
    {x: -11, z: -15, color: 0x9370DB},
    {x: 15, z: -8, color: 0xFF4500}
];

flowerPositions.forEach(pos => {
    // Check distance from pond and roads before adding
    const distanceFromPond = Math.sqrt((pos.x - 9) * (pos.x - 9) + (pos.z - 7) * (pos.z - 7));
    const onMainPath = Math.abs(pos.x) < 2; // Main horizontal path
    const onSidePath1 = Math.abs(pos.x + 10) < 1; // Side path 1
    const onSidePath2 = Math.abs(pos.x - 10) < 1; // Side path 2
    
    if (distanceFromPond > 6 && !onMainPath && !onSidePath1 && !onSidePath2) {
        flowers.push(createFlower(pos.x, pos.z, pos.color));
    }
});

// Animation variables
let time = 0;
const animationSpeed = 0.01;

// Day/Night cycle variables
let dayTime = 0.25; // Start at morning (0 = midnight, 0.25 = 6am, 0.5 = noon, 0.75 = 6pm, 1 = midnight)
let baseTimeSpeed = 0.001; // Base speed of day/night cycle
let timeSpeed = 0; // Current speed (starts stopped)
let speedMultiplier = 1; // Speed multiplier (1x, 2x, 3x, etc.)
let isTimeRunning = false; // Whether time is currently running
let sunAngle = 0;
let sunIntensity = 0.8;
let skyColor = new THREE.Color(0x87CEEB);
let ambientIntensity = 0.6;

// Hide loading screen
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Day/Night cycle function
function updateDayNightCycle() {
    // Update day time
    dayTime += timeSpeed;
    if (dayTime > 1) dayTime = 0;
    
    // Calculate sun position and intensity
    sunAngle = dayTime * Math.PI * 2; // Full circle in radians
    const sunHeight = Math.sin(sunAngle) * 15; // Sun height from -15 to 15
    const sunDistance = 25;
    
    // Update sun position
    directionalLight.position.x = Math.cos(sunAngle) * sunDistance;
    directionalLight.position.y = Math.max(sunHeight, 0.5); // Keep minimum height
    directionalLight.position.z = Math.sin(sunAngle) * sunDistance;
    
    // Update sun intensity based on time
    if (dayTime >= 0.2 && dayTime <= 0.8) {
        // Daytime (6am to 6pm)
        const dayProgress = (dayTime - 0.2) / 0.6;
        sunIntensity = 0.3 + Math.sin(dayProgress * Math.PI) * 0.7;
        ambientIntensity = 0.4 + Math.sin(dayProgress * Math.PI) * 0.4;
    } else {
        // Nighttime
        sunIntensity = 0.1;
        ambientIntensity = 0.2;
    }
    
    // Update lighting
    directionalLight.intensity = sunIntensity;
    ambientLight.intensity = ambientIntensity;
    
    // Update sky color
    if (dayTime >= 0.15 && dayTime <= 0.25) {
        // Sunrise
        const sunriseProgress = (dayTime - 0.15) / 0.1;
        skyColor.lerpColors(new THREE.Color(0x1a1a2e), new THREE.Color(0xff6b35), sunriseProgress);
    } else if (dayTime >= 0.25 && dayTime <= 0.3) {
        // Morning
        const morningProgress = (dayTime - 0.25) / 0.05;
        skyColor.lerpColors(new THREE.Color(0xff6b35), new THREE.Color(0x87ceeb), morningProgress);
    } else if (dayTime >= 0.3 && dayTime <= 0.7) {
        // Day
        skyColor.set(0x87ceeb);
    } else if (dayTime >= 0.7 && dayTime <= 0.8) {
        // Sunset
        const sunsetProgress = (dayTime - 0.7) / 0.1;
        skyColor.lerpColors(new THREE.Color(0x87ceeb), new THREE.Color(0xff4500), sunsetProgress);
    } else if (dayTime >= 0.8 && dayTime <= 0.9) {
        // Evening
        const eveningProgress = (dayTime - 0.8) / 0.1;
        skyColor.lerpColors(new THREE.Color(0xff4500), new THREE.Color(0x191970), eveningProgress);
    } else {
        // Night
        skyColor.set(0x1a1a2e);
    }
    
    // Update renderer background
    renderer.setClearColor(skyColor);
    
    // Update time display
    let timeText = "";
    if (dayTime >= 0.15 && dayTime < 0.3) timeText = "Sunrise";
    else if (dayTime >= 0.3 && dayTime < 0.5) timeText = "Morning";
    else if (dayTime >= 0.5 && dayTime < 0.7) timeText = "Afternoon";
    else if (dayTime >= 0.7 && dayTime < 0.9) timeText = "Sunset";
    else timeText = "Night";
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeText;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    time += animationSpeed;
    
    // Update day/night cycle
    updateDayNightCycle();
    
    // Animate tree swaying
    if (tree1) {
        tree1.rotation.z = Math.sin(time * 2) * 0.05;
    }
    if (tree2) {
        tree2.rotation.z = Math.sin(time * 1.5 + 1) * 0.03;
    }
    if (tree3) {
        tree3.rotation.z = Math.sin(time * 1.8 + 2) * 0.04;
    }
    if (tree4) {
        tree4.rotation.z = Math.sin(time * 1.3 + 3) * 0.035;
    }
    if (tree5) {
        tree5.rotation.z = Math.sin(time * 2.2 + 4) * 0.045;
    }
    if (tree6) {
        tree6.rotation.z = Math.sin(time * 1.7 + 5) * 0.025;
    }
    if (tree7) {
        tree7.rotation.z = Math.sin(time * 1.9 + 6) * 0.04;
    }
    
    // Animate pond water with stable movement
    if (pond.water) {
        const waterTime = time * 0.8;
        // Very gentle vertical movement for water surface
        pond.water.position.y = 0.05 + Math.sin(waterTime * 0.5) * 0.01;
        // Subtle rotation for organic movement
        pond.water.rotation.z = Math.sin(waterTime * 0.3) * 0.005;
    }
    
    // Animate fountain waterfall
    if (pond.waterfall) {
        const waterfallTime = time * 0.5;
        // Gentle fountain flow animation
        pond.waterfall.position.y = 1.1 + Math.sin(waterfallTime * 2) * 0.01;
        pond.waterfall.scale.x = 1 + Math.sin(waterfallTime * 3) * 0.05;
        pond.waterfall.scale.z = 1 + Math.sin(waterfallTime * 3) * 0.05;
        // Slow rotation for flowing water effect
        pond.waterfall.rotation.y = waterfallTime * 0.2;
    }
    
    // Animate splash effect
    if (pond.splash) {
        const splashTime = time * 0.7;
        // Gentle pulsing splash effect
        const splashScale = 1 + Math.sin(splashTime * 3) * 0.1;
        pond.splash.scale.set(splashScale, 0.3, splashScale);
        pond.splash.rotation.y = splashTime * 0.5;
    }
    
    // Animate flowers swaying
    flowers.forEach((flower, index) => {
        if (flower) {
            flower.rotation.z = Math.sin(time * 2 + index * 0.5) * 0.1;
        }
    });
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Initialize scene
function init() {
    console.log('3D Garden Scene initialized');
    console.log('Scene objects count:', scene.children.length);
    console.log('Camera position:', camera.position);
    console.log('Renderer size:', renderer.getSize(new THREE.Vector2()));
    
    // Red test cube removed as requested
    
    hideLoading();
    animate();
}

// Add interactive controls for day/night cycle
function setupControls() {
    const startStopButton = document.getElementById('startStop');
    const speedUpButton = document.getElementById('speedUp');
    const speedDownButton = document.getElementById('speedDown');
    const resetTimeButton = document.getElementById('resetTime');
    const speedDisplay = document.getElementById('speedDisplay');
    
    // Update speed display
    function updateSpeedDisplay() {
        if (speedDisplay) {
            speedDisplay.textContent = isTimeRunning ? `${speedMultiplier}x` : 'Stopped';
        }
    }
    
    // Update time speed based on current settings
    function updateTimeSpeed() {
        timeSpeed = isTimeRunning ? baseTimeSpeed * speedMultiplier : 0;
    }
    
    // Start/Stop button
    if (startStopButton) {
        startStopButton.addEventListener('click', () => {
            isTimeRunning = !isTimeRunning;
            startStopButton.textContent = isTimeRunning ? 'Stop' : 'Start';
            startStopButton.className = isTimeRunning ? 'stopped' : '';
            updateTimeSpeed();
            updateSpeedDisplay();
            console.log('Time cycle:', isTimeRunning ? 'started' : 'stopped');
        });
    }
    
    // Speed up button
    if (speedUpButton) {
        speedUpButton.addEventListener('click', () => {
            if (speedMultiplier < 10) {
                speedMultiplier++;
                updateTimeSpeed();
                updateSpeedDisplay();
                console.log('Speed increased to:', speedMultiplier + 'x');
            }
        });
    }
    
    // Speed down button
    if (speedDownButton) {
        speedDownButton.addEventListener('click', () => {
            if (speedMultiplier > 1) {
                speedMultiplier--;
                updateTimeSpeed();
                updateSpeedDisplay();
                console.log('Speed decreased to:', speedMultiplier + 'x');
            }
        });
    }
    
    // Reset time button
    if (resetTimeButton) {
        resetTimeButton.addEventListener('click', () => {
            dayTime = 0.25; // Reset to morning
            console.log('Time reset to morning');
        });
    }
    
    // Initialize display
    updateSpeedDisplay();
}

// Start the application
init();
setupControls();

// Add some helpful console logs
console.log('Controls:');
console.log('- Mouse: Orbit camera');
console.log('- Scroll: Zoom in/out');
console.log('- Right-click + drag: Pan');
console.log('- Use the controls panel to adjust day/night cycle');
