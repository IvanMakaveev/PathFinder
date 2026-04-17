import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Graph from '../Graph';
import * as edgeService from '../../services/edgeService';
import * as graphService from '../../services/graphService';
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState('');
    const [edgeDetails, setEdgeDetails] = useState(() => normalizeEdgeData(undefined, edgeid));

    useEffect(() => {
        let isMounted = true;

        setIsLoading(true);
        setMessage('');

        edgeService.getEdgeDetails(edgeid)
            .then((edgeData) => {
                if (!isMounted) {
                    return;
                }

                if (edgeData != undefined) {
                    setEdgeDetails(normalizeEdgeData(edgeData, edgeid));
                    return;
                }

                // Fallback for APIs that don't expose edge-details endpoint yet.
                return graphService.getGraphData().then((graphData) => {
                    if (!isMounted) {
                        return;
                    }

                    const edges = graphData?.edges ?? [];
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
                if (res == undefined) {
                    setMessage('Unable to delete edge.');
                    return;
                }

                setMessage('Edge deleted.');
                setGraphRefreshKey((prev) => prev + 1);
                navigate('/');
            })
            .catch(() => {
                setMessage('Unable to delete edge.');
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    return (
        <section className="edge-page">
            <div className="edge-page__graph-shell">
                <Graph key={graphRefreshKey} />
            </div>
            <aside className="edge-page__side-panel">
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
                                type="text"
                                className="edge-form__input"
                                value={edgeDetails.length}
                                readOnly
                            />
                        </label>

                        <div className="edge-form__actions">
                            <button
                                type="button"
                                className="edge-form__submit-button edge-form__submit-button--danger"
                                onClick={handleDelete}
                                disabled={isDeleting || !edgeDetails.id}
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