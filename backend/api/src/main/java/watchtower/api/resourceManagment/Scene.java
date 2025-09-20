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
        // tick all units in motion
        for (Unit u : movingUnits) {
            if (u.tickAndCheckIfArrived()) {
                // let the location know that the unit arrived
                u.getDest().arriveUnit(u);
                // and take it off the list of movers
                movingUnits.remove(u);
            }
        }

        // tick all disasters
        ArrayList<Disaster> disastersToRemove = new ArrayList<Disaster>();
        for (Disaster d : disasters) {
            if (d.tickAndCheckIfOver()) {
                // release all units
                for (Unit u : d.getAllUnits()) {
                    d.releaseUnit(u.getId());
                    u.sendTo(u.getHome());
                    movingUnits.add(u);
                }

                // mark disaster for removal
                disastersToRemove.add(d);
            }
        }
        for (Disaster disaster : disastersToRemove) {
            // remove from the list
            disasters.remove(disaster);
        }

        // increment current tick
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
            if (u.getCurrentLocation() != null) {
                u.getCurrentLocation().releaseUnit(u.getId());
                movingUnits.add(u);
            }
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
                    Unit u = units.getLast();
                    s.releaseUnit(u.getId());
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
                    s.releaseUnit(unitId);
                    movingUnits.add(u);
                    u.sendTo(dest);
                    return;
                }
            }
        }
        for (Disaster d : disasters) {
            for (Unit u : d.getAllUnits()) {
                if (u.getId().equals(unitId)) {
                    d.releaseUnit(unitId);
                    movingUnits.add(u);
                    u.sendTo(dest);
                    return;
                }
            }
        }
    }

    public List<Station> getAllStations() {
        return stations;
    }

    public List<Unit> getAllStationaryUnits() {
        List<Station> allStations = getAllStations();

        List<Unit> allStationaryUnits = new ArrayList<Unit>();

        // Loop through all stations and th
        for (Station station : allStations) {
            for (Unit unit : station.getAllUnits()) {
                allStationaryUnits.add(unit);
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