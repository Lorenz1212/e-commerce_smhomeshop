import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

export function SofaModel({ color, ...props }: { color: string }) {
  const { nodes, materials } = useGLTF("/models/couch-draco.glb") as any;
  const modelRef = useRef<Group>(null);

  // Optional: change material color dynamically
  if (materials?.wire_000000000 && color) {
    materials.wire_000000000.color.set(color);
  }

  return (
    <group ref={modelRef} {...props}>
      <mesh
        geometry={nodes.couch_01.geometry}
        material={materials.wire_000000000}
        rotation={[0, 0, 0]}
        scale={0.008} 
        position={[0, -4, 2]}
      />
    </group>
  );
}
