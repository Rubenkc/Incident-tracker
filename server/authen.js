import bcrypt from 'bcrypt'

const hashed = async() => {
   const hash =  await bcrypt.hash('Ruben129c!', 10)
    console.log('hashed, ',  hash)

    const res = await bcrypt.compare('Ruben129c!', '$2b$10$raDCewU4z1.SwQlu05f51eSG20h2sPUQJM3bplizMxb8.t.1/bTqO')

    console.log("comapare", res)
}

hashed()

