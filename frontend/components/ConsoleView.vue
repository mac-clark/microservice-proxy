<template>
  <div class="console-view">
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Level</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="log in sortedLogs" :key="log.timestamp + log.message">
          <tr>
            <td>{{ log.timestamp }}</td>
            <td :class="log.level">{{ log.level }}</td>
            <td>{{ log.message }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      consoleLogs: [], // Logs fetched from the backend or added in real-time
    };
  },
  computed: {
    // Sort logs to display the latest first
    sortedLogs() {
      return [...this.consoleLogs].reverse();
    },
  },
  methods: {
    // Add a new console log
    addConsoleLog(log) {
      this.consoleLogs.push(log);

      if (this.consoleLogs.length > 100) {
        this.consoleLogs.shift();
      }
    },
  },
};
</script>
  
  <style>
  .console-view table {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border-spacing: 0;
    border-collapse: collapse;
  }
  
  .console-view th,
  .console-view td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
  }
  
  .console-view th {
    font-weight: 600;
    background-color: #f9f9f9;
  }
  
  .console-view td {
    font-size: 14px;
    color: #555;
  }
  
  .console-view td.log {
    color: #28a745; /* Green for logs */
    font-weight: bold;
  }
  
  .console-view td.error {
    color: #dc3545; /* Red for errors */
    font-weight: bold;
  }
  
  .console-view td.warn {
    color: #ffc107; /* Yellow for warnings */
    font-weight: bold;
  }
  </style>  