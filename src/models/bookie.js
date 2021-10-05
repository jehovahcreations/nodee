const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const bookieSchema = new Schema({
    username: String,
    parent: String,
    password: String,
    phone:String,
    parent:String
});

bookieSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

bookieSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = model('Bookie', bookieSchema)