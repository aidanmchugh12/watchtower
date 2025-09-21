// AppContext.jsx
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [policeStations, setPoliceStations] = useState([]);
    const [fireStations, setFireStations] = useState([]);
    const [hospitals, setHospitals] = useState([]);

    return (
        <AppContext.Provider
            value={{ policeStations, setPoliceStations, fireStations, setFireStations, hospitals, setHospitals }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
