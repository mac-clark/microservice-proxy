<template>
    <div class="filter-bar">
      <label>
        Method:
        <select v-model="methodFilter" @change="applyFilter">
          <option value="">All</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
      <label>
        Status:
        <select v-model="statusFilter" @change="applyFilter">
          <option value="">All</option>
          <option value="200">2xx (Success)</option>
          <option value="300">3xx (Redirect)</option>
          <option value="400">4xx (Client Error)</option>
          <option value="500">5xx (Server Error)</option>
        </select>
      </label>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        methodFilter: '', // Stores the selected HTTP method filter
        statusFilter: '', // Stores the selected status range (e.g., 2 for 200s)
      };
    },
    methods: {
      applyFilter() {
        // Emit the selected filters to the parent component
        this.$emit('filter', {
          method: this.methodFilter,
          status: this.statusFilter,
        });
      },
    },
  };
  </script>
  
  
  <style>
  .filter-bar {
    margin: 10px 0;
    display: flex;
    gap: 15px;
  }
  label {
    font-weight: bold;
  }
  select {
    margin-left: 5px;
  }
  </style>
  