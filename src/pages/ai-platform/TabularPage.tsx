import { useState, useMemo, type ReactNode } from 'react';
import {
  PageShell,
  PageHeader,
  VStack,
  HStack,
  Button,
  Table,
  Pagination,
  FilterSearchInput,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  ProgressBar,
  StatusIndicator,
  EmptyState,
  ContextMenu,
  Breadcrumb,
  TopBar,
  TabBar,
} from '@/design-system';
import type { FilterField, AppliedFilter } from '@/design-system';
import { AIPlatformSidebar } from '@/pages/AIPlatformPage';
import { AiPlatformTopBarActions } from '@/pages/ai-platform/AiPlatformTopBarActions';
import { IconTrash, IconTable, IconDotsVertical } from '@tabler/icons-react';

// --- Types ---

type TabularExperiment = {
  id: string;
  name: string;
  status: 'active' | 'error' | 'building';
  mlTask: string;
  model: string;
  progress: number;
};

type TabularDetailModel = {
  id: string;
  rank: number;
  name: string;
  trainTime: string;
  accuracy: string;
  metric: string;
};

// --- Mock Data ---

const MOCK_EXPERIMENTS: TabularExperiment[] = [
  {
    id: '1',
    name: 'E-Commerce Price Elasticity',
    status: 'building',
    mlTask: 'Classification',
    model: 'XGBoost',
    progress: 75,
  },
  {
    id: '2',
    name: 'Customer Churn Prediction',
    status: 'active',
    mlTask: 'Classification',
    model: 'XGBoost',
    progress: 100,
  },
  {
    id: '3',
    name: 'Fraud Detection Pipeline',
    status: 'active',
    mlTask: 'Classification',
    model: 'XGBoost',
    progress: 100,
  },
];

const MOCK_DETAIL_MODELS: TabularDetailModel[] = [
  { id: '1', rank: 1, name: 'XGBoost', trainTime: '0s', accuracy: '90.1%', metric: 'Label' },
  { id: '2', rank: 2, name: 'XGBoost', trainTime: '40s', accuracy: '88%', metric: 'mse' },
];

const FILTER_FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Completed' },
      { value: 'error', label: 'Failed' },
      { value: 'building', label: 'Running' },
    ],
  },
  {
    id: 'mlTask',
    label: 'ML Task',
    type: 'select',
    options: [
      { value: 'classification', label: 'Classification' },
      { value: 'regression', label: 'Regression' },
    ],
  },
];

const CAPSULE_TABS = ['Feature importance', 'Dependence', 'Local SHAP', 'Interaction', 'Drift'];

const FEATURE_IMPORTANCE_DATA = [
  { name: 'ExitRates', value: 0.6844 },
  { name: 'ProductRelated_Duration', value: 0.26 },
  { name: 'TrafficType', value: 0.1 },
  { name: 'BounceRates', value: 0.05 },
  { name: 'Region', value: 0.02 },
  { name: 'Informational', value: 0.015 },
  { name: 'OperatingSystems', value: 0.012 },
  { name: 'Administrative_Duration', value: 0.01 },
  { name: 'Month_May', value: 0.008 },
  { name: 'Informational_Duration', value: 0.007 },
  { name: 'PageValues', value: 0.005 },
  { name: 'Month_Nov', value: 0.004 },
  { name: 'Browser', value: 0.003 },
  { name: 'Month_Feb', value: 0.002 },
  { name: 'Month_Jul', value: 0.001 },
];

const SHAP_WATERFALL_DATA = [
  { name: 'ExitRates', value: 0.32, direction: 'positive' as const },
  { name: 'PageValues', value: 0.18, direction: 'positive' as const },
  { name: 'ProductRelated_Duration', value: 0.12, direction: 'positive' as const },
  { name: 'BounceRates', value: -0.08, direction: 'negative' as const },
  { name: 'Region', value: -0.05, direction: 'negative' as const },
  { name: 'Month_Nov', value: -0.04, direction: 'negative' as const },
  { name: 'Informational', value: 0.03, direction: 'positive' as const },
  { name: 'TrafficType', value: -0.02, direction: 'negative' as const },
];

