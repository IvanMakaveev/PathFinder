import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Graph from '../Graph';
import * as shipmentService from '../../services/shipmentService';
import { getApiErrorMessage } from '../../utils/apiError';
import './ShipmentPage.css';

const ShipmentPage = () => {
    const { shipmentid } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingConstraint, setIsSavingConstraint] = useState(false);
    const [isDeletingConstraint, setIsDeletingConstraint] = useState(false);
    const [pathResult, setPathResult] = useState('');
    const [constraintMessage, setConstraintMessage] = useState('');
    const [shipmentData, setShipmentData] = useState({
        id: '',
        name: '',
        description: '',
        startNodeName: '',
        endNodeName: '',
        constraintJson: '',
    });

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        setPathResult('');
        setConstraintMessage('');

        Promise.all([
            shipmentService.getShipmentDetails(shipmentid),
            shipmentService.getShipmentConstraint(shipmentid),
        ])
            .then(([detailsResult, constraintResult]) => {
                if (!isMounted) {
                    return;
                }

                const details = detailsResult?.ok ? detailsResult.data : undefined;
                const constraint = constraintResult?.ok ? (constraintResult.data ?? '') : '';

                if (!details) {
                    setShipmentData({
                        id: shipmentid,
                        name: '',
                        description: '',
                        startNodeName: '',
                        endNodeName: '',
                        constraintJson: constraint,
                    });
                    return;
                }

                setShipmentData({
                    id: details.id ?? shipmentid,
                    name: details.name ?? '',
                    description: details.description ?? '',
                    startNodeName: details.startNodeName ?? '',
                    endNodeName: details.endNodeName ?? '',
                    constraintJson: constraint,
                });
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [shipmentid]);

    const handleFindPath = () => {
        shipmentService.findShipmentPath(shipmentid)
            .then((result) => {
                if (!result?.ok || !Array.isArray(result.data) || result.data.length === 0) {
                    setPathResult('No path found.');
                    return;
                }

                setPathResult(result.data.join(' -> '));
            })
            .catch(() => {
                setPathResult('No path found.');
            });
    };

    const handleEditConstraint = () => {
        setIsSavingConstraint(true);
        setConstraintMessage('');

        shipmentService.editShipmentConstraint(shipmentid, shipmentData.constraintJson)
            .then((res) => {
                if (!res?.ok) {
                    setConstraintMessage(getApiErrorMessage(res, 'Unable to save constraint JSON.'));
                    return;
                }

                setConstraintMessage('Constraint JSON updated.');
            })
            .catch(() => {
                setConstraintMessage('Unable to save constraint JSON.');
            })
            .finally(() => {
                setIsSavingConstraint(false);
            });
    };

    const handleDeleteConstraint = () => {
        setIsDeletingConstraint(true);
        setConstraintMessage('');

        shipmentService.deleteShipmentConstraint(shipmentid)
            .then((res) => {
                if (!res?.ok) {
                    setConstraintMessage(getApiErrorMessage(res, 'Unable to delete constraint JSON.'));
                    return;
                }

                setShipmentData((prev) => ({
                    ...prev,
                    constraintJson: '',
                }));
                setConstraintMessage('Constraint JSON deleted.');
            })
            .catch(() => {
                setConstraintMessage('Unable to delete constraint JSON.');
            })
            .finally(() => {
                setIsDeletingConstraint(false);
            });
    };

    return (
        <section className="shipment-page page-layout">
            <div className="shipment-page__graph-shell page-layout__graph-shell">
                <Graph />
            </div>

            <aside className="shipment-page__side-panel page-layout__side-panel">
                <h2 className="shipment-page__title">Shipment Details</h2>

                <form className="shipment-form" onSubmit={(event) => event.preventDefault()}>
                    <label className="shipment-form__field">
                        <span className="shipment-form__label">Name</span>
                        <input
                            type="text"
                            className="shipment-form__input"
                            value={shipmentData.name}
                            readOnly
                        />
                    </label>

                    <label className="shipment-form__field">
                        <span className="shipment-form__label">Description</span>
                        <input
                            type="text"
                            className="shipment-form__input"
                            value={shipmentData.description}
                            readOnly
                        />
                    </label>

                    <label className="shipment-form__field">
                        <span className="shipment-form__label">Start Node</span>
                        <input
                            type="text"
                            className="shipment-form__input"
                            value={shipmentData.startNodeName}
                            readOnly
                        />
                    </label>

                    <label className="shipment-form__field">
                        <span className="shipment-form__label">End Node</span>
                        <input
                            type="text"
                            className="shipment-form__input"
                            value={shipmentData.endNodeName}
                            readOnly
                        />
                    </label>

                    <div className="shipment-form__actions">
                        <button
                            type="button"
                            className="shipment-form__button"
                            onClick={handleFindPath}
                            disabled={isLoading}
                        >
                            Find Path
                        </button>
                    </div>

                    {pathResult && (
                        <p className="shipment-form__path-result">
                            <strong>Found Path:</strong> {pathResult}
                        </p>
                    )}

                    <label className="shipment-form__field">
                        <span className="shipment-form__label">Constraint JSON</span>
                        <textarea
                            className="shipment-form__textarea"
                            value={shipmentData.constraintJson}
                            onChange={(event) =>
                                setShipmentData((prev) => ({
                                    ...prev,
                                    constraintJson: event.target.value,
                                }))
                            }
                        />
                    </label>

                    <div className="shipment-form__actions shipment-form__actions--split">
                        <button
                            type="button"
                            className="shipment-form__button"
                            onClick={handleEditConstraint}
                            disabled={isLoading || isSavingConstraint || isDeletingConstraint}
                        >
                            {isSavingConstraint ? 'Saving...' : 'Edit Constraint'}
                        </button>
                        <button
                            type="button"
                            className="shipment-form__button shipment-form__button--danger"
                            onClick={handleDeleteConstraint}
                            disabled={isLoading || isSavingConstraint || isDeletingConstraint}
                        >
                            {isDeletingConstraint ? 'Deleting...' : 'Delete Constraint'}
                        </button>
                    </div>

                    {constraintMessage && (
                        <p className="shipment-form__path-result">{constraintMessage}</p>
                    )}
                </form>
            </aside>
        </section>
    );
};

export default ShipmentPage;
