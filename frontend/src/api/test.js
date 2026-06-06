const bcrypt = require('bcrypt');

async function test() {
    const hash = 'P$2b$10$tUzIyUVCITYHSBBHnQFYCeSax.BoJcB9ix9kPDLA9EnYk1dagmY1';

    const result = await bcrypt.compare('test', hash);
    console.log(result);
}

test();