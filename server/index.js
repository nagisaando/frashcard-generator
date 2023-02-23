const express = require('express')

const app = express()


app.get("/greeting", (req, res) => {
    const { name } = req.query
    if (name.toLowerCase() == 'daniel' || name.toLocaleLowerCase().includes('daniel')) {
        res.send('こんにちは😃　ダニエル！')
    } else if (name) {
        res.send(`Hey ${name}.... but where is Daniel?`)
    } else {
        res.send('You better to say your name first!')
    }

})


app.get("/api", (req, res) => {
    res.json({ "users": ["user 1", "user 2"] })
})

app.listen(3000, () => {
    console.log('server started')
})