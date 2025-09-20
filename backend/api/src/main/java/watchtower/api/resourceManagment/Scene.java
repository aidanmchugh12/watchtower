package watchtower.api.resourceManagment;

import java.util.*;

// Singleton class, there will only ever be a single instance
public class Scene {
    private static Scene singletonInstance = null;
    private List<Station> stations;
    private List<Disaster> disasters;
    private List<Unit> movingUnits;
    private long currentTick;

    private Scene(List<Station> allStations) {
        currentTick = 0;
        stations = allStations;
        disasters = new ArrayList<Disaster>();
        movingUnits = new ArrayList<Unit>();
    }

    private Scene() {
        this(new ArrayList<Station>());
    }

    public void tick() {
        for (Unit u : movingUnits) {
            if (u.tickAndCheckIfArrived()) {
                // let the location know that the unit arrived
                u.getDest().arriveUnit(u);
                // and take it off the list of movers
                movingUnits.remove(u);
            }
        }
        currentTick++;
    }

    public long getTick() {
        return currentTick;
    }

    public String addRandomDisaster() {
        return "disaster_id";
    }

    public void allocate(List<Unit> units, Disaster dest) {
        // for a list of units allocated by the decision algorithm
        for (Unit u : units) {
            u.sendTo(dest);
        }
    }

    public List<Station> getAllStations() {
        return stations;
    }

    public List<Unit> getAllStationaryUnits(char type) {
        List<Station> allStations = getAllStations();

        List<Unit> allStationaryUnits = new ArrayList<Unit>();

        // Loop through all stations and their units to grab appropriate units
        for (Station station : allStations) {
            for (Unit unit : station.getAllUnits()) {
                if (unit.getId().charAt(0) == type) {
                    allStationaryUnits.add(unit);
                }
            }
        }

        return allStationaryUnits;
    }

    public List<Unit> getAllMovingUnits() {
        return movingUnits;
    }

    public static Scene getInstance() {
        if (singletonInstance == null) {
            singletonInstance = new Scene();
        }
        return singletonInstance;
    }
}