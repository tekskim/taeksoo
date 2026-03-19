import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../../services/utils/cn";
import { getPercentageVariant } from "../../styles/common/monitoringStyles";
import {
  AlertIcon,
  CheckCircleIcon,
  ExpandOffIcon,
  ProgressIcon,
} from "../Icon";
import { Tooltip } from "../Tooltip";
import {
  floatingCardStyles,
  summaryCardStyles,
  summaryContentStyles,
  summaryTitleStyles,
  summaryGroupStyles,
  summaryGroupHeaderStyles,
  summaryGroupHeaderLeftStyles,
  summaryGroupHeaderButtonStyles,
  summaryGroupTitleStyles,
  summaryListStyles,
  summaryItemStyles,
  summaryItemLabelStyles,
  summaryStatusIconStyles,
  quotaCardStyles,
  quotaTitleStyles,
  quotaListStyles,
  quotaItemStyles,
  quotaHeaderStyles,
  quotaLabelStyles,
  quotaValueStyles,
  quotaBarStyles,
  quotaBarTrackStyles,
  quotaBarSegmentStyles,
  quotaBarUsedStyles,
  quotaBarPendingStyles,
  quotaBarSuccessStyles,
  quotaBarSuccessLightStyles,
  quotaBarWarningStyles,
  quotaBarWarningLightStyles,
  quotaBarErrorStyles,
  quotaBarErrorLightStyles,
  tooltipDotSuccessStyles,
  tooltipDotSuccessLightStyles,
  tooltipDotWarningStyles,
  tooltipDotWarningLightStyles,
  tooltipDotErrorStyles,
  tooltipDotErrorLightStyles,
} from "./FloatingCard.styles";
import type {
  FloatingCardProps,
  FloatingCardStatus,
  FloatingCardQuotaItem,
} from "./FloatingCard.types";

const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, value));
};

const getQuotaPercents = (
  item: FloatingCardQuotaItem,
): { usedPercent: number; pendingPercent: number } => {
  if (item.limit <= 0 || !Number.isFinite(item.limit)) {
    return { usedPercent: 0, pendingPercent: 0 };
  }

  const toPercent = (val: number) => clampPercent((val / item.limit) * 100);
  const usedPercent = toPercent(item.used);
  const pendingPercent = Math.min(
    100 - usedPercent,
    toPercent(item.pending ?? 0),
  );

  return { usedPercent, pendingPercent };
};

type QuotaColorVariant = "success" | "warning" | "error";

const getQuotaColorVariant = (percent: number): QuotaColorVariant => {
  const v = getPercentageVariant(percent);
  return v === "danger" ? "error" : v;
};

const getQuotaBarColorStyles = (
  variant: QuotaColorVariant,
  isPending: boolean,
): string => {
  if (isPending) {
    switch (variant) {
      case "error":
        return quotaBarErrorLightStyles;
      case "warning":
        return quotaBarWarningLightStyles;
      default:
        return quotaBarSuccessLightStyles;
    }
  }
  switch (variant) {
    case "error":
      return quotaBarErrorStyles;
    case "warning":
      return quotaBarWarningStyles;
    default:
      return quotaBarSuccessStyles;
  }
};

const getTooltipDotStyles = (
  variant: QuotaColorVariant,
  isPending: boolean,
): string => {
  if (isPending) {
    switch (variant) {
      case "error":
        return tooltipDotErrorLightStyles;
      case "warning":
        return tooltipDotWarningLightStyles;
      default:
        return tooltipDotSuccessLightStyles;
    }
  }
  switch (variant) {
    case "error":
      return tooltipDotErrorStyles;
    case "warning":
      return tooltipDotWarningStyles;
    default:
      return tooltipDotSuccessStyles;
  }
};

interface QuotaTooltipContentProps {
  used: number;
  pending?: number;
  usedVariant: QuotaColorVariant;
  pendingVariant: QuotaColorVariant;
}

