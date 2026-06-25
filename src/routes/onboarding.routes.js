const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboarding.controller');

// public routes — no auth needed
router.post('/register', onboardingController.register.bind(onboardingController));
router.post('/login', onboardingController.login.bind(onboardingController));
router.post('/logout', onboardingController.logout.bind(onboardingController));

module.exports = router;