import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from "./components/Map";
import HomeInput from "./components/HomeInput";
import Disaster from "./components/Disaster";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeInput />} />
        <Route path="/Disaster" element={<Disaster />} />
        <Route path="/Map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}