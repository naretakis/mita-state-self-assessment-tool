/**
 * Expandable domain table component
 * Clean design matching mita-3.0 reference
 */

import { JSX, useState, Fragment } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { StackedProgressBar } from './ProgressBar';
import { CapabilityRow } from './CapabilityRow';
import { TagsDisplay } from './TagsDisplay';
import { useScores } from '../../hooks';
import type { CapabilityDomain, CapabilityArea } from '../../types';
import { getAreasFromDomain, isCategorizedDomain } from '../../types';

interface DomainTableProps {
  domains: CapabilityDomain[];
  searchQuery: string;
  selectedTags: string[];
  onStartAssessment: (areaId: string) => void;
  onResumeAssessment: (areaId: string) => void;
  onEditAssessment: (areaId: string) => void;
  onViewAssessment: (areaId: string) => void;
  onExportAssessment: (areaId: string) => void;
  onDeleteAssessment: (areaId: string) => void;
  onViewHistory: (historyId: string) => void;
  onDeleteHistory: (historyId: string) => void;
}

/**
 * Expandable table showing domains and their capability areas
 */
export function DomainTable({
  domains,
  searchQuery,
  selectedTags,
  onStartAssessment,
  onResumeAssessment,
  onEditAssessment,
  onViewAssessment,
  onExportAssessment,
  onDeleteAssessment,
  onViewHistory,
  onDeleteHistory,
}: DomainTableProps): JSX.Element {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const {
    getDomainScore,
    getDomainStatusCounts,
    getDomainTags,
    getCapabilityStatus,
    getCapabilityScore,
    getCapabilityCompletion,
    getCapabilityTags,
  } = useScores();

  const toggleDomain = (domainId: string): void => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domainId)) {
        next.delete(domainId);
      } else {
        next.add(domainId);
      }
      return next;
    });
  };

  const filterAreas = (areas: CapabilityArea[]): CapabilityArea[] => {
    return areas.filter((area) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          area.name.toLowerCase().includes(query) ||
          area.description.toLowerCase().includes(query) ||
          area.topics.some((t) => t.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      if (selectedTags.length > 0) {
        const areaTags = getCapabilityTags(area.id);
        const hasMatchingTag = selectedTags.some((tag) => areaTags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Capability domains and assessment status">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell component="th" scope="col" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Domain / Capability Area
            </TableCell>
            <TableCell
              component="th"
              scope="col"
              align="center"
              sx={{ fontWeight: 600, color: 'text.secondary', width: 70 }}
            >
              Score
            </TableCell>
            <TableCell
              component="th"
              scope="col"
              align="center"
              sx={{ fontWeight: 600, color: 'text.secondary', width: 220 }}
            >
              Tags
            </TableCell>
            <TableCell
              component="th"
              scope="col"
              align="center"
              sx={{ fontWeight: 600, color: 'text.secondary', width: 140 }}
            >
              Status
            </TableCell>
            <TableCell
              component="th"
              scope="col"
              align="center"
              sx={{ fontWeight: 600, color: 'text.secondary', width: 90 }}
            >
              Completion
            </TableCell>
            <TableCell
              component="th"
              scope="col"
              align="center"
              sx={{ fontWeight: 600, color: 'text.secondary', width: 80 }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {domains.map((domain) => {
            const allAreas = getAreasFromDomain(domain);
            const filteredAreas = filterAreas(allAreas);
            const isExpanded = expandedDomains.has(domain.id);
            const domainScore = getDomainScore(domain.id);
            const statusCounts = getDomainStatusCounts(domain.id);
            const domainTags = getDomainTags(domain.id);
            const totalCompletion =
              allAreas.length > 0
                ? Math.round((statusCounts.finalized / allAreas.length) * 100)
                : 0;

            if (filteredAreas.length === 0 && (searchQuery || selectedTags.length > 0)) {
              return null;
            }

            return (
              <Fragment key={domain.id}>
                {/* Domain Row */}
                <TableRow hover onClick={() => toggleDomain(domain.id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {domain.name}
                      </Typography>
                      <Tooltip
                        title={domain.description}
                        placement="right"
                        arrow
                        enterDelay={200}
                        slotProps={{
                          tooltip: {
                            sx: { maxWidth: 400, fontSize: '0.8rem' },
                          },
                        }}
                      >
                        <InfoOutlinedIcon
                          aria-hidden="true"
                          sx={{
                            fontSize: 16,
                            color: 'text.disabled',
                            cursor: 'help',
                            '&:hover': { color: 'primary.main' },
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight={domainScore !== null ? 600 : 400}
                      color={domainScore !== null ? 'text.primary' : 'text.disabled'}
                    >
                      {domainScore !== null ? domainScore.toFixed(1) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TagsDisplay tags={domainTags} maxVisible={3} />
                  </TableCell>
                  <TableCell>
                    <StackedProgressBar
                      finalized={statusCounts.finalized}
                      inProgress={statusCounts.inProgress}
                      notStarted={statusCounts.notStarted}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color={totalCompletion === 100 ? 'success.main' : 'text.secondary'}
                    >
                      {totalCompletion}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      sx={{ p: 0.25 }}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${domain.name}`}
                    >
                      {isExpanded ? (
                        <KeyboardArrowDownIcon fontSize="small" aria-hidden="true" />
                      ) : (
                        <KeyboardArrowRightIcon fontSize="small" aria-hidden="true" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Capability Area Rows */}
                {isExpanded &&
                  (isCategorizedDomain(domain)
                    ? domain.categories.map((category) => {
                        const categoryAreas = filterAreas(category.areas);
                        if (
                          categoryAreas.length === 0 &&
                          (searchQuery || selectedTags.length > 0)
                        ) {
                          return null;
                        }
                        return (
                          <Fragment key={category.id}>
                            {/* Category Header */}
                            <TableRow>
                              <TableCell colSpan={6} sx={{ bgcolor: 'grey.100', py: 0.5, pl: 6 }}>
                                <Typography
                                  variant="caption"
                                  fontWeight={600}
                                  color="text.secondary"
                                >
                                  {category.name}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            {categoryAreas.map((area) => (
                              <CapabilityRow
                                key={area.id}
                                area={area}
                                status={getCapabilityStatus(area.id)}
                                score={getCapabilityScore(area.id)}
                                tags={getCapabilityTags(area.id)}
                                completion={getCapabilityCompletion(area.id)}
                                onStart={() => onStartAssessment(area.id)}
                                onResume={() => onResumeAssessment(area.id)}
                                onEdit={() => onEditAssessment(area.id)}
                                onView={() => onViewAssessment(area.id)}
                                onExport={() => onExportAssessment(area.id)}
                                onDelete={() => onDeleteAssessment(area.id)}
                                onViewHistory={onViewHistory}
                                onDeleteHistory={onDeleteHistory}
                                indentLevel={2}
                              />
                            ))}
                          </Fragment>
                        );
                      })
                    : filteredAreas.map((area) => (
                        <CapabilityRow
                          key={area.id}
                          area={area}
                          status={getCapabilityStatus(area.id)}
                          score={getCapabilityScore(area.id)}
                          tags={getCapabilityTags(area.id)}
                          completion={getCapabilityCompletion(area.id)}
                          onStart={() => onStartAssessment(area.id)}
                          onResume={() => onResumeAssessment(area.id)}
                          onEdit={() => onEditAssessment(area.id)}
                          onView={() => onViewAssessment(area.id)}
                          onExport={() => onExportAssessment(area.id)}
                          onDelete={() => onDeleteAssessment(area.id)}
                          onViewHistory={onViewHistory}
                          onDeleteHistory={onDeleteHistory}
                        />
                      )))}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
