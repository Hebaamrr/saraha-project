import dotenv from "dotenv"
dotenv.config()
import express from "express"

import bootstrap from "./src/app.controller.js"
const app = express()
const port = process.env.PORT



bootstrap(app,express)
app.listen(port, () => console.log(`Server running on port ${port}`))