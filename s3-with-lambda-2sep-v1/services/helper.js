module.exports.stringify = (str, isReadable) => {
    return JSON.stringify(str);
}

module.exports.responseMessage = ({ statusCode, data, message, error=null }) => {
    const response = {
        statusCode,
        data,
        message,
        error
    }
    return response;
}