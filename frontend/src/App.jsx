import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from "./components/Map";
import HomeInput from "./components/HomeInput";
import Disaster from "./components/Disaster";
import { AppProvider } from "./components/AppContext";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeInput />} />
          <Route path="/disaster" element={<Disaster />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}