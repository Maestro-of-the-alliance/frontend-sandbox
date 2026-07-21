import React from "react";
import Starfield from "./components/Starfield";
import ExperienceFlow from "./components/ExperienceFlow";

export default function App() {
  return (
    <>
      <Starfield />
      <ExperienceFlow onComplete={() => { window.location.href = "/landing.html"; }} />
    </>
  );
}
