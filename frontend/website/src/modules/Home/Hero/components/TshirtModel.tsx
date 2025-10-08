import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function TshirtModel({ color, ...props }: { color: string }) {
  const { nodes, materials } = useGLTF("/shirt_baked_2.glb") as any;

  const modelRef = useRef<Group>(null);

  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [position, setPosition] = useState<[number, number, number]>([1, 1, 1]);

  useEffect(() => {
    function updateScale() {
      const width = window.innerWidth;
      if (width < 600) {
        setScale([13, 13, 13]);
        setPosition([0, -1, 0]);
      } else if (width < 1200) {
        setScale([12, 12, 12]);
        setPosition([0, 0, 0]);
      } else {
        setScale([12, 12, 12]);
        setPosition([0, 0, 0]);
      }
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    Object.values(materials).forEach((material: any) => {
      material.color.set(color);
    });
  }, [color, materials]);

  return (
    <group ref={modelRef} {...props} dispose={null} position={position} scale={scale}>
      <mesh
        geometry={(nodes as any).T_Shirt_male.geometry}
        material={(materials as any).lambert1}
        position={[0.419, -0.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/shirt_baked_2.glb");
