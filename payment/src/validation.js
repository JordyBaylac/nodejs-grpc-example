const randomstring = require("randomstring");

function authorize(authorizationRequest) {
    let status = "DECLINED";

    const approvalCode = randomstring.generate(7);
    if (isValidPayment(approvalCode)) {
        status = "ACCEPTED";
    }

    return {
        status: status,
        approvalCode: approvalCode
    }
}

/**
 * We will return true only if the approvalCode 
 * does not contains an 'x', 'a' or 'v'
 * @param {string} approvalCode 
 */
function isValidPayment(approvalCode) {
    const invalidCharacters = ['x', 'a', 'v'];
    const hasInvalidChars = approvalCode
        .toLowerCase()
        .split('')
        .some((x) => invalidCharacters.includes(x));
    return !hasInvalidChars;
}

exports.authorize = authorize;