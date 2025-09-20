package watchtower.api.resourceManagment;

import java.util.*;
import java.util.concurrent.ThreadPoolExecutor.DiscardOldestPolicy;

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

    // for a list of units allocated by the decision algorithm
    public void allocateFromAlgorithm(List<Unit> units, Disaster dest) {
        for (Unit u : units) {
            // how do we make sure units aren't still listed as at station/disaster?
            u.sendTo(dest);
        }
    }

    // for a specified number of units allocated by user from a specific station
    public void allocateFromStation(String stationId, int num, Disaster dest) {
        for (Station s : stations) {
            if (s.getId().equals(stationId)) {
                List<Unit> units = s.getAllUnits();
                for (int i = 0; i < num; i++) {
                    if (units.size() == 0) {
                        return;
                    }
                    // pop from the list and send away
                    Unit u = units.removeLast();
                    u.sendTo(dest);
                    movingUnits.add(u);
                }
            }
        }
    }

    public void allocateFromMoving(String unitId, Disaster dest) {
        // for an individual (presumably moving) unit allocated by user
        for (Unit u : movingUnits) {
            if (u.getId().equals(unitId)) {
                u.sendTo(dest);
                return;
            }
        }

        // backups for if the unit arrived just before the user clicks
        for (Station s : stations) {
            for (Unit u : s.getAllUnits()) {
                if (u.getId().equals(unitId)) {
                    u.sendTo(dest);
                    movingUnits.add(u);
                    s.releaseUnit(unitId);
                    return;
                }
            }
        }
        for (Disaster d : disasters) {
            for (Unit u : d.getAllUnits()) {
                if (u.getId().equals(unitId)) {
                    movingUnits.add(u);
                    d.releaseUnit(unitId);
                    u.sendTo(dest);
                    return;
                }
            }
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