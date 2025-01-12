<template>
  <div id="app">
    <header class="app-header">
      <h1>LogJam <span class="help-icon" @click="toggleHelp">?</span></h1>
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
        </ul>
        <p>
          For more detailed documentation, visit the
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
    <div class="controls">
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
      <TargetSelector @updateTarget="updateTarget" />
    </div>
    <FilterBar @filter="updateFilters" />
    <LogTable :filters="filters" />
  </div>
</template>

<script>
import FilterBar from '/components/FilterBar.vue';
import LogTable from '/components/LogTable.vue';
import TargetSelector from '/components/TargetSelector.vue';

export default {
  components: {
    FilterBar,
    LogTable,
    TargetSelector,
  },
  data() {
    return {
      filters: {},
      method: 'GET', // Default HTTP method
      apiRoute: '', // Route entered by the user
      showHelp: false, // Toggles the help dropdown
    };
  },
  methods: {
    updateFilters(newFilters) {
      this.filters = newFilters;
    },
    toggleHelp() {
      this.showHelp = !this.showHelp;
    },
    sendRequest() {
      if (!this.apiRoute) {
        alert('Please enter a valid API route.');
        return;
      }
      console.log(`Sending ${this.method} request to: ${this.apiRoute}`);
      // Placeholder for backend integration
    },
    updateTarget(newTarget) {
      console.log('Updated target port:', newTarget);
    },
  },
};
</script>

<style>
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
  align-items: center;
  gap: 10px;
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