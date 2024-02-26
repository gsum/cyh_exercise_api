### Project Detail

This is an express project using typescript. We are using `.dotenv` for environment variables. This project used PostgreSQL and Sequelize for ORM.

### Implementations

1. Database Models: We have `User`, `Plan` and `Purchase` model. All models are created using sequelize-cli.
To create a new model, run `npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,password:string`. To run a migration run `npx sequelize-cli db:migrate`

2. Pre-loaded Data: Sequelize provided seed functionality so we have added seeders. To run seeders, run command `npx sequelize-cli db:seed:all`. It creates one users and 3 plans as givne on the exercise.

3. Rest Endpoint: There are 5 endpoints.
- "/": This is the get method that shows if the api is up or not.
- "/login": This is a post method, this endpoint logins a user by matching email and password and returns a jwt token so that it can be authorize later on too. We have JWT because it was easier to handle than generating a new token and managing it.
- "/plans": This is a get method that returns all the plans. We do not check token for this method but on front end this endpoint call is behind authcheck.
- "/purchase": This is post method that takes plan id in body, bearer token on header and create a purchase object everything is alright.
- "/purchases": This is a get method that returns all the purchases for a user including the plan details they have purchased. This endpoint needs authentication token.

### Some Packages

1. `body-parser`: This package is added so that we can read body from request.
2. `cors`: This enables us to take request from application running on different domain.
3. `dotenv`: This is to manage environment variables/
4. `jsonwebtoken`: For authetication tokens.
4. `pg`: Adapter to work on postgres database.
5. `pg-hstore`: For flexible data store on pg.
6. `sequelize`: ORM for PostgreSQL.

### What can be improved.
Due to time constriants I have not added tests. So we can add tests and modularize the routes on different controllers.

### API Endpoints

1. Login
- Endpoint: `/login`
- Method: GET
- Body: 
```
{
    "email": "john.smith@example.com",
    "password": "password123"
}
```

- Response:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcwODkyMjU1NiwiZXhwIjoxNzA5NTI3MzU2fQ.0gi-SjhQCo9yZ-XXXfaDjwdTczx7XDeaJgJ39SlZemU"
}
```