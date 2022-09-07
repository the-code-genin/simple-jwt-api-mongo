export default {
    app: {
        port: Number(process.env.PORT) || 8080
    },
    db: {
        uri: String(process.env.DB_URI),
        name: String(process.env.DB_NAME)
    }
}