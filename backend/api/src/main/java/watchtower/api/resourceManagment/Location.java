package watchtower.api.resourceManagment;

import java.util.List;

public abstract class Location {
    private List<Unit> units;
    public double lat;
    public double lon;
    public String id;

    public String getId() {
        return id;
    }

    public void arriveUnit(Unit u) {
        units.add(u);
        u.setCurrentLocation(this);
        u.sendTo(null);
    }

    public Unit releaseUnit(String id) {
        for (int i = 0; i < units.size(); i++) {
            Unit u = units.get(i);
            if (u.getId().equals(id)) {
                u.setCurrentLocation(null);
                return units.remove(i);
            }
        }

        return null;
    }

    public List<Unit> getAllUnits() {
        return units;
    }

    public int countUnits(String type) {
        int count = 0;
        for (Unit u : units) {
            if (u.getType().equals(type)) {
                count++;
            }
        }
        return count;
    }

    public boolean equals(Object other) {
        if (other instanceof Location) {
            Location otherLocation = (Location) other;
            if (id.equals(otherLocation.getId())) {
                return true;
            }
        }
        return false;
    }
}
