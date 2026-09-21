import { MongoClient, Db } from 'mongodb'

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://infotechpranavi_db_user:46tvRhmFSIcpwDWb@cluster0.nq9rxoz.mongodb.net/cosmora?retryWrites=true&w=majority&appName=Cluster0'
const MONGODB_DB = process.env.MONGODB_DB || 'cosmora'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached: { client: MongoClient | null; db: Db | null } = { client: null, db: null }

export async function connectToDatabase() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db }
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()

  const db = client.db(MONGODB_DB)

  cached.client = client
  cached.db = db

  return { client, db }
}
