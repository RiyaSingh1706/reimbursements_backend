const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../db/queries/onboarding.queries');
const { RegisterRequestDto } = require('../dtos/request/onboarding/register.request.dto');
const { LoginRequestDto } = require('../dtos/request/onboarding/login.request.dto');
require('dotenv').config();

class OnboardingService {
  async register(body) {
    const dto = new RegisterRequestDto(body);
    dto.validate();

    const existing = await findUserByEmail(dto.email);
    if (existing) {
      throw { status: 409, message: 'Email already registered' };
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await createUser({ name: dto.name, email: dto.email, password_hash });

    return user;
  }

  async login(body) {
    const dto = new LoginRequestDto(body);
    dto.validate();

    const user = await findUserByEmail(dto.email);
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, user };
  }
}

module.exports = new OnboardingService();