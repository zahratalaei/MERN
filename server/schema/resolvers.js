import { SECRET_KEY } from "../config.js"
import Post from "../models/Post.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {GraphQLError} from 'graphql'
import {userInputValidation, loginValidation } from "../utilities/validate.js"

const generateToken = (user) => {
     return jwt.sign({
          id: user.id,
          email: user.email,
          username:user.username
     },SECRET_KEY,{expiresIn:'1h'})
}

const resolvers = {
     Query: {
          posts: async () => await Post.find().sort({createdAt: -1}),
          post: async(_,args) => {
                const id = args.postId
                console.log(id);
               try {
                    const post = await Post.findById(id)
                    if(post){return post}else{ throw new Error}
               } catch (error) {
                    throw new Error(error)
               }
          }
     },
     Mutation:{
          login: async (_,args,context) => {
               console.log(args.input)
               const {username, password} = args.input
               //valid inputs
               const {valid, errors} = loginValidation(username, password)
               if(!valid){
                    throw new GraphQLError('Errors',{
                         extensions:{
                              code:'BAD_USER_INPUT',
                              errors: errors
                         }
                    })
               }
               //valid if the user is available
               const user = await User.findOne({username})
               if(!user){
                    errors.general = 'User not found';
                         throw new GraphQLError('User not found',{
                         extensions:{
                              code:'BAD_USER_INPUT',
                              errors:errors
                         }
                    })
               }
               //check if the password matches
               const match = await bcrypt.compare(password, user.password)
               if(!match){
                    errors.general = "wrong credentials";
                         throw new GraphQLError('Wrong credentials',{
                         extensions:{
                              code:'BAD_USER_INPUT',
                              errors:errors
                         }
                    })
               }
               const token = generateToken(user)
               return{...user._doc, id:user._id,token}
          },
          createUser: async (_, {input:{username, password, confirmPassword,email}}) =>{
               // const {username, password, confirmPassword,email} = args.input
               //validate user data
               const {valid,errors} = userInputValidation(username, email, password,confirmPassword)
               if(!valid){
                    throw new GraphQLError('Errors',{
                         extensions:{
                              code:'BAD_USER_INPUT',
                              errors: errors
                         }
                    })
               }
               //check user uniqueness
               const user = await User.findOne({username})
               if(user){
                    throw new GraphQLError('Taken username',{
                         extensions: {
                              code:'BAD_USER_INPUT',
                              username: 'This username has already been taken'
                         }
                    })
               }
               // hash the password and create auth token
                 password=await bcrypt.hash(password,12 )

               const newUser = new User({
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString()
               })
               const res = await newUser.save()
               const token = generateToken(res)
               return {
                    ...res._doc,
                    id:res._id,
                    token
               }

          },
          //Posts resolvers
          createPost:async (_,args,contextValue) => {
               console.log(contextValue);
               const newPost = {
                    title: args.input.title,
                    body: args.input.body
               }
               const user = contextValue.user
               newPost.username = user.username
               createdAt = new Date().toISOString()

               const post = await newPost.save()
               context.pubsub.publish('NEW_POST', {
                    newPost: post
                  });
               return post
          }

     }
}
export default resolvers