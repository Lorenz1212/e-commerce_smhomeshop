import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import "./HeroSection.css";
import { Link } from "react-router-dom";
import { SofaModel } from "./components/SofaModel";
import { SofaOBJ } from "./components/SofaOBJ";

const HeroSection = () => {
  
  const [tshirtColor, setTshirtColor] = useState<any>("red");

  const changeColor = (color:any) => {
    setTshirtColor(color);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="heroMain">
        <div className="sectionleft">
          <p>New Trend</p>
          <h1>Transform Your Space in Style</h1>
          Discover timeless furniture and home décor that bring comfort, elegance, and personality to every room. Make your home truly yours this season with SM Home.
          <div className="heroLink">
            <Link to="/shop/all" onClick={scrollToTop}>
              <h5>Discover More</h5>
            </Link>
          </div>
        </div>
        <div className="sectionright">
          <Canvas
            className="canvasModel"
            camera={{ position: [0, 5, 15], fov: 50 }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={2.5}
              color={"white"}
            />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minAzimuthAngle={-Infinity}
              maxAzimuthAngle={Infinity}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />

            <SofaModel color={tshirtColor} />
          </Canvas>
          <div className="heroColorBtn">
            <button
              onClick={() => changeColor("#353933")}
              style={{ backgroundColor: "#353933" }}
            ></button>
            <button
              onClick={() => changeColor("#EFBD4E")}
              style={{ backgroundColor: "#EFBD4E" }}
            ></button>
            <button
              onClick={() => changeColor("#726DE7")}
              style={{ backgroundColor: "#726DE7" }}
            ></button>
            <button
              onClick={() => changeColor("red")}
              style={{ backgroundColor: "red" }}
            ></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
