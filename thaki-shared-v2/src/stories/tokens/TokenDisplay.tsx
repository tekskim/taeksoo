import { useEffect, useState } from 'react';
import { useTheme } from '../../services';

// 디자인 토큰 관련 인터페이스
interface Token {
  name: string;
  value: string;
  type: 'color' | 'font' | 'space' | 'radius' | 'other';
}

interface TokenGroup {
  name: string;
  tokens: Token[];
}

const styles = {
  container: {
    fontFamily: 'var(--semantic-font-family)',
    padding: 'var(--semantic-space-block)',
    width: '100%',
    backgroundColor: 'var(--semantic-color-surface)',
    color: 'var(--semantic-color-text)',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--semantic-space-section)',
  },
  title: {
    margin: 0,
    color: 'var(--semantic-color-text)',
    fontWeight: 'var(--semantic-font-weightBold)',
  },
  groupSection: {
    marginBottom: 'calc(var(--semantic-space-section) * 2)',
  },
  groupTitle: {
    color: 'var(--semantic-color-text)',
    borderBottom: '2px solid var(--semantic-color-border)',
    paddingBottom: 'var(--semantic-space-inline)',
    marginBottom: 'var(--semantic-space-section)',
    fontWeight: 'var(--semantic-font-weightSemiBold)',
  },
  tokenGrid: {
    display: 'grid',
    gap: 'var(--semantic-space-block)',
    gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
    padding: 'var(--semantic-space-xs)',
  },

  tokenCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:
      'calc(var(--semantic-space-inline) + 2px) calc(var(--semantic-space-block) + 2px)',
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    border: '1px solid var(--semantic-color-border)',
    borderRadius: 'var(--semantic-radius-card)',
    transition: 'all 0.2s ease-in-out',
    width: '100%',
    minHeight:
      'calc(var(--semantic-space-section) * 2 + var(--semantic-space-block))',
    boxSizing: 'border-box',
    margin: '2px',
  },
  tokenInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 'var(--semantic-space-inline)',
  },
  tokenName: {
    fontFamily: 'monospace',
    color: 'var(--semantic-color-text)',
    fontWeight: 'var(--semantic-font-weightMedium)',
    fontSize: 'var(--semantic-font-sizeMd)',
    wordBreak: 'break-all',
    marginBottom: 'var(--semantic-space-inline)',
    lineHeight: 'var(--semantic-font-lineHeightNormal)',
  },
  tokenValue: {
    fontSize: 'var(--semantic-font-sizeLg)',
    color: 'var(--semantic-color-textMuted)',
    opacity: 0.8,
    lineHeight: 'var(--semantic-font-lineHeightNormal)',
  },
  tokenRenderer: {
    marginLeft: 'var(--semantic-space-inline)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    minWidth: 'calc(var(--semantic-space-xs) * 8)',
    maxWidth: 'none',
    height: 'calc(var(--semantic-space-xs) * 10)',
  },

  colorBox: {
    width: 'calc(var(--semantic-space-xs) * 8)',
    height: 'calc(var(--semantic-space-xs) * 8)',
    border: '1px solid var(--semantic-color-border)',
    borderRadius: 'var(--semantic-radius-control)',
    boxShadow: 'var(--semantic-shadow-sm)',
    flexShrink: 0,
  },
  radiusBox: {
    width: 'calc(var(--semantic-space-xs) * 8)',
    height: 'calc(var(--semantic-space-xs) * 8)',
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    border: '2px solid var(--semantic-color-primary)',
    boxShadow: 'var(--semantic-shadow-sm)',
    flexShrink: 0,
  },
  spaceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'calc(var(--semantic-space-xs) * 8)',
    height: 'calc(var(--semantic-space-xs) * 8)',
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    position: 'relative',
    flexShrink: 0,
  },
  spaceIndicator: {
    backgroundColor: 'var(--semantic-color-primary)',
    minWidth: '2px',
    minHeight: '2px',
    boxShadow: 'var(--semantic-shadow-sm)',
  },
  fontText: {
    color: 'var(--semantic-color-text)',
    textAlign: 'center',
  },
  fontSample: {
    fontSize: 'var(--semantic-font-sizeSm)',
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fontSizeDisplay: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontWeightDisplay: {
    fontSize: 'var(--semantic-font-sizeSm)',
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  lineHeightDisplay: {
    fontSize: 'var(--semantic-font-sizeXs)',
    width: '100%',
    textAlign: 'center',
    lineHeight: '1.2',
    overflow: 'hidden',
  },
  codeDisplay: {
    color: 'var(--semantic-color-text)',
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    padding: 'var(--semantic-space-xs) calc(var(--semantic-space-xs) + 2px)',
    borderRadius: 'var(--semantic-radius-control)',
    fontSize: 'var(--semantic-font-sizeXs)',
    width: '100%',
    textAlign: 'center',
    wordBreak: 'break-all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxHeight: 'calc(var(--semantic-space-xs) * 8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedText: {
    color: 'var(--semantic-color-textMuted)',
    fontSize: 'var(--semantic-font-sizeXs)',
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  usageSection: {
    marginTop: 'calc(var(--semantic-space-section) * 2)',
    padding: 'var(--semantic-space-block)',
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    borderRadius: 'var(--semantic-radius-card)',
    fontSize: 'var(--semantic-font-sizeSm)',
    color: 'var(--semantic-color-textMuted)',
    border: '1px solid var(--semantic-color-border)',
  },
  usageTitle: {
    margin: '0 0 var(--semantic-space-inline) 0',
    color: 'var(--semantic-color-text)',
  },
  usageParagraph: {
    margin: '0 0 var(--semantic-space-inline) 0',
  },
  codeExample: {
    backgroundColor: 'var(--semantic-color-surface)',
    padding: '2px var(--semantic-space-xs)',
    borderRadius: 'var(--semantic-radius-control)',
    border: '1px solid var(--semantic-color-border)',
  },
} as const;

// 토큰 타입을 자동으로 감지하는 함수 (Component 토큰 포함)
const detectTokenType = (name: string, value: string): Token['type'] => {
  // Component 토큰의 경우 더 스마트한 감지
  if (name.startsWith('--component-')) {
    if (name.includes('padding') || name.includes('margin')) return 'space';
    if (name.includes('radius')) return 'radius';
    if (value.startsWith('#') && /^#[0-9a-fA-F]{3,8}$/.test(value))
      return 'color';
    if (name.includes('bg') || name.includes('color') || name.includes('text'))
      return 'color';
  }

  if (name.includes('-color-')) return 'color';
  if (
    name.includes('-font-') ||
    name.includes('-weight') ||
    name.includes('-lineHeight')
  )
    return 'font';
  if (name.includes('-space-')) return 'space';
  if (name.includes('-radius-')) return 'radius';
  return 'other';
};

// 토큰 값을 시각적으로 렌더링하는 컴포넌트 (간소화)
const TokenValueRenderer: React.FC<{ token: Token }> = ({ token }) => {
  const renderValue = () => {
    switch (token.type) {
      case 'color':
        return (
          <div
            style={{
              ...styles.colorBox,
              backgroundColor: token.value,
            }}
          />
        );

      case 'font':
        if (token.name.includes('family')) {
          return (
            <span
              style={{
                ...styles.fontText,
                ...styles.fontSample,
                fontFamily: token.value,
              }}
            >
              Sample Text
            </span>
          );
        }
        if (token.name.includes('size')) {
          return (
            <span
              style={{
                ...styles.fontText,
                ...styles.fontSizeDisplay,
                fontSize: token.value,
              }}
            >
              Aa
            </span>
          );
        }
        if (token.name.includes('weight')) {
          return (
            <span
              style={{
                ...styles.fontText,
                ...styles.fontWeightDisplay,
                fontWeight: token.value,
              }}
            >
              Weight
            </span>
          );
        }
        if (token.name.includes('lineHeight')) {
          return (
            <div
              style={{
                ...styles.fontText,
                ...styles.lineHeightDisplay,
                lineHeight: token.value,
              }}
            >
              Line height
              <br />
              example
            </div>
          );
        }
        return <span style={styles.mutedText}>{token.value}</span>;

      case 'space':
        return (
          <div style={styles.spaceContainer}>
            <div
              style={{
                ...styles.spaceIndicator,
                paddingLeft: token.value,
                paddingRight: token.value,
                paddingTop: 0,
                paddingBottom: 0,
                border: '1px solid var(--semantic-color-border)',
                borderTop: '0px',
                borderBottom: '0px',
              }}
            >
              <div
                style={{
                  width: 'calc(var(--semantic-space-xs) * 2)',
                  height: 'calc(var(--semantic-space-xs) * 8)',
                  backgroundColor: 'var(--semantic-color-surface)',
                  border: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--semantic-font-sizeXs)',
                  color: 'var(--semantic-color-textMuted)',
                }}
              />
            </div>
          </div>
        );

      case 'radius':
        return (
          <div
            style={{
              ...styles.radiusBox,
              borderRadius: token.value,
            }}
          />
        );

      default:
        return <code style={styles.codeDisplay}>{token.value}</code>;
    }
  };

  return <div style={styles.tokenRenderer}>{renderValue()}</div>;
};

// 공통 토큰 카드 컴포넌트 (간소화)
const TokenCard: React.FC<{ token: Token }> = ({ token }) => {
  const cardStyle = styles.tokenCard;
  const nameStyle = styles.tokenName;

  return (
    <div style={cardStyle}>
      <div style={styles.tokenInfo}>
        <div style={nameStyle}>{token.name}</div>
        <div style={styles.tokenValue}>{token.value}</div>
      </div>
      <TokenValueRenderer token={token} />
    </div>
  );
};

// 토큰을 동적으로 가져오는 훅
const useTokens = (filterType?: Token['type']) => {
  const { theme } = useTheme();
  const [tokenGroups, setTokenGroups] = useState<TokenGroup[]>([]);

  useEffect(() => {
    const getComputedTokens = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      const allTokens: Token[] = [];

      // CSS 변수 이름 패턴들
      const tokenPatterns = ['--primitive-', '--semantic-', '--component-'];

      // 스타일시트에서 CSS 변수 추출
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
              for (const property of Array.from(rule.style)) {
                if (
                  property.startsWith('--') &&
                  tokenPatterns.some(pattern => property.includes(pattern))
                ) {
                  const value = computedStyle.getPropertyValue(property).trim();
                  if (value) {
                    const type = detectTokenType(property, value);

                    // 필터 타입이 지정된 경우 해당 타입만 포함
                    if (!filterType || type === filterType) {
                      allTokens.push({ name: property, value, type });
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          // CORS 에러 등을 무시
          console.warn('Cannot access stylesheet:', e);
        }
      }

      // 토큰들을 그룹별로 분류
      const groups: Record<string, TokenGroup> = {};

      allTokens.forEach(token => {
        let groupName = 'Other';

        if (token.name.startsWith('--primitive-')) {
          groupName = 'Primitive Tokens';
        } else if (token.name.startsWith('--semantic-')) {
          groupName = 'Semantic Tokens';
        } else if (token.name.startsWith('--component-')) {
          groupName = 'Component Tokens';
        }

        if (!groups[groupName]) {
          groups[groupName] = { name: groupName, tokens: [] };
        }

        groups[groupName].tokens.push(token);
      });

      // 각 그룹 내에서 토큰 정렬
      Object.values(groups).forEach(group => {
        group.tokens.sort((a, b) => a.name.localeCompare(b.name));
      });

      // 우선순위 순서로 정렬 (Component > Semantic > Primitive)
      const priorityOrder = [
        'Component Tokens',
        'Semantic Tokens',
        'Primitive Tokens',
        'Other',
      ];
      return Object.values(groups).sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.name);
        const bIndex = priorityOrder.indexOf(b.name);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      });
    };

    setTokenGroups(getComputedTokens());
  }, [theme, filterType]); // theme 변경 시 재계산

  return tokenGroups;
};

// 공통 토큰 디스플레이 컴포넌트 (최종 간소화)
export const TokenDisplay: React.FC<{
  title: string;
  filterType?: Token['type'];
}> = ({ title, filterType }) => {
  const tokenGroups = useTokens(filterType);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
      </div>

      {tokenGroups.map(group => (
        <div key={group.name} style={styles.groupSection}>
          <h2 style={styles.groupTitle}>
            {group.name} ({group.tokens.length})
          </h2>
          <div style={styles.tokenGrid}>
            {group.tokens.map(token => (
              <TokenCard key={token.name} token={token} />
            ))}
          </div>
        </div>
      ))}

      {/* All Tokens 스토리에만 사용법 표시 */}
      {!filterType && (
        <div style={styles.usageSection}>
          <h3 style={styles.usageTitle}>사용법</h3>
          <p style={styles.usageParagraph}>
            CSS에서: <code style={styles.codeExample}>var(--token-name)</code>
          </p>
          <p style={{ margin: '0' }}>
            예시:{' '}
            <code style={styles.codeExample}>
              color: var(--semantic-color-primary);
            </code>
          </p>
        </div>
      )}
    </div>
  );
};
