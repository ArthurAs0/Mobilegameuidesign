import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';

import kickerModelPath  from '@/assets/models/kicker.glb?url';
import keeperModelPath  from '@/assets/models/keeper_center.glb?url';
import keeperLModelPath from '@/assets/models/keeper_left.glb?url';
import keeperRModelPath from '@/assets/models/keeper_right.glb?url';
import ballPath         from '@/assets/models/ball.glb?url';
import goalPath         from '@/assets/models/goal.glb?url';
import idlePath         from '@/assets/models/standing_idle.glb?url';
import kickAnimPath     from '@/assets/models/soccer_penalty_kicker.glb?url';
import catchPath        from '@/assets/models/new_goalkeeper_catch_center.glb?url';

const ANIM = 'Armature|mixamo.com|Layer0';

;[kickerModelPath, keeperModelPath, keeperLModelPath, keeperRModelPath,
  ballPath, goalPath, idlePath, kickAnimPath, catchPath
].forEach(p => useGLTF.preload(p));

// ── ОТЛАДКА КАМЕРЫ ────────────────────────────────────────
function DebugCamera() {
  const cam = useControls('Camera', {
    posX: { value: 0, step: 0.1 },
    posY: { value: 2.0, step: 0.1 },
    posZ: { value: 12.0, step: 0.1 },
    lookX: { value: 0, step: 0.1 },
    lookY: { value: 0.5, step: 0.1 },
    lookZ: { value: 4.0, step: 0.1 },
  });

  useFrame(({ camera }) => {
    camera.position.set(cam.posX, cam.posY, cam.posZ);
    camera.lookAt(cam.lookX, cam.lookY, cam.lookZ);
  });

  return null;
}

// ── МЯЧ ──────────────────────────────────────────────────
interface Shot {
  targetX: number;
  power: number;
}

function Ball({ shot }: { shot: Shot | null }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  const { scene } = useGLTF(ballPath);
  const mesh = useMemo(() => scene.clone(true), [scene]);

  // Твои сохраненные значения для мяча
  const { bX, bY, bZ, bScale } = useControls('Ball', {
    bX: { value: 1, step: 0.1 },
    bY: { value: 0.15, step: 0.05 },
    bZ: { value: 5.5, step: 0.1 },
    bScale: { value: 1.25, step: 0.01 },
  });

  const startPos = useMemo(() => new THREE.Vector3(bX, bY, bZ), [bX, bY, bZ]);
  const getTarget = (tx: number) => new THREE.Vector3(tx, 1.1, -10.5);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!shot) {
      ref.current.position.lerp(startPos, 0.2);
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      t.current = 0;
      return;
    }
    t.current = Math.min(t.current + delta * 1.1, 1);
    const p = t.current;
    const target = getTarget(shot.targetX);
    const pos = new THREE.Vector3().lerpVectors(startPos, target, p);
    
    pos.y += Math.sin(p * Math.PI) * 2.2;
    ref.current.position.copy(pos);
    ref.current.rotation.x += 0.25;
    ref.current.rotation.z += 0.05;
  });

  return (
    <group ref={ref} scale={bScale}>
      <primitive object={mesh} castShadow />
    </group>
  );
}

