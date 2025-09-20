package graph;

import java.util.List;
import java.util.Map;

public class Graph {
    private List<StationaryObject> nodes;
    private List<Edge> edges;
    private List<MovingObject> movingObjects;
    private long currentTick;

    public Graph() {
        currentTick = 0;
    }

    public void tick() {
        for (Edge e : edges) {
            e.tick();
        }
        currentTick++;
    }

    public long getTick() {
        return currentTick;
    }

    public int allocate(String sourceId, String destinationId, Class<? extends MovingObject> type, int quantity) {
        // find the node for the sourceId. 
        return -1;
    }

    public List<StationaryObject> getAllStationaryObjects(String id) {
        return nodes;
    }

    public List<MovingObject> getAllMovingObjects() {
        return movingObjects;
    }
}