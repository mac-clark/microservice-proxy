<template>
  <div id="app">
    <h1>Microservice Debugging Proxy</h1>
    <FilterBar @filter="updateFilters" />
    <LogTable :filters="filters" />
  </div>
</template>

<script>
import FilterBar from '/components/FilterBar.vue';
import LogTable from '/components/LogTable.vue';

export default {
  components: {
    FilterBar,
    LogTable,
  },
  data() {
    return {
      filters: {}, // Stores the current filters applied
    };
  },
  methods: {
    updateFilters(newFilters) {
      this.filters = newFilters; // Update filters when received from FilterBar
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

h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>

