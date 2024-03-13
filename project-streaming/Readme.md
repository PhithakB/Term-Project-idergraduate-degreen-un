## Introduction
The project is a term project for undergraduate year 3. Faculty of Engineering Department of Computer Engineering Naresuan University

***Disclaimer***

***This project is not finish 100% and has a little problem***

***Function can work is watch trailer, bookmark(can view in databse but can't view in account), rename***

### Installation

1. Install node.js
    ```sh
    cd frontend
    npm install
    ```
    ```sh
    cd server
    npm install
    ```

2. Run XAMPP and start MySQL

3. Use `Database Client` Extension in VS Code for sure

4. Check .env file for create new connection

5. Create new connection and query database from project-streaming.query


### Start Application
1. Run application
    ```sh
    cd frontend
    npm run dev
    ```
    ```sh
    cd server
    npm run dev
    ```

2. Register and change `level_id` in table `account` in database to 1-5

3. Login by your email and password which you registered

### Built With
    * React
    * Next.js
    * Node.js
    * JWT
