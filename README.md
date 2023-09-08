# MERN Stack Docker

### Create this README.md file in the home directory

### Initialize git repository. Always do git operation in the home directory.

### Make .gitignore
  ```
    node_modules
    .env
  ```

### API-1. Create api directory and make initial Dockerfile in the api directory

1) In the home directory, 'git checkout -b api-1'

1) Dockerfile
   ```Dockerfile
      FROM node:20.5.1-bookworm-slim
      USER node
      WORKDIR /app
   ```

2) Then, in the api terminal run
   ```bash
      docker build -t api .
   ```

3) Enter into the docker container
   ```bash
      docker run -it -v $(pwd):/app --name api-1 api sh   
   ```

4) In the container, type `whoami`, it will show node username since we put `USER node` in the second line of the Dockerfile. Without this, the user will be `root`. `USER node` will ensure to prevent user permission issues while coding afterwards.

5) Continue setup in the container.
    ```
      npm init -y
      npm i express
      npm i -D nodemon
    ```

6) Make index.js file
   ```javascript
      const express = require('express')
      const app = express()

      app.get('/', (req, res)=>{
         res.status(200).json({
            status: 'success',
            message: 'Hello World'
         })
      })

      app.listen(3000, ()=>{
         console.log('app is listening on port 3000')
      })
   ```

7) Add the following "dev" script in the package.json file
   ```diff
      "scripts": {
         "test": "echo \"Error: no test specified\" && exit 1",
   +     "dev": "nodemon index.js"
      },
   ```

8) If you followed correctly up to this point, if you run `npm run dev` in the container, it will show the `nodemon` is listening on port 3000. Press Ctrl+C to stop `nodemon`

9) Exit from the container



### API-2. Update the Dockerfile in the api directory to the final version
1) Dockerfile
   ```diff
      FROM node:20.5.1-bookworm-slim
      USER node
      WORKDIR /app
   +  COPY --chown=node:node package*.json ./
   +  RUN npm ci
   +  COPY --chown=node:node ./ ./
   +  CMD [ "npm", "run", "dev" ]
   ```

   From above `--chown=node:node` changes the permission of the files from the root user to node user.

2) Add .dockerignore file.
   ```.dockerignore
      node_modules
   ```

3) Build the api docker image again. 
   ```bash
      docker build -t api .
   ```

4) Run the container, and test if it is working
   ```bash
      docker run -d -p 3000:3000 -v $(pwd):/app -v /app/node_modules --name api-1 api
      curl localhost:3000
   ```

   It should show `json message` on the cli.
   

### Docker Compose-1. 
1) Make docker-compose.yml in the project home directory. Set api into docker-compose.yml
   ```docker-compose.yml
      version: '3.9'
      services:
         api:
            build: 
               context: ./api
            ports:
               - 3000:3000
            volumes:
               - ./api:/app
               - /app/node_modules
   ```

2) Run the container, and test if it is working
   ```bash
      docker compose up -d --build
      curl localhost:3000
   ```

   It should show `json message` on the cli.


### Docker Compose-2. Add mongo to the api
1) Add mongo to docker-compose.yml
   ```diff
      version: '3.9'
      services:
         api:
            build: 
               context: ./api
            ports:
               - 3000:3000
            volumes:
               - ./api:/app
               - /app/node_modules
         
   +     mongodb:
   +        image: mongo:6
   +        environment:
   +           - MONGO_INITDB_ROOT_USERNAME=sanjeev
   +           - MONGO_INITDB_ROOT_PASSWORD=mypassword
   +        volumes:
   +           - mongo-db:/data/db
   +
   +  volumes:
   +     mongo-db:
   ```

2) Run the container, and test if the mongo is working
   ```bash
      docker compose up -d --build
      docker exec -it mern-mongodb-1 mongosh -u sanjeev -p mypassword
   ```

   It should enter into the mongodb without any error message.


### Front-1. Create front directory and make initial Dockerfile in the front directory
1) Dockerfile
   ```Dockerfile
      FROM node:20.5.1-bookworm-slim
      USER node
      WORKDIR /app
   ```

2) Then, in the front directory terminal run
   ```bash
      docker build -t front .
   ```

3) Enter into the docker container
   ```bash
      docker run -it -v $(pwd):/app --name front-1 front sh   
   ```

   In the container, initialize the react vite. But if there is any file in the directory where the react vite is installed, it emits error. So, tentantively move the Dockerfile fromt the front directory to the MERN home directory in the separate host terminal.

   ```bash
      # in the host directory
      ~/MERN $ cd front
      ~/MERN/front $ mv Dockerfile ..

      # in the container
      $ npm create vite@latest
      # in the project name question, type "." so that the react vite is installed in the front directory. And then, choose appropriate framework and its variant
      $ npm install

      # in the host directory
      ~/MERN $ mv Dockerfile front/

      # move the content of .gitignore file in the front directory to .gitignore file in the home directory, and delete .gitignore.
   ```

4) In the vscode front directory, change vite.config.js as follows
   ```javascript
      import { defineConfig } from 'vite'
      import react from '@vitejs/plugin-react'

      // https://vitejs.dev/config/
      export default defineConfig({
         plugins: [react()],
         server: {
            watch: {
               usePolling: true
            },
            host: true,
            strictPort: true,
            port: 5173
         }
      })
   ```

   In the front-1 container, run the following.
   ```bash
      $ npm run dev      
   ```

   If you followed correctly up to this point, if you run `npm run dev`, it should show running message of react vite. Press Ctrl+C to stop react vite.

