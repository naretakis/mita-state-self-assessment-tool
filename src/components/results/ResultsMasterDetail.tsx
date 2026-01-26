/**
 * Results Master-Detail Component
 *
 * Split view with domain/area navigation on left and detailed results on right.
 * Shows both As-Is (current) and To-Be (target) maturity levels.
 */

import { JSX, useState, useMemo, Fragment, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useScores, useCapabilityAssessments, useOrbitRatings, useAttachments } from '../../hooks';
import type { CapabilityDomain, DimensionScore, CapabilityArea } from '../../types';
import { getAreasFromDomain, isCategorizedDomain } from '../../types';
import { getAreaWithDomain } from '../../services/capabilities';
import { DimensionScoresTableWithTarget } from './DimensionScoresTableWithTarget';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ResultsMasterDetailProps {
  domains: CapabilityDomain[];
}

/** Selection can be either a domain or an area */
type Selection =
  | { type: 'domain'; domain: CapabilityDomain }
  | { type: 'area'; areaId: string; areaName: string };

/** Layer display names */
const LAYER_NAMES: Record<string, string> = {
  strategic: 'Strategic',
  core: 'Core',
  support: 'Support',
};

/**
 * Short labels for radar chart
 */
const SHORT_DIMENSION_LABELS: Record<string, string> = {
  Outcomes: 'Outcomes',
  Roles: 'Roles',
  'Business Architecture': 'Bus. Arch.',
  'Information & Data': 'Info/Data',
  Technology: 'Tech',
};

/**
 * Calculate target (To-Be) dimension scores from ratings
 */
function calculateTargetDimensionScores(
  dimensionScores: DimensionScore[],
  ratings: { dimensionId: string; targetLevel?: number }[]
): { dimensionId: string; targetLevel: number | null }[] {
  return dimensionScores.map((dim) => {
    const dimRatings = ratings.filter(
      (r) => r.dimensionId === dim.dimensionId && r.targetLevel && r.targetLevel > 0
    );
    if (dimRatings.length === 0) return { dimensionId: dim.dimensionId, targetLevel: null };

    const avg = dimRatings.reduce((sum, r) => sum + (r.targetLevel ?? 0), 0) / dimRatings.length;
    return { dimensionId: dim.dimensionId, targetLevel: Math.round(avg * 10) / 10 };
  });
}

/**
 * Domain detail panel showing domain summary and capability areas list
 */
