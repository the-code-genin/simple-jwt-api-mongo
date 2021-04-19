import dotenv from 'dotenv'
import 'reflect-metadata'
import {connect} from 'mongoose'
import express from 'express'
import corsMiddleware from 'cors'
import routes from './routes'
import path from 'path'


(async function() {
    // Load env variables.
    dotenv.config();
    
    // Connect to db.
    const db = await connect(process.env.DB_URI as string, {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Configure server.
    const app = express();
    app.set('app_url', process.env.APP_URL);
    app.set('app_key', process.env.APP_KEY);
    app.set('root_dir', __dirname);
    app.set('port', process.env.PORT || 8080);
    app.set('db', db);
    app.set('view engine', 'ejs');


    // Add middleware
    app.use('/storage', express.static(path.join(__dirname, '/storage/public')));
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(corsMiddleware());
    app.use('/api/*', express.json());


    // Register all app routes.
    routes(app);


    // Start server.
    app.listen(app.get('port'), () => {
        console.log(`App running on ${app.get('app_url')}`);
    });
})();
