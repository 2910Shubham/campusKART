import mongoose from "mongoose";
import debug from 'debug';
import config from 'config';

const dbgr = debug('development:mongoose');
console.log("Current NODE_ENV:", process.env.NODE_ENV);


mongoose
    .connect(`${config.get("MONGODB_URI")}`)
    .then(function(){
        dbgr("connected");
      
    })
    .catch(function(err){
        dbgr(err)
    })

    export default mongoose.connection;