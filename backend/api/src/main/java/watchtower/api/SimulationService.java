package watchtower.api;

import org.springframework.stereotype.Service;
import java.util.concurrent.*;

@Service
public class SimulationService {
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private ScheduledFuture<?> simulationTask;
    private boolean running = false;
    private int tickCount = 0;

    public synchronized void startSimulation() {
        if(running) return;

        running = true;

        simulationTask = scheduler.scheduleAtFixedRate(() -> {
            tick();
        }, 0, 1, TimeUnit.SECONDS);
    }

    public synchronized void stopSimulation() {
        if(!running) return;
        simulationTask.cancel(false);
        running = false;
    }

    private void tick() {
        tickCount++;
        // OBJECT LOGIC HERE
        System.out.println("Tick" + tickCount);
    }

    public synchronized int getTickCount() {
        return tickCount;
    }

    public synchronized void resetTickCount() {
        tickCount = 0;
    }

    public boolean isRunning() {
        return running;
    }
}
