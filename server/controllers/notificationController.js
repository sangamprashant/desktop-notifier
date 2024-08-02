exports.sendNotification = async (req, res, wss, clients) => {
    const { title, message, projectId } = req.body;
  
    // Validate input
    if (!title || !message || !projectId) {
      return res
        .status(400)
        .send({ message: "Missing required fields: title, message, or projectId.", success: false });
    }
  
    try {
      // Retrieve clients for the specified projectId
      const projectClients = clients[projectId];
  
      // Check if there are clients for the given projectId
      if (!projectClients || projectClients.length === 0) {
        return res.status(404).send({ message: "No clients found for the given projectId.", success: false });
      }
  
      // Send notification to each client
      projectClients.forEach((client) => {
        // Ensure the WebSocket connection is open
        if (client.readyState === 1) {
          client.send(JSON.stringify({ title, message }));
        } else {
          // Optionally handle clients with closed connections
          console.log(`Client with ID ${client.id} is not connected.`);
        }
      });
  
      // Send success response
      res.status(200).send({ message: "Notification sent successfully!", success: true });
    } catch (error) {
      // Log error and send error response
      console.error("Error sending notification:", error);
      res.status(500).send({ message: "Internal Server Error", success: false });
    }
  };
  