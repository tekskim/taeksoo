export {
  default as SectionCard,
  SectionCardHeader,
  SectionCardContent,
  SectionCardDataRow,
  SectionCardText,
} from './SectionCard';
export type {
  SectionCardProps,
  SectionCardHeaderProps,
  SectionCardContentProps,
  SectionCardDataRowProps,
  SectionCardField,
  SectionCardValueType,
  SectionCardTextProps,
} from './SectionCard';

// Backward compatibility aliases
export { default as DetailCard, SectionCardText as DetailCardText } from './SectionCard';
export type {
  SectionCardProps as DetailCardProps,
  SectionCardField as DetailCardField,
  SectionCardValueType as DetailCardValueType,
  SectionCardTextProps as DetailCardTextProps,
} from './SectionCard';
