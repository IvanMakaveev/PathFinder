import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as nodeService from '../../services/nodeService';
import Graph from '../Graph';
import './CreateNode.css';

const NODE_TYPE_OPTIONS = ['NormalNode', 'BrokenNode'];

const CreateNode = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        nodeType: NODE_TYPE_OPTIONS[0],
    });

    const handleCreate = () => {
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            setErrorMessage('Name is required.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        nodeService
            .createNode({
                name: trimmedName,
                nodeType: formData.nodeType,
            })
            .then((res) => {
                if (res?.ok === true) {
                    navigate('/');
                    return;
                }

                const values = Object.values(res?.errorData ?? {});
                const flattened = values.flatMap((value) =>
                    Array.isArray(value) ? value : [String(value)]
                );
                const message = flattened.join(' ');
                setErrorMessage(message || 'Unable to create node.');
            })
            .catch(() => {
                setErrorMessage('Unable to create node.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <section className="create-node-page">
            <div className="create-node-page__graph-shell">
                <Graph />
            </div>

            <aside className="create-node-page__side-panel">
                <form className="create-node-form" onSubmit={(event) => event.preventDefault()}>
                    <h2 className="create-node-form__title">Create Node</h2>

                    <label className="create-node-form__field">
                        <span className="create-node-form__label">Name</span>
                        <input
                            type="text"
                            className="create-node-form__input"
                            value={formData.name}
                            required
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, name: event.target.value }))
                            }
                        />
                    </label>

                    <label className="create-node-form__field">
                        <span className="create-node-form__label">Node Type</span>
                        <select
                            className="create-node-form__input"
                            value={formData.nodeType}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, nodeType: event.target.value }))
                            }
                        >
                            {NODE_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="button"
                        className="create-node-form__button"
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>

                    {errorMessage && <p className="create-node-form__error">{errorMessage}</p>}
                </form>
            </aside>
        </section>
    );
};

export default CreateNode;
