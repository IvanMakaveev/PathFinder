import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as nodeService from '../../services/nodeService';
import Graph from '../Graph';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { ROUTES } from '../../routes';
import { NODE_TYPE_OPTIONS } from '../../constants/nodeOptions';
import { getApiErrorMessage } from '../../utils/apiError';
import './CreateNode.css';

const CreateNode = () => {
    const navigate = useNavigate();
    const createAction = useAsyncAction();
    const [formData, setFormData] = useState({
        name: '',
        nodeType: NODE_TYPE_OPTIONS[0],
    });

    const handleCreate = async () => {
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            createAction.setMessage('Name is required.');
            return;
        }

        createAction.start();

        try {
            const res = await nodeService.createNode({
                name: trimmedName,
                nodeType: formData.nodeType,
            });

            if (res?.ok === true) {
                createAction.finish();
                navigate(ROUTES.home);
                return;
            }

            createAction.finish(getApiErrorMessage(res, 'Unable to create node.'));
        }
        catch {
            createAction.finish('Unable to create node.');
        }
    };

    return (
        <section className="create-node-page page-layout">
            <div className="create-node-page__graph-shell page-layout__graph-shell">
                <Graph />
            </div>

            <aside className="create-node-page__side-panel page-layout__side-panel">
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
                        disabled={createAction.isLoading}
                    >
                        {createAction.isLoading ? 'Creating...' : 'Create'}
                    </button>

                    {createAction.message && <p className="create-node-form__error">{createAction.message}</p>}
                </form>
            </aside>
        </section>
    );
};

export default CreateNode;
