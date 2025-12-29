---
title: "FPS Engine Framework(Place Holder)"
description: "A high-performance gun system with server-side validation and lag compensation."
image: "../../assets/projects/cover.jpg"
video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
role: "Lead Scripter"
gameLink: "https://www.roblox.com/games/123456789"
genre: "FPS / Shooter"
stack: ["Luau", "FastCast", "Maid", "Rojo"]
order: 2
---

# Overview
This framework was designed to handle 100+ concurrent players with minimal server lag. It features a modular attachment system and realistic recoil patterns.

## Shooting System Demo
Below is a demonstration of the hit-scan validation and recoil mechanics.

<video controls autoplay loop muted playsinline>
  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Key Features
- **Lag Compensation**: Custom rollback netcode to ensure fair play.
- **Security**: Server-side sanity checks for fire rate, ammo, and spread.
- **Modularity**: Guns are defined via ModuleScripts, making it easy for builders to add new weapons.