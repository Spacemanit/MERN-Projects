const express = require('express')
const app = express()
app.get('/save', (req, res) => {
    inpRno = req.query.use;
    inpName = req.query.pass;

})
app.listen(8000);