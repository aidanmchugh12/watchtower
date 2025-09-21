package watchtower.api;

import org.springframework.stereotype.Service;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import watchtower.api.resourceManagment.Scene;

@Service
public class SimulationService {

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private boolean running = false;
    private int tickCount = 0;

    // Start simulation ticks
    public synchronized void startSimulation() {
        if (running) return;
        running = true;

        scheduler.scheduleAtFixedRate(() -> {
            tick();
        }, 0, 1, TimeUnit.SECONDS); // update every second
    }

    // Stop simulation ticks
    public synchronized void stopSimulation() {
        running = false;
    }

    // Increment tick count and run your simulation logic
    private synchronized void tick() {
        tickCount++;
        System.out.println("Tick: " + tickCount);
        // TODO: ADD TICK FUNCTION CALL
    }

    public synchronized int getTickCount() {
        return tickCount;
    }

    public synchronized void resetTickCount() {
        tickCount = 0;
    }

    public synchronized boolean isRunning() {
        return running;
    }
}
