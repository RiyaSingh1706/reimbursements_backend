const onboardingService = require('../services/onboarding.service');

class OnboardingController {
  async register(req, res, next) {
    try {
      const user = await onboardingService.register(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { userId: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { token, user } = await onboardingService.login(req.body);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: { userId: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('token');
      return res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OnboardingController();