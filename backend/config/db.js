const { Pool } = require('pg');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// Hold singleton connections so they can be reused across the app
let mysqlConn;
let pgPool;

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
            connectionString: process.env.DB_URL,
            ssl: { rejectUnauthorized: false }
        });
        console.log("✅ PostgreSQL Connected");

        // 3. MongoDB (Chat History & Agent)
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME || 'sql_agent',
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ DB Error:", err);
    }
};

const getMysqlConn = () => mysqlConn;
const getPgPool = () => pgPool;

module.exports = {
    connectDatabases,
    getMysqlConn,
    getPgPool,
};