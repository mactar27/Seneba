import { pool } from "./lib/db"

async function run() {
  try {
    const rideId = "test-ride-tracking"
    const driverId = "test-driver-tracking"
    
    // Create driver with live coordinates (approx 1.5km from pickup)
    await pool.execute(
      "INSERT IGNORE INTO drivers (id, user_id, full_name, phone, vehicle_make, vehicle_model, license_plate, current_latitude, current_longitude, is_available) VALUES (?, ?, 'Cheikh Fall', '+220771234567', 'Toyota', 'Prius', 'DK-1234-A', 13.4680, -16.5850, 1)",
      [driverId, "drv-usr-track"]
    )
    
    // Create active ride ('arriving' status)
    await pool.execute(
      "INSERT IGNORE INTO rides (id, client_id, client_user_id, driver_id, pickup_address, pickup_latitude, pickup_longitude, destination_address, destination_latitude, destination_longitude, status, total_fare) VALUES (?, 'cli', 'cli-usr', ?, 'Banjul Market', 13.4549, -16.5790, 'Senegambia Strip', 13.4300, -16.7100, 'arriving', 350)",
      [rideId, driverId]
    )

    // Also update existing if IGNORE bypassed it
    await pool.execute(
      "UPDATE rides SET status = 'arriving', driver_id = ? WHERE id = ?",
      [driverId, rideId]
    )
    
    console.log("http://localhost:3001/client/ride/" + rideId)
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
