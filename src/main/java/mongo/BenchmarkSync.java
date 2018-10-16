package mongo;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.util.Arrays;

public class BenchmarkSync extends CommonBenchmarkSetting {

    public static void main(String[] args) {
        MongoClient mongoClient = MongoClients.create(
                MongoClientSettings.builder()
                        .applyToConnectionPoolSettings(builder -> builder.maxSize(numSocket).minSize(0).maxWaitQueueSize(numInsert))
                        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress("localhost"))))
                        .writeConcern(WriteConcern.MAJORITY)
                        .applicationName("MyApp")
                        .build());


        MongoCollection<Document> syncCollection = mongoClient.getDatabase(database).getCollection(BenchmarkSync.collection);
        syncCollection.drop();

        Long start = System.currentTimeMillis();
        System.out.println("loop: " + numLoop);

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
        System.out.println("cost: " + (System.currentTimeMillis() - start));
        System.out.println("total docs: " + syncCollection.countDocuments());
        syncCollection.drop();
        System.exit(0);

    }
}