function DomainDetailPanel({
  domain,
  onSelectArea,
  headingRef,
}: {
  domain: CapabilityDomain;
  onSelectArea: (area: CapabilityArea) => void;
  headingRef: React.RefObject<HTMLHeadingElement>;
}): JSX.Element {
  const { getDomainScore, getCapabilityScore, getCapabilityStatus } = useScores();

  const domainScore = getDomainScore(domain.id);
  const allAreas = getAreasFromDomain(domain);
  const finalizedAreas = allAreas.filter((area) => getCapabilityStatus(area.id) === 'finalized');

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Card */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left: Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <Typography
              variant="h5"
              component="h2"
              fontWeight={600}
              sx={{ mb: 1 }}
              ref={headingRef}
              tabIndex={-1}
            >
              {domain.name}
            </Typography>

            {/* Layer badge */}
            <Chip
              label={LAYER_NAMES[domain.layer] ?? domain.layer}
              size="small"
              variant="outlined"
              sx={{ mb: 1.5, textTransform: 'capitalize' }}
            />

            {/* Description */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {domain.description}
            </Typography>

            {/* Progress */}
            <Typography variant="body2" color="text.secondary">
              {finalizedAreas.length} of {allAreas.length} capability areas assessed
            </Typography>
          </Box>

          {/* Right: Score */}
          {domainScore !== null && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  {domainScore.toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Domain Score
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Capability Areas Table */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="h3">
            Capability Areas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an area to view detailed ORBIT assessment results
          </Typography>
        </Box>
        <TableContainer>
          <Table
            aria-label={`Capability areas in ${domain.name}. Select a row to view detailed results.`}
          >
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="col">
                  Capability Area
                </TableCell>
                <TableCell component="th" scope="col" align="center" sx={{ width: 100 }}>
                  Status
                </TableCell>
                <TableCell component="th" scope="col" align="center" sx={{ width: 80 }}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allAreas.map((area) => {
                const areaScore = getCapabilityScore(area.id);
                const status = getCapabilityStatus(area.id);
                const isFinalized = status === 'finalized';

                return (
                  <TableRow
                    key={area.id}
                    hover
                    onClick={() => onSelectArea(area)}
                    sx={{
                      cursor: 'pointer',
                      '&:focus-within': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: -2,
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        component="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArea(area);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectArea(area);
                          }
                        }}
                        aria-label={`${area.name}, ${isFinalized ? `assessed, score ${areaScore?.toFixed(1) ?? 'none'}` : 'not assessed'}. Press Enter to view details.`}
                        sx={{
                          all: 'unset',
                          cursor: 'pointer',
                          display: 'block',
                          width: '100%',
                          '&:focus': {
                            outline: 'none',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ fontStyle: isFinalized ? 'normal' : 'italic' }}
                        >
                          {area.name}
                        </Typography>
                        {area.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {area.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={isFinalized ? 'Assessed' : 'Not Assessed'}
                        size="small"
                        color={isFinalized ? 'success' : 'default'}
                        variant={isFinalized ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {areaScore !== null ? (
                        <Chip
                          label={areaScore.toFixed(1)}
                          size="small"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

/**
 * Area detail panel showing full results for selected capability area
 */
function AreaDetailPanel({
  areaId,
  areaName,
  headingRef,
}: {
  areaId: string;
  areaName: string;
  headingRef: React.RefObject<HTMLHeadingElement>;
}): JSX.Element {
  const { getCapabilityScoreData, getDimensionScoresForAssessment } = useScores();
  const { getAssessmentForArea } = useCapabilityAssessments();

  const areaInfo = useMemo(() => getAreaWithDomain(areaId), [areaId]);
  const scoreData = getCapabilityScoreData(areaId);
  const assessment = getAssessmentForArea(areaId);
  const dimensionScores = assessment ? getDimensionScoresForAssessment(assessment.id) : undefined;

  const { ratings } = useOrbitRatings(assessment?.id);
  const { attachments, downloadAttachment } = useAttachments(assessment?.id);

  // Calculate target dimension scores
  const targetDimScores = useMemo(() => {
    if (!dimensionScores) return [];
    return calculateTargetDimensionScores(dimensionScores, ratings);
  }, [dimensionScores, ratings]);

  // Build radar chart data with both As-Is and To-Be
  const radarChartData = useMemo(() => {
    if (!dimensionScores) return null;

    const labels = dimensionScores.map(
      (d) => SHORT_DIMENSION_LABELS[d.dimensionName] ?? d.dimensionName
    );
    const asIsScores = dimensionScores.map((d) => d.averageLevel ?? 0);
    const toBeScores = targetDimScores.map((d) => d.targetLevel ?? 0);

    // Check if there's any To-Be data
    const hasToBeData = toBeScores.some((s) => s > 0);

    const datasets = [
      {
        label: 'As-Is (Current)',
        data: asIsScores,
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(25, 118, 210, 1)',
        pointRadius: 4,
      },
    ];

    if (hasToBeData) {
      datasets.push({
        label: 'To-Be (Target)',
        data: toBeScores,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        pointRadius: 4,
      });
    }

    return { labels, datasets };
  }, [dimensionScores, targetDimScores]);

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { display: false, stepSize: 1 },
        grid: { color: 'rgba(0, 0, 0, 0.08)' },
        angleLines: { color: 'rgba(0, 0, 0, 0.08)' },
        pointLabels: { font: { size: 10, weight: 500 as const }, color: '#374151' },
      },
    },
    plugins: {
      legend: { display: true, position: 'bottom' as const },
    },
  };

  // Check if we have a finalized assessment with results
  const hasResults = scoreData && scoreData.score !== null;

  // Calculate To-Be average
  const toBeAverage = (() => {
    const validTargets = targetDimScores.filter((d) => d.targetLevel !== null);
    if (validTargets.length === 0) return null;
    return validTargets.reduce((sum, d) => sum + (d.targetLevel ?? 0), 0) / validTargets.length;
  })();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Card - combines title, description, scores, and chart */}
      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left: Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <Typography
              variant="h5"
              component="h2"
              fontWeight={600}
              sx={{ mb: 1 }}
              ref={headingRef}
              tabIndex={-1}
            >
              {areaName}
            </Typography>

            {/* Description */}
            {areaInfo?.area.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {areaInfo.area.description}
              </Typography>
            )}

            {/* Topics */}
            {areaInfo?.area.topics && areaInfo.area.topics.length > 0 && (
              <Box
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center', mb: 1.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: 'text.secondary', mr: 0.5 }}
                >
                  Topics:
                </Typography>
                {areaInfo.area.topics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    size="small"
                    variant="outlined"
                    sx={{ height: 22, fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            )}

            {/* Tags (only if we have results) */}
            {hasResults && scoreData.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: 'text.secondary', mr: 0.5 }}
                >
                  Tags:
                </Typography>
                {scoreData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 22 }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Right: Scores + Radar Chart (only if we have results) */}
          {hasResults && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}
            >
              {/* Scores row */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {scoreData.score?.toFixed(1) ?? '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    As-Is
                  </Typography>
                </Box>
                {toBeAverage !== null && (
                  <>
                    <Typography variant="h5" color="text.disabled" sx={{ mx: 0.5 }}>
                      →
                    </Typography>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, lineHeight: 1, color: 'success.main' }}
                      >
                        {toBeAverage.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        To-Be
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              {/* Radar Chart */}
              {radarChartData && (
                <Box
                  sx={{ width: 200, height: 200 }}
                  role="img"
                  aria-label="Radar chart comparing As-Is and To-Be maturity levels across ORBIT dimensions"
                >
                  <Radar data={radarChartData} options={radarChartOptions} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* No Assessment Message */}
      {!hasResults && (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <AssignmentIcon
            sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }}
            aria-hidden="true"
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Assessment Results
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This capability area has not been assessed yet. Complete an assessment from the
            Dashboard to see results here.
          </Typography>
        </Paper>
      )}

      {/* Dimension Scores Table with To-Be (only if we have results) */}
      {hasResults && dimensionScores && (
        <DimensionScoresTableWithTarget
          dimensionScores={dimensionScores}
          targetDimScores={targetDimScores}
          ratings={ratings}
          attachments={attachments}
          onDownloadAttachment={downloadAttachment}
        />
      )}
    </Box>
  );
}

/**
 * Navigation panel showing domains and areas
 */
function NavigationPanel({
  domains,
  selection,
  onSelectDomain,
  onSelectArea,
}: {
  domains: CapabilityDomain[];
  selection: Selection | null;
  onSelectDomain: (domain: CapabilityDomain) => void;
  onSelectArea: (areaId: string, areaName: string) => void;
}): JSX.Element {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const { getDomainScore, getCapabilityScore, getCapabilityStatus } = useScores();

  const selectedDomainId = selection?.type === 'domain' ? selection.domain.id : null;
  const selectedAreaId = selection?.type === 'area' ? selection.areaId : null;

  return (
    <Box>
      <Box sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Domains & Areas
        </Typography>
      </Box>
      <List disablePadding dense role="list">
        {domains.map((domain) => {
          const isExpanded = expandedDomains.has(domain.id);
          const isDomainSelected = selectedDomainId === domain.id;
          const domainScore = getDomainScore(domain.id);
          const allAreas = getAreasFromDomain(domain);
          const finalizedAreas = allAreas.filter(
            (area) => getCapabilityStatus(area.id) === 'finalized'
          );

          return (
            <Fragment key={domain.id}>
              <ListItemButton
                selected={isDomainSelected}
                onClick={() => {
                  onSelectDomain(domain);
                  // Toggle expand/collapse
                  setExpandedDomains((prev) => {
                    const next = new Set(prev);
                    if (next.has(domain.id)) {
                      next.delete(domain.id);
                    } else {
                      next.add(domain.id);
                    }
                    return next;
                  });
                }}
                sx={{ py: 0.5, minHeight: 36 }}
                aria-expanded={isExpanded}
                aria-label={`${domain.name}, ${domainScore !== null ? `score ${domainScore.toFixed(1)}, ` : ''}${finalizedAreas.length} of ${allAreas.length} assessed`}
              >
                {isExpanded ? (
                  <ExpandMoreIcon
                    sx={{ fontSize: 18, mr: 0.5, color: 'action.active' }}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronRightIcon
                    sx={{ fontSize: 18, mr: 0.5, color: 'action.active' }}
                    aria-hidden="true"
                  />
                )}
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {domain.name}
                    </Typography>
                  }
                  sx={{ my: 0 }}
                />
                {domainScore !== null ? (
                  <Chip
                    label={`${domainScore.toFixed(1)} (${finalizedAreas.length}/${allAreas.length})`}
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem',
                      ml: 0.5,
                    }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                    {finalizedAreas.length}/{allAreas.length}
                  </Typography>
                )}
              </ListItemButton>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List disablePadding dense>
                  {isCategorizedDomain(domain)
                    ? domain.categories.map((category) => (
                        <Fragment key={category.id}>
                          <Box sx={{ px: 2, py: 0.25, bgcolor: 'grey.100' }}>
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="text.secondary"
                              sx={{ fontSize: '0.65rem' }}
                            >
                              {category.name}
                            </Typography>
                          </Box>
                          {category.areas.map((area) => {
                            const areaScore = getCapabilityScore(area.id);
                            const isSelected = selectedAreaId === area.id;
                            const isFinalized = getCapabilityStatus(area.id) === 'finalized';
                            return (
                              <ListItemButton
                                key={area.id}
                                selected={isSelected}
                                onClick={() => onSelectArea(area.id, area.name)}
                                sx={{
                                  pl: 4,
                                  py: 0.25,
                                  minHeight: 28,
                                  opacity: isFinalized ? 1 : 0.7,
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: '0.8rem',
                                        fontStyle: isFinalized ? 'normal' : 'italic',
                                      }}
                                    >
                                      {area.name}
                                    </Typography>
                                  }
                                  sx={{ my: 0 }}
                                />
                                {areaScore !== null ? (
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {areaScore.toFixed(1)}
                                  </Typography>
                                ) : (
                                  <Typography variant="caption" color="text.disabled">
                                    —
                                  </Typography>
                                )}
                              </ListItemButton>
                            );
                          })}
                        </Fragment>
                      ))
                    : allAreas.map((area) => {
                        const areaScore = getCapabilityScore(area.id);
                        const isSelected = selectedAreaId === area.id;
                        const isFinalized = getCapabilityStatus(area.id) === 'finalized';
                        return (
                          <ListItemButton
                            key={area.id}
                            selected={isSelected}
                            onClick={() => onSelectArea(area.id, area.name)}
                            sx={{
                              pl: 3.5,
                              py: 0.25,
                              minHeight: 28,
                              opacity: isFinalized ? 1 : 0.7,
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: '0.8rem',
                                    fontStyle: isFinalized ? 'normal' : 'italic',
                                  }}
                                >
                                  {area.name}
                                </Typography>
                              }
                              sx={{ my: 0 }}
                            />
                            {areaScore !== null ? (
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {areaScore.toFixed(1)}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.disabled">
                                —
                              </Typography>
                            )}
                          </ListItemButton>
                        );
                      })}
                </List>
              </Collapse>
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}

/**
 * Master-Detail split view component
 */
export function ResultsMasterDetail({ domains }: ResultsMasterDetailProps): JSX.Element {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');
  const detailHeadingRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Focus the detail heading when selection changes
  useEffect(() => {
    if (selection && detailHeadingRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        detailHeadingRef.current?.focus();
      }, 100);
    }
  }, [selection]);

  const handleSelectDomain = (domain: CapabilityDomain): void => {
    setSelection({ type: 'domain', domain });
    setAnnouncement(`Viewing ${domain.name} domain details`);
  };

  const handleSelectArea = (areaId: string, areaName: string): void => {
    setSelection({ type: 'area', areaId, areaName });
    setAnnouncement(`Viewing ${areaName} assessment results`);
  };

  const handleSelectAreaFromDomain = (area: CapabilityArea): void => {
    setSelection({ type: 'area', areaId: area.id, areaName: area.name });
    setAnnouncement(`Viewing ${area.name} assessment results`);
  };

  const handleBackToNav = (): void => {
    navRef.current?.focus();
    setAnnouncement('Returned to domain navigation');
  };

  return (
    <Paper
      sx={{ display: 'flex', minHeight: 400, position: 'relative' }}
      role="region"
      aria-label="Results by domain"
    >
      {/* Live region for announcements */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </Box>

      {/* Left: Navigation */}
      <Box
        sx={{
          width: 320,
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
        component="nav"
        aria-label="Domain and capability area navigation"
        ref={navRef}
        tabIndex={-1}
      >
        <NavigationPanel
          domains={domains}
          selection={selection}
          onSelectDomain={handleSelectDomain}
          onSelectArea={handleSelectArea}
        />
      </Box>

      {/* Right: Detail Panel */}
      <Box
        sx={{ flex: 1, bgcolor: 'grey.50', position: 'relative' }}
        role="region"
        aria-label="Selected item details"
      >
        {selection && (
          <Button
            size="small"
            onClick={handleBackToNav}
            aria-label="Return to domain navigation sidebar"
            sx={{
              position: 'absolute',
              left: '-9999px',
              top: 8,
              zIndex: 1,
              fontSize: '0.75rem',
              '&:focus': {
                left: 8,
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            ← Back to navigation
          </Button>
        )}
        {selection?.type === 'domain' ? (
          <DomainDetailPanel
            domain={selection.domain}
            onSelectArea={handleSelectAreaFromDomain}
            headingRef={detailHeadingRef}
          />
        ) : selection?.type === 'area' ? (
          <AreaDetailPanel
            areaId={selection.areaId}
            areaName={selection.areaName}
            headingRef={detailHeadingRef}
          />
        ) : (
          <Box
            sx={{
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              Select a domain or capability area from the left to view results
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
