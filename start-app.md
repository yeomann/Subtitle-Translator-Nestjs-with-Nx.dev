# Steps

Install NX CLI
`yarn global add nx` or `npm install -g nx`

Project use NX, More read how NX works or run please check NX-README.md from the project directory

1 - Download the source and run `yarn` or `npm install` incase if you're using npm
2 - make sure to have Redis and postgres installed in the your system.
3 - Follwing .env is required which is copied in the repo and not .gitignored

```.env
APP_CONFIG=Subtitle Translator App|admin@itsdanishraza.com
REDIS_CONFIG=localhost|6379

POSTGRES_HOST=localhost
POSTGRES_PORT=5432p
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=postgres
POSTGRES_DATABASE_SCHEMA=subtitle_translator_dev

JWT_SECRET=aBigSecret_2021!_secret_KEY
PORT=8088
MODE=DEV
```

4 - make sure that you have postgres on 5432 default port with host, user, password, Database and schema like shown in the .env

5 - make sure that redis is installed and running at 6379 default port.

## Run commands

#### Run HTTP App aka translator-backend

`nx serve` or `yarn start`
Swagger will be live at http://localhost:8088/api/v1/swagger/#/

#### Run Microservice App aka tms-microservice

`nx serve tms-microservice`
Microservice will be live at localhost 8888

## Create initial user in the agent entity from the postgres

Unfortunately, Due to limitation on my side, i couldn't move this task to migeration.
_Please use **real email** to test Email functionality of the system._

```txt
id: 751b3fdb-afd8-4f77-804a-dec508e5c2ba
created_at: 2020-12-11 23:41:13
updated_at: 2021-01-31 18:00:01
created_by: System
updated_by: System
email: idanishraza@gmail.com OR YOUR EMAIL HERE,
username: userdanishh OR YOUR USERNAME HERE
password: `$2b$10$sdd4E0Rq0zg4hr/8BMUAteY3W.ovqVu75R9x.dS9mw7RpJn2RuS12`
full_name: Danish Raza OR YOUR NAME HERE
ip_white_list: {}
last_password_change:
access_token:
```

Above hash's password is = primeroot123!

After trying to login `auth/login` from swagger first time, you can use this input:

```json{
  "username": "idanishraza@gmail.com OR YOUR EMAIL HERE",
  "password": "primeroot123!"
}
```

system will force you to change password anyway bt responding:

```json
{
  "statusCode": "FirstTimerChangePassword",
  "message": "change password"
}
```

so you will have to create your own password from `auth/changepass`

Thats it, Thank you 🙏!
