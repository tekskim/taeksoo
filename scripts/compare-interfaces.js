#!/usr/bin/env node
/**
 * Component Interface Comparison Script
 * 
 * Compares SSOT component interfaces with production interfaces
 * to identify differences that need to be unified.
 * 
 * Usage: node scripts/compare-interfaces.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// SSOT component interface definitions (extracted from actual files)
const SSOT_INTERFACES = {
  Button: {
    file: 'src/design-system/components/Button/Button.tsx',
    props: {
      variant: ['primary', 'secondary', 'outline', 'ghost', 'muted', 'danger', 'warning', 'link'],
      size: ['sm', 'md', 'lg'],
      fullWidth: 'boolean',
      iconOnly: 'boolean',
      isLoading: 'boolean',
      leftIcon: 'ReactNode',
      rightIcon: 'ReactNode',
      icon: 'ReactNode',
      as: 'ElementType',
    },
  },
  Badge: {
    file: 'src/design-system/components/Badge/Badge.tsx',
    props: {
      variant: ['info', 'success', 'warning', 'danger', 'default'],
      size: ['sm', 'md', 'lg'],
      dot: 'boolean',
      icon: 'ReactNode',
    },
  },
  Input: {
    file: 'src/design-system/components/Input/Input.tsx',
    props: {
      size: ['sm', 'md', 'lg'],
      error: 'boolean',
      fullWidth: 'boolean',
      leftIcon: 'ReactNode',
      rightIcon: 'ReactNode',
    },
  },
  Checkbox: {
    file: 'src/design-system/components/Checkbox/Checkbox.tsx',
    props: {
      checked: 'boolean',
      disabled: 'boolean',
      error: 'boolean',
      label: 'ReactNode',
      description: 'string',
    },
  },
  Toggle: {
    file: 'src/design-system/components/Toggle/Toggle.tsx',
    props: {
      checked: 'boolean',
      disabled: 'boolean',
      size: ['sm', 'md'],
      label: 'string',
    },
  },
  Select: {
    file: 'src/design-system/components/Select/Select.tsx',
    props: {
      options: 'Array<{value, label}>',
      placeholder: 'string',
      fullWidth: 'boolean',
      disabled: 'boolean',
      error: 'boolean',
    },
  },
  Table: {
    file: 'src/design-system/components/Table/Table.tsx',
    props: {
      columns: 'Array<Column>',
      data: 'Array<T>',
      selectable: 'boolean',
      sortable: 'boolean',
      onRowClick: 'function',
      emptyMessage: 'string',
    },
  },
  Modal: {
    file: 'src/design-system/components/Modal/Modal.tsx',
    props: {
      open: 'boolean',
      onClose: 'function',
      children: 'ReactNode',
    },
  },
  Drawer: {
    file: 'src/design-system/components/Drawer/Drawer.tsx',
    props: {
      open: 'boolean',
      onClose: 'function',
      title: 'string',
      position: ['left', 'right'],
      size: ['sm', 'md', 'lg'],
    },
  },
  Tabs: {
    file: 'src/design-system/components/Tabs/Tabs.tsx',
    props: {
      value: 'string',
      onChange: 'function',
      variant: ['underline', 'boxed'],
    },
  },
  Pagination: {
    file: 'src/design-system/components/Pagination/Pagination.tsx',
    props: {
      currentPage: 'number',
      totalPages: 'number',
      onPageChange: 'function',
      showPageSize: 'boolean',
      pageSize: 'number',
      onPageSizeChange: 'function',
    },
  },
  StatusIndicator: {
    file: 'src/design-system/components/StatusIndicator/StatusIndicator.tsx',
    props: {
      status: ['active', 'error', 'muted', 'building'],
      label: 'string',
      iconOnly: 'boolean',
    },
  },
  Tooltip: {
    file: 'src/design-system/components/Tooltip/Tooltip.tsx',
    props: {
      content: 'ReactNode',
      position: ['top', 'bottom', 'left', 'right'],
      delay: 'number',
    },
  },
  ProgressBar: {
    file: 'src/design-system/components/ProgressBar/ProgressBar.tsx',
    props: {
      value: 'number',
      max: 'number',
      variant: ['default', 'success', 'warning', 'danger'],
      size: ['sm', 'md', 'lg'],
      showLabel: 'boolean',
    },
  },
  InlineMessage: {
    file: 'src/design-system/components/InlineMessage/InlineMessage.tsx',
    props: {
      variant: ['info', 'success', 'warning', 'error'],
      title: 'string',
      closable: 'boolean',
    },
  },
};

// Production component interface definitions (based on thaki-ui shared)
// These need to be updated based on actual production code
const PRODUCTION_INTERFACES = {
  Button: {
    file: 'packages/shared/src/components/Button/Button.types.ts',
    props: {
      variant: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'],
      size: ['sm', 'md', 'lg'],
      appearance: ['solid', 'outline', 'text'],
      fullWidth: 'boolean',
      isLoading: 'boolean',
      leftIcon: 'ReactNode',
      rightIcon: 'ReactNode',
    },
  },
  Badge: {
    file: 'packages/shared/src/components/Badge/Badge.tsx',
    props: {
      variant: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      size: ['sm', 'md', 'lg'],
    },
  },
  Input: {
    file: 'packages/shared/src/components/Input/Input.tsx',
    props: {
      size: ['sm', 'md', 'lg'],
      error: 'boolean',
      fullWidth: 'boolean',
    },
  },
  Checkbox: {
    file: 'packages/shared/src/components/Checkbox/Checkbox.tsx',
    props: {
      checked: 'boolean',
      disabled: 'boolean',
      label: 'string',
    },
  },
  Toggle: {
    file: 'packages/shared/src/components/Toggle/Toggle.tsx',
    props: {
      checked: 'boolean',
      disabled: 'boolean',
      size: ['sm', 'md', 'lg'],
    },
  },
  // Dropdown in production vs Select in SSOT
  Dropdown: {
    file: 'packages/shared/src/components/Dropdown/Dropdown.tsx',
    props: {
      options: 'Array<Option>',
      placeholder: 'string',
      disabled: 'boolean',
    },
  },
  Table: {
    file: 'packages/shared/src/components/Table/Table.tsx',
    props: {
      columns: 'Array<Column>',
      data: 'Array<T>',
      selectable: 'boolean',
      sortable: 'boolean',
      onRowClick: 'function',
      ellipsis: 'boolean',
    },
  },
  // No Modal in production, uses ActionModal
  ActionModal: {
    file: 'packages/shared/src/components/ActionModal/ActionModal.tsx',
    props: {
      open: 'boolean',
      onClose: 'function',
      title: 'string',
      actions: 'Array<Action>',
    },
  },
  Tabs: {
    file: 'packages/shared/src/components/Tabs/Tabs.tsx',
    props: {
      value: 'string',
      onChange: 'function',
    },
  },
  Pagination: {
    file: 'packages/shared/src/components/Pagination/Pagination.tsx',
    props: {
      current: 'number',
      total: 'number',
      onChange: 'function',
      pageSize: 'number',
      onPageSizeChange: 'function',
    },
  },
  StatusIndicator: {
    file: 'packages/shared/src/components/StatusIndicator/StatusIndicator.tsx',
    props: {
      status: ['active', 'inactive', 'warning', 'error', 'pending'],
      label: 'string',
    },
  },
  Tooltip: {
    file: 'packages/shared/src/components/Tooltip/Tooltip.tsx',
    props: {
      content: 'ReactNode',
      placement: ['top', 'bottom', 'left', 'right'],
    },
  },
  ProgressBar: {
    file: 'packages/shared/src/components/ProgressBar/ProgressBar.tsx',
    props: {
      value: 'number',
      max: 'number',
      color: 'string',
    },
  },
  InlineMessage: {
    file: 'packages/shared/src/components/InlineMessage/InlineMessage.tsx',
    props: {
      variant: ['info', 'success', 'warning', 'error'],
      closable: 'boolean',
    },
  },
};

/**
 * Compare two prop definitions
 */
