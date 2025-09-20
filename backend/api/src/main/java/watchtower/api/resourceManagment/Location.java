package watchtower.api.resourceManagment;

import java.util.List;

public abstract class Location {
    private List<Unit> units;
    public double lat;
    public double lon;

    public void arriveUnit(Unit u) {
        units.add(u);
        u.sendTo(null);
    }

    public Unit releaseUnit(String type) {
        for (int i = 0; i < units.size(); i++) {
            Unit u = units.get(i);
            if (u.getType().equals(type)) {
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
}
