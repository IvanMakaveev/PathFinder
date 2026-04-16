import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorHandler.css';

const ErrorHandler = () => {
	const navigate = useNavigate();

	return (
		<section className="error-handler">
			<h1 className="error-handler__title">Something went wrong</h1>
			<p className="error-handler__message">
				We were unable to load the requested data. Please try again or return to the graph.
			</p>
			<div className="error-handler__actions">
				<button type="button" className="error-handler__button" onClick={() => navigate(-1)}>
					Go Back
				</button>
				<button type="button" className="error-handler__button error-handler__button--primary" onClick={() => navigate('/')}>
					Go To Graph
				</button>
			</div>
		</section>
	);
};

export default ErrorHandler;
