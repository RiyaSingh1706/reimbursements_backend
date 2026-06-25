class LoginRequestDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.email || !this.password) {
      throw { status: 400, message: 'email and password are required' };
    }
    if (!this.email.endsWith('@org.com')) {
      throw { status: 400, message: 'Only org.com email addresses are allowed' };
    }
  }
}

module.exports = { LoginRequestDto };