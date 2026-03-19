export type FloatingCardStatus = 'processing' | 'success' | 'warning';

export type FloatingCardSectionItem = {
  label: string;
  status?: FloatingCardStatus;
};

export type FloatingCardSectionGroup = {
  id?: string;
  title?: string;
  status?: FloatingCardStatus;
  items: FloatingCardSectionItem[];
};

export type FloatingCardQuotaItem = {
  label: string;
  used: number;
  limit: number;
  pending?: number;
  displayValue?: string;
};

export type FloatingCardSectionOpenMode = 'single' | 'multiple';

export type FloatingCardProps = {
  summaryTitle?: string;
  sections?: FloatingCardSectionGroup[];
  quotaTitle?: string;
  quotas?: FloatingCardQuotaItem[];
  className?: string;
  collapsibleSections?: boolean;
  sectionOpenMode?: FloatingCardSectionOpenMode;
  defaultExpandedSectionIds?: string[];
  expandedSectionIds?: string[];
  onExpandedSectionIdsChange?: (sectionIds: string[]) => void;
};
