import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Graph from '../Graph';
import * as edgeService from '../../services/edgeService';
import * as graphService from '../../services/graphService';
import { ROUTES } from '../../routes';
import { getApiErrorMessage } from '../../utils/apiError';
import './EdgePage.css';

const normalizeEdgeData = (edgeData, fallbackId) => {
    if (!edgeData) {
        return {
            id: fallbackId,
            fromNodeName: '',
            toNodeName: '',
            fromNodeId: '',
            toNodeId: '',
            length: '',
        };
    }

    const fromNodeId = String(edgeData.fromNodeId ?? '');
    const toNodeId = String(edgeData.toNodeId ?? '');

    return {
        id: String(edgeData.id ?? fallbackId),
        fromNodeName: String(edgeData.fromNodeName ?? fromNodeId),
        toNodeName: String(edgeData.toNodeName ?? toNodeId),
        fromNodeId,
        toNodeId,
        length: String(edgeData.length ?? ''),
    };
};

const EdgePage = () => {
    const { edgeid } = useParams();
    const navigate = useNavigate();
    const [graphRefreshKey, setGraphRefreshKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const [edgeDetails, setEdgeDetails] = useState(() => normalizeEdgeData(undefined, edgeid));

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        setMessage('');

        edgeService.getEdgeDetails(edgeid)
            .then((edgeResult) => {
                if (!isMounted) {
                    return;
                }

                if (edgeResult?.ok && edgeResult?.data) {
                    setEdgeDetails(normalizeEdgeData(edgeResult.data, edgeid));
                    return;
                }

                // Fallback for APIs that don't expose edge-details endpoint yet.
                return graphService.getGraphData().then((graphResult) => {
                    if (!isMounted) {
                        return;
                    }

                    const edges = graphResult?.ok ? (graphResult.data?.edges ?? []) : [];
                    const matchingEdge = edges.find((edge) => String(edge.id) === String(edgeid));
                    setEdgeDetails(normalizeEdgeData(matchingEdge, edgeid));

                    if (!matchingEdge) {
                        setMessage('Unable to load edge details.');
                    }
                });
            })
            .catch(() => {
                if (isMounted) {
                    setMessage('Unable to load edge details.');
                    setEdgeDetails(normalizeEdgeData(undefined, edgeid));
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [edgeid]);

    const handleDelete = () => {
        setIsDeleting(true);
        setMessage('');

        edgeService.deleteEdge(edgeDetails.id)
            .then((res) => {
                if (!res?.ok) {
                    setMessage(getApiErrorMessage(res, 'Unable to delete edge.'));
                    return;
                }

                setMessage('Edge deleted.');
                setGraphRefreshKey((prev) => prev + 1);
                navigate(ROUTES.home);
            })
            .catch(() => {
                setMessage('Unable to delete edge.');
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    const handleEdit = () => {
        const numericLength = Number(edgeDetails.length);

        if (!Number.isInteger(numericLength) || numericLength <= 0) {
            setMessage('Length must be a positive integer.');
            return;
        }

        setIsSaving(true);
        setMessage('');

        edgeService.editEdgeLength(edgeDetails.id, numericLength)
            .then((res) => {
                if (!res?.ok) {
                    setMessage(getApiErrorMessage(res, 'Unable to update edge length.'));
                    return;
                }

                setMessage('Edge length updated.');
                setGraphRefreshKey((prev) => prev + 1);
            })
            .catch(() => {
                setMessage('Unable to update edge length.');
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    return (
        <section className="edge-page page-layout">
            <div className="edge-page__graph-shell page-layout__graph-shell">
                <Graph key={graphRefreshKey} />
            </div>
            <aside className="edge-page__side-panel page-layout__side-panel">
                <h2 className="edge-page__title">Edge Details</h2>

                {isLoading && <p className="edge-page__hint">Loading edge data...</p>}

                {!isLoading && (
                    <form className="edge-form" onSubmit={(event) => event.preventDefault()}>
                        <label className="edge-form__field">
                            <span className="edge-form__label">From Node</span>
                            <input
                                type="text"
                                className="edge-form__input"
                                value={edgeDetails.fromNodeName}
                                readOnly
                            />
                        </label>

                        <label className="edge-form__field">
                            <span className="edge-form__label">To Node</span>
                            <input
                                type="text"
                                className="edge-form__input"
                                value={edgeDetails.toNodeName}
                                readOnly
                            />
                        </label>

                        <label className="edge-form__field">
                            <span className="edge-form__label">Length</span>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                className="edge-form__input"
                                value={edgeDetails.length}
                                onChange={(event) =>
                                    setEdgeDetails((prev) => ({
                                        ...prev,
                                        length: event.target.value,
                                    }))
                                }
                            />
                        </label>

                        <div className="edge-form__actions">
                            <button
                                type="button"
                                className="edge-form__submit-button"
                                onClick={handleEdit}
                                disabled={isLoading || isSaving || isDeleting || !edgeDetails.id}
                            >
                                {isSaving ? 'Saving...' : 'Edit'}
                            </button>
                            <button
                                type="button"
                                className="edge-form__submit-button edge-form__submit-button--danger"
                                onClick={handleDelete}
                                disabled={isLoading || isSaving || isDeleting || !edgeDetails.id}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>

                        {message && <p className="edge-form__hint">{message}</p>}
                    </form>
                )}
            </aside>
        </section>
    );
};

export default EdgePage;