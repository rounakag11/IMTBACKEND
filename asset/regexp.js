const emailRegExp = /^[a-zA-Z-.]+@+$/;
const passwordRegExp =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // admin@123
const CGIDRegexp = /^[0-9]{7}$/
const Phonenumberregexp = /^[0-9]{9}$/

module.exports = {
    emailRegExp,
    passwordRegExp,
    CGIDRegexp,
    Phonenumberregexp
}