import mongoose from "mongoose";

const mongodb_url = process.env.MONGODB_URI;


if(!mongodb_url){
    console.log("Please write mongodb url in env file");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {connection : null, promise : null}
}

const ConnectToDatabase = async() => {    
    if(cached.connection){        
        return cached.connection;
    }
    if(!cached.promise){        
        const opts = {
            bufferCommands : false,
            maxPoolSize : 10
        }

        cached.promise = mongoose.connect(mongodb_url,opts);
    }

    try {
        cached.connection = await cached.promise;
        if(cached.connection){
            console.log("Connection established");
        }
        return cached.connection;
    } catch (error) {
        console.log("Failed to make Connection with DB",error);
    }
}

export {
    ConnectToDatabase
}