const QuotaTooltipContent = ({
  used,
  pending,
  usedVariant,
  pendingVariant,
}: QuotaTooltipContentProps): React.ReactElement => {
  const hasPending = Boolean(pending && pending > 0);

  return (
    <div className="flex flex-col gap-2 px-1 py-0.5">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-[5px] rounded-full shrink-0",
            getTooltipDotStyles(usedVariant, false),
          )}
        />
        <span className="text-12 text-text-on-fill whitespace-nowrap">
          Used : {used}
        </span>
      </div>
      {hasPending ? (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-[5px] rounded-full shrink-0",
              getTooltipDotStyles(pendingVariant, true),
            )}
          />
          <span className="text-12 text-text-on-fill whitespace-nowrap">
            New : {pending}
          </span>
        </div>
      ) : null}
    </div>
  );
};

const StatusIcon = ({ status }: { status?: FloatingCardStatus }) => {
  if (!status) {
    return null;
  }

  switch (status) {
    case "success":
      return <CheckCircleIcon size="sm" variant="success" aria-hidden />;
    case "warning":
      return <AlertIcon size="sm" variant="error" aria-hidden />;
    case "processing":
    default:
      return <ProgressIcon size="sm" aria-hidden />;
  }
};

/**
 * [Design System] FloatingCard component
 *
 * Displays section status summaries with quota usage.
 */