5) In the host terminal, move back the Dockerfile to the front directory
   ```bash
      # in the host directory
      ~/MERN $ cd Dockerfile ./front
   ```

6) Exit from the front container



### FRONT-2. Update the Dockerfile in the front directory to the final version
1) Dockerfile
   ```diff
      FROM node:20.5.1-bookworm-slim
      USER node
      WORKDIR /app
   +  COPY --chown=node:node package*.json ./
   +  RUN npm ci
   +  COPY --chown=node:node ./ ./
   +  CMD [ "npm", "run", "dev" ]
   ```

   From above `--chown=node:node` changes the permission of the files from the root user to node user.

2) Add .dockerignore file.
   ```.dockerignore
      node_modules
   ```

3) Build the api docker image again. 
   ```bash
      docker build -t front .
   ```

4) Run the container, and test if it is working
   ```bash
      docker run -d -p 5173:5173 -v $(pwd):/app -v /app/node_modules --name front-1 front
      curl localhost:5173
   ```

   It should show `Vite + React html script` on the cli.

5) Stop the container
   ```
      docker rm front-1 -f
   ```

6) Add front stack to the docker-compose.yml in the home directory.
   ```diff
      version: '3.9'
      services:
         api:
            build: 
               context: ./api
            ports:
               - 3000:3000
            volumes:
               - ./api:/app
               - /app/node_modules

   +     front:
   +        build: 
   +           context: ./front
   +        ports:
   +           - 5173:5173
   +        volumes:
   +           - ./front:/app
   +           - /app/node_modules
         
         mongodb:
            image: mongo:6
            environment:
               - MONGO_INITDB_ROOT_USERNAME=sanjeev
               - MONGO_INITDB_ROOT_PASSWORD=mypassword
            volumes:
               - mongo-db:/data/db
    
      volumes:
         mongo-db:
   ```

7) In the home directory run the followings, and check if it is working as the same as before.
   ```bash
      docker compose up -d --build
      curl localhost:3000
      curl localhost:5173
      docker exec -it mern-mongodb-1 mongosh -u sanjeev -p mypassword
   ```

8) If all are working well, run 'docker compose down' for the next step.



### MongoDB API - POST API
1) Run docker compose and enter into api container shell, and install mongoose.
   ```bash
      docker compose up -d --build
      docker exec -it mern-api-1 sh
      -> in the api container
         npm i mongoose
   ```

2) Close docker compose with 'docker compose down', and run again with 'docker compose up -d --build'

3) Add connection string to index.js in the api directory.
   ```javascript
      const mongoose = require('mongoose')
      mongoose.connect('mongodb://sanjeev:mypassword@mongodb:27017/mydb?authSource=admin')
         .then(()=>console.log('connected to mongodb'))
         .catch((err)=>console.log('error connecting to mongodb : ', err))
   ```

4) Check if the mongo connection is displayed.
   ```bash
      docker logs mern-api-1 -f
   ```

5) Add models, controllers, routes directory and setup the necessary code.

6) Test Post API using mongodb as follows
   POST create a post
      localhost:3000/api/v1/post

      Body
      raw (json)
      json
      {
         "title": "The Lord of the Ring",
         "body": "body of The Lord of the Ring"
      }

   GET get a request
      localhost:3000/api/v1/post/64b1e2cf7f9c48205992d2f7

   GET get all posts
      localhost:3000/api/v1/post

   PATCH update a post
      localhost:3000/api/v1/post/64b1e2cf7f9c48205992d2f7

      Body
      raw (json)
      json
      {
         "title": "Harry Potter 2",
         "body": "body of Harry Potter 2"
      }

   DELETE delete a post
      localhost:3000/api/v1/post/64b1e2cf7f9c48205992d2f7



### Authentication with REDIS
1) Run docker compose and enter into api container shell, and install redis, connect-redis, express-session.
   ```bash
      docker compose up -d --build
      docker exec -it mern-api-1 sh
      -> in the api container
         npm i redis connect-redis express-session
   ```

2) Add Redis container in the docker-compose.yml
   ```diff
      version: '3.9'
      services:
      api:
         build: 
            context: ./api
         ports:
            - 3000:3000
         volumes:
            - ./api:/app
            - /app/node_modules
      
      front:
         build: 
            context: ./front
         ports:
            - 5173:5173
         volumes:
            - ./front:/app
            - /app/node_modules
      
      mongodb:
         image: mongo:6
         environment:
            - MONGO_INITDB_ROOT_USERNAME=sanjeev
            - MONGO_INITDB_ROOT_PASSWORD=mypassword
         volumes:
            - mongo-db:/data/db

   +  redis:
   +     image: redis:7.0.10

      volumes:
         mongo-db:
   ```

3) Close docker compose with 'docker compose down', and run again with 'docker compose up -d --build'

4) Add connection string to index.js in the api directory.
   ```javascript
      // connect to Redis
      const redis = require('redis')
      let redisClient = redis.createClient({url:'redis://redis:6379'})
      redisClient.on('error', (err)=>console.log('redis error : ', err))
      redisClient.on('ready', ()=>console.log('connected to redis...'))
      async function connectRedis() {
         await redisClient.connect().catch(console.error)

         await redisClient.set('my_key', 'my value');
         const value = await redisClient.get('my_key');
         console.log('my_key : ', value)
      }
      connectRedis()
   ```

4) Check if the redis connection is displayed.
   ```bash
      docker logs mern-api-1 -f
   ```
