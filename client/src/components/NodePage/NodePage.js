import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Graph from '../Graph';
import * as nodeService from '../../services/nodeService';
import { ROUTES } from '../../routes';
import {
    NODE_MODIFIER_TYPE_OPTIONS,
    NODE_TYPE_OPTIONS,
} from '../../constants/nodeOptions';
import { useShipments } from '../../contexts/ShipmentContext';
import { getApiErrorMessage } from '../../utils/apiError';
import './NodePage.css';

const normalizeModifierType = (rawType) => {
    if (NODE_MODIFIER_TYPE_OPTIONS.includes(rawType)) {
        return rawType;
    }

    return NODE_MODIFIER_TYPE_OPTIONS[0];
};

const normalizeTypeValue = (rawType) => {
    if (NODE_TYPE_OPTIONS.includes(rawType)) {
        return rawType;
    }

    return NODE_TYPE_OPTIONS[0];
};

const normalizeModifiers = (modifiersData) => {
    if (Array.isArray(modifiersData)) {
        return modifiersData.map((item) => {
            const modifierId = item?.id ?? item?.Id;
            const key = item?.modifierType;
            const value = item?.modifierValue;

            return {
                id: modifierId,
                key: normalizeModifierType(key),
                value: Number.isFinite(Number(value)) ? String(Number(value)) : '0',
            };
        });
    }

    return [];
};

const normalizeNodeData = (detailsData, modifiersData, fallbackId) => {
    const nodeId = detailsData?.id ?? fallbackId;
    const nodeName = detailsData?.name ?? '';
    const nodeType = detailsData?.nodeType;

    return {
        id: nodeId,
        name: nodeName,
        type: normalizeTypeValue(nodeType),
        attributes: normalizeModifiers(modifiersData),
    };
};

