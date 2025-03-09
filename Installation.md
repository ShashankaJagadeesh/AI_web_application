## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or above)
- [MySQL](https://www.mysql.com/) database

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone <Insert-repo-url>
   cd ai-web-app-backend
2. **Install Dependencies**
   ```bash
   npm install
3. **Configure Environment Variables**:
   Create a .env file in the backend folder with the following content:
   ```bash
    PORT=5000
    DB_DIALECT=mysql
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=your_db_password
    DB_NAME=ai_web_app
    JWT_SECRET=your_secret_key
    OPENAI_API_KEY=your_openai_api_key
    MISTRAL_API_KEY=your_mistral_api_key
4. **Set up the Database**
   ```bash
    CREATE DATABASE ai_web_app;
    USE ai_web_app;
5. Create the users table:
   ```bash
    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
   ```
6. Create the queries table
   ```bash
    CREATE TABLE queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    query_text TEXT NOT NULL,
    option_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
   ```
 7. Start the server
     ```bash
     node server.js
     ```
### Frontend Setup
Install dependencies and start server
  ```bash
    npm install
    npm start
  ```

### Additional Notes:
Ensure that the backend server is running before starting the frontend.
If you encounter any CORS issues, configure the cors settings in server.js.
Verify the .env file contains the correct database credentials and API keys.
This completes the installation process.






    

   
