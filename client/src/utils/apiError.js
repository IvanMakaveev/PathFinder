const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

export const getValidationMessage = (errorData) => {
    if (!errorData || typeof errorData !== 'object') {
        return '';
    }

    const values = Object.values(errorData);
    const message = values
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .map((value) => String(value ?? '').trim())
        .filter(Boolean)
        .join(' ');

    return message;
};

export const getApiErrorMessage = (result, fallbackMessage) => {
    const validationMessage = getValidationMessage(result?.errorData);
    if (validationMessage !== '') {
        return validationMessage;
    }

    if (isNonEmptyString(result?.errorMessage)) {
        return result.errorMessage;
    }

    return fallbackMessage;
};