const NodePage = () => {
    const { nodeid } = useParams();
    const navigate = useNavigate();
    const { refreshShipments } = useShipments();
    const [graphRefreshKey, setGraphRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddingModifier, setIsAddingModifier] = useState(false);
    const [modifierToDeleteId, setModifierToDeleteId] = useState(null);
    const [loadError, setLoadError] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
    const [newModifier, setNewModifier] = useState({
        key: NODE_MODIFIER_TYPE_OPTIONS[0],
        value: '0',
    });
    const [nodeDetails, setNodeDetails] = useState(() =>
        normalizeNodeData({ id: nodeid }, [], nodeid)
    );

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        setLoadError('');
        setSaveMessage('');

        Promise.all([
            nodeService.getNodeDetails(nodeid),
            nodeService.getNodeModifiers(nodeid),
        ])
            .then(([detailsResult, modifiersResult]) => {
                if (!isMounted) {
                    return;
                }

                if (!detailsResult?.ok || !modifiersResult?.ok) {
                    setLoadError('Unable to load node details.');
                    setNodeDetails(normalizeNodeData({ id: nodeid }, [], nodeid));
                    return;
                }

                setNodeDetails(normalizeNodeData(detailsResult.data, modifiersResult.data, nodeid));
            })
            .catch(() => {
                if (!isMounted) {
                    return;
                }

                setLoadError('Unable to load node details.');
                setNodeDetails(normalizeNodeData({ id: nodeid }, [], nodeid));
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [nodeid]);

    const handleEditClick = () => {
        setIsSaving(true);
        setSaveMessage('');

        nodeService.editNodeType(nodeDetails.id, nodeDetails.type)
            .then((res) => {
                if (!res?.ok) {
                    setSaveMessage(getApiErrorMessage(res, 'Unable to save node type.'));
                    return;
                }

                setSaveMessage('Node type updated.');
                setGraphRefreshKey((prev) => prev + 1);
            })
            .catch(() => {
                setSaveMessage('Unable to save node type.');
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const handleDeleteClick = () => {
        setIsDeleting(true);
        setSaveMessage('');

        nodeService.deleteNode(nodeDetails.id)
            .then(async (res) => {
                if (!res?.ok) {
                    setSaveMessage(getApiErrorMessage(res, 'Unable to delete node.'));
                    return;
                }

                await refreshShipments();
                setSaveMessage('Node deleted.');
                navigate(ROUTES.home);
            })
            .catch(() => {
                setSaveMessage('Unable to delete node.');
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    const reloadModifiers = () => {
        return nodeService.getNodeModifiers(nodeid)
            .then((res) => {
                if (!res?.ok) {
                    return false;
                }

                setNodeDetails((prev) => ({
                    ...prev,
                    attributes: normalizeModifiers(res.data),
                }));

                return true;
            })
            .catch(() => false);
    };

    const handleAddModifierClick = () => {
        const numericValue = Number(newModifier.value);
        if (!Number.isInteger(numericValue)) {
            setSaveMessage('Modifier value must be an integer');
            return;
        }

        setIsAddingModifier(true);
        setSaveMessage('');

        nodeService.addNodeModifier(nodeDetails.id, newModifier.key, numericValue)
            .then(async (res) => {
                if (res?.ok !== true) {
                    setSaveMessage(getApiErrorMessage(res, 'Unable to add modifier.'));
                    return;
                }

                const reloaded = await reloadModifiers();

                if (!reloaded) {
                    const created = res?.data;
                    const createdId = created?.id ?? created?.Id;
                    const createdType = created?.modifierType ?? created?.ModifierType ?? newModifier.key;
                    const createdValue = created?.modifierValue ?? created?.Value ?? numericValue;

                    if (createdId != null) {
                        setNodeDetails((prev) => ({
                            ...prev,
                            attributes: [
                                ...prev.attributes,
                                {
                                    id: createdId,
                                    key: normalizeModifierType(createdType),
                                    value: String(Number(createdValue) || 0),
                                },
                            ],
                        }));
                    }
                }

                setNewModifier((prev) => ({ ...prev, value: '0' }));
                setSaveMessage('Modifier added.');
            })
            .catch(() => {
                setSaveMessage('Unable to add modifier.');
            })
            .finally(() => {
                setIsAddingModifier(false);
            });
    };

    const handleDeleteModifierClick = (modifierId) => {
        setModifierToDeleteId(modifierId);
        setSaveMessage('');

        nodeService.deleteNodeModifier(modifierId)
            .then(async (res) => {
                if (!res?.ok) {
                    setSaveMessage(getApiErrorMessage(res, 'Unable to delete modifier.'));
                    return;
                }

                const reloaded = await reloadModifiers();
                if (!reloaded) {
                    setNodeDetails((prev) => ({
                        ...prev,
                        attributes: prev.attributes.filter((pair) => String(pair.id) !== String(modifierId)),
                    }));
                }

                setSaveMessage('Modifier deleted.');
            })
            .catch(() => {
                setSaveMessage('Unable to delete modifier.');
            })
            .finally(() => {
                setModifierToDeleteId(null);
            });
    };

    return (
        <section className="node-page page-layout">
            <div className="node-page__graph-shell page-layout__graph-shell">
                <Graph key={graphRefreshKey} />
            </div>
            <aside className="node-page__side-panel page-layout__side-panel">
                <h2 className="node-page__title">Node Details</h2>

                {isLoading && <p className="node-page__hint">Loading node data...</p>}

                {!isLoading && loadError && <p className="node-page__hint">{loadError}</p>}

                {!isLoading && !loadError && (
                    <form className="node-form" onSubmit={(event) => event.preventDefault()}>
                        <label className="node-form__field">
                            <span className="node-form__label">Name</span>
                            <input
                                type="text"
                                className="node-form__input"
                                value={nodeDetails.name}
                                readOnly
                            />
                        </label>

                        <label className="node-form__field">
                            <span className="node-form__label">Type</span>
                            <select
                                className="node-form__input"
                                value={nodeDetails.type}
                                onChange={(event) =>
                                    setNodeDetails((prev) => ({ ...prev, type: event.target.value }))
                                }
                            >
                                {NODE_TYPE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="node-form__actions node-form__actions--top">
                            <button
                                type="button"
                                className="node-form__submit-button"
                                onClick={handleEditClick}
                                disabled={isSaving || isDeleting || isAddingModifier || modifierToDeleteId !== null}
                            >
                                {isSaving ? 'Saving...' : 'Edit'}
                            </button>
                            <button
                                type="button"
                                className="node-form__submit-button node-form__submit-button--danger"
                                onClick={handleDeleteClick}
                                disabled={isSaving || isDeleting || isAddingModifier || modifierToDeleteId !== null}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>

                        <div className="node-form__field">
                            <div className="node-form__header-row">
                                <span className="node-form__label">Modifiers</span>
                            </div>

                            <div className="node-form__pair node-form__pair--adder">
                                <select
                                    className="node-form__input"
                                    value={newModifier.key}
                                    onChange={(event) =>
                                        setNewModifier((prev) => ({ ...prev, key: event.target.value }))
                                    }
                                >
                                    {NODE_MODIFIER_TYPE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    step="1"
                                    className="node-form__input"
                                    value={newModifier.value}
                                    onChange={(event) =>
                                        setNewModifier((prev) => ({ ...prev, value: event.target.value }))
                                    }
                                    placeholder="Integer"
                                />

                                <button
                                    type="button"
                                    className="node-form__small-button"
                                    onClick={handleAddModifierClick}
                                    disabled={isAddingModifier || isSaving || isDeleting || modifierToDeleteId !== null}
                                >
                                    {isAddingModifier ? 'Adding...' : 'Add'}
                                </button>
                            </div>

                            {nodeDetails.attributes.length === 0 && (
                                <p className="node-form__hint">No modifiers configured.</p>
                            )}

                            <div className="node-form__pairs">
                                {nodeDetails.attributes.map((pair, index) => (
                                    <div className="node-form__pair" key={`${pair.id ?? 'modifier'}-${pair.key}-${index}`}>
                                        <input
                                            type="text"
                                            className="node-form__input"
                                            value={pair.key}
                                            readOnly
                                        />

                                        <input
                                            type="number"
                                            step="1"
                                            className="node-form__input"
                                            value={pair.value}
                                            readOnly
                                        />

                                        <button
                                            type="button"
                                            className="node-form__small-button node-form__small-button--danger"
                                            onClick={() => handleDeleteModifierClick(pair.id)}
                                            disabled={pair.id == null || isAddingModifier || isSaving || isDeleting || modifierToDeleteId !== null}
                                        >
                                            {modifierToDeleteId !== null && String(modifierToDeleteId) === String(pair.id)
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {saveMessage && <p className="node-form__hint">{saveMessage}</p>}
                    </form>
                )}
            </aside>
        </section>
    );
};

export default NodePage;