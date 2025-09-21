package watchtower.api.resourceManagment;

import watchtower.api.Log;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

// Singleton class, there will only ever be a single instance
public class Scene {
    private static Scene singletonInstance = null;
    private static List<Station> stations;
    private static List<Disaster> disasters;
    private static List<Unit> movingUnits;
    private static long currentTick;

    public Scene(List<Station> allStations) {
        int unitId = 1;
        currentTick = 0;
        stations = allStations;
        for (Station s : stations) {
            for (int i = 0; i < s.capacity; i++) {
                Unit u = new Unit(s.getType(), s, unitId);
                s.arriveUnit(u);
                unitId++;
            }
        }
        disasters = new ArrayList<Disaster>();
        movingUnits = new ArrayList<Unit>();
    }

    private Scene() {
        this(new ArrayList<Station>());
    }

    public void tick() {
        // tick all units in motion
        Iterator<Unit> iterator = movingUnits.iterator();
        while (iterator.hasNext()) {
            Unit u = iterator.next();
            if (u.tickAndCheckIfArrived()) {
                u.getDest().arriveUnit(u);
                iterator.remove();
            }
        }

        // tick all disasters
        ArrayList<Disaster> disastersToRemove = new ArrayList<Disaster>();
        for (Disaster d : disasters) {
            if (d.tickAndCheckIfOver()) {
                // release all units
                List<Unit> list = d.getUnits();
                for (int i = list.size() - 1; i >= 0; i--) {
                    Unit u = list.get(i);
                    d.releaseUnit(u.getId());
                    u.sendTo(u.getHome());
                    movingUnits.add(u);
                }

                // mark disaster for removal
                disastersToRemove.add(d);
            }
        }
        for (Disaster disaster : disastersToRemove) {

            // check if unit is en route to disaster getting removed
            for (Unit u : movingUnits) {
                if (u.getDest().equals(disaster)) {
                    u.sendTo(u.getHome());
                }
            }
            // remove from the list
            Log.log("success: disaster " + disaster.getId() + " has ended");
            disasters.remove(disaster);
        }

        if (currentTick % 20 == 0) {
            if (Math.random() > 0.75) {
                double typeval = Math.random();
                String type;
                if (typeval > 0.65) {
                    type = "fire";
                } else if (typeval > 0.3) {
                    type = "flood";
                } else {
                    type = "crime";
                }
                int severity = (int) Math.ceil(Math.random() * 5);
                int duration = (int) Math.ceil(Math.random() * 500);

                double lat = 40.44 + 0.1 * (Math.random() - 0.5);
                double lon = -79.99 + 0.1 * (Math.random() - 0.5);

                Disaster d = new Disaster(lat, lon, type, (int) currentTick, severity, duration);
                addDisaster(d);
                DecisionAlgorithm dAlgo = new DecisionAlgorithm();
                List<Unit> unitsToMove = dAlgo.CreateDecision(d);
                allocateFromAlgorithm(unitsToMove, d);
            }
        }

        // increment current tick
        currentTick++;
    }

    public long getTick() {
        return currentTick;
    }

    public void addDisaster(Disaster d) {
        disasters.add(d);
        Log.log("DISASTER: a new " + d.getType() + " of severity level " + d.getSeverityLevel()
                + " is occurring at coordinates " + Double.toString(d.lat) + ", " + Double.toString(d.lon));
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
                List<Unit> units = s.getUnits();
                for (int i = 0; i < num; i++) {
                    if (units.size() == 0 || dest == null) {
                        return;
                    }
                    // pop from the list and send away
                    Unit u = units.getLast();
                    s.releaseUnit(u.getId());
                    u.sendTo(dest);
                    movingUnits.add(u);
                }
                return;
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
            for (Unit u : s.getUnits()) {
                if (u.getId().equals(unitId)) {
                    s.releaseUnit(unitId);
                    movingUnits.add(u);
                    u.sendTo(dest);
                    return;
                }
            }
        }
        for (Disaster d : disasters) {
            for (Unit u : d.getUnits()) {
                if (u.getId().equals(unitId)) {
                    d.releaseUnit(unitId);
                    movingUnits.add(u);
                    u.sendTo(dest);
                    return;
                }
            }
        }
    }

    public Disaster getDisaster(String disasterId) {
        for (Disaster d : disasters) {
            if (d.getId().equals(disasterId)) {
                return d;
            }
        }
        throw new RuntimeException();
    }

    public List<Station> getAllStations() {
        return stations;
    }

    public List<Unit> getAllStationaryUnits() {
        List<Station> allStations = getAllStations();

        List<Unit> allStationaryUnits = new ArrayList<Unit>();

        // Loop through all stations and th
        for (Station station : allStations) {
            for (Unit unit : station.getUnits()) {
                allStationaryUnits.add(unit);
            }
        }

        return allStationaryUnits;
    }

    public List<Station> getStations() {
        return stations;
    }

    public List<Disaster> getDisasters() {
        return disasters;
    }

    public List<Unit> getMovingUnits() {
        return movingUnits;
    }

    public static Scene getInstance() {
        if (singletonInstance == null) {
            singletonInstance = new Scene();
        }
        return singletonInstance;
    }

    @Override
    public String toString() {
        return "Scene at tick number " + Long.toString(currentTick) + "\n"
                + "Stations: \n"
                + stations.toString() + "\n"
                + "Disasters: \n"
                + disasters.toString() + "\n"
                + "Moving units: \n"
                + movingUnits.toString() + "\n";
    }
}