const DRIFT_DATA = [
  { bin: '0.0', train: 0.12, prod: 0.14 },
  { bin: '0.1', train: 0.18, prod: 0.15 },
  { bin: '0.2', train: 0.25, prod: 0.22 },
  { bin: '0.3', train: 0.2, prod: 0.28 },
  { bin: '0.4', train: 0.15, prod: 0.12 },
  { bin: '0.5', train: 0.06, prod: 0.05 },
  { bin: '0.6', train: 0.03, prod: 0.03 },
  { bin: '0.7', train: 0.01, prod: 0.01 },
];

const PERFORMANCE_CURVE_DATA = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0.45 },
  { x: 0.2, y: 0.65 },
  { x: 0.3, y: 0.75 },
  { x: 0.4, y: 0.82 },
  { x: 0.5, y: 0.87 },
  { x: 0.6, y: 0.9 },
  { x: 0.7, y: 0.93 },
  { x: 0.8, y: 0.95 },
  { x: 0.9, y: 0.97 },
  { x: 1.0, y: 1.0 },
];

const CONFUSION_MATRIX = [
  [142, 18],
  [12, 128],
];

// --- Components ---

function StatCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: 'active' | 'error' | 'building';
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] px-4 py-3">
      <div className="flex flex-col gap-1.5">
        <span className="text-label-sm text-[var(--color-text-subtle)]">{label}</span>
        <span className="text-body-md text-[var(--color-text-default)]">{value}</span>
      </div>
      <StatusIndicator status={status} layout="icon-only" />
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] overflow-hidden">
      <div className="px-6 pt-5 pb-4">
        <h4 className="text-heading-h6 text-[var(--color-text-default)]">{title}</h4>
      </div>
      <div className="px-6 pb-5">{children}</div>
    </div>
  );
}

function FeatureImportanceChart() {
  const maxValue = FEATURE_IMPORTANCE_DATA[0].value;
  return (
    <ChartCard title="Feature Importance">
      <div className="flex flex-col gap-1.5">
        {FEATURE_IMPORTANCE_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-3 h-[22px]">
            <span className="text-body-md text-[var(--color-text-default)] w-[180px] text-right shrink-0 truncate">
              {item.name}
            </span>
            <div className="flex-1 h-[14px] relative">
              <div
                className="absolute top-0 left-0 h-full rounded-sm bg-[var(--color-action-primary)]"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <div className="w-[180px] shrink-0" />
        <div className="flex-1 flex justify-between">
          <span className="text-body-sm text-[var(--color-text-subtle)]">0</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">0.2</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">0.4</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">0.6</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">
            {maxValue.toFixed(16).replace(/0+$/, '')}
          </span>
        </div>
      </div>
    </ChartCard>
  );
}

function DependenceChart() {
  const points = [
    { x: 10, y: 85 },
    { x: 15, y: 80 },
    { x: 20, y: 72 },
    { x: 22, y: 68 },
    { x: 30, y: 60 },
    { x: 35, y: 55 },
    { x: 38, y: 50 },
    { x: 42, y: 48 },
    { x: 48, y: 40 },
    { x: 55, y: 35 },
    { x: 60, y: 30 },
    { x: 65, y: 28 },
    { x: 70, y: 22 },
    { x: 75, y: 18 },
    { x: 80, y: 15 },
    { x: 85, y: 12 },
    { x: 90, y: 10 },
    { x: 95, y: 8 },
  ];
  return (
    <ChartCard title="Partial Dependence Plot — ExitRates">
      <div className="relative w-full h-[280px]">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <line
            x1="40"
            y1="180"
            x2="380"
            y2="180"
            stroke="var(--color-border-default)"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="10"
            x2="40"
            y2="180"
            stroke="var(--color-border-default)"
            strokeWidth="1"
          />
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <g key={i}>
              <line
                x1="40"
                y1={180 - v * 170}
                x2="380"
                y2={180 - v * 170}
                stroke="var(--color-border-subtle)"
                strokeWidth="0.5"
                strokeDasharray="4"
              />
              <text
                x="35"
                y={184 - v * 170}
                textAnchor="end"
                className="text-[9px]"
                fill="var(--color-text-subtle)"
              >
                {(v * 0.4).toFixed(2)}
              </text>
            </g>
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <text
              key={i}
              x={40 + v * 340}
              y="195"
              textAnchor="middle"
              className="text-[9px]"
              fill="var(--color-text-subtle)"
            >
              {(v * 0.08).toFixed(2)}
            </text>
          ))}
          <polyline
            points={points
              .map((p) => `${40 + (p.x / 100) * 340},${180 - (p.y / 100) * 170}`)
              .join(' ')}
            fill="none"
            stroke="var(--color-action-primary)"
            strokeWidth="2"
          />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={40 + (p.x / 100) * 340}
              cy={180 - (p.y / 100) * 170}
              r="3"
              fill="var(--color-action-primary)"
              opacity="0.6"
            />
          ))}
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <span className="text-body-sm text-[var(--color-text-subtle)]">ExitRates</span>
        </div>
      </div>
    </ChartCard>
  );
}

