import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as edgeService from '../../services/edgeService';
import * as nodeService from '../../services/nodeService';
import Graph from '../Graph';
import { ROUTES } from '../../routes';
import { getApiErrorMessage } from '../../utils/apiError';
import './CreateEdge.css';

const CreateEdge = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nodeOptions, setNodeOptions] = useState([]);
    const [formData, setFormData] = useState({
        fromNodeId: '',
        toNodeId: '',
        length: '1',
    });

    useEffect(() => {
        nodeService.getAllNodes().then((result) => {
            const nodes = Array.isArray(result?.data) ? result.data : [];
            const options = Array.isArray(nodes)
                ? nodes.map((node) => ({
                    id: String(node.id ?? ''),
                    name: node.name ?? `Node ${node.id ?? node.Id}`,
                }))
                : [];

            setNodeOptions(options);

            if (options.length > 0) {
                const firstId = options[0].id;
                const secondId = options[1]?.id ?? firstId;
                setFormData((prev) => ({
                    ...prev,
                    fromNodeId: firstId,
                    toNodeId: secondId,
                }));
            }
        });
    }, []);

    const handleCreate = () => {
        setIsSubmitting(true);
        setErrorMessage('');

        const numericLength = Number(formData.length);
        if (!Number.isInteger(numericLength) || numericLength <= 0) {
            setErrorMessage('Length must be a positive integer.');
            setIsSubmitting(false);
            return;
        }

        edgeService
            .createEdge({
                fromNodeId: formData.fromNodeId,
                toNodeId: formData.toNodeId,
                length: numericLength,
            })
            .then((res) => {
                if (res?.ok === true) {
                    navigate(ROUTES.home);
                    return;
                }

                setErrorMessage(getApiErrorMessage(res, 'Unable to create edge.'));
            })
            .catch(() => {
                setErrorMessage('Unable to create edge.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <section className="create-edge-page page-layout">
            <div className="create-edge-page__graph-shell page-layout__graph-shell">
                <Graph />
            </div>

            <aside className="create-edge-page__side-panel page-layout__side-panel">
                <form className="create-edge-form" onSubmit={(event) => event.preventDefault()}>
                    <h2 className="create-edge-form__title">Create Edge</h2>

                    <label className="create-edge-form__field">
                        <span className="create-edge-form__label">From Node</span>
                        <select
                            className="create-edge-form__input"
                            value={formData.fromNodeId}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, fromNodeId: event.target.value }))
                            }
                        >
                            {nodeOptions.length === 0 && <option value="">No nodes available</option>}
                            {nodeOptions.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="create-edge-form__field">
                        <span className="create-edge-form__label">To Node</span>
                        <select
                            className="create-edge-form__input"
                            value={formData.toNodeId}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, toNodeId: event.target.value }))
                            }
                        >
                            {nodeOptions.length === 0 && <option value="">No nodes available</option>}
                            {nodeOptions.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="create-edge-form__field">
                        <span className="create-edge-form__label">Length</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            className="create-edge-form__input"
                            value={formData.length}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, length: event.target.value }))
                            }
                        />
                    </label>

                    <button
                        type="button"
                        className="create-edge-form__button"
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>

                    {errorMessage && <p className="create-edge-form__error">{errorMessage}</p>}
                </form>
            </aside>
        </section>
    );
};

export default CreateEdge;
