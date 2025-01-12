<template>
  <div class="target-selector">
    <h3>Select Target Port</h3>
    <input
      type="number"
      v-model="targetPort"
      placeholder="Enter target port (e.g., 5000)"
    />
    <button @click="checkPortAvailability">Check Port</button>
    <span v-if="portStatus" :class="portStatusClass">{{ portStatusMessage }}</span>
    <button @click="updateTarget">Update Target</button>
    <p class="current-target">
      Current Target Port: <span v-if="currentTarget">{{ currentTarget }}</span>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      targetPort: '', // User input for target port
      portStatus: null, // Status of the port (e.g., "open", "closed", "restricted")
      portStatusMessage: '', // Message to display based on port status
      currentTarget: null, // Current target port fetched from the backend
    };
  },
  computed: {
    portStatusClass() {
      return {
        success: this.portStatus === 'open',
        error: this.portStatus === 'closed' || this.portStatus === 'restricted',
      };
    },
  },
  methods: {
    async checkPortAvailability() {
      try {
        const response = await fetch(
          `http://localhost:4000/check-port?port=${this.targetPort}`
        );
        const data = await response.json();
        this.portStatus = data.status;
        this.portStatusMessage = data.message;
      } catch (error) {
        console.error('Error checking port availability:', error);
        this.portStatus = 'error';
        this.portStatusMessage = 'Unable to check port availability.';
      }
    },
    async updateTarget() {
      try {
        const response = await fetch('http://localhost:4000/update-target', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ port: this.targetPort }),
        });
        const data = await response.json();
        alert(data.message); // Notify the user of the update
        this.fetchCurrentTarget(); // Refresh the displayed current target
      } catch (error) {
        console.error('Error updating target port:', error);
      }
    },
    async fetchCurrentTarget() {
      try {
        const response = await fetch('http://localhost:4000/current-target');
        const data = await response.json();
        this.currentTarget = data.target; // Set the current target port
      } catch (error) {
        console.error('Error fetching current target port:', error);
      }
    },
  },
  mounted() {
    this.fetchCurrentTarget(); // Fetch the current target when the component loads
  },
};
</script>

<style>
.target-selector {
  display: flex;
  align-items: center; /* Align items vertically */
  gap: 10px; /* Add spacing between elements */
  margin: 10px 0;
  font-family: inherit;
}

.target-selector h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.target-selector input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease-in-out;
}

.target-selector input[type="number"]:focus {
  border-color: #007bff; /* Highlight border on focus */
}

.target-selector button {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.target-selector button:hover {
  background-color: #0056b3;
}

.target-selector button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.target-selector span {
  font-size: 14px;
  font-weight: 600;
}

.target-selector .success {
  color: #28a745; /* Green for success */
}

.target-selector .error {
  color: #dc3545; /* Red for errors */
}

.target-selector .current-target {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
</style>
