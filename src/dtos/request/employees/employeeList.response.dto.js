class EmployeeResponseDto {
  constructor({ id, name, email, role }) {
    this.userId = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

module.exports = { EmployeeResponseDto };