import { TfootProps } from './TcTable.types';

export const TableFooter = ({ children, className, colSpan }: TfootProps) => {
  if (!children) {
    return null;
  }

  return (
    <tfoot className={className}>
      <tr>
        <td colSpan={colSpan}>{children}</td>
      </tr>
    </tfoot>
  );
};
