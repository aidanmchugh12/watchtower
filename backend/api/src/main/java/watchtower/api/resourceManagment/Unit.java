package watchtower.api.resourceManagment;

public abstract class Unit {
    private double minutesPerStep = 1;
    private double progress;
    private double latPos;
    private double longPos;
    private String id;

    // how far along? min=0, max=distance
    public double getProgress() {
        return progress;
    }

    // move by a set amount, then return if it arrived
    // TODO: UPDATE LAT LONG INSTEAD
    public boolean move(double distanceToDest) {
        progress += minutesPerStep;
        if (progress >= distanceToDest) {
            return true;
        }
        return false;
    }
    
    public String getId() {
        return id;
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
