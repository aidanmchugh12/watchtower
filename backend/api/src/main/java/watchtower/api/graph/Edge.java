package watchtower.api.graph;

import java.util.ArrayList;

public class Edge {
    private StationaryObject source;
    private StationaryObject dest;
    private double distance;  // in minutes
    private ArrayList<MovingObject> movingObjects;

    public Edge(StationaryObject source, StationaryObject dest, double distance) {
        this.source = source;
        this.dest = dest;
        this.distance = distance;
    }

    public void addObj(MovingObject o) {
        movingObjects.add(o);
    }

    public void tick() {
        for (MovingObject o : movingObjects) {
            // move it (with .move()), check if it arrived
            if (o.move(distance)) {
                // pass along ownership
                dest.addObj(o);
                movingObjects.remove(o);
            }
        }
    }

    public double getDistance() {
        return distance;
    }
}
