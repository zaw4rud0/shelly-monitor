# shelly-monitor

A simple monitor for a Shelly Plus H&T device

## Features

* Real-time data collection from your Shelly Plus H&T devices via WebSocket.
* Data persistence in a MariaDB database.
* A locally hosted web interface for data visualization.
* Graphs displaying the temperature and humidity, as well as the status of the Shelly device.

## Installation

### Prerequisites

* Node.js (version 12 or higher)
* MariaDB
* A Shelly Plus H&T device
* A Shelly cloud account

### Installation

1. Clone the repository
```shell
git clone https://github.com/zaw4rud0/shelly-monitor.git
```
2. Install dependencies
```shell
npm install
```
3. Set up the environment by creating a file `.env` file and setting its content as follows:
```
DB_HOST=localhost
DB_USER=shelly
DB_PASS=shelly123
DB_NAME=measurements
PORT=443
```
Note that you can replace any of the fields as you desire as long as you change it in the code as well.
4. Database setup
```sql
mariadb -u shelly -p measurements < path/to/database_setup.sql
```
Create a database of the following structure:
```
+-------------+------------+------+-----+---------+----------------+
| Field       | Type       | Null | Key | Default | Extra          |
+-------------+------------+------+-----+---------+----------------+
| id          | int(11)    | NO   | PRI | NULL    | auto_increment |
| timestamp   | bigint(20) | YES  |     | NULL    |                |
| temperature | float      | YES  |     | NULL    |                |
| humidity    | float      | YES  |     | NULL    |                |
| charge      | int(11)    | YES  |     | NULL    |                |
+-------------+------------+------+-----+---------+----------------+
```
5. Start the server
```sh
node server.js
```

### Connect the device to the application

* Go to https://control.shelly.cloud and navigate to your Shelly device panel.
* Enter your Webhook address to connect your device. It has the structure of `ws://<ip_address>:<port>`. This step is necessary to allow your Shelly device to send measurement updates to this application.

## Usage

After starting the server, open a web browser and navigate to `http://localhost:443` (or the post you configured) to view the dashboard. The dashboard will display the data it receives from your Shelly Plus H&T device.

## License

This project is licensed under the MIT license. For more details, see the [license](LICENSE).

## Roadmap

- [x] Use Express.js as backbone of the application.
- [x] Integrate websocket server into the application.
- [x] Use common European date and time format.
- [x] Add widget that shows the current temperature and humidity, as well as the battery charge of the Shelly.
- [x] Use an integrated database instead of JSON files for storage. Use MariaDB as the relational database management system.  
- [ ] Improve UI (especially on mobile devices) and make it more user-friendly
- [ ] Light/dark mode switch
- [ ] Make the dashboard reactive to new data from the Shelly.