// ── ВРАТАРЬ ───────────────────────────────────────────────
function Keeper({ aiDir, active }: { aiDir: 'left'|'center'|'right'; active: boolean }) {
  const group = useRef<THREE.Group>(null);

  // Выбираем файл в зависимости от того, куда бьет игрок
  const modelPath = aiDir === 'left' ? keeperLModelPath
    : aiDir === 'right' ? keeperRModelPath : keeperModelPath;

  const { scene, animations: diveAnimations } = useGLTF(modelPath);
  const { animations: idleAnimations } = useGLTF(idlePath);
  const { animations: catchAnimations } = useGLTF(catchPath);

  const { actions: diveActions } = useAnimations(diveAnimations, group);
  const { actions: idleActions } = useAnimations(idleAnimations, group);
  const { actions: catchActions } = useAnimations(catchAnimations, group);

  const { kX, kY, kZ, kRotY, kScale } = useControls('Keeper', {
    kX: { value: 0, step: 0.1 },
    kY: { value: -1.5, step: 0.1 },
    kZ: { value: -9.5, step: 0.1 },
    kRotY: { value: 0, step: 0.1, min: -Math.PI, max: Math.PI },
    kScale: { value: 1.0, step: 0.1 },
  });

  useEffect(() => {
    // УМНЫЙ ПОИСК АНИМАЦИИ: берем первую доступную из списка
    const idleAction = idleActions ? Object.values(idleActions)[0] : null;
    
    let currentDiveAction = null;

    if (aiDir === 'center') {
      currentDiveAction = (catchActions && Object.values(catchActions)[0]) || 
                          (diveActions && Object.values(diveActions)[0]); 
    } else {
      currentDiveAction = diveActions ? Object.values(diveActions)[0] : null;
    }

    // Если анимация не найдена, выводим ошибку в консоль, чтобы знать наверняка
    if (!idleAction || !currentDiveAction) {
      console.warn(`🚨 Анимация не найдена для направления: ${aiDir}. Проверь файл ${modelPath}`);
      return;
    }

    if (active) {
      // Прыжок
      idleAction.fadeOut(0.2);
      currentDiveAction.reset().setLoop(THREE.LoopOnce, 1);
      currentDiveAction.clampWhenFinished = true;
      currentDiveAction.fadeIn(0.2).play();
    } else {
      // Стойка
      currentDiveAction.fadeOut(0.2);
      idleAction.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.2).play();
    }

    return () => {
      if (currentDiveAction) currentDiveAction.stop();
      if (idleAction) idleAction.stop();
    };
  }, [active, aiDir, diveActions, idleActions, catchActions, modelPath]);

  return (
    <group ref={group} position={[kX, kY, kZ]} rotation={[0, kRotY, 0]} scale={kScale}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
}

// ── КИКЕР ─────────────────────────────────────────────────
function Kicker({ kicking }: { kicking: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(kickerModelPath);
  
  const { animations: ia } = useGLTF(idlePath);
  const { actions: idleA } = useAnimations(ia, group);
  const { animations: ka } = useGLTF(kickAnimPath);
  const { actions: kickA } = useAnimations(ka, group);

  // Твои сохраненные значения для кикера
  const { pX, pY, pZ, pRotY, pScale } = useControls('Player', { 
    pX: { value: 0, step: 0.1 },
    pY: { value: -1.5, step: 0.1 },
    pZ: { value: 6.5, step: 0.1 },
    pRotY: { value: Math.PI, step: 0.1, min: -Math.PI, max: Math.PI },
    pScale: { value: 1.5, step: 0.1 }
  });

  useEffect(() => {
    const idle = idleA[ANIM];
    const kick = kickA[ANIM];
    if (!idle || !kick) return;

    if (kicking) {
      idle.fadeOut(0.1);
      kick.reset().setLoop(THREE.LoopOnce, 1);
      kick.clampWhenFinished = true;
      kick.fadeIn(0.1).play();
    } else {
      kick.fadeOut(0.15);
      idle.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.2).play();
    }
  }, [kicking, idleA, kickA]);

  return (
    <group ref={group} position={[pX, pY, pZ]} rotation={[0, pRotY, 0]} scale={pScale}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
}

// ── ПОЛЕ И ВОРОТА ─────────────────────────────────────────
function Goal() {
  const { scene } = useGLTF(goalPath);
  const mesh = useMemo(() => scene.clone(true), [scene]);

  // Твои сохраненные значения для ворот
  const { gX, gY, gZ, gRotY, gScale } = useControls('Goal', {
    gX: { value: 0, step: 0.1 },
    gY: { value: -1.5, step: 0.1 },
    gZ: { value: -11, step: 0.1 },
    gRotY: { value: 0, step: 0.1, min: -Math.PI, max: Math.PI },
    gScale: { value: 2.0, step: 0.1 },
  });

  return (
    <primitive 
      object={mesh} 
      position={[gX, gY, gZ]} 
      rotation={[0, gRotY, 0]} 
      scale={gScale} 
      castShadow 
      receiveShadow 
    />
  );
}

function Field() {
  return (
    <>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a5c28" roughness={0.95} />
      </mesh>
      {[-4,-3,-2,-1,0,1,2,3,4].map(i => (
        <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={[i*5, -1.498, 0]}>
          <planeGeometry args={[5, 100]} />
          <meshStandardMaterial color={i%2===0?'#185425':'#1d6630'} roughness={0.95}/>
        </mesh>
      ))}
      {([
        { p:[0,-1.494,-7.5] as [number,number,number], s:[16,0.1] as [number,number] },
        { p:[0,-1.494, 4.5] as [number,number,number], s:[16,0.1] as [number,number] },
        { p:[-8,-1.494,-1.5] as [number,number,number], s:[0.1,12] as [number,number] },
        { p:[ 8,-1.494,-1.5] as [number,number,number], s:[0.1,12] as [number,number] },
      ]).map(({p,s},i) => (
        <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={p}>
          <planeGeometry args={s}/>
          <meshStandardMaterial color="#fff" transparent opacity={0.5}/>
        </mesh>
      ))}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -1.493, 5.5]}>
        <circleGeometry args={[0.15, 20]}/>
        <meshStandardMaterial color="#fff" transparent opacity={0.7}/>
      </mesh>
    </>
  );
}

