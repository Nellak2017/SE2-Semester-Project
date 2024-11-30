# Local Go server setup notes

## Table of Contents

## Setup

### WSL and Docker Desktop

Since I already setup WSL2 and Docker Desktop, I can skip this setup step.
However, if you don't have it set up you basically do this generally.

1. Download WSL2 from powershell command. [Microsoft WSL tutorial](https://learn.microsoft.com/en-us/windows/wsl/install)
2. Download Docker from Docker website. [Docker install instructions](https://docs.docker.com/desktop/setup/install/windows-install/)
3. Verify installations by trying the version commands in the command line.

### Downloading Golang

When you download this one, be sure to download it to your user profile at `C:/users/Nellak` to avoid permission errors. 

1. Download Go from the official site. [Go releases](https://go.dev/dl/)
2. Update the GOPATH environment variable to point to your user profile/go/bin.
3. Test it by trying the go version command in your terminal.

### Downloading Postgres and getting db connection info

For this, download postgres in wsl then verify it then start the service. Be sure to gather the db connection info so it can be used by Go. 

#### Gather this info for Go db connection
* username
* password
* port
* db name

=> `connStr := "postgres://username:password@localhost:5432/dbname?sslmode=disable"`

#### Resources
* [WSL postgres tutorial](https://dev.to/sfpear/install-and-use-postgres-in-wsl-423d)

#### Set up Postgres from scratch on wsl
1. Install postgres on wsl using your wsl terminal. 
2. Verify it downloaded in wsl.
3. Set password for default postgres user.
4. Start service and then check it.
5. Get hostname for use in Go from windows.
6. Open psql as default user postgres.
7. Create a new user in Postgres while in psql with some authlevel.
8. Create a database.
9. Grant new user priviledges while in psql.
10. Quit psql.

#### Useful Postgres commands

##### basics
- install psql : `sudo apt-get install postgresql`
- list all Databases (in psql): `\l`
- list all users (in psql): `\du`
- list all tables in current db (in psql): `\dt`
- psql version : `psql --version`
- quit : `\q`

##### opening psql
- open psql as default : `sudo -u postgres psql`
- open psql as user : `sudo -u <user name> psql`
- open psql as user in specific db: `psql -U <user name> -d <db name>`

##### database operations
- create a database: `createdb <db name>`
- change database (in psql): `\c <db name>`
- Create tables in a db from a file (file redirect approach): `psql -U <user name> -q <db name> < <file-path/file.sql>`
- Create tables in a db from a file (psql redirect approach): `psql -U <user name> -d <db name> -f <file-path/file.sql>`
- Create a database (in psql): `CREATE DATABASE <db name> OWNER <user name>;`

##### user operations
- create new user (in psql): `CREATE USER <user name> WITH PASSWORD 'newpassword' SUPERUSER; # all`
- create new user interactive: `sudo -u postgres createuser --interactive`
- set password for user : `sudo passwd <user name>`
- grant user access (in psql): `GRANT ALL PRIVILEGES ON DATABASE <db name> TO <user name>;`
- delete user (in psql): `DROP USER <user name>;`
- login as a user : `su - <user name>`
    - open psql without sudo when logged in: `psql`
    - open db without sudo when logged in: `psql <db name>`

##### services
- start psql service : `sudo service postgresql start`
- check psql service : `sudo service postgresql status`

##### other
- get hostname : `hosstname -I`

## Making Postgres Database and Schema

### Make Database

To make the Database do the steps below.

1. Navigate to your terminal.
2. If you have not made a user other than the default user, then make one.
```sql
CREATE USER <user name> WITH PASSWORD 'newpassword' SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE <db name> TO <user name>;
```
```bash
sudo passwd <user name>
```
3. Login as that user.
```bash
su - <user name>
```
4. Get into psql as the logged in user.
```bash
psql
```
5. List all databases then if the desired one isn't created, then make it.
```sql
\l
CREATE DATABASE <db name> OWNER <user name>;
```

### Make Schema

The schema defines the structure of each table. Make sure you make a __schemas.sql__ in some folder with the proper postgres syntax for the table creation. Then navigate to that directory to then do the commands.

1. Navigate to the sql directory that contains the __schemas.sql__ using the terminal.
2. Create the tables from the schema file.
```bash
psql -U <user name> -d <db name> -f schemas.sql
```