function compareProps(ssotProps, prodProps) {
  const differences = {
    onlyInSSOT: [],
    onlyInProd: [],
    different: [],
    same: [],
  };

  const ssotKeys = Object.keys(ssotProps || {});
  const prodKeys = Object.keys(prodProps || {});

  // Find props only in SSOT
  for (const key of ssotKeys) {
    if (!prodKeys.includes(key)) {
      differences.onlyInSSOT.push({ name: key, value: ssotProps[key] });
    }
  }

  // Find props only in Production
  for (const key of prodKeys) {
    if (!ssotKeys.includes(key)) {
      differences.onlyInProd.push({ name: key, value: prodProps[key] });
    }
  }

  // Find props in both but different
  for (const key of ssotKeys) {
    if (prodKeys.includes(key)) {
      const ssotVal = ssotProps[key];
      const prodVal = prodProps[key];
      
      if (Array.isArray(ssotVal) && Array.isArray(prodVal)) {
        const ssotSet = new Set(ssotVal);
        const prodSet = new Set(prodVal);
        const onlyInSSOT = ssotVal.filter(v => !prodSet.has(v));
        const onlyInProd = prodVal.filter(v => !ssotSet.has(v));
        
        if (onlyInSSOT.length > 0 || onlyInProd.length > 0) {
          differences.different.push({
            name: key,
            ssot: ssotVal,
            prod: prodVal,
            onlyInSSOT,
            onlyInProd,
          });
        } else {
          differences.same.push(key);
        }
      } else if (JSON.stringify(ssotVal) !== JSON.stringify(prodVal)) {
        differences.different.push({
          name: key,
          ssot: ssotVal,
          prod: prodVal,
        });
      } else {
        differences.same.push(key);
      }
    }
  }

  return differences;
}

