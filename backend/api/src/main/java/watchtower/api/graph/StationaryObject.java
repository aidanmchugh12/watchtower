package graph;

import java.util.ArrayList;

public interface StationaryObject {
    public ArrayList<Edge> getAllEdges();
    public Edge getEdge(String id);  // get edge by destination ID
    public double getDist(String id);  // get distance by destination ID
    public ArrayList<MovingObject> getAllLocalResources();
    public void addObj(MovingObject obj);
    public MovingObject removeObj(Class<? extends MovingObject> type);  // sketchy because it returns the parent type
}