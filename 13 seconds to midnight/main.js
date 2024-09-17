    let gameStarted = false;
    const MAX_PARTICLES = 130;
    let PLAYER_SPEED = 0.04;
    const SENSITIVITY = 0.1;
    const forestRadius = 80;  // Increased forest size
    const treeCount = 2000;    // Increased number of trees
    const playerBaseHeight = 0.5;  // The base height of the player
    const TREE_COLLISION_RADIUS = .5; // Adjust based on your tree's width
    const PLAYER_RADIUS = 0.2; // Adjust based on your player's size
    const INITIAL_AMBIENT = 0.3;  // Adjust this value as needed
    const MAX_TIME = 13000; // 13 seconds in milliseconds
    const SHAKE_INTENSITY = 0.07;
    const SHAKE_DURATION = 300; // milliseconds
    const ATTACK_COOLDOWN = 700; // 2 seconds cooldown between attacks

    let speedBoostActive = false;
    let speedBoostTimer = null;

    const INITIAL_HEARTBEAT_DELAY = 1000;
    const FINAL_HEARTBEAT_DELAY = 400;
    const BASE_PLAYER_SPEED = 0.04;
    const SPEED_BOOST_MULTIPLIER = 2;

    'use strict';
    let // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
    zzfxV=.3,               // volume
    zzfxX=new AudioContext, // audio context
    zzfx=                   // play sound
    (p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
    ,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
    g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
    X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
    R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
    =f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)
    %2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a<
    e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(h
    -a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
    H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
    createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
    b.buffer=p;b.connect(zzfxX.destination);b.start()}

    onload = () => {
        // Set up the WebGL context with proper scaling
        const canvas = document.getElementById('gameCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        const timerDisplay = document.getElementById("timerDisplay");
        // const healthDisplay = document.getElementById('healthDisplay');
        const healthFill = document.getElementById('healthFill');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const restartButton = document.getElementById("restartButton");
        const winGameScreen = document.getElementById("winGameScreen");
        const playAgain = document.getElementById("playAgain");

        // Initialize player position and rotation
        X = 0;
        Z = 0;
        RY = 0;
        let playerHealth = 100;

        const particles = [];
        const trees = []; 
        const collectibles = [];
        const enemies = [];

        // Create overlay canvas for tunnel vision effect
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'overlayCanvas';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        // overlayCanvas.style.mixblendmode = "multiply";
        document.body.appendChild(overlayCanvas);

        const customModelTree = {
            vertices: [.157565,0,.157565,-.157565,0,-.157565,.157565,0,-.157565,.102249,5.332085,.10225,-.102249,6.165702,.10225,-.102249,5.332085,.10225,-.157565,0,.157565,-.102249,5.332085,-.102248,.102249,5.332085,-.102248,-.017916,2.437575,-.387225,.061217,2.163112,-.097166,-.058139,2.163112,-.097166,.020994,2.437575,-.387225,.061217,2.270659,-.097166,.020994,2.472636,-.387225,-.058139,2.270659,-.097166,-.017916,2.437575,-.387225,-.058139,2.163112,-.097166,-.058139,2.163112,-.097166,.061217,2.163112,-.097166,.020994,2.437575,-.387225,-.017916,2.472636,-.387225,.053329,1.250192,.157565,-.016467,1.476365,.366027,-.050711,1.250192,.135427,-.050711,1.350576,.135427,.019084,1.510667,.366027,.053329,1.350576,.135427,.019084,1.476365,.366027,.053329,1.250192,.157565,-.050711,1.250192,.135427,.053329,1.250192,.157565,-.016467,1.476365,.366027,-.016467,1.510667,.366027,.357363,1.930699,.013624,.132233,1.879278,.034185,.132233,1.813751,.034185,.357363,1.94831,.013624,.132233,1.879278,-.022051,.357363,1.930699,-.00149,.132233,1.813751,-.024717,.132233,1.813751,.034185,.132233,1.813751,.034185,.132233,1.879278,.034185,.357363,1.94831,.013624,.357363,1.94831,-.00149,-.392656,3.060125,-.024078,-.114001,3.037659,-.03942,-.114001,2.972429,-.03942,-.392656,3.096621,-.024078,-.114001,3.037659,.030237,-.392656,3.060125,.014895,-.114001,2.972429,.030237,-.114001,2.972429,-.03942,-.114001,2.972429,-.03942,-.114001,3.037659,-.03942,-.392656,3.096621,-.024078,-.392656,3.096621,.014895,.03203,3.484732,.157566,-.006541,3.603713,.397595,-.025791,3.484732,.07078,-.025791,3.550155,.07078,-.006541,3.625574,.397595,.03203,3.550155,.07078,.01278,3.625574,.397595,.03203,3.484732,.157566,-.025791,3.484732,.07078,.03203,3.484732,.157566,-.006541,3.603713,.397595,-.024333,4.203851,-.027319,.022481,4.394909,-.400243,.041965,4.203851,-.027319,.041965,4.286136,-.027319,.022481,4.42883,-.400243,-.024333,4.286136,-.027319,-.00485,4.394909,-.400243,-.024333,4.203851,-.027319,-.024333,4.203851,-.027319,.041965,4.203851,-.027319,.022481,4.394909,-.400243,-.00485,4.42883,-.400243,-.388418,.931924,-.004114,-.070566,.84111,-.025226,-.082292,.7847,-.025226,-.385544,.945751,-.004114,-.070566,.84111,.030707,-.388418,.931924,.009595,-.082292,.7847,.030707,-.082292,.7847,-.025226,-.082292,.7847,-.025226,-.070566,.84111,-.025226,-.385544,.945751,-.004114,-.385544,.945751,.009595,.102249,6.165702,.10225,-.102249,6.865098,.10225,.102249,6.165702,-.102248,-.102249,6.165702,-.102248,-.102249,6.865098,-.102248,.102249,6.865098,.10225,.102249,6.865098,-.102248,-.017916,2.437575,-.387225,.019084,1.476365,.366027,.019084,1.476365,.366027,.357363,1.930699,.013624,.357363,1.930699,.013624,-.392656,3.060125,-.024078,-.392656,3.060125,-.024078,.01278,3.603713,.397595,.01278,3.603713,.397595,.01278,3.603713,.397595,-.00485,4.394909,-.400243,-.00485,4.394909,-.400243,-.388418,.931924,-.004114,-.388418,.931924,-.004114],
            uv: [0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,.625,0,.375,.25,.375,0,.625,.25,.375,.5,.625,.5,.375,.75,.625,1,.375,1,.125,.75,.125,.5,.875,.5,.625,.75,.375,0,.625,.25,.375,.25,.375,.5,.625,.75,.375,.75,.625,1,.375,1,.125,.5,.125,.75,.875,.5,.625,.5,.625,0,.375,.25,.375,0,.625,.25,.375,.5,.625,.75,.375,.75,.375,1,.125,.75,.125,.5,.875,.5,.625,.5,.625,0,.375,.25,.375,0,.625,.25,.375,.5,.625,.75,.375,.75,.375,1,.125,.75,.125,.5,.875,.5,.625,.5,.375,0,.625,.25,.375,.25,.375,.5,.625,.5,.375,.75,.625,.75,.375,1,.125,.5,.125,.75,.875,.5,.375,0,.625,.25,.375,.25,.375,.5,.625,.5,.375,.75,.625,1,.375,1,.125,.75,.125,.5,.875,.5,.625,.75,.625,0,.375,.25,.375,0,.625,.25,.375,.5,.625,.75,.375,.75,.375,1,.125,.75,.125,.5,.875,.5,.625,.5,0,1,1,1,0,0,1,0,1,0,0,1,0,0,.875,.75,.625,0,.875,.75,.625,1,.875,.75,.625,1,.875,.75,.625,0,.625,1,.875,.75,.625,0,.875,.75,.625,1,.875,.75],
            indices: [0,1,2,3,4,5,6,7,1,2,3,0,0,5,6,1,8,2,9,10,11,12,13,10,14,15,13,15,16,17,13,18,19,20,21,14,22,23,24,23,25,24,25,26,27,27,28,29,30,27,31,32,26,33,34,35,36,37,38,35,38,39,40,39,41,40,38,42,43,44,39,45,46,47,48,49,50,47,50,51,52,51,53,52,50,54,55,56,51,57,58,59,60,59,61,60,62,63,61,64,65,63,66,63,67,68,64,62,69,70,71,70,72,71,73,74,72,74,75,76,72,77,78,79,80,73,81,82,83,84,85,82,85,86,87,86,88,87,85,89,90,91,86,92,93,94,4,7,95,8,5,96,7,8,93,3,97,98,99,96,99,95,4,97,96,95,98,93,0,6,1,3,93,4,6,5,7,2,8,3,0,3,5,1,7,8,9,12,10,12,14,13,14,21,15,15,21,16,13,15,18,20,100,21,22,101,23,23,33,25,25,33,26,27,26,28,30,25,27,32,102,26,34,37,35,37,45,38,38,45,39,39,103,41,38,40,42,44,104,39,46,49,47,49,57,50,50,57,51,51,105,53,50,52,54,56,106,51,58,107,59,59,62,61,62,64,63,64,108,65,66,61,63,68,109,64,69,110,70,70,73,72,73,80,74,74,80,75,72,74,77,79,111,80,81,84,82,84,92,85,85,92,86,86,112,88,85,87,89,91,113,86,93,98,94,7,96,95,5,4,96,8,95,93,97,94,98,96,97,99,4,94,97,95,99,98] 
        }
        const customModelEnemy = {
            vertices: [...'@/ -(@D_-(V8WIS@$d)8W6S@$6S)8WV8W_-(J?/,O)(4ISV8W@$6S -()8WJLP,Ow7F)8WJ?V(4J?7FJLFJL7FJ?7Fw7FJ?}FJLw7FMF2F)(4V(4J?*]8 [4 VK VU]IWG [R_G [O[-_-_0[8 [6WR_'].map(a=>(a.codePointAt())/127),
    uv: [...'@EM&48u	y)`&gzTYS&$CM&VHNpbn)T3z^=`&u	y)OINpFTC>G9mVHxLs=lzOIFTe=`L`Le=lzs=xLEwEw9mbn>G0OPP0 JO0/R :0\'0 :/R J\'0'].map(a=>(a.codePointAt())/127),
    indices: [0,1,2,3,4,5,6,7,8,9,5,10,2,11,12,0,2,13,14,15,16,17,6,8,18,6,17,3,5,9,0,13,19,19,1,0,20,21,9,22,21,20,13,2,12,6,18,7,23,24,25,26,2,1,27,25,28,29,24,23,30,31,32,33,34,15,35,36,32,32,31,35,37,38,39,40,41,39,14,33,15,24,42,25,43,34,44,29,45,24,25,42,28,39,38,40,34,43,15,34,46,44,47,48,49,50,51,52,51,53,54,55,52,56,47,57,48,58,59,60,49,61,47,51,50,53,61,59,47,59,61,60,62,55,56,51,56,52]
    };
        

        
        function createParticle(playerX, playerZ) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.sqrt(Math.random()) * 30;
            const x = playerX + Math.cos(angle) * radius;
            const z = playerZ + Math.sin(angle) * radius;
            const y = 0.4 + Math.random() * 3;

            return {
                x, y, z,
                vx: (Math.random() - 0.2) * 0.002,
                vy: -0.0005 - Math.random() * 0.0001,
                vz: (Math.random() - 0.2) * 0.002,
                life: 2000 + Math.random() * 2000,
                maxLife: 3500,
                size: 0.3 + Math.random() * 0.3,
                opacity: 1
            };
        }

        function updateParticles(deltaTime, playerX, playerZ) {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                p.x += (p.vx + Math.sin(Date.now() / 3000) * 0.0005) * deltaTime;
                p.y += p.vy * deltaTime;
                p.z += (p.vz + Math.cos(Date.now() / 3000) * 0.0005) * deltaTime;
                
                p.life -= deltaTime;
                p.opacity = Math.min(1, p.life / p.maxLife);
                
                if (p.life <= 0 || p.y < 0) {
                    particles.splice(i, 1);
                } else {
                    W.billboard({
                        n: `particle${i}`,
                        x: p.x,
                        y: p.y,
                        z: p.z,
                        w: p.size,
                        h: p.size,
                        b: "ffffff50" + Math.floor(p.opacity * 255).toString(16).padStart(2, '0')
                    });
                }
            }
            if (particles.length < MAX_PARTICLES && Math.random() < 0.95) {
                particles.push(createParticle(playerX, playerZ));
            }
        }

        function updateTunnelVision(timeRemaining, isUnderAttack = false) {
        const totalTime = 13000; // 13 seconds in milliseconds
        const timeProgress = Math.max(0, Math.min(1, 1 - (timeRemaining / totalTime)));
    
        const canvas = document.getElementById('overlayCanvas');
        const ctx = canvas.getContext('2d');
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.max(canvas.width, canvas.height);
    
        const minInnerRadius = 10;
        const maxInnerRadius = 30;
        const innerRadius = maxInnerRadius - (maxInnerRadius - minInnerRadius) * timeProgress;
    
        const gradient = ctx.createRadialGradient(
            centerX, centerY, innerRadius,
            centerX, centerY, maxRadius / 1.2
        );
    
        const innerOpacity = -8;
        const outerOpacity = Math.min(0.9, 0.9 + timeProgress * 0.8);
    
        // Change the inner color to dark red when under attack
        const innerColor = isUnderAttack ? '174, 30, 30' : '0, 0, 0';
        
        gradient.addColorStop(0, `rgba(${innerColor}, ${innerOpacity})`);
        gradient.addColorStop(0.9, `rgba(0, 0, 0, ${outerOpacity * 2})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${outerOpacity})`);
    
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.6, timeProgress * 0.6)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
        
        W.reset(canvas);


    const gridSize = Math.ceil(Math.sqrt(treeCount));
    const cellSize = forestRadius * 2.2 / gridSize;
    const offset = forestRadius / gridSize;
    const clearingRadius = forestRadius * .05;

    for(let i = 0; i < treeCount; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        const x = (col * cellSize - forestRadius) + (Math.random() * cellSize - offset);
        const z = (row * cellSize - forestRadius) + (Math.random() * cellSize - offset);

        const distanceFromCenter = Math.sqrt(x * x + z * z);
        if (distanceFromCenter >= clearingRadius) {
            trees.push({x, z});
        }
    }



        W.add("my_custom_tree", customModelTree);

        const CHUNK_SIZE = 20; // Increased chunk size for better visibility
        const chunks = {};
        
        // Group trees into chunks
        trees.forEach((tree, index) => {
            const chunkX = Math.floor(tree.x / CHUNK_SIZE);
            const chunkZ = Math.floor(tree.z / CHUNK_SIZE);
            const chunkKey = `${chunkX},${chunkZ}`;
            
            if (!chunks[chunkKey]) {
                chunks[chunkKey] = [];
            }
            chunks[chunkKey].push(tree);
        });
        
        // Create merged geometries for each chunk
        Object.entries(chunks).forEach(([chunkKey, chunkTrees], chunkIndex) => {
            const mergedVertices = [];
            const mergedUV = [];
            const mergedIndices = [];
            let vertexOffset = 0;
        
            chunkTrees.forEach((tree, treeIndex) => {
                const treeModel = W.models.my_custom_tree;
                const treeVertices = treeModel.vertices.map((v, index) => {
                    if (index % 3 === 0) return v * 2.2 + (tree.x - Math.floor(tree.x / CHUNK_SIZE) * CHUNK_SIZE);
                    if (index % 3 === 1) return v * 2.2 - 0.1;
                    if (index % 3 === 2) return v * 2.2 + (tree.z - Math.floor(tree.z / CHUNK_SIZE) * CHUNK_SIZE);
                });
        
                mergedVertices.push(...treeVertices);
                mergedUV.push(...treeModel.uv);
                mergedIndices.push(...treeModel.indices.map(index => index + vertexOffset));
        
                vertexOffset += treeModel.vertices.length / 3;
            });
        
            // Add the merged chunk as a new model
            W.add(`tree_chunk_${chunkIndex}`, {
                vertices: mergedVertices,
                uv: mergedUV,
                indices: mergedIndices
            });
        
            // Render the chunk
            const [chunkX, chunkZ] = chunkKey.split(',').map(Number);
            W[`tree_chunk_${chunkIndex}`]({
                n: `tree_chunk_${chunkIndex}`,
                x: chunkX * CHUNK_SIZE,
                z: chunkZ * CHUNK_SIZE,
                y: 0,
                b: "000",
                s: 1
            });
        });
        

            // Create collectibles
            for(let i = 0; i < 26; i++) {  // Increased to 26 (13 of each type)
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.sqrt(Math.random()) * (forestRadius * 0.8);
                const x = Math.cos(angle) * distance;
                const z = Math.sin(angle) * distance;
                const isSpeedBoost = i >= 13; // First 13 are time boosts, next 13 are speed boosts
            
                collectibles.push({
                    x, 
                    z, 
                    collected: false,
                    type: isSpeedBoost ? 'speed' : 'time'
                });
                
                if (isSpeedBoost) {
                    W.sphere({
                        n: "collectible" + i,
                        size: .2,
                        x: x,
                        z: z,
                        y: 0.6,
                        b: "ff0000", // Red color for speed boost
                        s: 1
                    });
                } else {
                    W.cube({
                        n: "collectible" + i,
                        size: .2,
                        x: x,
                        z: z,
                        y: 0.4,
                        rx: 45,
                        ry: 45,
                        b: "c3e5b6",
                        s: 1
                    });
                }
            }
            function animateCollectibles() {
                const time = Date.now() * 0.001; // Current time in seconds
                collectibles.forEach((c, i) => {
                    if (!c.collected && c.type === 'time') {
                        const y = 0.4 + Math.sin(time + i) * 0.1; // Simple floating effect
                        const ry = (time * 30 + i * 30) % 360; // Simple rotation
                        W.move({
                            n: "collectible" + i,
                            y: y,
                            ry: ry
                        });
                    }
                });
            }
            function showCollectibleFeedback(text) {
                const feedback = document.createElement('div');
                feedback.textContent = text;
                feedback.style.position = 'absolute';
                feedback.style.left = '50%';
                feedback.style.top = '50%';
                feedback.style.transform = 'translate(-50%, -50%)';
                feedback.style.fontSize = '24px';
                feedback.style.fontWeight = 'bold';
                feedback.style.color = '#fff';
                feedback.style.opacity = '1';
                feedback.style.transition = 'all 1s ease-out';
                document.body.appendChild(feedback);
            
                setTimeout(() => {
                    feedback.style.opacity = '0';
                    feedback.style.transform = 'translate(-50%, -100%)';
                }, 50);
            
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 1050);
            }


    
    // Add the custom model to the framework
    W.add("my_custom_model", customModelEnemy);

        // Create enemies
        for(let i = 0; i < 13; i++) {  // Increased number of enemies
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.sqrt(Math.random()) * (forestRadius * 0.8);  // Keep enemies within 80% of forest radius
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            enemies.push({x, z, active: true});
            W.my_custom_model({
                n: "enemy" + i,
                size: .8,
                ry: 20,
                x: x,
                z: z,
                y: 0,
                b: "000",  // Red black for enemies
                s:1
            });
        }
    
    // Function to calculate the angle between two points
    function calculateAngle(x1, z1, x2, z2) {
        return Math.atan2(x2 - x1, z2 - z1) * (180 / Math.PI);
    }
        
        // Create ground plane
        function createLayeredFog(options = {}) {
        const {
            baseSize = canvas.width,
            layers = 8,
            startHeight = 0,
            totalHeight = 0.7,
            startOpacity = 0.5,
            endOpacity = 0.9,
            baseColor = "101010"
        } = options;
    
        const heightStep = totalHeight / layers;
        const opacityStep = (startOpacity - endOpacity) / (layers - 1);
    
        for (let i = 0; i < layers; i++) {
            const height = startHeight + (i * heightStep);
            const opacity = Math.max(0, Math.min(1, startOpacity - (i * opacityStep)));
            const hexOpacity = Math.floor(opacity * 255).toString(16).padStart(2, '0');
            
            W.plane({
                size: baseSize,
                b: `${baseColor}${hexOpacity}`,
                y: height,
                rx: -90,
            });
        }
    }
    
    // Usage in your initialization function
        function initScene() {
            W.cube({n:"player", size:.1, y:0.3, z:0,rx:-90, ry:0, b:"f00", s:1});
            // Set up camera
            W.camera({g:"player",z:5,y:0,rx:90}); // z 0 change it to first person
            // Set sky color (dark blue for night)
            W.clearColor("767872");

            // Create layered fog
            createLayeredFog({
                baseSize: canvas.width,
                layers: 20,
                startHeight: 0.02,
                totalHeight: 0.30,
                startOpacity: 0.08,
                endOpacity: 0.13,
            //   baseColor: "fff" //try 000000
            });
            createGrassField();
            W.light({x:.3,y:.3,z:.3});    
        }
        initScene();
        // Add this function to initialize the start screen
    function initStartScreen() {
        const startScreen = document.getElementById('startScreen');
        const startButton = document.getElementById('startButton');
        
        startButton.addEventListener('click', startGame);
        
        // Show the start screen
        startScreen.style.display = 'flex';
    }
    
    // Add this function to start the game
    function startGame() {

        gameState = {
            timeRemaining: MAX_TIME,
            isGameOver: false,
            hasWon: false
        };
        const startScreen = document.getElementById('startScreen');
        
        // Hide the start screen
        startScreen.style.display = 'none';
        
        // Start the game
        gameStarted = true;
    
        // Reset player state
        playerHealth = 100;
        X = 0;
        Z = 0;
        RY = 0;
        score = 0;

        updateHeartbeat();
        startCricketSounds();
        scheduleHorrorSound();
        PLAYER_SPEED = BASE_PLAYER_SPEED;
    
        // Reset player position
        W.move({n:"player", x: X, z:Z, ry: RY});
    
        // Reset tunnel vision
        updateTunnelVision(13000);
    
        // Reset collectibles 
        collectibles.forEach((c, i) => {
        c.collected = false;
        W.move({n: "collectible" + i, y: .4});
        });
    
        // Reset enemies
        enemies.forEach((e, i) => {
        e.active = true;
        W.move({n: "enemy" + i, y: 0});
        });
    
        // Lock the pointer
        canvas.requestPointerLock();
        // Start the game loop
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    // Add this new function to update displays
    function updateDisplays() {
        timerDisplay.textContent = `${(gameState.timeRemaining / 1000).toFixed(1)} 𝗦⃥𝗘⃥𝗖⃥𝗢⃥𝗡⃥𝗗⃥𝗦⃥ 𝗧⃥𝗢⃥ 𝗠⃥𝗜⃥𝗗⃥𝗡⃥𝗜⃥𝗚⃥𝗛⃥𝗧⃥`;
        healthFill.style.width = `${playerHealth}%`;
    }
    initStartScreen();

    document.addEventListener('pointerlockchange', handlePointerLock);
    document.addEventListener('mozpointerlockchange', handlePointerLock);
    document.addEventListener('webkitpointerlockchange', handlePointerLock);

    // Function to create a large grass texture
    function createLargeGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;  
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Draw grass blades
    for (let i = 0; i < 10000; i++) {  // More grass blades for density
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const height = 10 + Math.random() * 10;

        const gradient = ctx.createLinearGradient(x, y + height, x, y);
        gradient.addColorStop(0, '#ff00');
        gradient.addColorStop(1, '#401313');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10 + Math.random() * 9;

        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + (Math.random() - 0.9) * 50, y);
        ctx.stroke();
    }
    return canvas;
    }

    // Function to create a large grass field
    function createGrassField() {
    const grassTexture = createLargeGrassTexture();
    
    // Create a large plane for the grass field
    W.plane({
        size: 200,  // Adjust based on your desired field size
        y: .01,    // Slightly above ground to prevent z-fighting
        rx: -90,    // Flat on the ground
        t: grassTexture,
        n: "grassField"
    });
    }
        //initialize the game
        let gameState = {
        timeRemaining: 13000, // 13 sec in milisec
        isGameOver: false, 
        hasWon: false
        };

        // First, update your key state object to include WASD keys
    let keys = {u:0, d:0, l:0, r:0, w:0, s:0, a:0, d:0};

    // Update your key event listeners
    document.onkeydown = e => {
        if(e.key == "ArrowUp" || e.key.toLowerCase() == "w") keys.u = 1;
        if(e.key == "ArrowDown" || e.key.toLowerCase() == "s") keys.d = 1;
        if(e.key == "ArrowLeft" || e.key.toLowerCase() == "a") keys.l = 1;
        if(e.key == "ArrowRight" || e.key.toLowerCase() == "d") keys.r = 1;
    };

    document.onkeyup = e => {
        if(e.key == "ArrowUp" || e.key.toLowerCase() == "w") keys.u = 0;
        if(e.key == "ArrowDown" || e.key.toLowerCase() == "s") keys.d = 0;
        if(e.key == "ArrowLeft" || e.key.toLowerCase() == "a") keys.l = 0;
        if(e.key == "ArrowRight" || e.key.toLowerCase() == "d") keys.r = 0;
    };
        
        // Collision detection function
    function checkCollision(x, z, objects, playerRadius) {
        const combinedRadiusSquared = (TREE_COLLISION_RADIUS + playerRadius) ** 2;
        for (let obj of objects) {
            const dx = obj.x - x;
            const dz = obj.z - z;
            const distanceSquared = dx * dx + dz * dz;
            if (distanceSquared < combinedRadiusSquared) {
                return true;
            }
        }
        return false;
    }
    //playmusic
    function playHeartbeat() {
        zzfx(...[1,.1,400,,.01,,1,,-12,.2,-100,-1.12,.05,,,.1,.4,.7,.1]);
    }
    function playCricketSound() {
        zzfx(...[.5,,597,.01,.04,.09,1,2,-2,,372,.07,,,22,,,.67,,,880]); // Cricket sound
    }

    function playHorrorSound() {
        zzfx(...[.5,,64,.1,.33,.32,3,2.2,,13,,,.04,,.1,,.17,.63,.03,,143]); // Horror sound
    }
    function playButtonClickSound() {
        zzfx(...[.02,,840,,.03,.06,4,.1,,,-261,.06,,,,,.03,.52,.01,.35]);
    }
    function addButtonClickSounds() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', playButtonClickSound);
        });
    }
    addButtonClickSounds();
    startButton.addEventListener('click', () => {
        playButtonClickSound();
        startGame();
    });

    restartButton.addEventListener("click", () => {
        playButtonClickSound();
        gameOverScreen.style.display = "none";
        restartGame();
    });

    document.getElementById('playAgain').addEventListener('click', () => {
        playButtonClickSound();
        winGameScreen.style.display = "none";
        restartGame();
    });

    function calculateHeartbeatInterval(timeRemaining) {
        const timeProgress = 1 - (timeRemaining / MAX_TIME);
        return INITIAL_HEARTBEAT_DELAY - (INITIAL_HEARTBEAT_DELAY - FINAL_HEARTBEAT_DELAY) * timeProgress;
    }
    let nextHeartbeatTimeout;

    function updateHeartbeat() {
        if (nextHeartbeatTimeout) {
            clearTimeout(nextHeartbeatTimeout);
        }

        const currentInterval = calculateHeartbeatInterval(gameState.timeRemaining);

        playHeartbeat();
        scheduleNextHeartbeat(currentInterval);
    }

    function scheduleNextHeartbeat(delay) {
        nextHeartbeatTimeout = setTimeout(() => {
            if (!gameState.isGameOver && !gameState.hasWon) {
                playHeartbeat();
                const newDelay = calculateHeartbeatInterval(gameState.timeRemaining);
                scheduleNextHeartbeat(newDelay);
            }
        }, delay);
    }

    let cricketInterval;

    function startCricketSounds() {
        // Play cricket sounds randomly every 100ms to 2000ms
        cricketInterval = setInterval(() => {
            if (Math.random() < 0.1) { // Adjust this probability to control density of cricket sounds
                playCricketSound();
            }
        }, 300);
    }
    let horrorSoundTimeout;

    function scheduleHorrorSound() {
        const delay = 5000 + Math.random() * 10000; // Random delay between 5 to 15 seconds
        horrorSoundTimeout = setTimeout(() => {
            playHorrorSound();
            scheduleHorrorSound(); // Schedule the next horror sound
        }, delay);
    }
    function stopSounds() {
        if (cricketInterval) {
            clearInterval(cricketInterval);
            cricketInterval = null;
        }
        if (horrorSoundTimeout) {
            clearTimeout(horrorSoundTimeout);
            horrorSoundTimeout = null;
        }
        if (nextHeartbeatTimeout) {
            clearTimeout(nextHeartbeatTimeout);
            nextHeartbeatTimeout = null;
        }
    }
    function activateSpeedBoost() {
        if (!speedBoostActive) {
            PLAYER_SPEED = BASE_PLAYER_SPEED * SPEED_BOOST_MULTIPLIER;
        }
        
        speedBoostActive = true;

        if (speedBoostTimer) clearTimeout(speedBoostTimer);
        
        speedBoostTimer = setTimeout(() => {
            speedBoostActive = false;
            PLAYER_SPEED = BASE_PLAYER_SPEED;
        }, 2000); // 2 seconds duration
    }

    function updateDarkness(timeRemaining) {
        const cappedTime = Math.min(timeRemaining, MAX_TIME);
        const timeProgress = 1 - (cappedTime / MAX_TIME);
        
        // Calculate new ambient light
        const newAmbient = INITIAL_AMBIENT - (timeProgress * (INITIAL_AMBIENT - 0.010));
        W.ambient(newAmbient);
    }

    //calculate score function
    function calculateScore(timeRemaining, health) {
        let timeScore = Math.floor(timeRemaining / 10); // 1 second = 100 points, 0.01 seconds = 1 point
        let healthScore = Math.floor(health / 10) * 100; // Each 10 health = 100 points
        return timeScore + healthScore;
    }

        // Win condition check
        function checkWinCondition(x, z) {
        const distanceFromCenter = Math.sqrt(x*x + z*z);
        return distanceFromCenter > forestRadius;
    }

        //restart game function
        function restartGame() {
            stopSounds(); // Ensure all sounds are stopped before restarting
        
            gameState = {
                timeRemaining: MAX_TIME,
                isGameOver: false,
                hasWon: false
            };
            
            playerHealth = 100;
            X = 0;
            Z = 0;
            RY = 0;
            score = 0;
            PLAYER_SPEED = BASE_PLAYER_SPEED;
        speedBoostActive = false;
        if (speedBoostTimer) clearTimeout(speedBoostTimer);
        
            W.move({n:"player", x: X, z:Z, ry: RY});
            gameOverScreen.style.display = "none";
            winGameScreen.style.display = "none";
        
            // Reset tunnel vision
            updateTunnelVision(MAX_TIME);
        
            // Reset collectibles 
            collectibles.forEach((c, i) => {
                c.collected = false;
                const y = c.type === 'speed' ? 0.6 : 0.4;
                W.move({n: "collectible" + i, y: y});
            });
        
            // Reset enemies
            enemies.forEach((e, i) => {
                e.active = true;
                W.move({n: "enemy" + i, y: 0});
            });
        
            // Reset mouse look variables
            mouseX = 0;
            mouseY = 0;
        
            updateHeartbeat();
            startCricketSounds();
            scheduleHorrorSound();
            updateDisplays();
        
            // Ensure the game is marked as started
            gameStarted = true;
        
            // Reset the last time for delta time calculation
            lastTime = performance.now();
        
            // Lock the pointer
            canvas.requestPointerLock();
        
            // Restart the game loop
            requestAnimationFrame(gameLoop);
        }
        



        restartButton.addEventListener("click", () => {
            playButtonClickSound();
            restartGame();
        });
        
        playAgain.addEventListener("click", () => {
            playButtonClickSound();
            restartGame();
        });

    function handlePointerLock() {
        if (document.pointerLockElement === canvas) {
        
        } else {
            // Pointer is unlocked
            if (gameStarted && !gameState.isGameOver && !gameState.hasWon) {
                // If the game is running and not over, re-lock the pointer
                canvas.requestPointerLock();
            }
        }
    }



    // Mouse look variables
    let mouseX = 0;
    let mouseY = 0;

    function updatePlayerRotation() {
        W.move({
            n: "player",
            rx: -90 + mouseY * SENSITIVITY, // Adjust vertical look
            ry: mouseX * SENSITIVITY // Adjust horizontal look
        });
    }

    // Mouse move event listener
    document.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement === canvas) {
        mouseX -= event.movementX; // Inverted horizontal movement
        mouseY -= event.movementY; // Vertical movement remains the same


            // Clamp vertical rotation
            mouseY = Math.max(-180, Math.min(240, mouseY));

            updatePlayerRotation();
        }
    });

        // Lock pointer on click
        canvas.addEventListener('click', () => {
            if (gameStarted && !gameState.isGameOver && !gameState.hasWon) {
                canvas.requestPointerLock();
            }
        });


        let cameraShake = { x: 0, y: 0, z: 0, duration: 0 };

        function updateCameraShake(deltaTime) {
            if (cameraShake.duration > 0) {
                cameraShake.duration -= deltaTime;
                cameraShake.x = (Math.random() - 0.5) * SHAKE_INTENSITY;
                cameraShake.y = (Math.random() - 0.5) * SHAKE_INTENSITY;
                cameraShake.z = (Math.random() - 0.5) * SHAKE_INTENSITY;
                
                if (cameraShake.duration <= 0) {
                    cameraShake.x = 0;
                    cameraShake.y = 0;
                    cameraShake.z = 0;
                }
            }
        }
        function gameOver() {
            gameState.timeRemaining = 0;
            gameState.isGameOver = true;
            stopSounds(); 
            gameOverScreen.style.display = 'block';
            document.exitPointerLock();
            
            zzfx(...[.03,,167,.02,.46,.02,4,.1,-76,-25,279,.94,,,,,.27,.97,.48]); // gameover sound
        }
        
        function winGame() {
            gameState.hasWon = true;
            stopSounds();
            score = calculateScore(gameState.timeRemaining, playerHealth);
            const winGameScreen = document.getElementById('winGameScreen');
            const finalScore = document.getElementById('finalScore');
            
            finalScore.textContent = `𝗬⃥𝗢⃥𝗨⃥𝗥⃥ 𝗦⃥𝗖⃥𝗢⃥𝗥⃥𝗘⃥: ${score}`;
            
        
            winGameScreen.style.display = 'block';
            document.exitPointerLock();
            
            zzfx(...[.5,,699,.03,.2,.17,1,.7,,,,,.09,,,,.13,.98,.13,.39,-1499]);  // Win sound
        }

        let lastTime = performance.now();
        let frameCount = 0;
        function gameLoop(currentTime) {
            if (!gameStarted || gameState.isGameOver || gameState.hasWon) return;
        
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
        
            // Update timer
            gameState.timeRemaining -= deltaTime;
        
            if (gameState.timeRemaining <= 0 || playerHealth <= 0) {
                gameOver();
                return;
            }
        
            const isUnderAttack = enemies.some(e => {
                const dx = X - e.x;
                const dz = Z - e.z;
                return dx * dx + dz * dz < 0.25; // Square of 0.5
            });
            
            // Update game elements
            updateParticles(deltaTime, X, Z);
            updateDarkness(gameState.timeRemaining);
            updateTunnelVision(gameState.timeRemaining, isUnderAttack);
            updateCameraShake(deltaTime);
            updateDisplays();
        
            frameCount++;
            if (frameCount % 5 === 0) {
                animateCollectibles();
            }
        
            // Player movement
            let moveForward = (keys.u || keys.w) - (keys.d || keys.s);
            let moveSide = (keys.r || keys.d) - (keys.l || keys.a);
        
            if (moveForward !== 0 && moveSide !== 0) {
                moveForward *= 0.707;
                moveSide *= 0.707;
            }
        
            const playerRotationY = mouseX * SENSITIVITY;
            const rotationRadians = playerRotationY * Math.PI / 180;
            
            const dx = (-moveForward * Math.sin(rotationRadians) + moveSide * Math.cos(rotationRadians)) * PLAYER_SPEED;
            const dz = (-moveForward * Math.cos(rotationRadians) - moveSide * Math.sin(rotationRadians)) * PLAYER_SPEED;
            
            let newX = X + dx;
            let newZ = Z + dz;
        
            // Collision detection and movement
            if (!checkCollision(newX, newZ, trees, PLAYER_RADIUS)) {
                X = newX;
                Z = newZ;
            } else if (!checkCollision(newX, Z, trees, PLAYER_RADIUS)) {
                X = newX;
            } else if (!checkCollision(X, newZ, trees, PLAYER_RADIUS)) {
                Z = newZ;
            }
        
            // Update player position
            W.move({
                n: "player", 
                x: X + cameraShake.x, 
                y: playerBaseHeight + cameraShake.y,
                z: Z + cameraShake.z, 
                ry: playerRotationY
            });
        
            // Check win condition
            if (checkWinCondition(X, Z)) {
                winGame();
                return;
            }
        
            // Handle collectibles and enemies
            handleCollectibles();
            handleEnemies(deltaTime);
        
            requestAnimationFrame(gameLoop);
        }
        function handleCollectibles() {
            collectibles.forEach((c, i) => {
                if (!c.collected && checkCollision(X, Z, [c], 0.4)) {
                    c.collected = true;
                    if (c.type === 'time') {
                        gameState.timeRemaining += 5000;
                        showCollectibleFeedback("+5s");
                        zzfx(...[.5,,137,.07,.28,.13,1,.6,,198,,,.06,,,,,.67,.23,.47]);
                    } else if (c.type === 'speed') {
                        activateSpeedBoost();
                        showCollectibleFeedback("2x Speed!");
                        zzfx(...[.5,,106,.02,.15,.29,,1.1,,,,,.1,,.2,.2,.13,.64,.16,.44]);
                    } 
                    W.move({n: "collectible" + i, y: -1000});
                }
            });
        }
        
        function handleEnemies(deltaTime) {
            enemies.forEach((e, i) => {
                if (e.active) {
                    const dx = X - e.x;
                    const dz = Z - e.z;
                    const distanceSquared = dx * dx + dz * dz;
                    if (distanceSquared < 225) { 
                        const distance = Math.sqrt(distanceSquared);
                        const speed = 0.04;
                        e.x += dx / distance * speed;
                        e.z += dz / distance * speed;
        
                        const targetAngle = calculateAngle(e.x, e.z, X, Z);
                        e.currentAngle = e.currentAngle || 0;
                        let angleDiff = targetAngle - e.currentAngle;
                        if (angleDiff > 180) angleDiff -= 360;
                        if (angleDiff < -180) angleDiff += 360;
        
                        e.currentAngle += angleDiff * 4 * deltaTime / 1000;
                        e.currentAngle = (e.currentAngle + 360) % 360;
        
                        W.move({
                            n: "enemy" + i, 
                            x: e.x, 
                            z: e.z,
                            ry: e.currentAngle
                        });
        
                        if (checkCollision(X, Z, [e], 0.5)) {
                            const currentTime = Date.now();
                            if (!e.lastAttackTime || (currentTime - e.lastAttackTime) >= ATTACK_COOLDOWN) {
                                playerHealth = Math.max(0, playerHealth - 10);
                                updateDisplays();
                                zzfx(...[.5,,147,.01,.08,.21,1,2.2,-7,-2,,,,.3,2.9,.4,,.61,.08,,-2418]);
                                e.lastAttackTime = currentTime;
                                cameraShake.duration = SHAKE_DURATION;
        
                                if (playerHealth <= 0) {
                                    playerHealth = 0;
                                    gameOver();
                                    return;
                                }
        
                                e.x -= dx / distance * 0.8;
                                e.z -= dz / distance * 0.8;
                                W.move({n: "enemy" + i, x: e.x, z: e.z});
                            }
                        }
                    }
                }
            });
        }

        requestAnimationFrame(gameLoop);
        
    }

    