package watchtower.api.resourceManagment;

import java.util.*;

public class DecisionAlgorithm {
    
    public DecisionAlgorithm() {}

    // Returns units to use
    public List<Unit> CreateDecision(Disaster disaster) {
        
        Scene scene = Scene.getInstance();

        // MAKE A LIST OF ALL FREE UNITS
        // Grab all stationary units
        List<Unit> allFreeUnits = scene.getAllStationaryUnits();

        // Grab all in route & returning units
        List<Unit> movingUnits = scene.getAllMovingUnits();
        List<Unit> returningUnits = new ArrayList<Unit>();
        for(Unit unit : movingUnits) {
            // If desitation & home values are the same, the unit is returning
            if(unit.getDest().lat == unit.getHome().lat && unit.getDest().lon == unit.getHome().lon) {
                returningUnits.add(unit);
            }
        }
        allFreeUnits.addAll(returningUnits); // ALL FREE UNITS (STATIONARY & RETURNING)



        // // Establish reccomended units for disaster
        // int reccomendedUnits = 0;
        // String reccomendedUnitType = "";


        // List<Unit> unitsToUse = new ArrayList<Unit>(); // RETURN ARRAYLIST

        // // First: prefer returning units if they're closer than the nearest station
        // for(Unit unit : returningUnits) {
            
        // }


        return unitsToUse;
    }

}
