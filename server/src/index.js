import app from './app.js'
import "dotenv/config"

const PORT = process.env.PORT || 3000;

console.log(PORT)

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

