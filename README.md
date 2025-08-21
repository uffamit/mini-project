

-----

# A Mini Project On: Password Strength Checker

A full-stack web application designed for real-time password strength analysis. This project provides users with immediate, comprehensive feedback to help them create stronger, more secure passwords using a modern tech stack.

**Submitted in partial fulfillment of the requirements for the Second Year B.Sc. in Computer Science (SYBSc CS).**

  - **College:** KPG College
  - **Submitted By:** `[]`
  - **Under the Guidance of:** `[Teacher`

-----

## Project Abstract

In today's digital environment, strong passwords are the first line of defense for securing personal information. This project presents a **Password Strength Checker**, a full-stack web application developed to address the common issue of weak password creation. The application is built with **Next.js** for the frontend, and a **Node.js** server with **Express.js** for the backend logic and API. **MongoDB** is used as the database to store user and analysis data. It provides users with real-time, pattern-based analysis of their passwords, offering visual feedback and actionable suggestions for improvement. Registered users can also securely track their analysis history, promoting better long-term password hygiene.

-----

## Features

  * ✅ **Real-Time Strength Analysis:** The system evaluates password strength instantly as the user types.
  * 📊 **Visual Feedback System:** An intuitive progress bar and a detailed checklist provide clear feedback on password criteria.
  * 🔐 **Secure User Authentication:** A custom-built authentication system handles secure user sign-up, login, and session management.
  * 🗂️ **Personalized Analysis History:** Authenticated users can view a history of their past password checks, which are securely stored in the database.
  * 📱 **Responsive Design:** The user interface is fully responsive and optimized for both desktop and mobile devices.

-----

##  Technology Stack

  * **Frontend:** Next.js, React, Tailwind CSS
  * **Backend:** Node.js, Express.js
  * **Database:** MongoDB
  * **Runtime Environment:** Node.js

-----

## Getting Started

To set up and run this project locally, please follow the steps below.

### Prerequisites

  * Node.js (v18.x or later)
  * npm (or yarn)
  * MongoDB installed locally or a connection string for a cloud instance (e.g., MongoDB Atlas)

### \#\#\# Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/uffamit/mini-project.git
    cd mini-project
    ```

2.  **Install project dependencies:**
    *(Assuming your frontend and backend are in separate directories like `client` and `server`)*

    ```bash
    # Install frontend dependencies
    cd client
    npm install

    # Install backend dependencies
    cd ../server
    npm install
    cd ..
    ```

3.  **Configure Environment Variables:**

      * In the `server` directory, create a file named `.env`.
      * Add your database connection string and a secret for session management.

    <!-- end list -->

    ```env
    # server/.env - Backend Environment Variables
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="your_super_secret_key_for_sessions"
    ```

-----

##  Development

To run the application, you will need to start both the backend server and the frontend development server in separate terminals.

1.  **Run the Backend Server:**

    ```bash
    cd server
    npm run start # Or your configured script
    ```

2.  **Run the Frontend Development Server:**

    ```bash
    cd client
    npm run dev
    ```

Open [http://localhost:3000] in your browser to view the running application.

-----

##  Building for Production

To create an optimized production build of the application:

```bash
# From the client directory
npm run build
```

The build artifacts will be stored in the `.next` directory.

-----

## Project Structure

```
.
├── .idx
├── docs
├── public
├── src
│   ├── ai
│   │   ├── flows
│   │   └── ...
│   ├── app
│   │   ├── dashboard
│   │   ├── login
│   │   ├── signup
│   │   └── ...
│   ├── components
│   │   ├── layout
│   │   ├── ui
│   │   └── ...
│   ├── context
│   ├── hooks
│   └── lib
├── .gitignore
├── apphosting.yaml
├── components.json
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

-----

##  License

This project is licensed under the MIT License.

-----

## Acknowledgement

## We would like to express our sincere gratitude to our guide, **`[Teacher]`**, for their invaluable mentorship and support throughout this project. We are also thankful to the Department of Computer Science at **KPG College** for providing us with the necessary resources and a conducive environment for learning.
