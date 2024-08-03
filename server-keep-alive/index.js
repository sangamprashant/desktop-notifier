const express = require("express");
const axios = require("axios");
const schedule = require("node-schedule");
const path = require("path");

const app = express();
const PORT = 3000;

// Replace with your Replit URL
const REPLIT_URL =
  "https://405a7f5e-dd2b-40aa-844d-1f43c5aaeb2f-00-28m09n76xiw8m.sisko.replit.dev/ping";

// Function to send a request to the Replit instance
async function pingReplit() {
  try {
    const response = await axios.get(REPLIT_URL);
    console.log("Pinged Replit successfully:", response.data);
  } catch (error) {
    console.error("Error pinging Replit:", error.message);
  }
}

// Schedule a ping every 5 minutes
schedule.scheduleJob("*/5 * * * *", pingReplit);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../server.html"));
});

app.listen(PORT, () => {
  console.log(`Ping server is running on port ${PORT}`);
});
