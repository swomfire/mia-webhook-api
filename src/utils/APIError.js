import httpStatus from 'http-status';

export const ERROR_MESSAGE = {
  CONTENT_NOT_FOUND: 'No content available',
  BAD_REQUEST: 'Invalid request',
  EMAIL_EXIST: 'Email is exist',
  PASSWORD_INCORRECT: 'Current password is not correct',

  // tax
  ZIP_CODE_NOT_FOUND:
    "Sorry, we haven't suppot your postal yet. Please input another postal code",

  /* Stripe */
  STRIPE_CREATE_FAIL: 'Create fail',
  STRIPE_UPDATE_FAIL: 'Update fail',
  STRIPE_CHARGE_FAIL: 'Charge fail',
  STRIPE_UPDATE_DEFAULT_CARD_FAIL: 'Update default card fail',
  STRIPE_PAY_ORDER_FAIL: 'Pay order fail',
  STRIPE_EMPTY_SOURCE: 'Source is empty',
  STRIPE_FETCH_FAIL: 'Fetch fail',
  STRIPE_DELETE_CARD_FAIL: 'Delete card fail',
  VALIDATION_MATCH_FAIL: 'Match Failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  POSTCODE_NOT_BELONG: 'This postcode does not belong to this province',
  PRODUCT_NOT_ENOUGH: 'is not enough in stock',
};

/**
 * @extends Error
 */
class APIError extends Error {
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }

  toJSON() {
    return {
      message: this.message,
      status: this.status,
    };
  }
}

export default APIError;
