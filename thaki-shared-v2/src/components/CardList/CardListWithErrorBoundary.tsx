import { ReactElement } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CardList, type CardListProps } from './CardList';

interface Props<T> extends CardListProps<T> {
  errorUI?: ReactElement;
}

const CardListWithErrorBoundary = <T,>({ errorUI, ...props }: Props<T>) => {
  return (
    <ErrorBoundary fallback={errorUI}>
      <CardList {...props} />
    </ErrorBoundary>
  );
};

export { CardListWithErrorBoundary };
