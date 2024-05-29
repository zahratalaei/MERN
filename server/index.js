import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

import typeDefs from "./schema/type-defs.js";
import resolvers from "./schema/resolvers.js";
import mongoose from "mongoose";
import {MONGODB} from './config.js'
import Authentication from "./utilities/Authentication.js";

const server = new ApolloServer({typeDefs,resolvers})

mongoose.connect(MONGODB, {useNewUrlParser: true,useUnifiedTopology: true,})
     .then(()=>{
          console.log('DB connected');
     })
     .catch(err => {
          console.log(err.message);
     })

const{url} = await startStandaloneServer(server, {listen: {port: 4000}, context:Authentication}
)

console.log(`server is running on ${url}`);