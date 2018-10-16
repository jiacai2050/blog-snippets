package mongo;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class CommonBenchmarkSetting {

    static int numSocket = 10;
    static String database = "benchmark";
    static String collection = "bench-collection";

    static int numThread = 5;
    static int numInsert = 100000;
    static int numLoop = numInsert / numThread;

    static ThreadPoolExecutor executor = new ThreadPoolExecutor(numThread, numThread, 1, TimeUnit.HOURS, new ArrayBlockingQueue<>(numInsert));

    static CountDownLatch latch = new CountDownLatch(numInsert);
}