function LocalShapChart() {
  const maxAbs = Math.max(...SHAP_WATERFALL_DATA.map((d) => Math.abs(d.value)));
  return (
    <ChartCard title="Local SHAP Values — Sample #1">
      <div className="flex flex-col gap-2">
        {SHAP_WATERFALL_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-3 h-[24px]">
            <span className="text-body-md text-[var(--color-text-default)] w-[180px] text-right shrink-0 truncate">
              {item.name}
            </span>
            <div className="flex-1 h-[16px] relative flex items-center">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-border-default)]" />
              {item.direction === 'positive' ? (
                <div
                  className="absolute left-1/2 h-full rounded-sm bg-[var(--color-state-info)]"
                  style={{ width: `${(item.value / maxAbs) * 50}%` }}
                />
              ) : (
                <div
                  className="absolute h-full rounded-sm bg-[var(--color-state-danger)]"
                  style={{
                    width: `${(Math.abs(item.value) / maxAbs) * 50}%`,
                    right: '50%',
                  }}
                />
              )}
            </div>
            <span className="text-body-sm text-[var(--color-text-subtle)] w-[50px] text-right shrink-0">
              {item.value > 0 ? '+' : ''}
              {item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <div className="w-[180px] shrink-0" />
        <div className="flex-1 flex justify-between">
          <span className="text-body-sm text-[var(--color-text-subtle)]">-0.3</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">0</span>
          <span className="text-body-sm text-[var(--color-text-subtle)]">+0.3</span>
        </div>
        <div className="w-[50px] shrink-0" />
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--color-state-info)]" />
          <span className="text-body-sm text-[var(--color-text-subtle)]">Positive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--color-state-danger)]" />
          <span className="text-body-sm text-[var(--color-text-subtle)]">Negative</span>
        </div>
      </div>
    </ChartCard>
  );
}

