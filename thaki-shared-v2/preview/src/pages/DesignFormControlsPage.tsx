import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Input } from '@shared/components/Input';
import { Textarea } from '@shared/components/Textarea';
import { Checkbox } from '@shared/components/Checkbox';
import { RadioButton } from '@shared/components/RadioButton';
import { RadioGroup } from '@shared/components/RadioGroup';
import { Toggle } from '@shared/components/Toggle';
import { Dropdown } from '@shared/components/Dropdown';
import { FormField } from '@shared/components/FormField';
import { FilterSearchInput } from '@shared/components/FilterSearch';
import { Password } from '@shared/components/Password';
import Range from '@shared/components/Range';
import { TagInput } from '@shared/components/TagInput';
import { DatePicker } from '@shared/components/DatePicker';
import { SearchIcon, CheckIcon } from '@shared/components/Icon/svg/wrapped';
import type { FilterKey, FilterKeyWithValue } from '@shared/components/FilterSearch';
import type { OptionValue } from '@shared/components/Dropdown';

const filterKeys: FilterKey[] = [
  { key: 'name', label: 'Name', type: 'input', placeholder: 'Filter by name…' },
  { key: 'status', label: 'Status', type: 'input', placeholder: 'Filter by status…' },
  { key: 'region', label: 'Region', type: 'input' },
];

const buttonVariants = ['primary', 'secondary', 'muted', 'error'] as const;
const buttonSizes = ['sm', 'md', 'lg'] as const;
const appearances = ['solid', 'outline', 'ghost'] as const;