/**
 * Generate comparison report
 */
function generateReport() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║         SSOT vs Production Interface Comparison Report           ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log('');

  const allComponents = new Set([
    ...Object.keys(SSOT_INTERFACES),
    ...Object.keys(PRODUCTION_INTERFACES),
  ]);

  const summary = {
    identical: [],
    needsWork: [],
    onlyInSSOT: [],
    onlyInProd: [],
  };

  for (const component of Array.from(allComponents).sort()) {
    const ssot = SSOT_INTERFACES[component];
    const prod = PRODUCTION_INTERFACES[component];

    if (!prod) {
      summary.onlyInSSOT.push(component);
      continue;
    }
    if (!ssot) {
      summary.onlyInProd.push(component);
      continue;
    }

    const diff = compareProps(ssot.props, prod.props);
    const hasDifferences = 
      diff.onlyInSSOT.length > 0 || 
      diff.onlyInProd.length > 0 || 
      diff.different.length > 0;

    if (hasDifferences) {
      summary.needsWork.push({ component, diff });
    } else {
      summary.identical.push(component);
    }
  }

  // Print summary
  console.log('📊 Summary');
  console.log('─'.repeat(60));
  console.log(`  ✅ Identical interfaces: ${summary.identical.length}`);
  console.log(`  ⚠️  Needs unification: ${summary.needsWork.length}`);
  console.log(`  📦 Only in SSOT: ${summary.onlyInSSOT.length}`);
  console.log(`  🏭 Only in Production: ${summary.onlyInProd.length}`);
  console.log('');

  // Detailed differences
  if (summary.needsWork.length > 0) {
    console.log('⚠️  Components Needing Unification');
    console.log('═'.repeat(60));
    
    for (const { component, diff } of summary.needsWork) {
      console.log('');
      console.log(`📦 ${component}`);
      console.log('─'.repeat(40));

      if (diff.different.length > 0) {
        console.log('  Different values:');
        for (const d of diff.different) {
          if (Array.isArray(d.ssot)) {
            console.log(`    • ${d.name}:`);
            console.log(`      SSOT: [${d.ssot.join(', ')}]`);
            console.log(`      Prod: [${d.prod.join(', ')}]`);
            if (d.onlyInSSOT?.length) {
              console.log(`      Only in SSOT: ${d.onlyInSSOT.join(', ')}`);
            }
            if (d.onlyInProd?.length) {
              console.log(`      Only in Prod: ${d.onlyInProd.join(', ')}`);
            }
          } else {
            console.log(`    • ${d.name}: SSOT=${d.ssot}, Prod=${d.prod}`);
          }
        }
      }

      if (diff.onlyInSSOT.length > 0) {
        console.log('  Only in SSOT:');
        for (const p of diff.onlyInSSOT) {
          console.log(`    • ${p.name}: ${Array.isArray(p.value) ? `[${p.value.join(', ')}]` : p.value}`);
        }
      }

      if (diff.onlyInProd.length > 0) {
        console.log('  Only in Production:');
        for (const p of diff.onlyInProd) {
          console.log(`    • ${p.name}: ${Array.isArray(p.value) ? `[${p.value.join(', ')}]` : p.value}`);
        }
      }
    }
  }

  // Components only in one system
  if (summary.onlyInSSOT.length > 0) {
    console.log('');
    console.log('📦 Components Only in SSOT (need to add to Production)');
    console.log('─'.repeat(60));
    for (const c of summary.onlyInSSOT) {
      console.log(`  • ${c}`);
    }
  }

  if (summary.onlyInProd.length > 0) {
    console.log('');
    console.log('🏭 Components Only in Production (consider adding to SSOT)');
    console.log('─'.repeat(60));
    for (const c of summary.onlyInProd) {
      console.log(`  • ${c}`);
    }
  }

  console.log('');
  console.log('═'.repeat(60));
  console.log('💡 Recommendation: Unify the interfaces marked with ⚠️ first.');
  console.log('   Then migrate components that exist only in one system.');
  console.log('');

  // Generate JSON report
  const reportPath = path.join(ROOT_DIR, 'interface-comparison-report.json');
  const jsonReport = {
    generatedAt: new Date().toISOString(),
    summary: {
      identical: summary.identical,
      needsWork: summary.needsWork.map(n => n.component),
      onlyInSSOT: summary.onlyInSSOT,
      onlyInProd: summary.onlyInProd,
    },
    details: summary.needsWork,
  };
  fs.writeFileSync(reportPath, JSON.stringify(jsonReport, null, 2));
  console.log(`📄 JSON report saved to: ${reportPath}`);
}

// Run
generateReport();
