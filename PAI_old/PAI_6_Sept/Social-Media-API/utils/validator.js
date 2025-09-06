const validator = require('validator');
const config = require('../config/config');

const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Please provide a valid email address' };
  }

  return { isValid: true };
};

const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < config.validation.minPasswordLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${config.validation.minPasswordLength} characters long` 
    };
  }

  return { isValid: true };
};

const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }

  if (name.trim().length > 50) {
    return { isValid: false, message: 'Name cannot be more than 50 characters long' };
  }

  return { isValid: true };
};

const validatePostTitle = (title) => {
  if (!title) {
    return { isValid: false, message: 'Post title is required' };
  }

  if (title.trim().length < 3) {
    return { isValid: false, message: 'Post title must be at least 3 characters long' };
  }

  if (title.trim().length > 100) {
    return { isValid: false, message: 'Post title cannot be more than 100 characters long' };
  }

  return { isValid: true };
};

const validatePostBody = (body) => {
  if (!body) {
    return { isValid: false, message: 'Post content is required' };
  }

  if (body.trim().length < 10) {
    return { isValid: false, message: 'Post content must be at least 10 characters long' };
  }

  if (body.trim().length > config.validation.maxPostLength) {
    return { 
      isValid: false, 
      message: `Post content cannot be more than ${config.validation.maxPostLength} characters long` 
    };
  }

  return { isValid: true };
};

const validateCommentText = (text) => {
  if (!text) {
    return { isValid: false, message: 'Comment text is required' };
  }

  if (text.trim().length < 1) {
    return { isValid: false, message: 'Comment cannot be empty' };
  }

  if (text.trim().length > config.validation.maxCommentLength) {
    return { 
      isValid: false, 
      message: `Comment cannot be more than ${config.validation.maxCommentLength} characters long` 
    };
  }

  return { isValid: true };
};

const validateObjectId = (id) => {
  if (!id) {
    return { isValid: false, message: 'ID is required' };
  }

  if (!validator.isMongoId(id)) {
    return { isValid: false, message: 'Invalid ID format' };
  }

  return { isValid: true };
};

const validateUserRegistration = (userData) => {
  const errors = [];

  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  }

  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message);
  }

  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateUserLogin = (loginData) => {
  const errors = [];

  const emailValidation = validateEmail(loginData.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message);
  }

  if (!loginData.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validatePostCreation = (postData) => {
  const errors = [];

  const titleValidation = validatePostTitle(postData.title);
  if (!titleValidation.isValid) {
    errors.push(titleValidation.message);
  }

  const bodyValidation = validatePostBody(postData.body);
  if (!bodyValidation.isValid) {
    errors.push(bodyValidation.message);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePostTitle,
  validatePostBody,
  validateCommentText,
  validateObjectId,
  validateUserRegistration,
  validateUserLogin,
  validatePostCreation
};