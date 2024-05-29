import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

const Authentication = async ({req}) => {
     
     const token = req.headers.authorization | '';
     const user = await verify(token, SECRET_KEY)
     console.log(user);
     if(!user){
          console.log('user is not authenticated');
     }
     return {user}
     // if(authHeader){
     //      const token = authHeader.split('Bearer')[1]
     //      if(token){
     //           try{
     //                const user =verify(token, SECRET_KEY)
     //                return user
     //           }catch(err){
     //                throw new GraphQLError('User is not authenticated', {
     //                     extensions: {
     //                       code: 'UNAUTHENTICATED',
     //                       http: { status: 401 },
     //                     },})
     //           }
     //      }
     //      throw new GraphQLError("Authentication token must be 'Bearer [token]", {
     //           extensions: {
     //             code: 'UNAUTHENTICATED',
     //             http: { status: 401 },
     //           },})
         
     // }
     // throw new GraphQLError('Authorization header must be provided', {
     //      extensions: {
     //        code: 'UNAUTHENTICATED',
     //        http: { status: 401 },
     //      },})
     
}
export default Authentication;