const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Auth Service'));

app.listen(3000, () => console.log('Auth service running on port 3000'));