// ── GAME ARENA (ОСНОВНОЙ КОМПОНЕНТ) ───────────────────────
interface GameArenaProps {
  result: string | null;
  playerChoice: string | null;
  aiChoice: string | null;
  homeScore: number;
  awayScore: number;
}

export function GameArena({ result, playerChoice, aiChoice }: GameArenaProps) {
  const [shot, setShot] = useState<Shot | null>(null);
  const [kicking, setKicking] = useState(false);
  const [keeperActive, setKeeperActive] = useState(false);
  const [showResultVisual, setShowResultVisual] = useState(false);
  const [lastResult, setLastResult] = useState<string|null>(null);

  const aiDir = (aiChoice ?? 'center') as 'left'|'center'|'right';
  const visualKeeperDir = aiDir === 'left' ? 'right' : aiDir === 'right' ? 'left' : 'center';

  useEffect(() => {
    if (result && result !== 'waiting' && result !== 'idle') {
      setLastResult(result);
      
      setKicking(true);
      setKeeperActive(true);

      const targetX = playerChoice === 'left' ? -2.5
        : playerChoice === 'right' ? 2.5
        : 0;

      const shotTimeout = setTimeout(() => {
        setShot({ targetX, power: 1.5 });
      }, 500);

      const showUiTimeout = setTimeout(() => {
        setShowResultVisual(true);
      }, 1500);

      const hideUiTimeout = setTimeout(() => {
        setShowResultVisual(false);
      }, 3500);
      
      const resetSceneTimeout = setTimeout(() => {
        setKicking(false);
        setKeeperActive(false);
        setShot(null);
      }, 4000);

      return () => {
        clearTimeout(shotTimeout);
        clearTimeout(showUiTimeout);
        clearTimeout(hideUiTimeout);
        clearTimeout(resetSceneTimeout);
      }
    }
  }, [result, playerChoice, aiDir]);

  const isGoal = lastResult === 'goal';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      zIndex: 0, background: '#0a1628',
    }}>
      <Canvas shadows gl={{ antialias: true }} fov={50} near={0.1} far={300}>
        <DebugCamera />
        
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[5, 15, 8]} intensity={2.0} castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048}
          shadow-camera-left={-20} shadow-camera-right={20}
          shadow-camera-top={20} shadow-camera-bottom={-20}
          shadow-camera-far={60}
        />
        <directionalLight position={[-6, 8, -4]} intensity={0.5} color="#b0d4ff" />
        <hemisphereLight args={['#a8d0ff', '#1a5c25', 0.4]} />
        <Environment preset="dawn" />

        <Field />

        <Suspense fallback={null}>
          <Goal />
        </Suspense>

        <Suspense fallback={null}>
          <Kicker kicking={kicking} />
          <Keeper key={visualKeeperDir} aiDir={visualKeeperDir} active={keeperActive} />
        </Suspense>

        <Suspense fallback={null}>
          <Ball shot={shot} />
        </Suspense>

        <ContactShadows position={[0,-1.49,0]} opacity={0.6} scale={40} blur={2} far={14} />
      </Canvas>

      {showResultVisual && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div
            className={`flex flex-col items-center gap-3 px-16 py-8 rounded-3xl border backdrop-blur-md ${
              isGoal
                ? 'bg-green-500/15 border-green-400/40 shadow-[0_0_100px_rgba(74,222,128,0.45)]'
                : 'bg-red-500/15 border-red-400/40 shadow-[0_0_100px_rgba(248,113,113,0.45)]'
            }`}
            style={{ animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
          >
            <span style={{ fontSize: '80px' }}>{isGoal ? '⚽' : '🧤'}</span>
            <span className={`text-6xl font-black italic tracking-widest uppercase ${isGoal?'text-green-300':'text-red-300'}`}>
              {isGoal ? 'GOAL!' : 'SAVED!'}
            </span>
          </div>
          <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.55)}to{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}
    </div>
  );
}