export function DesignFormControlsPage() {
  const [checkboxOn, setCheckboxOn] = useState(true);
  const [radioValue, setRadioValue] = useState('b');
  const [toggleOn, setToggleOn] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<OptionValue>('east');
  const [inputVal, setInputVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [rangeVal, setRangeVal] = useState(40);
  const [appliedFilters, setAppliedFilters] = useState<FilterKeyWithValue[]>([]);
  const [password, setPassword] = useState('');
  const [showPwdTooltip, setShowPwdTooltip] = useState(false);
  const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<{ key: string; value: string }[]>([
    { key: 'env', value: 'staging' },
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-[22px] leading-[32px] font-semibold text-text m-0">Form controls</h1>
        <p className="text-13 leading-20 text-text-muted m-0">
          Live examples of shared-v2 form components (import paths shown per section).
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Button</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Button</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-6">
          {appearances.map((appearance) => (
            <div key={appearance} className="flex flex-col gap-3">
              <span className="text-12 font-medium text-text-muted capitalize">{appearance}</span>
              <div className="flex flex-col gap-4">
                {buttonSizes.map((size) => (
                  <div key={size} className="flex flex-wrap items-center gap-2">
                    {buttonVariants.map((variant) => (
                      <Button key={variant} variant={variant} appearance={appearance} size={size}>
                        {variant}
                      </Button>
                    ))}
                    <Button variant="primary" appearance={appearance} size={size}>
                      <CheckIcon size="xs" className="shrink-0" /> Icon
                    </Button>
                    <Button variant="secondary" appearance={appearance} size={size} disabled>
                      Disabled
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Input</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Input</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4 max-w-md">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Placeholder"
            className="w-full"
          />
          <Input placeholder="Disabled" disabled className="w-full" />
          <div className="flex items-center gap-2 w-full min-w-0">
            <SearchIcon variant="muted" size="sm" className="shrink-0" />
            <Input placeholder="Search with leading icon" className="flex-1 min-w-0" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Textarea</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Textarea</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4 max-w-md">
          <Textarea rows={3} value={textareaVal} onChange={(e) => setTextareaVal(e.target.value)} />
          <Textarea rows={2} placeholder="Placeholder only" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Checkbox</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Checkbox</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-3">
          <Checkbox checked={checkboxOn} onChange={setCheckboxOn}>
            Checked state (toggle me)
          </Checkbox>
          <Checkbox checked={false} onChange={() => {}} disabled>
            Unchecked disabled
          </Checkbox>
          <Checkbox checked disabled onChange={() => {}}>
            Checked disabled
          </Checkbox>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">
            RadioButton / RadioGroup
          </h2>
          <p className="text-13 leading-20 text-text-muted m-0">
            @shared/components/RadioButton · @shared/components/RadioGroup
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-6">
          <RadioGroup
            name="demo-plan"
            legend="Pick one option"
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
              { value: 'c', label: 'Option C' },
            ]}
            selectedValue={radioValue}
            onChange={setRadioValue}
          />
          <div className="flex flex-col gap-2">
            <span className="text-12 text-text-muted">Standalone RadioButton</span>
            <RadioButton name="solo" value="x" label="Standalone" checked onChange={() => {}} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Toggle</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Toggle</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-4">
          <Toggle
            checked={toggleOn}
            onChange={(e) => setToggleOn(e.target.checked)}
            checkedLabel="Notifications on"
            uncheckedLabel="Notifications off"
          />
          <Toggle checked={false} disabled uncheckedLabel="Disabled off" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Dropdown</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Dropdown</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface max-w-xs">
          <Dropdown.Select
            value={dropdownValue}
            onChange={setDropdownValue}
            placeholder="Select region"
          >
            <Dropdown.Option value="east" label="US East" />
            <Dropdown.Option value="west" label="US West" />
            <Dropdown.Option value="eu" label="EU Central" />
          </Dropdown.Select>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">FormField</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/FormField</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-6 max-w-md">
          <FormField label="Display name" required>
            <Input placeholder="Acme Corp" className="w-full" />
          </FormField>
          <FormField label="Description" hint="Shown in lists and detail headers.">
            <Input placeholder="Optional" className="w-full" />
          </FormField>
          <FormField label="Email" required error="Enter a valid email address.">
            <Input type="email" error placeholder="you@example.com" className="w-full" />
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">
            FilterSearchInput
          </h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/FilterSearch</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface flex flex-col gap-3">
          <FilterSearchInput
            filterKeys={filterKeys}
            onFilterAdd={(f) => setAppliedFilters((prev) => [...prev, f])}
            selectedFilters={appliedFilters}
            placeholder="Add filters by key"
          />
          {appliedFilters.length > 0 && (
            <p className="text-12 text-text-muted m-0">
              Active:{' '}
              {appliedFilters
                .map((f) => `${f.label}:${f.displayValue ?? f.value ?? ''}`)
                .join(' · ')}
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Password</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Password</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface max-w-md">
          <Password
            id="design-password-demo"
            label="Password"
            placeholder="Type a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            tooltipContent={<span className="text-12">Use at least 8 characters.</span>}
            showTooltip={showPwdTooltip}
            onFocus={() => setShowPwdTooltip(true)}
            onBlur={() => setShowPwdTooltip(false)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">Range</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/Range</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface max-w-md flex flex-col gap-2">
          <span className="text-12 text-text-muted">Value: {rangeVal}</span>
          <Range min={0} max={100} value={rangeVal} onChange={setRangeVal} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">TagInput</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/TagInput</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface">
          <TagInput tags={tags} onTagsChange={setTags} maxTags={6}>
            <TagInput.Form keyPlaceholder="label key" valuePlaceholder="label value" />
            <TagInput.AddButton />
          </TagInput>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] leading-[28px] font-semibold text-text m-0">DatePicker</h2>
          <p className="text-13 leading-20 text-text-muted m-0">@shared/components/DatePicker</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface inline-flex flex-col gap-3 max-w-fit">
          <DatePicker
            mode="single"
            value={singleDate}
            onChange={setSingleDate}
            onApply={setSingleDate}
            onCancel={() => setSingleDate(undefined)}
            numberOfMonths={1}
            preventFutureSet={false}
          />
          <span className="text-12 text-text-muted">
            Selected: {singleDate ? singleDate.toDateString() : '—'}
          </span>
        </div>
      </section>
    </div>
  );
}
