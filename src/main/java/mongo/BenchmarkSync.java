package mongo;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.WriteConcern;
import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import org.bson.Document;

import java.util.Arrays;

public class BenchmarkSync extends CommonBenchmarkSetting {


    static MongoClient mongoClient = MongoClients.create(
            MongoClientSettings.builder()
                    .applyToConnectionPoolSettings(builder -> builder.maxSize(numSocket).minSize(0).maxWaitQueueSize(numInsert))
                    .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddress, mongoPort))))
                    .writeConcern(mongoWriteConcern)
                    .applicationName("MyApp")
                    .build());

    static MongoCollection<Document> syncCollection = mongoClient.getDatabase(database).getCollection(BenchmarkSync.collection);

    public static void setup() {
        syncCollection.drop();
    }

    public static void testInsert() {

        setup();
        Long start = System.currentTimeMillis();

        for (int j = 0; j < numThread; j++) {
            for (int i = 0; i < numLoop; i++) {
                final String id = String.format("%s-%s", j, i);
                executor.execute(() -> {
                    syncCollection.insertOne(new Document("name", "sync-doc")
                            .append("contact", new Document("phone", "228-555-0149")
                                    .append("email", "cafeconleche@example.com")
                                    .append("location", Arrays.asList(-73.92502, 40.8279556)))
                            .append("stars", 3)
                            .append("categories", Arrays.asList("Bakery", "Coffee", "Pastries")).append("_id", id));
                    latch.countDown();
                });
            }
        }
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        assert syncCollection.countDocuments() == numInsert;
        LOG.info("", numInsert, numThread, numSocket, "sync insert", System.currentTimeMillis() - start);
//        System.out.println("sync cost: " + (System.currentTimeMillis() - start));
    }

    public static void testQuery() {

        Long start = System.currentTimeMillis();

        for (int j = 0; j < numThread; j++) {
            for (int i = 0; i < numLoop; i++) {
                final String id = String.format("%s-%s", j, i);
                executor.execute(() -> {
                    FindIterable<Document> documents = syncCollection.find(Filters.eq("_id", id));
                    Document doc = documents.first();
                    assert "sync-doc".equals(doc.get("name"));
                    latch.countDown();
                });
            }
        }
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        LOG.info("", numInsert, numThread, numSocket, "sync query", System.currentTimeMillis() - start);
    }

    public static void main(String[] args) {

//        testInsert();
        testQuery();
        System.exit(0);

    }
}
