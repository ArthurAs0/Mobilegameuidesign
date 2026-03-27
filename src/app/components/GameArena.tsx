import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// модели
import kickerPath  from '@/assets/models/kicker.glb';
import keeperCPath from '@/assets/models/keeper_center.glb';
import keeperLPath from '@/assets/models/keeper_left.glb';
import keeperRPath from '@/assets/models/keeper_right.glb';
import ballPath    from '@/assets/models/ball.glb';
import goalPath    from '@/assets/models/goal.glb';


// 🔹 универсальная модель
function AnimatedModel({ path, position, scale, rotation = [0,0,0], animationName }: any) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animationName && actions[animationName]) {
      actions[animationName].reset().fadeIn(0.2).play();
      actions[animationName].clampWhenFinished = true;
    }
  }, [actions, animationName]);

  return <primitive ref={group} object={scene} position={position} scale={scale} rotation={rotation} castShadow />;
}


// ⚽ МЯЧ С ФИЗИКОЙ
function SoccerBall({ result, shot }: any) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  const start = new THREE.Vector3(0, -1.2, 5);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (result === 'waiting' || !shot) {
      ref.current.position.copy(start);
      ref.current.rotation.set(0,0,0);
      t.current = 0;
      return;
    }

    t.current += delta * shot.power * 0.8;

    const progress = Math.min(t.current, 1);

    // парабола
    const pos = new THREE.Vector3().lerpVectors(start, shot.target, progress);
    pos.y += Math.sin(progress * Math.PI) * shot.power * 2;

    ref.current.position.copy(pos);

    // вращение
    ref.current.rotation.x += 0.3 * shot.power;
    ref.current.rotation.y += 0.1;
  });

  return (
    <group ref={ref}>
      <Suspense fallback={null}>
        <AnimatedModel path={ballPath} scale={2} />
      </Suspense>
    </group>
  );
}


// 🧤 AI ВРАТАРЬ
function Goalie({ result, shot }: any) {
  const choice = useMemo(() => {
    if (!shot) return 'center';

    // пытается угадать (но не всегда)
    const rand = Math.random();

    if (rand < 0.6) {
      if (shot.target.x < -1) return 'left';
      if (shot.target.x > 1) return 'right';
      return 'center';
    }

    return ['left','right','center'][Math.floor(Math.random()*3)];
  }, [shot]);

  let anim = 'Idle';
  if (result !== 'waiting') {
    if (choice === 'left') anim = 'DiveLeft';
    if (choice === 'right') anim = 'DiveRight';
    if (choice === 'center') anim = 'DiveCenter';
  }

  const path = choice === 'left' ? keeperLPath : choice === 'right' ? keeperRPath : keeperCPath;

  return (
    <Suspense fallback={null}>
      <AnimatedModel path={path} position={[0,-1.5,-11.5]} scale={2.2} animationName={anim} />
    </Suspense>
  );
}


// 👟 ИГРОК
function Kicker({ result }: any) {
  const anim = result !== 'waiting' ? 'Kick' : 'Idle';

  return (
    <Suspense fallback={null}>
      <AnimatedModel path={kickerPath} position={[0,-1.5,7.5]} scale={2.2} rotation={[0,Math.PI,0]} animationName={anim} />
    </Suspense>
  );
}


// 🎮 ОСНОВНОЙ КОМПОНЕНТ
export function GameArena() {
  const [shot, setShot] = useState<any>(null);
  const [result, setResult] = useState('waiting');

  const pressTime = useRef(0);

  return (
    <div className="w-full h-full bg-slate-950 relative">
      <Canvas
        shadows
        camera={{ position: [0, 4, 16], fov: 40 }}

        onPointerDown={() => {
          pressTime.current = Date.now();
        }}

        onPointerUp={(e) => {
          const hold = (Date.now() - pressTime.current) / 1000;

          // сила
          const power = Math.min(hold * 2, 2);

          // координата клика
          const p = e.point;

          // accuracy (ошибка)
          const spread = (2 - power) * 1.5;

          const target = new THREE.Vector3(
            THREE.MathUtils.clamp(p.x + (Math.random()-0.5)*spread, -6, 6),
            THREE.MathUtils.clamp(p.y + (Math.random()-0.5)*spread, 0.5, 4),
            -13
          );

          setShot({ target, power });

          // результат
          const isGoal = Math.random() > 0.35;
          setResult(isGoal ? 'goal' : 'save');

          // сброс через 3 сек
          setTimeout(() => {
            setResult('waiting');
            setShot(null);
          }, 3000);
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10,20,10]} intensity={1.8} castShadow />
        <Environment preset="sunset" />

        <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.5,0]} receiveShadow>
          <planeGeometry args={[150,150]} />
          <meshStandardMaterial color="#1a4d1a" />
        </mesh>

        <Suspense fallback={null}>
          <AnimatedModel path={goalPath} position={[0,-1.5,-13]} scale={[2.4,3.5,1]} />
        </Suspense>

        <Kicker result={result} />
        <Goalie result={result} shot={shot} />
        <SoccerBall result={result} shot={shot} />

        <ContactShadows opacity={0.45} scale={30} blur={2} far={15} />
      </Canvas>

      {/* UI */}
      {result !== 'waiting' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-8xl font-black ${
            result === 'goal' ? 'text-green-400' : 'text-red-500'
          }`}>
            {result === 'goal' ? 'GOAL ⚽' : 'SAVED 🧤'}
          </div>
        </div>
      )}
    </div>
  );
}