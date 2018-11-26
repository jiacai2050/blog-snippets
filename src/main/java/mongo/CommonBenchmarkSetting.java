package mongo;

import com.mongodb.WriteConcern;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public abstract class CommonBenchmarkSetting {

    static Logger LOG = LogManager.getLogger("mongo-perf");
    static String mongoAddress = "192.168.33.10";
    static int mongoPort = Integer.parseInt(System.getProperty("numInsert", "37017"));
    static String database = "benchmark";
    static String collection = "bench-collection";
    static WriteConcern mongoWriteConcern = WriteConcern.ACKNOWLEDGED;


    static int numInsert = Integer.parseInt(System.getProperty("numInsert", "100000"));
    static int numThread = Integer.parseInt(System.getProperty("numThread", "5"));
    static int numSocket = Integer.parseInt(System.getProperty("numSocket", "10"));
    static int numLoop = numInsert / numThread;

    static ThreadPoolExecutor executor = new ThreadPoolExecutor(numThread, numThread, 1, TimeUnit.HOURS, new ArrayBlockingQueue<>(numInsert));

    static CountDownLatch latch = new CountDownLatch(numInsert);

}
