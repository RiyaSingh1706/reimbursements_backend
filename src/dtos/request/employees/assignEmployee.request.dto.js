class AssignEmployeeRequestDto {
  constructor({ empId, rmId }) {
    this.empId = empId;
    this.rmId = rmId;
  }

  validate() {
    if (!this.empId || !this.rmId) {
      throw { status: 400, message: 'empId and rmId are required' };
    }
    if (this.empId === this.rmId) {
      throw { status: 400, message: 'empId and rmId cannot be the same user' };
    }
  }
}

module.exports = { AssignEmployeeRequestDto };