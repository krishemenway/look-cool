const express = require('express')
const request = require('request')
const app = express()
const port = 3000

app.use(express.static("dist"))
app.listen(port, () => console.log(`Dev Server started on port ${port}!`))