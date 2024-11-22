Microservice Debugging Proxy
============================

**Microservice Debugging Proxy** is a lightweight, Node.js-based tool designed to intercept, log, and debug HTTP traffic in real-time. Built for developers working with microservices, it provides an easy-to-use interface for inspecting requests and responses, replaying requests, and enhancing visibility into API interactions.

This project is under active development and aims to complement workflows in distributed systems, third-party API integrations, and local debugging environments.

* * * * *

Features
--------

-   **Real-Time Request Logging**: Capture and inspect incoming and outgoing HTTP requests and responses.
-   **Error Highlighting**: Automatically flag requests with error status codes (4xx/5xx).
-   **Request Replay**: Modify and resend captured requests directly from the interface.
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

    git clone https://github.com/your-username/microservice-proxy.git
    cd microservice-proxy

2.  Install dependencies for both backend and frontend:

    ```bash

    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install

### Running the Project

1.  Start the backend proxy server:

    ```bash

    cd backend
    npm run dev

2.  Start the frontend dashboard:

    ```bash

    cd ../frontend
    npm run serve

3.  Open the dashboard in your browser:

    `http://localhost:3000`

4.  Configure your client application to use the proxy by setting its base URL to:

    `http://localhost:5000`

* * * * *

Directory Structure
-------------------

```bash

microservice-proxy/
├── backend/               # Backend proxy service
├── frontend/              # Frontend Vue.js dashboard
├── docker/                # Docker configurations (optional)
├── docs/                  # Documentation and guides
├── .gitignore             # Git ignore file
├── LICENSE                # License file
└── README.md              # Project overview
```

* * * * *

Contributing
------------

Contributions are welcome! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or fix.
3.  Commit your changes with clear messages.
4.  Submit a pull request with a detailed description of your work.

* * * * *

Roadmap
-------

-   [ ]  Basic request/response logging
-   [ ]  Error highlighting for 4xx/5xx status codes
-   [ ]  Request replay functionality
-   [ ]  Filtering by endpoint, method, or status
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
----------------

MacKenzie Clark
GitHub: mac-clark
Website: https://clarkcodes.dev