<template>
  <div class="log-table">
    <div class="legend">
      <span class="legend-item success">Success (2xx)</span>
      <span class="legend-item redirect">Redirect (3xx)</span>
      <span class="legend-item warning">Warning (4xx)</span>
      <span class="legend-item error">Error (5xx)</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Method</th>
          <th>URL</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="log in filteredLogs" :key="log.timestamp + log.url">
          <!-- Main Row -->
          <tr @click="toggleExpanded(log)">
            <td>{{ log.timestamp }}</td>
            <td>{{ log.method }}</td>
            <td>{{ log.url }}</td>
            <td
              :class="{
                success: log.status >= 200 && log.status < 300,
                redirect: log.status >= 300 && log.status < 400,
                warning: log.status >= 400 && log.status < 500,
                error: log.status >= 500,
              }"
            >
              {{ log.status }}
            </td>
            <td>
              <button @click="replayRequest(log)">Replay</button>
            </td>
          </tr>
          <!-- Expanded Row -->
          <tr v-if="expandedLog === log">
            <td colspan="5">
              <div class="log-details">
                <h4>Request Details</h4>
                <pre>{{ log.body }}</pre>
                <h4>Response Details</h4>
                <pre>{{ log.responseBody }}</pre>
                <h4>Headers</h4>
                <pre>{{ log.responseHeaders }}</pre>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      logs: [], // Logs fetched from the backend or added in real-time
      expandedLog: null, // Tracks the currently expanded log
      maxLogs: 100, // Maximum number of logs to retain
    };
  },
  computed: {
    filteredLogs() {
      return this.logs
        .slice() // Create a shallow copy to avoid mutating the original array
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort logs by timestamp (newest first)
        .filter((log) => {
          const methodMatch = this.filters.method
            ? log.method === this.filters.method
            : true;

          const statusMatch = this.filters.status
            ? Math.floor(log.status / 100) === parseInt(this.filters.status) / 100
            : true;

          return methodMatch && statusMatch;
        });
    },
  },
  mounted() {
    this.fetchLogs(); // Fetch existing logs initially
  },
  methods: {
    async fetchLogs() {
      try {
        const response = await fetch("http://localhost:4000/logs");
        this.logs = await response.json();
        this.trimLogs(); // Ensure we only keep the latest 100 logs
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    },
    trimLogs() {
      if (this.logs.length > this.maxLogs) {
        this.logs.splice(0, this.logs.length - this.maxLogs); // Remove oldest logs
      }
    },
    toggleExpanded(log) {
      this.expandedLog = this.expandedLog === log ? null : log;
    },
    addLog(newLog) {
      // Ensure the logs array doesn't exceed the maxLogs limit
      this.logs.push(newLog);
      if (this.logs.length > this.maxLogs) {
        this.logs.shift(); // Remove the oldest log
      }
    },
    replayRequest(log) {
      this.$emit("replay", log); // Emit the log entry to the parent for replay
    },
  },
};
</script>

<style>
.log-table {
  margin: 20px auto;
  width: 100%;
  overflow-x: auto;
  border-spacing: 0;
  border-collapse: collapse;
}

table {
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
}

th {
  font-weight: 600;
  background-color: #f9f9f9;
}

td {
  font-size: 14px;
  color: #555;
}

tr:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}

/* Legend Styles */
.legend {
  margin: 10px 0;
  text-align: left;
  font-size: 14px;
  display: flex;
  gap: 15px;
}

.legend-item {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.legend-item.success {
  background-color: #d4edda; /* Light green */
  color: #28a745; /* Green text */
}

.legend-item.redirect {
  background-color: #d1ecf1; /* Light blue */
  color: #007bff; /* Blue text */
}

.legend-item.warning {
  background-color: #fff3cd; /* Light yellow */
  color: #ffc107; /* Yellow text */
}

.legend-item.error {
  background-color: #f8d7da; /* Light red */
  color: #dc3545; /* Red text */
}

.success {
  color: #28a745; /* Green for 200s */
  font-weight: bold;
}

.redirect {
  color: #007bff; /* Blue for 300s (redirects) */
  font-weight: bold;
}

.warning {
  color: #ffc107; /* Yellow for 400s */
  font-weight: bold;
}

.error {
  color: #ff3b30; /* Apple’s error red */
  font-weight: 600;
}

.log-details {
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  font-family: monospace;
  font-size: 13px;
}

h4 {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
}
</style>