function InteractionChart() {
  const features = ['ExitRates', 'PageValues', 'ProductRelated', 'BounceRates', 'Region'];
  const matrix = [
    [1.0, 0.42, 0.35, 0.28, 0.12],
    [0.42, 1.0, 0.31, 0.18, 0.08],
    [0.35, 0.31, 1.0, 0.45, 0.15],
    [0.28, 0.18, 0.45, 1.0, 0.22],
    [0.12, 0.08, 0.15, 0.22, 1.0],
  ];
  const getColor = (v: number) => {
    if (v >= 0.8) return 'bg-blue-600';
    if (v >= 0.4) return 'bg-blue-400';
    if (v >= 0.2) return 'bg-blue-200';
    return 'bg-blue-100';
  };
  return (
    <ChartCard title="Feature Interaction Strength">
      <div className="flex gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="h-6" />
          {features.map((f) => (
            <div key={f} className="h-8 flex items-center">
              <span className="text-body-sm text-[var(--color-text-default)] w-[120px] text-right truncate pr-2">
                {f}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5 h-6">
            {features.map((f) => (
              <div key={f} className="w-8 flex items-end justify-center">
                <span className="text-body-xs text-[var(--color-text-subtle)] rotate-[-45deg] origin-bottom-left whitespace-nowrap">
                  {f}
                </span>
              </div>
            ))}
          </div>
          {matrix.map((row, ri) => (
            <div key={ri} className="flex gap-0.5">
              {row.map((val, ci) => (
                <div
                  key={ci}
                  className={`w-8 h-8 rounded-sm ${getColor(val)} flex items-center justify-center`}
                  title={`${features[ri]} × ${features[ci]}: ${val.toFixed(2)}`}
                >
                  <span className="text-body-xs text-white">{val.toFixed(1)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-1 ml-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-600" />
            <span className="text-body-xs text-[var(--color-text-subtle)]">Strong (≥0.8)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-400" />
            <span className="text-body-xs text-[var(--color-text-subtle)]">Medium (≥0.4)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-200" />
            <span className="text-body-xs text-[var(--color-text-subtle)]">Weak (≥0.2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-100" />
            <span className="text-body-xs text-[var(--color-text-subtle)]">Minimal (&lt;0.2)</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function DriftChart() {
  const maxVal = Math.max(...DRIFT_DATA.flatMap((d) => [d.train, d.prod]));
  return (
    <ChartCard title="Feature Drift — ExitRates">
      <div className="flex flex-col gap-1">
        {DRIFT_DATA.map((item) => (
          <div key={item.bin} className="flex items-center gap-3 h-[28px]">
            <span className="text-body-sm text-[var(--color-text-subtle)] w-[32px] text-right shrink-0">
              {item.bin}
            </span>
            <div className="flex-1 flex flex-col gap-0.5 justify-center">
              <div className="h-[10px] relative">
                <div
                  className="absolute top-0 left-0 h-full rounded-sm bg-[var(--color-action-primary)] opacity-70"
                  style={{ width: `${(item.train / maxVal) * 100}%` }}
                />
              </div>
              <div className="h-[10px] relative">
                <div
                  className="absolute top-0 left-0 h-full rounded-sm bg-[var(--color-state-warning)] opacity-70"
                  style={{ width: `${(item.prod / maxVal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--color-action-primary)] opacity-70" />
          <span className="text-body-sm text-[var(--color-text-subtle)]">Training</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--color-state-warning)] opacity-70" />
          <span className="text-body-sm text-[var(--color-text-subtle)]">Production</span>
        </div>
        <span className="text-body-sm text-[var(--color-text-subtle)] ml-auto">
          PSI: 0.032 (Low drift)
        </span>
      </div>
    </ChartCard>
  );
}

function ConfusionMatrixChart() {
  const labels = ['Positive', 'Negative'];
  const colors = [
    ['bg-green-100 text-green-800', 'bg-red-100 text-red-800'],
    ['bg-red-100 text-red-800', 'bg-green-100 text-green-800'],
  ];
  return (
    <ChartCard title="Confusion Matrix">
      <div className="flex gap-6">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5 ml-[80px]">
            {labels.map((l) => (
              <div key={l} className="w-[72px] text-center">
                <span className="text-body-sm text-[var(--color-text-subtle)]">{l}</span>
              </div>
            ))}
          </div>
          {CONFUSION_MATRIX.map((row, ri) => (
            <div key={ri} className="flex items-center gap-0.5">
              <span className="text-body-sm text-[var(--color-text-subtle)] w-[80px] text-right pr-2">
                {labels[ri]}
              </span>
              {row.map((val, ci) => (
                <div
                  key={ci}
                  className={`w-[72px] h-[56px] rounded-[var(--radius-sm)] ${colors[ri][ci]} flex items-center justify-center`}
                >
                  <span className="text-heading-h5">{val}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="ml-[80px] mt-2 text-center">
            <span className="text-body-sm text-[var(--color-text-subtle)]">Predicted</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-[var(--color-text-subtle)] w-[80px]">Accuracy</span>
            <span className="text-body-md text-[var(--color-text-default)]">90.0%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-[var(--color-text-subtle)] w-[80px]">Precision</span>
            <span className="text-body-md text-[var(--color-text-default)]">87.7%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-[var(--color-text-subtle)] w-[80px]">Recall</span>
            <span className="text-body-md text-[var(--color-text-default)]">91.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-[var(--color-text-subtle)] w-[80px]">F1 Score</span>
            <span className="text-body-md text-[var(--color-text-default)]">89.5%</span>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function RocCurveChart() {
  return (
    <ChartCard title="ROC Curve">
      <div className="relative w-full h-[280px]">
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <line
            x1="50"
            y1="260"
            x2="380"
            y2="260"
            stroke="var(--color-border-default)"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="20"
            x2="50"
            y2="260"
            stroke="var(--color-border-default)"
            strokeWidth="1"
          />
          {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
            <g key={i}>
              <line
                x1="50"
                y1={260 - v * 240}
                x2="380"
                y2={260 - v * 240}
                stroke="var(--color-border-subtle)"
                strokeWidth="0.5"
                strokeDasharray="4"
              />
              <text
                x="45"
                y={264 - v * 240}
                textAnchor="end"
                className="text-[9px]"
                fill="var(--color-text-subtle)"
              >
                {v.toFixed(1)}
              </text>
              <text
                x={50 + v * 330}
                y="275"
                textAnchor="middle"
                className="text-[9px]"
                fill="var(--color-text-subtle)"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}
          <line
            x1="50"
            y1="260"
            x2="380"
            y2="20"
            stroke="var(--color-border-default)"
            strokeWidth="1"
            strokeDasharray="6"
          />
          <polyline
            points={PERFORMANCE_CURVE_DATA.map((p) => `${50 + p.x * 330},${260 - p.y * 240}`).join(
              ' '
            )}
            fill="none"
            stroke="var(--color-action-primary)"
            strokeWidth="2"
          />
          <text
            x="215"
            y="290"
            textAnchor="middle"
            className="text-[10px]"
            fill="var(--color-text-subtle)"
          >
            False Positive Rate
          </text>
          <text
            x="15"
            y="140"
            textAnchor="middle"
            className="text-[10px]"
            fill="var(--color-text-subtle)"
            transform="rotate(-90 15 140)"
          >
            True Positive Rate
          </text>
          <text x="300" y="40" className="text-[10px]" fill="var(--color-action-primary)">
            AUC = 0.94
          </text>
        </svg>
      </div>
    </ChartCard>
  );
}

function RiskQualityChart() {
  const stabilityData = [
    { epoch: 1, score: 0.88 },
    { epoch: 2, score: 0.89 },
    { epoch: 3, score: 0.9 },
    { epoch: 4, score: 0.91 },
    { epoch: 5, score: 0.9 },
    { epoch: 6, score: 0.89 },
    { epoch: 7, score: 0.9 },
    { epoch: 8, score: 0.91 },
    { epoch: 9, score: 0.9 },
    { epoch: 10, score: 0.9 },
  ];
  return (
    <ChartCard title="Model Stability Over Time">
      <div className="relative w-full h-[220px]">
        <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <line
            x1="50"
            y1="160"
            x2="380"
            y2="160"
            stroke="var(--color-border-default)"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="160"
            stroke="var(--color-border-default)"
            strokeWidth="1"
          />
          {[0.85, 0.9, 0.95].map((v) => (
            <g key={v}>
              <line
                x1="50"
                y1={160 - ((v - 0.85) / 0.1) * 150}
                x2="380"
                y2={160 - ((v - 0.85) / 0.1) * 150}
                stroke="var(--color-border-subtle)"
                strokeWidth="0.5"
                strokeDasharray="4"
              />
              <text
                x="45"
                y={164 - ((v - 0.85) / 0.1) * 150}
                textAnchor="end"
                className="text-[9px]"
                fill="var(--color-text-subtle)"
              >
                {v.toFixed(2)}
              </text>
            </g>
          ))}
          <polyline
            points={stabilityData
              .map((p, i) => `${50 + (i / 9) * 330},${160 - ((p.score - 0.85) / 0.1) * 150}`)
              .join(' ')}
            fill="none"
            stroke="var(--color-state-success)"
            strokeWidth="2"
          />
          {stabilityData.map((p, i) => (
            <circle
              key={i}
              cx={50 + (i / 9) * 330}
              cy={160 - ((p.score - 0.85) / 0.1) * 150}
              r="3"
              fill="var(--color-state-success)"
            />
          ))}
          <line
            x1="50"
            y1={160 - ((0.88 - 0.85) / 0.1) * 150}
            x2="380"
            y2={160 - ((0.88 - 0.85) / 0.1) * 150}
            stroke="var(--color-state-warning)"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <text
            x="385"
            y={164 - ((0.88 - 0.85) / 0.1) * 150}
            className="text-[8px]"
            fill="var(--color-state-warning)"
          >
            Threshold
          </text>
        </svg>
      </div>
    </ChartCard>
  );
}

// --- Main Page ---

export function TabularPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;

  const [selectedExperiment, setSelectedExperiment] = useState<TabularExperiment | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [detailTab, setDetailTab] = useState('overview');
  const [insightTab, setInsightTab] = useState('Feature importance');

  const filteredExperiments = useMemo(() => {
    let result = MOCK_EXPERIMENTS;
    appliedFilters.forEach((f) => {
      if (f.fieldId === 'name') {
        result = result.filter((e) => e.name.toLowerCase().includes(String(f.value).toLowerCase()));
      }
      if (f.fieldId === 'status') {
        result = result.filter((e) => e.status === f.value);
      }
    });
    return result;
  }, [appliedFilters]);

  const completedCount = MOCK_EXPERIMENTS.filter((e) => e.status === 'active').length;
  const failedCount = MOCK_EXPERIMENTS.filter((e) => e.status === 'error').length;
  const runningCount = MOCK_EXPERIMENTS.filter((e) => e.status === 'building').length;

  // --- List Columns ---

  const listColumns = [
    {
      key: 'status',
      header: 'Status',
      width: 59,
      align: 'center' as const,
      render: (_value: unknown, row: TabularExperiment) => (
        <StatusIndicator status={row.status} layout="icon-only" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (_value: unknown, row: TabularExperiment) => (
        <button
          className="text-label-md text-[var(--color-action-primary)] hover:underline text-left"
          onClick={() => setSelectedExperiment(row)}
        >
          {row.name}
        </button>
      ),
    },
    { key: 'mlTask', header: 'ML task' },
    { key: 'model', header: 'Model' },
    {
      key: 'progress',
      header: 'Progress',
      render: (_value: unknown, row: TabularExperiment) =>
        row.progress < 100 ? (
          <div className="flex flex-col gap-2">
            <span className="text-body-md text-[var(--color-text-default)]">{row.progress}%</span>
            <ProgressBar value={row.progress} className="w-full" />
          </div>
        ) : (
          <span className="text-body-md text-[var(--color-text-default)]">100%</span>
        ),
    },
    {
      key: 'action',
      header: 'Action',
      width: 72,
      align: 'center' as const,
      render: (_value: unknown, row: TabularExperiment) => (
        <ContextMenu
          items={[
            { id: 'view', label: 'View details', onClick: () => setSelectedExperiment(row) },
            { id: 'delete', label: 'Delete', status: 'danger', divider: true, onClick: () => {} },
          ]}
          trigger="click"
        >
          <button className="p-1 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)]">
            <IconDotsVertical size={16} className="text-[var(--color-text-muted)]" />
          </button>
        </ContextMenu>
      ),
    },
  ];

  // --- Detail Columns ---

  const detailColumns = [
    { key: 'rank', header: 'Rank', width: 59, align: 'center' as const },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'trainTime', header: 'Train time' },
    { key: 'accuracy', header: 'Accuracy', sortable: true },
    { key: 'metric', header: 'Metric' },
  ];

  // --- List View ---

  const listView = (
    <VStack gap={3}>
      <PageHeader
        title="Tabular"
        actions={
          <HStack gap={1}>
            <Button variant="secondary" size="md">
              Refresh
            </Button>
            <Button variant="primary" size="md">
              Start training
            </Button>
          </HStack>
        }
      />

      <div className="flex gap-2">
        <StatCard label="Completed" value={completedCount} status="active" />
        <StatCard label="Failed" value={failedCount} status="error" />
        <StatCard label="Running" value={runningCount} status="building" />
      </div>

      <HStack gap={2} align="center">
        <FilterSearchInput
          filters={FILTER_FIELDS}
          appliedFilters={appliedFilters}
          onFiltersChange={setAppliedFilters}
          placeholder="Find experiments with filter"
          size="sm"
          className="w-[280px]"
          hideAppliedFilters
        />
        <div className="w-px h-4 bg-[var(--color-border-default)]" />
        <Button
          variant="muted"
          size="sm"
          leftIcon={<IconTrash size={12} />}
          disabled={selectedItems.length === 0}
        >
          Delete
        </Button>
      </HStack>

      <Pagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
        totalItems={filteredExperiments.length}
        selectedCount={selectedItems.length}
      />

      {filteredExperiments.length === 0 ? (
        <EmptyState
          icon={<IconTable size={48} stroke={1} />}
          title="No experiments found"
          description="Start your first training to create a tabular experiment."
          action={
            <Button variant="primary" size="md">
              Start training
            </Button>
          }
        />
      ) : (
        <Table
          columns={listColumns}
          data={filteredExperiments}
          rowKey="id"
          selectable
          selectedKeys={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      )}
    </VStack>
  );

  // --- Detail View ---

  const detailView = selectedExperiment && (
    <VStack gap={4}>
      <VStack gap={1}>
        <h2 className="text-heading-h5 text-[var(--color-text-default)]">
          {selectedExperiment.name}
        </h2>
        <span className="text-body-md text-[var(--color-text-subtle)]">Description</span>
      </VStack>

      <div className="flex rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] overflow-hidden">
        {[
          { label: 'Category', value: 'E-Commerce > Price Elasticity' },
          { label: 'Best Score', value: '90.1%' },
          { label: 'Models Trained', value: '4' },
          { label: 'Stability', value: '0.01' },
          { label: 'Risk level', value: 'Low' },
        ].map((item, idx, arr) => (
          <div key={item.label} className="flex flex-1 items-stretch">
            <div className="flex flex-1 flex-col gap-1.5 px-4 py-3">
              <span className="text-label-sm text-[var(--color-text-subtle)]">{item.label}</span>
              <span className="text-body-md text-[var(--color-text-muted)]">{item.value}</span>
            </div>
            {idx < arr.length - 1 && <div className="w-px bg-[var(--color-border-default)]" />}
          </div>
        ))}
      </div>

      <Tabs value={detailTab} onChange={setDetailTab} variant="underline" size="sm">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="model-insights">Model Insights</Tab>
          <Tab value="performance">Performance</Tab>
          <Tab value="risk">Risk & Quality</Tab>
        </TabList>

        <TabPanel value="overview" className="pt-0">
          <VStack gap={3} className="pt-3">
            <VStack gap={1}>
              <span className="text-heading-h6 text-[var(--color-text-default)]">Overview</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Compare performance of trained models.
              </span>
            </VStack>
            <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalItems={2} />
            <Table columns={detailColumns} data={MOCK_DETAIL_MODELS} rowKey="id" />
          </VStack>
        </TabPanel>

        <TabPanel value="model-insights" className="pt-0">
          <VStack gap={4} className="pt-3">
            <div className="flex gap-2">
              {CAPSULE_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setInsightTab(t)}
                  className={`px-2.5 py-1.5 rounded-[var(--radius-md)] text-label-lg transition-colors ${
                    insightTab === t
                      ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]'
                      : 'text-[var(--color-text-default)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <VStack gap={1}>
              <span className="text-heading-h5 text-[var(--color-text-default)]">
                Model Leaderboard
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                {insightTab === 'Feature importance' && 'View SHAP-based feature importance.'}
                {insightTab === 'Dependence' &&
                  'Partial dependence of predictions on selected feature.'}
                {insightTab === 'Local SHAP' && 'Local explanation for individual predictions.'}
                {insightTab === 'Interaction' && 'Feature interaction strength between pairs.'}
                {insightTab === 'Drift' &&
                  'Compare feature distributions between training and production.'}
              </span>
            </VStack>
            {insightTab === 'Feature importance' && <FeatureImportanceChart />}
            {insightTab === 'Dependence' && <DependenceChart />}
            {insightTab === 'Local SHAP' && <LocalShapChart />}
            {insightTab === 'Interaction' && <InteractionChart />}
            {insightTab === 'Drift' && <DriftChart />}
          </VStack>
        </TabPanel>

        <TabPanel value="performance" className="pt-0">
          <VStack gap={4} className="pt-3">
            <VStack gap={1}>
              <span className="text-heading-h6 text-[var(--color-text-default)]">Performance</span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Model evaluation metrics and diagnostic charts.
              </span>
            </VStack>
            <div className="grid grid-cols-2 gap-4">
              <ConfusionMatrixChart />
              <RocCurveChart />
            </div>
          </VStack>
        </TabPanel>

        <TabPanel value="risk" className="pt-0">
          <VStack gap={4} className="pt-3">
            <VStack gap={1}>
              <span className="text-heading-h6 text-[var(--color-text-default)]">
                Risk & Quality
              </span>
              <span className="text-body-md text-[var(--color-text-subtle)]">
                Model risk assessment and quality monitoring.
              </span>
            </VStack>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Stability Index', value: '0.01', status: 'Low risk' },
                { label: 'Gini Coefficient', value: '0.82', status: 'Good' },
                { label: 'KS Statistic', value: '0.68', status: 'Acceptable' },
                { label: 'VIF Max', value: '2.4', status: 'No multicollinearity' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-4 py-3"
                >
                  <span className="text-label-sm text-[var(--color-text-subtle)]">{m.label}</span>
                  <div className="mt-1 text-heading-h5 text-[var(--color-text-default)]">
                    {m.value}
                  </div>
                  <span className="text-body-sm text-[var(--color-state-success)]">{m.status}</span>
                </div>
              ))}
            </div>
            <RiskQualityChart />
          </VStack>
        </TabPanel>
      </Tabs>
    </VStack>
  );

  // --- Breadcrumb ---

  const breadcrumbItems = selectedExperiment
    ? [{ label: 'Tabular', href: '/ai-platform/tabular' }, { label: selectedExperiment.name }]
    : [{ label: 'Tabular' }];

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={[{ id: 'tabular', label: 'Tabular', closable: false }]}
          activeTab="tabular"
          onTabChange={() => {}}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation={true}
          onBack={() => {
            if (selectedExperiment) setSelectedExperiment(null);
            else window.history.back();
          }}
          onForward={() => window.history.forward()}
          breadcrumb={<Breadcrumb items={breadcrumbItems} />}
          actions={<AiPlatformTopBarActions />}
        />
      }
      contentClassName="pt-4 px-8 pb-20 bg-[var(--color-surface-default)]"
    >
      {selectedExperiment ? detailView : listView}
    </PageShell>
  );
}
