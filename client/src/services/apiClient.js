const toErrorMessage = (status, fallback) => {
    if (status >= 500) {
        return 'Server error. Please try again.';
    }

    if (status === 404) {
        return 'Requested resource was not found.';
    }

    if (status === 401 || status === 403) {
        return 'You are not authorized for this action.';
    }

    return fallback;
};

const parseResponseBody = async (response, responseType) => {
    if (responseType === 'text') {
        return response.text();
    }

    if (responseType === 'none') {
        return undefined;
    }

    const text = await response.text();
    if (text === '') {
        return undefined;
    }

    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
};

const createFailureResult = async (response, fallbackErrorMessage) => {
    const rawBody = await parseResponseBody(response, 'json').catch(() => undefined);
    const errorData = typeof rawBody === 'object' && rawBody !== null ? rawBody : undefined;
    const errorMessage = toErrorMessage(
        response.status,
        fallbackErrorMessage || (typeof rawBody === 'string' ? rawBody : 'Request failed.')
    );

    return {
        ok: false,
        status: response.status,
        data: undefined,
        errorData,
        errorMessage,
    };
};

export const request = async (url, options = {}, config = {}) => {
    const {
        responseType = 'json',
        fallbackErrorMessage = 'Request failed.',
    } = config;

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            return createFailureResult(response, fallbackErrorMessage);
        }

        const data = await parseResponseBody(response, responseType);
        return {
            ok: true,
            status: response.status,
            data,
            errorData: undefined,
            errorMessage: '',
        };
    }
    catch {
        return {
            ok: false,
            status: 0,
            data: undefined,
            errorData: undefined,
            errorMessage: 'Network error. Please check your connection.',
        };
    }
};
