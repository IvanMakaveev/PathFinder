import { useCallback, useState } from 'react';

const INITIAL_STATE = {
    isLoading: false,
    message: '',
};

export const useAsyncAction = () => {
    const [state, setState] = useState(INITIAL_STATE);

    const start = useCallback(() => {
        setState({
            isLoading: true,
            message: '',
        });
    }, []);

    const finish = useCallback((message = '') => {
        setState({
            isLoading: false,
            message,
        });
    }, []);

    const setMessage = useCallback((message) => {
        setState((prev) => ({
            ...prev,
            message,
        }));
    }, []);

    const clearMessage = useCallback(() => {
        setState((prev) => ({
            ...prev,
            message: '',
        }));
    }, []);

    return {
        isLoading: state.isLoading,
        message: state.message,
        start,
        finish,
        setMessage,
        clearMessage,
    };
};
