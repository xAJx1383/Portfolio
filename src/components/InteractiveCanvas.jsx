import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function InteractiveCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const isMobile = window.innerWidth < 768;
    const SHARD_COUNT = isMobile ? 150 : 400; 
    const COLORS = {
      bg: 0x1e1e1e,
      primary: new THREE.Color(0x0085ff),
      accent: new THREE.Color(0x69b4ff),
      white: new THREE.Color(0xe1ffff)
    };

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1e1e1e, 0.02);
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x1e1e1e, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(0.7, 0); 
    const material = new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 2,
      ior: 1.5,
      clearcoat: 1.0,
      flatShading: true,
      transparent: true,
    });
    
    const mesh = new THREE.InstancedMesh(geometry, material, SHARD_COUNT);
    const dummy = new THREE.Object3D();
    const shardData = [];

    /* BEGIN CHANGES: Hollow Tunnel Distribution Helper */
    const getHollowPosition = () => {
      // Create a "Safe Zone" in the center (X and Y between -6 and 6)
      // Shards will only spawn in the "outer" area
      let x = (Math.random() - 0.5) * 60;
      let y = (Math.random() - 0.5) * 60;

      // If both X and Y are too close to center, push them out
      if (Math.abs(x) < 8 && Math.abs(y) < 8) {
        x += x > 0 ? 10 : -10;
        y += y > 0 ? 10 : -10;
      }
      return { x, y };
    };
    /* END CHANGES */

    // --- Initial Distribution ---
    for (let i = 0; i < SHARD_COUNT; i++) {
      const pos = getHollowPosition();
      shardData.push({
        x: pos.x,
        y: pos.y,
        z: Math.random() * -150 + 40, 
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        rotSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01),
        scale: Math.random() * 0.4 + 0.2
      });
    }
    scene.add(mesh);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
    scene.add(hemiLight);

    const coreLight = new THREE.PointLight(COLORS.primary, 15, 60);
    scene.add(coreLight);

    let targetScroll = 0;
    let currentScroll = 0;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = window.scrollY / (maxScroll || 1);
    };
    window.addEventListener('scroll', handleScroll);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const deltaScroll = targetScroll - currentScroll;
      currentScroll += deltaScroll * 0.05;
      const rawVelocity = Math.abs(deltaScroll);
      scrollVelocity += (rawVelocity - scrollVelocity) * 0.05;

      // Dynamic Theming
      if (currentScroll < 0.5) {
        coreLight.color.lerpColors(COLORS.primary, COLORS.accent, currentScroll * 2);
      } else {
        coreLight.color.lerpColors(COLORS.accent, COLORS.white, (currentScroll - 0.5) * 2);
      }

      material.emissive = coreLight.color;
      material.emissiveIntensity = Math.min(0.1 + (scrollVelocity * 10), 1.0);

      // --- Infinite Fly-Through with Safe Zone ---
      for (let i = 0; i < SHARD_COUNT; i++) {
        const data = shardData[i];
        data.z += 0.05 + (scrollVelocity * 1.5);

        /* BEGIN CHANGES: Safe Zone Recycling */
        if (data.z > 45) {
          const newPos = getHollowPosition();
          data.z = -110; 
          data.x = newPos.x;
          data.y = newPos.y;
        }
        /* END CHANGES */

        data.rotation.x += data.rotSpeed.x;
        data.rotation.y += data.rotSpeed.y;

        dummy.position.set(data.x, data.y, data.z);
        dummy.rotation.copy(data.rotation);
        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ 
      width: '100%', height: '100%', 
      background: '#1e1e1e', position: 'fixed', 
      top: 0, left: 0, zIndex: -1 
    }} />
  );
}