import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts"
import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts"

const env = config()

const client = new MongoClient()

await client.connect({
    db: "userdb",
    tls: true,
    servers: [{
        host: "cluster0-shard-00-01.fp1pa.mongodb.net",
        port: 27017,
    }],
    credential: {
        username: "dbUser",
        password: env.MONGODB_PASSWORD,
        db: "userdb",
        mechanism: "SCRAM-SHA-1",
    }
})

const db = client.database("userdb")
export default db