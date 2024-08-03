const axios = require('axios');
const URL = 'https://desktop-notifier.onrender.com/ping';
function pingServer() {
  axios.get(URL)
    .then(response => {
      console.log('Ping successful:', response.status);
    })
    .catch(error => {
      console.error('Error pinging server:', error);
    });
}
// Ping every 5 minutes (300000 milliseconds)
setInterval(pingServer, 300000);
// Initial ping
pingServer();
