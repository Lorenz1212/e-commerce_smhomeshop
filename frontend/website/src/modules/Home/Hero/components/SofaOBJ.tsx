import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import React, { useEffect } from "react";

export const SofaOBJ = ({ color = "#b5651d" }) => {
  const isLive = !["localhost", "127.0.0.1"].includes(window.location.hostname);

  const baseUrl = (isLive)?import.meta.env.VITE_APP_3D_URL_LIVE:import.meta.env.VITE_APP_3D_URL;

  const materials = useLoader(MTLLoader, `${baseUrl}/models/couch.mtl`);
  const obj = useLoader(OBJLoader, `${baseUrl}/models/couch.obj`, (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  useEffect(() => {
    obj.traverse((child:any) => {
      if (child.isMesh) {
        child.material.color.set(color);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [obj, color]);

  return <primitive object={obj} scale={0.008} position={[0, -4, 2]}/>;
};
