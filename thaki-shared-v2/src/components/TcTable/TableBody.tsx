// React 및 유틸, 선택 컴포넌트, 스타일, 타입 임포트
import React from 'react';
import { cn } from '../../services/utils';
import { Checkbox } from '../Checkbox';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { RadioButton } from '../RadioButton';
import {
  bodyTrClassnames,
  selectCellClassnames,
  selectInnerClassnames,
  tdClassnames,
  trClassnames,
} from './TcTable.styles';
import { SelectValue, Type, TYPE } from './TcTable.types';

/**
 * 행 단위 체크박스/라디오 선택 셀 컴포넌트
 *
 * - `type`에 따라 Checkbox(다중) 또는 RadioButton(단일)을 렌더링
 * - 셀 클릭 이벤트는 행 클릭 전파를 막기 위해 stopPropagation 처리
 * - `selectValue`가 없으면 `index`를 폴백 키로 사용
 */
export const SelectCell = ({
  type,
  selectValue,
  index,
  groupName,
  checkedRowValues,
  setCheckedRowValues,
  onChange,
  disabled = false,
}: {
  type: Type;
  selectValue?: SelectValue;
  index: number;
  groupName: string;
  checkedRowValues: Set<SelectValue>;
  setCheckedRowValues: (checkedRowValues: Set<SelectValue>) => void;
  onChange?: (selectedValues: SelectValue[]) => void;
  disabled?: boolean;
}) => {
  // selectValue 없으면 index를 키로 사용
  const value = selectValue ?? index;

  const isSelected = checkedRowValues.has(value);

  // 체크박스 토글: 선택 시 제거, 미선택 시 추가
  const onCheckboxChange = () => {
    if (disabled) return;

    const next = new Set(checkedRowValues);

    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setCheckedRowValues(next);
    onChange?.(Array.from(next));
  };

  // 라디오 선택: 기존 선택 초기화 후 단일 값만 유지
  const onRadioChange = (value: SelectValue) => {
    if (disabled) return;

    setCheckedRowValues(new Set([value]));
    onChange?.([value]);
  };

  return (
    <td
      className={cn(tdClassnames, selectCellClassnames)}
      data-select
      onClick={e => e.stopPropagation()} // 행 클릭 이벤트 전파 방지
    >
      <div className={selectInnerClassnames}>
        {/* type에 따라 체크박스 또는 라디오 렌더링 */}
        {type === TYPE.CHECKBOX ? (
          <Checkbox
            name={groupName}
            value={value}
            checked={isSelected}
            onChange={onCheckboxChange}
            disabled={disabled}
          />
        ) : (
          <RadioButton
            name={groupName}
            value={value}
            checked={isSelected}
            onChange={onRadioChange}
            disabled={disabled}
          />
        )}
      </div>
    </td>
  );
};

/**
 * 테이블 본문 컴포넌트
 *
 * - 렌더링된 행 목록(`rows`)과 확장 행 맵(`expandedRows`)을 받아 `<tbody>`로 출력
 * - 전체 본문을 ErrorBoundary로 감싸 렌더링 오류 시 `errorUI`로 대체
 * - 각 행 아래에 확장 행이 있으면 바로 이어서 렌더링
 */
export const TableBody = ({
  rows,
  expandedRows,
  colSpan,
  errorUI,
}: {
  rows: React.ReactElement[];
  expandedRows: Map<number, React.ReactNode>;
  colSpan: number;
  errorUI: React.ReactNode;
}) => {
  return (
    <tbody>
      {/* 본문 렌더링 오류 시 errorUI로 전체 대체 */}
      <ErrorBoundary
        fallback={
          <tr className={cn(trClassnames, bodyTrClassnames)}>
            <td className={tdClassnames} colSpan={colSpan}>
              {errorUI}
            </td>
          </tr>
        }
      >
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {row}
            {/* 확장 행이 있으면 해당 행 바로 아래 렌더링 */}
            {expandedRows.get(index)}
          </React.Fragment>
        ))}
      </ErrorBoundary>
    </tbody>
  );
};
