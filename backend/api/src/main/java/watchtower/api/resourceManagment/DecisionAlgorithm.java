package watchtower.api.resourceManagment;

import java.util.*;

public class DecisionAlgorithm {
    
    public DecisionAlgorithm() {}

    // Returns units to use
    public List<Unit> CreateDecision(Disaster disaster) {
        
        Scene scene = Scene.getInstance();

        // MAKE A LIST OF ALL FREE UNITS
        // Grab stationary units safely (make a modifiable copy)
        List<Unit> stationary = scene.getAllStationaryUnits();
        List<Unit> allFreeUnits = (stationary == null) ? new ArrayList<>() : new ArrayList<>(stationary);

        // Grab moving units and collect returning ones
        List<Unit> movingUnits = scene.getMovingUnits();
        if(movingUnits != null) {
            for(Unit unit : movingUnits) {
                if(unit.getDest() == null || unit.getHome() == null) continue;
                // consider unit returning if dest == home
                if (Double.compare(unit.getDest().lat, unit.getHome().lat) == 0
                        && Double.compare(unit.getDest().lon, unit.getHome().lon) == 0) {
                    allFreeUnits.add(unit);
                }
            }
        }

        Collections.sort(allFreeUnits, 
            (a, b) -> Double.compare(
                Util.calculateDistance(a.getLat(), a.getLon(), disaster.lat, disaster.lon), 
                Util.calculateDistance(b.getLat(), b.getLon(), disaster.lat, disaster.lon))
        );

        // Establish reccomended units for disaster
        int reccomendedUnits = 5 * disaster.getSeverityLevel(); // TODO: make better calculation later


        List<Unit> unitsToUse = new ArrayList<Unit>(); // RETURN ARRAYLIST
        int unitsAdded = 0;

        // Loop through sorted units and add them to units to use
        for(Unit unit : allFreeUnits) {
            if(unitsAdded == reccomendedUnits) {
                break;
            }
            unitsToUse.add(unit);
            unitsAdded++;
        }

        return unitsToUse;
    }

}
