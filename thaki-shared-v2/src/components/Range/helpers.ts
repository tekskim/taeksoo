type ThumbType = 'min' | 'max';

/**
 * 슬라이더 값이 최소/최대 범위를 벗어나지 않도록 강제로 제한합니다.
 */
const clampValue = (value: number, lower: number, upper: number) =>
  Math.min(Math.max(value, lower), upper);

/**
 * step 값의 소수점 자릿수를 계산해 precision 손실을 방지합니다.
 */
const getDecimalPlaces = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const valueString = value.toString();

  if (valueString.includes('e-')) {
    const exponent = Number(valueString.split('e-')[1]);
    return Number.isFinite(exponent) ? exponent : 0;
  }

  const decimalPart = valueString.split('.')[1];
  return decimalPart ? decimalPart.length : 0;
};

const isThumbType = (value: string | null): value is ThumbType =>
  value === 'min' || value === 'max';

/**
 * 포인터 위치와 레인지 DOMRect를 기반으로 0~1 사이의 비율을 계산합니다.
 */
const getBoundedRatio = (clientX: number, rect: DOMRect): number => {
  if (rect.width === 0) {
    return 0;
  }

  const rawRatio = (clientX - rect.left) / rect.width;
  return clampValue(rawRatio, 0, 1);
};

/**
 * 비율 값을 실제 슬라이더 값으로 변환하고 최소/최대 범위를 보정합니다.
 */
const getValueFromRatio = (ratio: number, min: number, max: number): number =>
  clampValue(min + (max - min) * ratio, min, max);

/**
 * data 속성에서 ThumbType 선호값을 안전하게 파싱합니다.
 */
const parseThumbPreference = (attributeValue: string | null): ThumbType | null =>
  isThumbType(attributeValue) ? attributeValue : null;

/**
 * 포인터에 가장 가까운 ThumbType을 계산해 어떤 핸들을 이동할지 결정합니다.
 */
const pickClosestThumb = (
  value: number,
  minValue: number,
  maxValue: number,
  preferredThumb: ThumbType | null
): ThumbType => {
  const distanceToMin = Math.abs(value - minValue);
  const distanceToMax = Math.abs(value - maxValue);

  if (distanceToMin === distanceToMax) {
    return preferredThumb ?? 'min';
  }

  return distanceToMin < distanceToMax ? 'min' : 'max';
};

/**
 * DOMRect를 기반으로 포인터 위치를 실제 값으로 변환합니다.
 */
const getPointerValueFromRect = (
  rect: DOMRect,
  clientX: number,
  min: number,
  max: number
): number | null => {
  if (rect.width === 0) {
    return null;
  }

  const ratio = getBoundedRatio(clientX, rect);

  return getValueFromRatio(ratio, min, max);
};

/**
 * 타겟 정보를 활용해 움직일 ThumbType을 결정합니다.
 */
const getClosestThumbFromEvent = (
  target: EventTarget | null,
  pointerValue: number,
  minValue: number,
  maxValue: number
): ThumbType => {
  const element = target instanceof HTMLElement ? target : null;
  const preferredThumb = parseThumbPreference(element?.getAttribute('data-thumb-type') ?? null);

  return pickClosestThumb(pointerValue, minValue, maxValue, preferredThumb);
};

/**
 * input 요소의 step 속성을 숫자로 변환하고 유효하지 않은 값은 null로 처리합니다.
 */
const parseStepAttribute = (stepAttr: string | null | undefined): number | null => {
  if (stepAttr === 'any') {
    return null;
  }

  if (stepAttr === null || stepAttr === undefined || stepAttr === '') {
    return 1;
  }

  const parsed = Number(stepAttr);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return null;
};

/**
 * step 단위를 반영하여 값을 스냅하고 precision 을 유지한 채 반환합니다.
 */
const applyStepToValue = (
  rawValue: number,
  min: number,
  max: number,
  step: number | null
): number => {
  if (step === null) {
    return clampValue(rawValue, min, max);
  }

  const stepped = Math.round((rawValue - min) / step) * step + min;
  const decimals = getDecimalPlaces(step);
  const nextValue = Number(stepped.toFixed(decimals));

  return clampValue(nextValue, min, max);
};

export {
  applyStepToValue,
  clampValue,
  getBoundedRatio,
  getClosestThumbFromEvent,
  getPointerValueFromRect,
  getValueFromRatio,
  parseStepAttribute,
  parseThumbPreference,
  pickClosestThumb,
};
export type { ThumbType };
