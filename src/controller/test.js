const bcrypt = require('bcryptjs');

const hash = '$2b$10$iHSo1aIh1HwCCbJTeRLXnOWYosxzuTI9Qy1AK1vRhiFcM7NcJu7.6';
const passwordToTest = '008022chou';

bcrypt.compare(passwordToTest, hash).then(result => {
    console.log("Match:", result); // If this is false, the hash is for a different password
});
