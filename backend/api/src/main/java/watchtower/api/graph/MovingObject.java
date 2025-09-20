package graph;

public abstract class MovingObject {
    private double minutesPerStep = 1;
    private double progress;
    private String id;

    // how far along? min=0, max=distance
    public double getProgress() {
        return progress;
    }

    // move by a set amount, then return if it arrived
    public boolean move(double distanceToDest) {
        progress += minutesPerStep;
        if (progress >= distanceToDest) {
            return true;
        }
        return false;
    }
    
    public String getId() {
        return null;
    }

    @Override
    public boolean equals(Object other) {
        if (other instanceof MovingObject) {
            MovingObject otherMovingObject = (MovingObject) other;
            if (id.equals(otherMovingObject.getId())) {
                return true;
            }
        }
        return false;
    }
}
