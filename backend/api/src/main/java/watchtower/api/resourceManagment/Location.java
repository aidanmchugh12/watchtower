package watchtower.api.resourceManagment;

import java.util.ArrayList;
import java.util.List;

public abstract class Location {
    public List<Unit> units;
    public double lat;
    public double lon;
    public String id;

    public String getId() {
        return id;
    }

    public void arriveUnit(Unit u) {
        if (units == null) {
            units = new ArrayList<Unit>();
        }
        units.add(u);
        Util.log("unit " + u.getId() + " has arrived at " + id);
        u.setCurrentLocation(this);
        u.sendTo(null);
    }

    public Unit releaseUnit(String id) {
        for (int i = 0; i < units.size(); i++) {
            Unit u = units.get(i);
            if (u.getId().equals(id)) {
                u.setCurrentLocation(null);
                Util.log("unit " + u.getId() + " has left " + id);
                if (this instanceof Station && units.size() == 0) {
                    Util.log("notice: station " + getId() + " has no remaining capacity");
                }
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

    @Override
    public boolean equals(Object other) {
        if (other instanceof Location) {
            Location otherLocation = (Location) other;
            if (id.equals(otherLocation.getId())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "location " + id + " currently with " + Integer.toString(units.size()) + " at " + Double.toString(lat)
                + ", "
                + Double.toString(lon);

    }
}
