package watchtower.api.resourceManagment;

public abstract class Unit {
    private double lat;
    private double lon;
    private String id;
    private Station home;
    private Location dest;

    public Unit(String type, Station home, int id) {
        if (type.equals("f") || type.equals("p") || type.equals("a")) {
            throw new RuntimeException();
        }
        this.id = type + String.format("%07d", id);
        this.home = home;
        this.lat = home.lat;
        this.lat = home.lon;
        this.dest = home;
    }

    public boolean tickAndCheckIfArrived() {
        if (Util.calculateDistance(lat, lon, dest.lat, dest.lon) <= Util.distPerTick) {
            return true;
        }
        double[] dirWeights = Util.calculateDirection(lat, lon, dest.lat, dest.lon);
        lat += dirWeights[0] * Util.distPerTick;
        lon += dirWeights[1] * Util.distPerTick;
        return false;
    }

    public String getId() {
        return id;
    }

    /*
     * first char is
     * f (firetruck)
     * p (police car)
     * a (ambulance)
     */
    public String getType() {
        return id.substring(0, 1);
    }

    public double getLat() {
        return this.lat;
    }

    public double getLon() {
        return this.lon;
    }

    public Location getDest() {
        return dest;
    }

    public Location getHome() {
        return home;
    }

    public void sendTo(Location l) {
        dest = l;
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof Unit) {
            Unit otherMovingObject = (Unit) other;
            if (id.equals(otherMovingObject.getId())) {
                return true;
            }
        }
        return false;
    }
}
