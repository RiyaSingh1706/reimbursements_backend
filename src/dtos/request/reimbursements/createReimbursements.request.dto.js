class CreateReimbursementRequestDto {
  constructor({ title, description, amount }) {
    this.title = title;
    this.description = description;
    this.amount = amount;
  }

  validate() {
    if (!this.title || !this.description || !this.amount) {
      throw { status: 400, message: 'title, description and amount are required' };
    }
    if (isNaN(this.amount) || Number(this.amount) <= 0) {
      throw { status: 400, message: 'amount must be a positive number' };
    }
  }
}

module.exports = { CreateReimbursementRequestDto };