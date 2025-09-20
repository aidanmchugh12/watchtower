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

    public int allocate(String sourceId, String destinationId, String type, int quantity) {
        // find the node for the sourceId.
        return -1;
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