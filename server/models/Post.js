import { Schema, model } from "mongoose";

const postSchema = new Schema({
     Title:String,
     body: String,
     username: String, 
     createdAt: String,
     comments:[
          {
               body: String,
               commenter: String,
               createdAt: String,
          },
     ],
     likes:[{
          username: String,
          createdAt: String}
     ],
     author:{
          type:Schema.Types.ObjectId,
          ref: 'users'
     }
})

const Post = model('Post',postSchema)
export default Post