const { Pool } = require('pg');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const { BigQuery } = require('@google-cloud/bigquery');
// Hold singleton connections so they can be reused across the app
let mysqlConn;
let pgPool;
let sqliteDb;
let bigqueryClient;
const connectDatabases = async () => {
    try {
        // 1. MySQL (Workbench)
        mysqlConn = await mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB_NAME
        });
        console.log("✅ MySQL (Workbench) Connected");

        // 2. PostgreSQL (Aiven Cloud)
        pgPool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});
     sqliteDb = new sqlite3.Database('./local_store.db', (err) => {
            if (err) console.error("❌ SQLite Error:", err);
            else console.log("✅ SQLite (Local File) Connected");
        });
        //console.log("✅ PostgreSQL Connected");
 await pgPool.query("SELECT NOW()");
console.log("Neon connection working properly");
        // 3. MongoDB (Chat History & Agent)
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME || 'sql_agent',
        });
        console.log("✅ MongoDB Connected");

        bigqueryClient = new BigQuery({
            projectId: process.env.BIGQUERY_PROJECT_ID,
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });
        console.log("✅ BigQuery Data Warehouse Connected");

        return { mysqlConn, pgPool, sqliteDb, bigqueryClient };
    } catch (err) {
        console.error("❌ DB Error:", err);
    }
};
const getBigQuery = () => bigqueryClient;
const getMysqlConn = () => mysqlConn;
const getPgPool = () => pgPool;
const getSqliteDb = () => sqliteDb;
module.exports = {
    connectDatabases,
    getMysqlConn,
    getPgPool,  
    getSqliteDb,
    getBigQuery, // Export the warehouse client
};