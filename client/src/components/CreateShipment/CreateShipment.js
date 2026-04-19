import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as nodeService from '../../services/nodeService';
import * as shipmentService from '../../services/shipmentService';
import Graph from '../Graph';
import { useShipments } from '../../contexts/ShipmentContext';
import { ROUTES } from '../../routes';
import { getApiErrorMessage } from '../../utils/apiError';
import './CreateShipment.css';

const CreateShipment = () => {
    const navigate = useNavigate();
    const { addShipment } = useShipments();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nodeOptions, setNodeOptions] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startNodeId: '',
        endNodeId: '',
    });

    useEffect(() => {
        nodeService.getAllNodes().then((result) => {
            const nodes = Array.isArray(result?.data) ? result.data : [];
            const options = nodes.map((node) => ({
                id: String(node.id ?? ''),
                name: node.name ?? `Node ${node.id ?? ''}`,
            }));

            setNodeOptions(options);

            if (options.length > 0) {
                const firstId = options[0].id;
                const secondId = options[1]?.id ?? firstId;
                setFormData((prev) => ({
                    ...prev,
                    startNodeId: firstId,
                    endNodeId: secondId,
                }));
            }
        });
    }, []);

    const handleCreate = () => {
        const trimmedName = formData.name.trim();
        if (trimmedName === '') {
            setErrorMessage('Name is required.');
            return;
        }

        if (formData.startNodeId === '' || formData.endNodeId === '') {
            setErrorMessage('Start node and end node are required.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        shipmentService
            .createShipment({
                name: trimmedName,
                description: formData.description,
                startNodeId: formData.startNodeId,
                endNodeId: formData.endNodeId,
            })
            .then((res) => {
                if (res?.ok === true) {
                    const createdId = res?.data?.id;
                    if (createdId != null) {
                        addShipment({
                            id: createdId,
                            name: trimmedName,
                        });
                    }

                    navigate(ROUTES.home);
                    return;
                }

                setErrorMessage(getApiErrorMessage(res, 'Unable to create shipment.'));
            })
            .catch(() => {
                setErrorMessage('Unable to create shipment.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <section className="create-shipment-page page-layout">
            <div className="create-shipment-page__graph-shell page-layout__graph-shell">
                <Graph />
            </div>

            <aside className="create-shipment-page__side-panel page-layout__side-panel">
                <form className="create-shipment-form" onSubmit={(event) => event.preventDefault()}>
                    <h2 className="create-shipment-form__title">Create Shipment</h2>

                    <label className="create-shipment-form__field">
                        <span className="create-shipment-form__label">Name</span>
                        <input
                            type="text"
                            className="create-shipment-form__input"
                            value={formData.name}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, name: event.target.value }))
                            }
                        />
                    </label>

                    <label className="create-shipment-form__field">
                        <span className="create-shipment-form__label">Description</span>
                        <input
                            type="text"
                            className="create-shipment-form__input"
                            value={formData.description}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, description: event.target.value }))
                            }
                        />
                    </label>

                    <label className="create-shipment-form__field">
                        <span className="create-shipment-form__label">Start Node</span>
                        <select
                            className="create-shipment-form__input"
                            value={formData.startNodeId}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, startNodeId: event.target.value }))
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

                    <label className="create-shipment-form__field">
                        <span className="create-shipment-form__label">End Node</span>
                        <select
                            className="create-shipment-form__input"
                            value={formData.endNodeId}
                            onChange={(event) =>
                                setFormData((prev) => ({ ...prev, endNodeId: event.target.value }))
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

                    <button
                        type="button"
                        className="create-shipment-form__button"
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>

                    {errorMessage && <p className="create-shipment-form__error">{errorMessage}</p>}
                </form>
            </aside>
        </section>
    );
};

export default CreateShipment;
