package watchtower.api.resourceManagment;

public class Util {
    public static final double distPerTick = 0.001;

    public static double calculateDistance(double[] pos1, double[] pos2) {
        if(pos1 == null || pos2 == null) return 0.0;

        double dx = pos2[0] - pos1[0];
        double dy = pos2[1] - pos1[1];
        return Math.hypot(dx, dy);
    }
}
