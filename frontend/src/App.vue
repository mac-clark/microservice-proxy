<template>
  <div id="app">
    <header class="app-header">
      <h1>LogJam <span class="help-icon" @click="toggleHelp">?</span></h1>
      <label class="download-toggle">
        <input
          type="checkbox"
          v-model="downloadLogs"
        />
        Download Session Logs
      </label>
      <div v-if="showHelp" class="help-dropdown">
        <div class="help-header">
          <h3>How to Use LogJam</h3>
          <button class="close-help" @click="toggleHelp">X</button>
        </div>
        <p>
          LogJam is designed for local microservice development as a debugging tool. 
          It allows you to:
        </p>
        <ul>
          <li>Inspect and analyze API requests and responses in real-time.</li>
          <li>Filter requests by HTTP method or status code.</li>
          <li>Set a target port for the local application you're debugging.</li>
          <li>View detailed logs, including request and response headers and bodies.</li>
          <li>
            <strong>Console Logs:</strong> Switch to the "Console" tab to view backend console logs in real-time.<br />This requires implementation of the debug-agent provided. Read more in the README for instructions.
          </li>
          <li>
            <strong>Download Session Logs:</strong> Toggle this feature on to
            automatically download all session logs as a JSON file when the app exits.
          </li>
        </ul>
        <p>
          For more detailed documentation, visit our
          <a
            href="https://github.com/mac-clark/microservice-proxy/blob/master/README.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub README
          </a>.
        </p>
      </div>
    </header>
    <TargetSelector ref="targetSelector" @updateTarget="updateTarget" />
    <div class="tabs">
      <button
        :class="{ active: activeTab === 'api' }"
        @click="activeTab = 'api'"
      >
        API Logs
      </button>
      <button
        :class="{ active: activeTab === 'console' }"
        @click="activeTab = 'console'"
      >
        Console Logs
      </button>
    </div>
    <div class="tab-content">
      <div v-show="activeTab === 'api'" class="api-panel">
        <div class="request-controls">
          <select v-model="method" class="method-selector">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            v-model="apiRoute"
            class="route-input"
            placeholder="/api-route?query"
          />
          <button @click="sendRequest">Run</button>
        </div>
        <FilterBar @filter="updateFilters" />
        <LogTable ref="logTable" :filters="filters" @replay="sendRequest" />
      </div>
      <ConsoleView v-show="activeTab === 'console'" ref="consoleView" />
    </div>
  </div>
</template>

<script>
import FilterBar from '/components/FilterBar.vue';
import LogTable from '/components/LogTable.vue';
import TargetSelector from '/components/TargetSelector.vue';
import ConsoleView from '/components/ConsoleView.vue';

