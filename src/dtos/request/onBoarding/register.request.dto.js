class RegisterRequestDto {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.name || !this.email || !this.password) {
      throw { status: 400, message: 'name, email and password are required' };
    }
    if (!this.email.endsWith('@org.com')) {
      throw { status: 400, message: 'Only org.com email addresses are allowed' };
    }
  }
}

module.exports = { RegisterRequestDto };