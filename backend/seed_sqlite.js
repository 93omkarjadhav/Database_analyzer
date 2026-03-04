const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./local_store.db');

db.serialize(() => {

    // 1. DROP the table first to start fresh
    db.run("DROP TABLE IF EXISTS inventory");
    // Create a local inventory table
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT,
        quantity INTEGER,
        warehouse_loc TEXT
    )`);

    // Insert dummy records
    const stmt = db.prepare("INSERT INTO inventory (item_name, quantity, warehouse_loc) VALUES (?, ?, ?)");
    stmt.run("Tablets", 45, "Pune_A1");
    stmt.run("Keyboards", 120, "Mumbai_B2");
    stmt.run("Monitors", 30, "Delhi_C3");
    stmt.run("Mice", 200, "Pune_A2");
    stmt.run("Laptops", 25, "Chennai_D1");
    stmt.run("Printers", 15, "Mumbai_B1");
    stmt.run("Scanners", 18, "Delhi_C1");
    stmt.run("Projectors", 10, "Hyderabad_E1");
    stmt.run("Speakers", 75, "Pune_A1");    
    stmt.run("Headphones", 150, "Bangalore_F2");
    stmt.run("Webcams", 60, "Chennai_D2");
    stmt.run("Routers", 90, "Mumbai_B3");
    stmt.run("Hard Drives", 140, "Delhi_C2");
    stmt.run("SSDs", 110, "Hyderabad_E2");
    stmt.run("RAM Modules", 170, "Bangalore_F1");
    stmt.run("Graphics Cards", 20, "Pune_A1");
    stmt.run("Power Banks", 130, "Chennai_D3");
    stmt.run("Cables", 300, "Delhi_C4");
    stmt.run("USB Drives", 220, "Mumbai_B4");
    stmt.run("Smartphones", 50, "Hyderabad_E3");
    stmt.finalize();
    
    console.log("✅ SQLite Database 'local_store.db' created and seeded!");
});
db.close(); 