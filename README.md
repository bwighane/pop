# ADX Products Populator

This is a script that loads products into ADX from a CSV file.

## Dependencies

The script uses a number of projects and dependencies to work properly:

- [NodeJS > v10.12](https://nodejs.org/en/download/ "node")
- [MySQL v5.5](https://dev.mysql.com/downloads/mysql/ "mysql")

## Installation

### step 1: clone the project

Clone this repository into your local directory, Use the commands below:

```sh
# clone project to a computer
git clone https://github.com/Kuunika/adx-products-populator

# navigate to the project root directory
cd adx-products-populator
```

### step 2: dependencies installation

Install all the dependencies

```sh
# install dependencies
npm install
```

### step 3: Data files

Copy data files to the data directory in the root directory.

### step 4: database

Create a schema in mysql database called `dhis2-integration-mediator`:

```sh
# connect to mysql database
# note: replace 'user' with your real mysql user name in the command bellow
mysql -u user -p
# enter the specified user password in the prompt

# create the database
CREATE DATABASE `dhis2-integration-mediator`;

# select the created database
use `dhis2-integration-mediator`;

# load database structure
source data/schema.sql;

# exist from mysql
\q
```

### step 5:  environmental variables

Create a `.env` file with the contents of your .env.default file.

```sh
# copy the .env.default to .env file
cp .env.default .env
```

Modify the `.env` file and make sure it reflects the environment settings.

### step 6: start the script

```sh
# start the worker
npm start
```
