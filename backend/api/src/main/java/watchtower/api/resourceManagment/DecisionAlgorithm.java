package watchtower.api.resourceManagment;

import java.util.*;

public class DecisionAlgorithm {
    
    public DecisionAlgorithm() {}

    // Returns units to use
    public List<Unit> CreateDecision(Disaster disaster) {
        
        Scene scene = Scene.getInstance();

        // Grab most relevant units for a disaster

        char unitType = 'P';
        // Grab sorted (closest to farthest) units from stations
        List<Unit> sortedStationaryUnits = scene.getAllStationaryUnits(unitType);

        Collections.sort(sortedStationaryUnits, (a, b) -> Double.compare(Util.calculateDistance(a), util.calculateDistance(b)));

        List<Unit> unitsToUse = new ArrayList<Unit>();




        return unitsToUse;
    }

}
