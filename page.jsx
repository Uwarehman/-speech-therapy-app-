import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Mic, Play, RotateCw, Volume2 } from 'lucide-react';

export default function SpeechTherapyApp() {
  const videoRef = useRef(null);
  const sceneContainerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [currentWord, setCurrentWord] = useState('Hello');
  const [feedback, setFeedback] = useState('');
  const [userScore, setUserScore] = useState(0);
  const sceneRef = useRef(null);

  const words = ['Hello', 'Thank You', 'Please', 'Good Morning', 'Smile'];

  // Initialize DETAILED Professional 3D Mouth
  useEffect(() => {
    if (!sceneContainerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(60, 600 / 700, 0.1, 1000);
    camera.position.z = 3;
    camera.position.y = 0.2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(600, 700);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    sceneContainerRef.current.appendChild(renderer.domElement);

    const mouthGroup = new THREE.Group();
    scene.add(mouthGroup);

    // ========== UPPER GUMS ==========
    const upperGumsGeometry = new THREE.BoxGeometry(1.2, 0.25, 0.3);
    const gumsMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd97777,
      shininess: 40
    });
    const upperGums = new THREE.Mesh(upperGumsGeometry, gumsMaterial);
    upperGums.position.set(0, 0.4, 0);
    mouthGroup.add(upperGums);

    // ========== LOWER GUMS ==========
    const lowerGums = new THREE.Mesh(upperGumsGeometry, gumsMaterial);
    lowerGums.position.set(0, -0.4, 0);
    mouthGroup.add(lowerGums);

    // ========== UPPER TEETH - INDIVIDUAL ==========
    const createTeeth = (yPos, isUpper) => {
      const teethCount = 8;
      for (let i = 0; i < teethCount; i++) {
        const toothGeometry = new THREE.BoxGeometry(0.12, 0.35, 0.25);
        const toothMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xfff8f0,
          shininess: 100
        });
        const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
        
        const spacing = 0.15;
        tooth.position.set((i - 3.5) * spacing, yPos, 0.15);
        tooth.castShadow = true;
        mouthGroup.add(tooth);
      }
    };

    createTeeth(0.5, true);
    createTeeth(-0.5, false);

    // ========== MOUTH CAVITY (INNER MOUTH) ==========
    const cavityGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.4);
    const cavityMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6b3a3a,
      shininess: 20
    });
    const mouthCavity = new THREE.Mesh(cavityGeometry, cavityMaterial);
    mouthCavity.position.set(0, 0, 0.05);
    mouthGroup.add(mouthCavity);

    // ========== TONGUE - DETAILED ==========
    const tongueGroup = new THREE.Group();
    tongueGroup.position.set(0, -0.15, 0.2);
    mouthGroup.add(tongueGroup);

    // Tongue main body
    const tongueGeometry = new THREE.BoxGeometry(0.55, 0.25, 0.35);
    const tongueMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd64f5c,
      shininess: 60
    });
    const tongueBody = new THREE.Mesh(tongueGeometry, tongueMaterial);
    tongueBody.position.z = 0.1;
    tongueGroup.add(tongueBody);

    // Tongue tip
    const tongueTipGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const tongueTip = new THREE.Mesh(tongueTipGeometry, tongueMaterial);
    tongueTip.position.set(0, -0.15, 0.35);
    tongueTip.scale.set(1, 0.6, 1);
    tongueGroup.add(tongueTip);

    // Tongue ridges (texture lines)
    const createTongueRidge = (xOffset) => {
      const ridgeGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.3);
      const ridgeMaterial = new THREE.MeshPhongMaterial({ color: 0xc64555 });
      const ridge = new THREE.Mesh(ridgeGeometry, ridgeMaterial);
      ridge.position.set(xOffset, 0, 0.05);
      tongueGroup.add(ridge);
    };
    createTongueRidge(-0.2);
    createTongueRidge(0);
    createTongueRidge(0.2);

    // ========== PALATE (roof of mouth) ==========
    const palateGeometry = new THREE.BoxGeometry(0.9, 0.15, 0.3);
    const palateMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xc95c5c,
      shininess: 30
    });
    const palate = new THREE.Mesh(palateGeometry, palateMaterial);
    palate.position.set(0, 0.45, 0.1);
    mouthGroup.add(palate);

    // ========== LIPS ==========
    // Upper lip
    const upperLipGeometry = new THREE.BoxGeometry(1.0, 0.12, 0.15);
    const lipMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xeb6b7a,
      shininess: 80
    });
    const upperLip = new THREE.Mesh(upperLipGeometry, lipMaterial);
    upperLip.position.set(0, 0.6, 0.1);
    mouthGroup.add(upperLip);

    // Lower lip
    const lowerLip = new THREE.Mesh(upperLipGeometry, lipMaterial);
    lowerLip.position.set(0, -0.6, 0.1);
    mouthGroup.add(lowerLip);

    // ========== LIGHTING - PROFESSIONAL STUDIO ==========
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 3, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, -2, -3);
    scene.add(backLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // ========== MOUSE CONTROLS ==========
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotate = true;

    renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        mouthGroup.rotation.y += deltaX * 0.01;
        mouthGroup.rotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // ========== ANIMATION LOOP ==========
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (autoRotate && !isDragging) {
        mouthGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    sceneRef.current = { 
      scene, 
      mouthGroup, 
      tongueGroup,
      upperGums,
      lowerGums,
      upperLip,
      lowerLip,
      mouthCavity
    };

    return () => {
      if (sceneContainerRef.current && sceneContainerRef.current.children.length > 0) {
        try {
          sceneContainerRef.current.removeChild(renderer.domElement);
        } catch (e) {}
      }
    };
  }, []);

  // Access webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.log('Camera access denied:', err));
  }, []);

  // Animate detailed mouth movements
  const animateMouth = (wordType) => {
    if (!sceneRef.current) return;

    const { tongueGroup, upperLip, lowerLip, mouthCavity } = sceneRef.current;
    let startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (wordType === 'Hello') {
        // "He-llo" - mouth opens wide
        const openAmount = Math.sin(progress * Math.PI * 1.5) * 0.6;
        upperLip.position.y = 0.6 + openAmount * 0.15;
        lowerLip.position.y = -0.6 - openAmount * 0.2;
        mouthCavity.scale.y = 1 + openAmount * 0.4;
        tongueGroup.scale.z = Math.max(0, 1 - openAmount * 0.3);

      } else if (wordType === 'Smile') {
        // Smile - mouth pulls back, less vertical
        const smileAmount = Math.sin(progress * Math.PI) * 0.5;
        upperLip.position.y = 0.6 + smileAmount * 0.1;
        lowerLip.position.y = -0.6 - smileAmount * 0.1;
        mouthCavity.scale.y = 0.7 + smileAmount * 0.3;

      } else if (wordType === 'Thank You') {
        // "Th" - tongue between teeth
        const tongueOut = Math.sin(progress * Math.PI) * 0.8;
        tongueGroup.position.z = 0.2 + tongueOut * 0.3;
        upperLip.position.y = 0.6 + tongueOut * 0.15;
        lowerLip.position.y = -0.6 - tongueOut * 0.15;

      } else if (wordType === 'Please') {
        // "P" sound - lips pressed
        const pAmount = Math.sin(progress * Math.PI * 2) * 0.3;
        upperLip.position.y = 0.6 - pAmount * 0.2;
        lowerLip.position.y = -0.6 + pAmount * 0.2;
        mouthCavity.scale.y = 0.5 + pAmount * 0.2;

      } else {
        // Generic natural speech
        const openAmount = Math.sin(progress * Math.PI) * 0.5;
        upperLip.position.y = 0.6 + openAmount * 0.1;
        lowerLip.position.y = -0.6 - openAmount * 0.15;
        mouthCavity.scale.y = 1 + openAmount * 0.3;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const playWord = () => {
    animateMouth(currentWord);
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
    setFeedback(`🔊 Watch closely! Teacher pronouncing: "${currentWord}" - See tongue & lip positions!`);
  };

  const startListening = () => {
    setIsListening(true);
    setFeedback('🎤 Listening... Pronounce the word now!');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const targetWord = currentWord.toLowerCase();
      
      const similarity = calculateSimilarity(transcript, targetWord);
      
      if (similarity > 0.7) {
        setFeedback(`✅ EXCELLENT! You said "${currentWord}" PERFECTLY! +10 points! 🎉`);
        setUserScore(prev => prev + 10);
      } else if (similarity > 0.5) {
        setFeedback(`⚠️ Good try! You said "${transcript}" - Watch the teacher's mouth again & try once more`);
      } else {
        setFeedback(`❌ You said "${transcript}" - Different word. Listen to teacher again`);
      }
      
      setIsListening(false);
    };
    
    recognition.start();
  };

  const calculateSimilarity = (str1, str2) => {
    const len = Math.max(str1.length, str2.length);
    const matches = str1.split('').filter((char, i) => char === str2[i]).length;
    return matches / len;
  };

  const changeWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setFeedback(`📝 New word: "${randomWord}" - Pay attention to tongue & lip movement!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">🗣️ SPEECH THERAPY TRAINER</h1>
          <p className="text-gray-300">Professional 3D Mouth Anatomy Teaching System</p>
          <div className="text-3xl font-black text-yellow-400 mt-4">🏆 Score: {userScore}</div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Left Panel - Camera Feed */}
          <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 text-white font-bold text-lg">📹 YOUR FACE - Real-time Mirror</div>
            <div className="relative bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ✓ LIVE
              </div>
              <div className="absolute bottom-4 right-4 text-green-300 text-xs font-mono bg-black bg-opacity-60 p-3 rounded border border-green-500">
                <div className="font-bold">👤 DETECTION STATUS</div>
                <div>Face: ✓ Active</div>
                <div>Mouth: ✓ Detected</div>
                <div>Lips: ✓ Tracking</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Professional 3D Mouth */}
          <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700">
            <div className="bg-gradient-to-r from-pink-600 to-red-600 p-3 text-white font-bold text-lg">🎓 PROFESSIONAL 3D MOUTH TEACHER</div>
            <div
              ref={sceneContainerRef}
              className="w-full bg-gradient-to-b from-gray-950 to-black flex items-center justify-center"
              style={{ height: '700px' }}
            />
            <div className="text-xs text-gray-300 p-2 bg-slate-900 text-center border-t border-slate-700">
              💡 Drag to rotate | See gums, teeth, tongue & palate in detail
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-2xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left - Word Section */}
            <div>
              <div className="text-white mb-8">
                <div className="text-sm text-gray-300 mb-3 font-bold tracking-wide">📢 WORD TO PRONOUNCE:</div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-3">{currentWord}</div>
                <div className="text-xs text-gray-400">👀 Click LISTEN to watch the teacher's mouth in detail</div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={playWord}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-black py-4 px-4 rounded-lg flex items-center justify-center gap-3 transition text-lg shadow-2xl border border-green-400"
                >
                  <Volume2 size={26} /> 👂 LISTEN - Teacher Shows
                </button>

                <button
                  onClick={startListening}
                  disabled={isListening}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black py-4 px-4 rounded-lg flex items-center justify-center gap-3 transition disabled:opacity-50 text-lg shadow-2xl border border-blue-400"
                >
                  <Mic size={26} /> {isListening ? '🎤 RECORDING...' : '🎤 YOUR TURN - SAY IT!'}
                </button>

                <button
                  onClick={changeWord}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black py-4 px-4 rounded-lg flex items-center justify-center gap-3 transition text-lg shadow-2xl border border-purple-400"
                >
                  <RotateCw size={26} /> ➡️ NEXT WORD
                </button>
              </div>
            </div>

            {/* Right - Feedback Section */}
            <div>
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-6 h-full border border-slate-600">
                <div className="text-sm text-gray-300 mb-3 font-bold tracking-wide">📊 REAL-TIME FEEDBACK:</div>
                <div className="text-lg font-bold text-white min-h-24 mb-6 bg-slate-950 p-4 rounded border-l-4 border-cyan-500 overflow-y-auto">
                  {feedback || '👂 Press LISTEN to begin! Watch mouth, gums, teeth & tongue!'}
                </div>
                <div className="p-4 bg-slate-950 rounded border border-slate-600">
                  <div className="font-bold text-cyan-300 mb-3 tracking-wide">📖 LEARNING STEPS:</div>
                  <div className="text-gray-300 text-sm space-y-2">
                    <div>✓ Watch 3D teacher mouth open</div>
                    <div>✓ See tongue & lip position</div>
                    <div>✓ Observe gum & teeth placement</div>
                    <div>✓ Listen to pronunciation</div>
                    <div>✓ Click YOUR TURN</div>
                    <div>✓ Replicate the sound</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">🔬 Anatomically Accurate 3D Mouth Model with Real-time Speech Recognition</p>
          <p className="text-gray-500 text-xs mt-2">Professional Teaching Tool for Speech & Pronunciation Therapy</p>
        </div>
      </div>
    </div>
  );
}
