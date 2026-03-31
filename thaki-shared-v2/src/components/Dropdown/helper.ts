/**
 * 브라우저 크기와 드롭다운 옵션 높이를 고려하여 드롭다운 위치 계산을 하는 함수
 */
const calculateDropdownPosition = ({
  top,
  bottom,
  optionListHeight,
  windowHeight,
}: {
  top: number;
  bottom: number;
  optionListHeight: number;
  windowHeight: number;
}) => {
  const spaceBelow = windowHeight - bottom;

  const shouldShowAbove = spaceBelow < optionListHeight && top > optionListHeight;

  return shouldShowAbove;
};

/** 포커스된 옵션의 인덱스를 계산하는 함수 */
const calculateNewlyFocusedIndex = (
  prevFocusedIndex: number,
  optionCount: number,
  direction: 'up' | 'down'
) => {
  if (direction === 'down') {
    return prevFocusedIndex < optionCount - 1 ? prevFocusedIndex + 1 : 0;
  }

  if (direction === 'up') {
    return prevFocusedIndex > 0 ? prevFocusedIndex - 1 : optionCount - 1;
  }

  throw new Error('Invalid direction');
};

/** 포커스된 옵션이 한 바퀴를 돌아서 처음으로 돌아가는지 여부를 계산하는 함수 */
const calculateHasFullyRotated = (
  prevFocusedIndex: number,
  newlyFocusedIndex: number,
  optionCount: number,
  direction: 'up' | 'down'
) => {
  if (direction === 'down') {
    return prevFocusedIndex === optionCount - 1 && newlyFocusedIndex === 0;
  }

  if (direction === 'up') {
    return prevFocusedIndex === 0 && newlyFocusedIndex === optionCount - 1;
  }

  throw new Error('Invalid direction');
};

/** 옵션 리스트의 높이를 계산하는 함수 */
const calculateOptionListHeight = (
  optionCount: number,
  optionHeight: number,
  numbersOfOptionsInView: number
) => {
  return optionCount === 0
    ? optionHeight // noResult일 때는 하나의 옵션 높이만큼
    : numbersOfOptionsInView < optionCount
      ? numbersOfOptionsInView * optionHeight
      : optionCount * optionHeight;
};

export {
  calculateDropdownPosition,
  calculateHasFullyRotated,
  calculateNewlyFocusedIndex,
  calculateOptionListHeight,
};
