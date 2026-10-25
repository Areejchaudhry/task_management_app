# TaskFlow – Task Management System

A simple and responsive task management application that allows users to organize, manage, and track their tasks efficiently. This project demonstrates full-stack web development using a frontend interface, a Node.js backend, and MongoDB for data storage.

## 📌 Project Information

- **Project Name:** TaskFlow – Task Management System
- **Project Type:** Full-Stack Web Application
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Purpose:** To provide a simple way to create, view, update, and delete tasks.

## ✨ Features

- **Create Tasks:** Add new tasks with relevant details.
- **View Tasks:** Display saved tasks in an organized interface.
- **Update Tasks:** Edit existing task information.
- **Delete Tasks:** Remove tasks when they are no longer needed.
- **REST API:** Perform CRUD operations using HTTP methods.
- **Database Integration:** Store and retrieve tasks using MongoDB.
- **Input Validation:** Validate task data before processing requests.
- **Error Handling:** Handle invalid inputs and API errors.
- **Responsive Interface:** Use the application across different screen sizes, depending on the implemented styling.

## 🛠️ Technologies Used

| Technology & Purpose
| HTML : Structure of the application 
| CSS : Styling and layout 
| JavaScript : Frontend functionality and API requests 
| Node.js : Server-side JavaScript runtime 
| Express.js : Backend routing and REST API 
| MongoDB : Database for storing tasks 

## ⚙️ Prerequisites

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Git (optional, for cloning the repository)

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Areejchaudhry/task_management_app

### 2. Navigate to the Project Folder

```bash
cd Task2
```


### 3. Install Dependencies

```bash
npm install
```

### 4. Start MongoDB

Make sure your MongoDB server is running.

If you use a local MongoDB installation on Windows and have configured the data directory as `C:\data\db`, open a terminal and run:

```bash
mongod --dbpath C:\data\db
```

Keep this terminal open while running the application. If MongoDB is already running as a Windows service, you do not need to start it again manually.

### 5. Start the Application

Open another terminal in the project directory and run:

```bash
npm start
```

If your project uses a development script, you can also run:

```bash
npm run dev
```

### 6. Open the Application

Open the local URL displayed in your terminal. For example, if your server runs on port 3000, visit:

```text
http://localhost:3000
```

If the frontend is served separately, open the frontend's configured URL instead.

## 📁 Project Structure

The project may be organized similarly to the following:

Task2/
├── public/             # Frontend files, if configured
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js           # Backend server
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Locked dependency versions
└── README.md           # Project documentation
```

Your actual directory structure may differ.

## 🎯 Learning Outcomes

Through this project, I practiced:

- Building a frontend interface with HTML, CSS, and JavaScript.
- Developing RESTful APIs with Node.js and Express.js.
- Connecting a backend application to MongoDB.
- Implementing Create, Read, Update, and Delete (CRUD) operations.
- Handling validation and errors in a full-stack application.
- Running and testing a web application locally.

## 👩‍💻 Author

Developed as a full-stack web development practice project.

---

**TaskFlow – Organize your tasks, manage your time, and stay productive.**
