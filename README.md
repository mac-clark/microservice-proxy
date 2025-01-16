LogJam: Microservice Debugging Proxy
====================================

**LogJam** is a lightweight, Node.js-based tool designed to intercept, log, and debug HTTP traffic in real-time. Built for developers working with microservices, it provides an intuitive interface for inspecting requests and responses, replaying requests, and enhancing visibility into API interactions. With the addition of the **Debug Agent**, you can now capture console logs from the target server for complete debugging insights.

* * * * *

Features
--------

-   **Real-Time Request Logging**: Capture and inspect incoming and outgoing HTTP requests and responses.
-   **Error Highlighting**: Automatically flag requests with error status codes (4xx/5xx).
-   **Request Replay**: Modify and resend captured requests directly from the interface.
-   **Console Log Integration**: Capture and display console logs from the target server via a debug agent.
-   **Intuitive Dashboard**: Vue.js-powered dashboard for visualizing and filtering logs.
-   **Lightweight and Fast**: Designed to minimize overhead on your development environment.

* * * * *

Getting Started
---------------

Follow these steps to get the project up and running:

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management

### Installation

1.  Clone this repository:

    ```bash
    git clone https://github.com/mac-clark/microservice-proxy
    ```

2.  Install dependencies for both backend and frontend:

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

### Running the Project

1.  Start the backend proxy server:

    ```bash
    cd backend
    npm run dev
    ```

2.  Start the frontend dashboard:

    ```bash
    cd ../frontend
    npm run serve
    ```

3.  Open the dashboard in your browser:

    `http://localhost:8080`

4.  Configure your client application to use the proxy by setting its base URL to:

    `http://localhost:PORT`

    4a. You can target any port with this proxy, and can easily configure the target port in the dashboard, you of course will need to change your application's port to be the same.

* * * * *

Debug Agent Setup
-----------------

The **Debug Agent** allows you to capture console logs from the target server. Follow these steps to set it up:

### Including the Debug Agent in Your Target Server

1.  Install the Debug Agent:

    ```bash
    npm install logjam-debug-agent
    ```

2.  Import and start the Debug Agent in your server (node.js):

    ```
    const debugAgent = require('./debug-agent');

    ... Application Logic ...

    const PORT = 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

    debugAgent.start(server);
    ```

3.  Run your target server as usual. The Debug Agent will start a WebSocket server on `ws://localhost:PORT` and capture console logs (`console.log`, `console.error`, `console.warn`).

### Viewing Console Logs in LogJam

1.  Ensure that your target server is running with the Debug Agent enabled.
2.  Open LogJam at `http://localhost:8080`.
3.  Switch to the "Console Logs" tab to view real-time console output from your target server.

* * * * *

Directory Structure
-------------------

```
logjam/
├── backend/               # Backend proxy service
├── frontend/              # Frontend Vue.js dashboard
├── debug-agent/           # Debug Agent module
├── .gitignore             # Git ignore file
├── LICENSE                # License file
└── README.md              # Project overview
```

Roadmap
-------

-   [x]  Basic request/response logging
-   [x]  Error highlighting for 4xx/5xx status codes
-   [x]  Request replay functionality
-   [x]  Console log capture via Debug Agent
-   [ ]  Advanced filtering by endpoint, method, or status
-   [ ]  Integration with Postman and Swagger
-   [ ]  Docker support for easy deployment

* * * * *

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.

* * * * *

Acknowledgements
----------------

-   Built with [Node.js](https://nodejs.org/) and [Vue.js](https://vuejs.org/)
-   Inspired by developer workflows in debugging and microservice testing.

* * * * *

Author
------

**[MacKenzie Clark](https://clarkcodes.dev)**\
GitHub: [mac-clark](https://github.com/mac-clark)\
Website: [https://clarkcodes.dev](https://clarkcodes.dev/)
