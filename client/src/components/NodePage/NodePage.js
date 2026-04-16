import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Graph from '../Graph';
import * as nodeService from '../../services/nodeService';
import './NodePage.css';

const NODE_TYPE_OPTIONS = ['NormalNode', 'BrokenNode'];
const ATTRIBUTE_KEY_OPTIONS = ['CoolantNode', 'SpecializedNode'];

const createEmptyPair = () => ({
    key: ATTRIBUTE_KEY_OPTIONS[0],
    value: '',
});

const normalizeModifierType = (rawType) => {
    if (rawType === 0 || rawType === '0') {
        return 'CoolantNode';
    }

    if (rawType === 1 || rawType === '1') {
        return 'SpecializedNode';
    }

    if (ATTRIBUTE_KEY_OPTIONS.includes(rawType)) {
        return rawType;
    }

    return ATTRIBUTE_KEY_OPTIONS[0];
};

const normalizeTypeValue = (rawType) => {
    if (rawType === 0 || rawType === '0') {
        return 'NormalNode';
    }

    if (rawType === 1 || rawType === '1') {
        return 'BrokenNode';
    }

    if (NODE_TYPE_OPTIONS.includes(rawType)) {
        return rawType;
    }

    return NODE_TYPE_OPTIONS[0];
};

const normalizeModifiers = (modifiersData) => {
    if (Array.isArray(modifiersData)) {
        return modifiersData.map((item) => {
            const key = item?.modifierType;
            const value = item?.modifierValue;

            return {
                key: normalizeModifierType(key),
                value: Number.isFinite(Number(value)) && Number(value) > 0 ? String(value) : '',
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
    const [graphRefreshKey, setGraphRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [saveMessage, setSaveMessage] = useState('');
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
            .then(([detailsData, modifiersData]) => {
                if (!isMounted) {
                    return;
                }

                if (detailsData == undefined || modifiersData == undefined) {
                    setLoadError('Unable to load node details.');
                    setNodeDetails(normalizeNodeData({ id: nodeid }, [], nodeid));
                    return;
                }

                setNodeDetails(normalizeNodeData(detailsData, modifiersData, nodeid));
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

    const updateAttribute = (index, field, value) => {
        setNodeDetails((prev) => ({
            ...prev,
            attributes: prev.attributes.map((pair, pairIndex) =>
                pairIndex === index ? { ...pair, [field]: value } : pair
            ),
        }));
    };

    const addAttribute = () => {
        setNodeDetails((prev) => ({
            ...prev,
            attributes: [...prev.attributes, createEmptyPair()],
        }));
    };

    const removeAttribute = (index) => {
        setNodeDetails((prev) => ({
            ...prev,
            attributes: prev.attributes.filter((_, pairIndex) => pairIndex !== index),
        }));
    };

    const handleEditClick = () => {
        setIsSaving(true);
        setSaveMessage('');

        nodeService.editNodeType(nodeDetails.id, nodeDetails.type)
            .then((res) => {
                if (res == undefined) {
                    setSaveMessage('Unable to save node type.');
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
            .then((res) => {
                if (res == undefined) {
                    setSaveMessage('Unable to delete node.');
                    return;
                }

                setSaveMessage('Node deleted.');
            })
            .catch(() => {
                setSaveMessage('Unable to delete node.');
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    return (
        <section className="node-page">
            <div className="node-page__graph-shell">
                <Graph key={graphRefreshKey} />
            </div>
            <aside className="node-page__side-panel">
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

                        <div className="node-form__field">
                            <div className="node-form__header-row">
                                <span className="node-form__label">Key/Value Pairs</span>
                                <button
                                    type="button"
                                    className="node-form__small-button"
                                    onClick={addAttribute}
                                >
                                    Add Pair
                                </button>
                            </div>

                            {nodeDetails.attributes.length === 0 && (
                                <p className="node-form__hint">No pairs configured.</p>
                            )}

                            <div className="node-form__pairs">
                                {nodeDetails.attributes.map((pair, index) => (
                                    <div className="node-form__pair" key={`${pair.key}-${index}`}>
                                        <select
                                            className="node-form__input"
                                            value={pair.key}
                                            onChange={(event) =>
                                                updateAttribute(index, 'key', event.target.value)
                                            }
                                        >
                                            {ATTRIBUTE_KEY_OPTIONS.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            className="node-form__input"
                                            value={pair.value}
                                            onChange={(event) =>
                                                updateAttribute(index, 'value', event.target.value)
                                            }
                                            placeholder="Positive integer"
                                        />

                                        <button
                                            type="button"
                                            className="node-form__small-button node-form__small-button--danger"
                                            onClick={() => removeAttribute(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="node-form__actions">
                            <button
                                type="button"
                                className="node-form__submit-button"
                                onClick={handleEditClick}
                                disabled={isSaving || isDeleting}
                            >
                                {isSaving ? 'Saving...' : 'Edit'}
                            </button>
                            <button
                                type="button"
                                className="node-form__submit-button node-form__submit-button--danger"
                                onClick={handleDeleteClick}
                                disabled={isSaving || isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>

                        {saveMessage && <p className="node-form__hint">{saveMessage}</p>}
                    </form>
                )}
            </aside>
        </section>
    );
};

export default NodePage;