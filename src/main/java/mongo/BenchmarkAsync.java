package mongo;


import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.async.SingleResultCallback;
import com.mongodb.async.client.FindIterable;
import com.mongodb.async.client.MongoClient;
import com.mongodb.async.client.MongoClients;
import com.mongodb.async.client.MongoCollection;
import com.mongodb.client.model.Filters;
import org.bson.Document;

import java.util.Arrays;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class BenchmarkAsync extends CommonBenchmarkSetting {

    static MongoClient mongoClient = MongoClients.create(
            MongoClientSettings.builder()
                    .applyToConnectionPoolSettings(builder -> builder.maxSize(numSocket).minSize(0).maxWaitQueueSize(numInsert))
                    .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddress, mongoPort))))
                    .writeConcern(mongoWriteConcern)
                    .applicationName("MyApp")
                    .build());

    static MongoCollection<Document> benchCollection = mongoClient.getDatabase(database).getCollection(collection);

    static void setup() {
        CompletableFuture<String> future = new CompletableFuture();
        benchCollection.drop((result, t) -> {
            if (t != null) {
                future.completeExceptionally(t);
            } else {
                future.complete("done");
            }

        });
        try {
            assert "done".equals(future.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }

    static void testInsert() {
        setup();
        Long start = System.currentTimeMillis();

        for (int j = 0; j < numThread; j++) {
            for (int i = 0; i < numLoop; i++) {
                final String id = String.format("%s-%s", j, i);
                executor.submit(() -> {
                    benchCollection.insertOne(new Document("name", "sync-doc")
                            .append("contact", new Document("phone", "228-555-0149")
                                    .append("email", "cafeconleche@example.com")
                                    .append("location", Arrays.asList(-73.92502, 40.8279556)))
                            .append("stars", 3)
                            .append("categories", Arrays.asList("Bakery", "Coffee", "Pastries")).append("_id", id), new SingleResultCallback<Void>() {
                        @Override
                        public void onResult(Void result, Throwable t) {
                            if (t != null)
                                System.out.println(t);
                            latch.countDown();
                        }
                    });
                });
            }
        }
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        CompletableFuture<Long> countFuture = new CompletableFuture<>();
        benchCollection.countDocuments((result, t) -> {
            if (t != null)
                countFuture.completeExceptionally(t);
            else
                countFuture.complete(result);
        });
        try {
            assert countFuture.get() == numInsert;
            LOG.info("", numInsert, numThread, numSocket, "async", System.currentTimeMillis() - start);
//        System.out.println("cost: " + (System.currentTimeMillis() - start));
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }


    static void testQuery() {
        Long start = System.currentTimeMillis();

        for (int j = 0; j < numThread; j++) {
            for (int i = 0; i < numLoop; i++) {
                final String id = String.format("%s-%s", j, i);

                executor.submit(() -> {
                    FindIterable<Document> findIterable = benchCollection.find(Filters.eq("_id", id));
                    findIterable.first((doc, t) -> {
                        if (null == t) {
                            assert "sync-doc".equals(doc.get("name"));
                        } else {
                            System.err.println(t);
                        }
                        latch.countDown();
                    });

                });
            }
        }
        try {
            latch.await();
            LOG.info("", numInsert, numThread, numSocket, "async query", System.currentTimeMillis() - start);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

    public static void main(String[] args) {
//        testInsert();
        testQuery();
        System.exit(0);
    }
}
