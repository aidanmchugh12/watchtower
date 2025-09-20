package watchtower.api.resourceManagment;

public class Util {
    public static final double distPerTick = 0.001;

    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dx = lat2 - lat1;
        double dy = lon2 - lon1;
        return Math.hypot(dx, dy);
    }

    public static double[] calculateDirection(double lat1, double lon1, double lat2, double lon2) {
        double dx = lon2 - lon1;
        double dy = lat2 - lat1;
        double length = Math.sqrt(dx * dx + dy * dy);

        if (length == 0) {
            return new double[]{0.0, 0.0}; // no movement
        }

        return new double[]{dx / length, dy / length};
    }
}
