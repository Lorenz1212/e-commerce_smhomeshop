// SofaModel.tsx
import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { MeshStandardMaterial, Color } from "three";

type SofaModelProps = {
  src: string; // path to .glb/.gltf
  color?: string; // hex or css color
  castShadow?: boolean;
  receiveShadow?: boolean;
  scale?: number;
};

export const SofaModel: React.FC<SofaModelProps> = ({ src, color = "#b5651d", castShadow = true, receiveShadow = true, scale = 1 }) => {
  // useGLTF caches automatically
  const gltf = useGLTF(src) as any;
  const group = useRef<HTMLDivElement | null>(null);

  // create a material with your color to override model materials (if desired)
  const overrideMat = useMemo(() => new MeshStandardMaterial({ color: new Color(color), metalness: 0.1, roughness: 0.6 }), [color]);

  return (
    <group ref={group} scale={[scale, scale, scale]} dispose={null}>
      {/* If your glTF contains a scene with child meshes */}
      {gltf.scene ? (
        <primitive object={gltf.scene} />
      ) : (
        // fallback: loop nodes (for models exported with nodes)
        Object.values(gltf.nodes ?? {}).map((node: any, i) =>
          node.isMesh ? (
            <mesh
              key={i}
              geometry={node.geometry}
              castShadow={castShadow}
              receiveShadow={receiveShadow}
              // override material to change color (optional)
              material={overrideMat}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          ) : null
        )
      )}
    </group>
  );
};

// Preload helper (optional)
useGLTF.preload("/models/sofa.glb");