export default {
  components: {
    FilterBar,
    LogTable,
    TargetSelector,
    ConsoleView,
  },
  data() {
    return {
      activeTab: 'api', // Tracks the active tab: 'api' or 'console'
      filters: {},
      method: 'GET', // Default HTTP method
      apiRoute: '', // Route entered by the user
      showHelp: false, // Toggles the help dropdown
      downloadLogs: false, // Toggle for downloading session logs
      socket: null, // WebSocket instance
    };
  },
  methods: {
    updateFilters(newFilters) {
      this.filters = newFilters;
    },
    toggleHelp() {
      this.showHelp = !this.showHelp;
    },
    updateTarget(newTarget) {
      console.log('Updated target port:', newTarget);
    },
    sendRequest(log = null) {
      // Determine if this is a replay or a new request
      const isReplay = log && typeof log === 'object' && log.url && log.method;

      const apiRoute = isReplay ? log?.url : this.apiRoute;

      // Validate the API route
      if (!apiRoute || !apiRoute.trim()) {
        alert("Please enter a valid API route.");
        return;
      }

      const sanitizedRoute = apiRoute.trim();

      // Ensure the target port is set
      const targetPort = this.$refs.targetSelector?.currentTarget;
      if (!targetPort) {
        alert("Target port is not set. Please configure the target.");
        return;
      }

      console.log(
        `${isReplay ? "Replaying" : "Sending"} ${isReplay ? log.method : this.method} request to: ${sanitizedRoute}`
      );

      // Prepare the payload
      const payload = {
        method: isReplay ? log.method : this.method,
        url: sanitizedRoute,
        targetHost: "http://localhost", // Adjust if the target is not localhost
        targetPort,
      };

      if (isReplay) {
        payload.headers = log?.headers || {};
        payload.body = log?.body || null;
      } else if (["POST", "PUT", "PATCH"].includes(payload.method)) {
        payload.body = JSON.stringify({ example: "data" }); // Replace with actual data input
        payload.headers = { "Content-Type": "application/json" };
      }

      // Send the request to the backend
      fetch("http://localhost:4000/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(`${isReplay ? "Replayed" : "Sent"} response:`, data);

          // Add the response log to the existing logs
          this.$refs.logTable.addLog({
            timestamp: new Date().toISOString(),
            method: payload.method,
            url: sanitizedRoute,
            status: data.status,
            responseHeaders: data.headers,
            responseBody: data.body,
          });
        })
        .catch((error) => {
          console.error(
            `Error ${isReplay ? "replaying" : "sending"} request:`,
            error
          );
        });
    },
    connectWebSocket() {
      // Connect to proxy server WebSocket
      this.socket = new WebSocket('ws://localhost:4000');
      this.socket.onopen = () => console.log('WebSocket connected to proxy server');
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'log') {
          this.$refs.logTable.logs.push(message.data);
        }
      };
      this.socket.onclose = () => console.log('WebSocket disconnected from proxy server');
      this.socket.onerror = (error) => console.error('WebSocket error from proxy server:', error);

      // Connect to debug agent WebSocket
      this.debugSocket = new WebSocket('ws://localhost:5000/debug');
      this.debugSocket.onopen = () => console.log('WebSocket connected to debug-agent');
      this.debugSocket.onmessage = (event) => {
        const log = JSON.parse(event.data);
        console.log('Received console log from debug-agent:', log);

        // Safeguard to ensure the ref exists before calling the method
        if (this.$refs.consoleView?.addConsoleLog) {
          this.$refs.consoleView.addConsoleLog(log);
        } else {
          console.warn('consoleView ref is not available yet. Skipping log addition.');
        }
      };
      this.debugSocket.onclose = () => console.log('WebSocket disconnected from debug-agent');
      this.debugSocket.onerror = (error) => console.error('WebSocket error from debug-agent:', error);
    },
  },
  mounted() {
    this.connectWebSocket();
  },
  beforeDestroy() {
    if (this.socket) this.socket.close();
    if (this.debugSocket) this.debugSocket.close();
  },
};
</script>

<style>
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 15px;
  border: 1px solid #007bff;
  background-color: #f5f5f5;
  color: #007bff;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #007bff;
  color: #fff;
}

.tabs button:hover {
  background-color: #0056b3;
  color: #fff;
}

.tab-content {
  margin-top: 20px;
}

.download-toggle {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  margin-left: 20px;
}

.download-toggle input {
  transform: scale(1.2);
  cursor: pointer;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.app-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.help-icon {
  font-size: 18px;
  background-color: #007bff;
  color: #fff;
  padding: 5px 10px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-block;
  text-align: center;
}

.help-icon:hover {
  background-color: #0056b3;
}

.help-dropdown {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-top: 10px;
  font-size: 14px;
  position: relative;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.help-dropdown ul {
  padding-left: 20px;
}

.help-dropdown a {
  color: #007bff;
  text-decoration: none;
}

.help-dropdown a:hover {
  text-decoration: underline;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-help {
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  padding: 5px 10px;
  cursor: pointer;
}

.close-help:hover {
  background-color: #c82333;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.request-controls {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  width: 50%;
}

.method-selector {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.route-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>