const FloatingCard = ({
  summaryTitle = "Summary",
  sections,
  quotaTitle = "Quota",
  quotas,
  className,
  collapsibleSections = false,
  sectionOpenMode = "multiple",
  defaultExpandedSectionIds,
  expandedSectionIds,
  onExpandedSectionIdsChange,
}: FloatingCardProps): React.ReactElement | null => {
  const summarySections = sections ?? [];
  const showSummarySection = summarySections.length > 0;
  const quotaItems = quotas ?? [];
  const showQuotaSection = quotaItems.length > 0;
  const resolvedSections = useMemo(
    () =>
      summarySections.map((section, index) => ({
        ...section,
        id: section.id ?? `${section.title ?? "section"}-${index}`,
      })),
    [summarySections],
  );
  const isControlled = expandedSectionIds !== undefined;
  const getDefaultExpandedSectionIds = useCallback((): string[] => {
    if (!collapsibleSections) {
      return [];
    }
    if (defaultExpandedSectionIds?.length) {
      return defaultExpandedSectionIds;
    }
    if (sectionOpenMode === "single") {
      return resolvedSections.length ? [resolvedSections[0].id] : [];
    }
    return resolvedSections.map((section) => section.id);
  }, [
    collapsibleSections,
    defaultExpandedSectionIds,
    resolvedSections,
    sectionOpenMode,
  ]);
  const [internalExpandedSectionIds, setInternalExpandedSectionIds] = useState<
    string[]
  >(() => getDefaultExpandedSectionIds());

  useEffect(() => {
    if (!collapsibleSections || isControlled) {
      return;
    }
    const validIds = new Set(resolvedSections.map((section) => section.id));
    setInternalExpandedSectionIds((prev) => {
      const next = prev.filter((id) => validIds.has(id));
      if (next.length > 0) {
        return next;
      }
      return getDefaultExpandedSectionIds();
    });
  }, [
    collapsibleSections,
    getDefaultExpandedSectionIds,
    isControlled,
    resolvedSections,
  ]);

  const expandedIds = isControlled
    ? (expandedSectionIds ?? [])
    : internalExpandedSectionIds;

  const handleSectionToggle = useCallback(
    (sectionId: string) => {
      if (!collapsibleSections) {
        return;
      }
      const isExpanded = expandedIds.includes(sectionId);
      const nextExpandedIds =
        sectionOpenMode === "single"
          ? isExpanded
            ? []
            : [sectionId]
          : isExpanded
            ? expandedIds.filter((id) => id !== sectionId)
            : [...expandedIds, sectionId];

      if (!isControlled) {
        setInternalExpandedSectionIds(nextExpandedIds);
      }
      onExpandedSectionIdsChange?.(nextExpandedIds);
    },
    [
      collapsibleSections,
      expandedIds,
      isControlled,
      onExpandedSectionIdsChange,
      sectionOpenMode,
    ],
  );

  if (!showSummarySection && !showQuotaSection) {
    return null;
  }

  return (
    <div className={cn(floatingCardStyles, className)}>
      {showSummarySection ? (
        <section className={summaryCardStyles}>
          <div className={summaryContentStyles}>
            <p className={summaryTitleStyles}>{summaryTitle}</p>
            {resolvedSections.map((section) => {
              const hasHeader = Boolean(section.title || section.status);
              const isExpanded =
                !collapsibleSections ||
                !hasHeader ||
                expandedIds.includes(section.id);
              return (
                <div className={summaryGroupStyles} key={section.id}>
                  {hasHeader ? (
                    <div className={summaryGroupHeaderStyles}>
                      {collapsibleSections ? (
                        <button
                          type="button"
                          className={summaryGroupHeaderButtonStyles}
                          onClick={() => handleSectionToggle(section.id)}
                          aria-expanded={isExpanded}
                        >
                          <ExpandOffIcon
                            size="xs"
                            aria-hidden
                            style={{
                              transform: isExpanded ? "rotate(90deg)" : "none",
                              transition: "transform 0.15s ease-in-out",
                            }}
                          />
                          {section.title ? (
                            <p className={summaryGroupTitleStyles}>
                              {section.title}
                            </p>
                          ) : null}
                        </button>
                      ) : (
                        <div className={summaryGroupHeaderLeftStyles}>
                          <ExpandOffIcon size="xs" aria-hidden />
                          {section.title ? (
                            <p className={summaryGroupTitleStyles}>
                              {section.title}
                            </p>
                          ) : null}
                        </div>
                      )}
                      {section.status ? (
                        <span className={summaryStatusIconStyles}>
                          <StatusIcon status={section.status} />
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {isExpanded ? (
                    <div className={summaryListStyles}>
                      {section.items.map((item, itemIndex) => (
                        <div
                          className={summaryItemStyles}
                          key={`${item.label}-${itemIndex}`}
                        >
                          <p className={summaryItemLabelStyles}>{item.label}</p>
                          <span className={summaryStatusIconStyles}>
                            <StatusIcon status={item.status} />
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {showQuotaSection ? (
        <section className={quotaCardStyles}>
          <p className={quotaTitleStyles}>{quotaTitle}</p>
          <div className={quotaListStyles}>
            {quotaItems.map((item, index) => {
              const { usedPercent, pendingPercent } = getQuotaPercents(item);
              const hasPending = pendingPercent > 0;
              const hasUsed = usedPercent > 0;
              const remainingPercent = Math.max(
                0,
                100 - usedPercent - pendingPercent,
              );
              const displayValue =
                item.displayValue ?? `${item.used}/${item.limit}`;

              // Color variants based on combined percentage
              const totalPercent = usedPercent + pendingPercent;
              const usedVariant = getQuotaColorVariant(usedPercent);
              const pendingVariant = getQuotaColorVariant(totalPercent);

              const tooltipContent = (
                <QuotaTooltipContent
                  used={item.used}
                  pending={item.pending}
                  usedVariant={usedVariant}
                  pendingVariant={pendingVariant}
                />
              );

              return (
                <div className={quotaItemStyles} key={`${item.label}-${index}`}>
                  <div className={quotaHeaderStyles}>
                    <p className={quotaLabelStyles}>{item.label}</p>
                    <p className={quotaValueStyles}>{displayValue}</p>
                  </div>
                  <Tooltip content={tooltipContent} direction="bottom">
                    <div className={quotaBarStyles}>
                      <div className={quotaBarTrackStyles} />
                      {hasUsed ? (
                        <div
                          className={cn(
                            quotaBarSegmentStyles,
                            quotaBarUsedStyles,
                            getQuotaBarColorStyles(usedVariant, false),
                            hasPending && "rounded-r-none",
                          )}
                          style={{ width: `${usedPercent}%` }}
                        />
                      ) : null}
                      {hasPending ? (
                        <div
                          className={cn(
                            quotaBarSegmentStyles,
                            quotaBarPendingStyles,
                            getQuotaBarColorStyles(pendingVariant, true),
                            hasUsed && "rounded-l-none",
                            remainingPercent > 0 && "rounded-r-none",
                          )}
                          style={{
                            left: `${usedPercent}%`,
                            width: `${pendingPercent}%`,
                          }}
                        />
                      ) : null}
                    </div>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default FloatingCard;
