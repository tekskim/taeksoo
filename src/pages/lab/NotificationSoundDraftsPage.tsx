import { useState, useRef, useCallback } from 'react';
import { VStack, HStack, Badge, Tabs, TabList, Tab, TabPanel } from '@/design-system';
import { IconPlayerPlay, IconPlayerStop, IconVolume } from '@tabler/icons-react';
import { normalSoundDefs, emergencySoundDefs } from './notificationSoundSynth';
import type { SoundDefinition } from './notificationSoundSynth';

function SoundCard({
  sound,
  index,
  isPlaying,
  onPlay,
  variant,
}: {
  sound: SoundDefinition;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  variant: 'normal' | 'emergency';
}) {
  const borderColor = isPlaying
    ? variant === 'emergency'
      ? 'border-[var(--color-state-danger)]'
      : 'border-[var(--color-action-primary)]'
    : 'border-[var(--color-border-default)]';

  const bgColor = isPlaying
    ? variant === 'emergency'
      ? 'bg-[var(--color-state-danger-bg)]'
      : 'bg-[var(--color-state-info-bg)]'
    : 'bg-[var(--color-surface-default)]';

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-[var(--radius-lg)] border ${borderColor} ${bgColor} transition-all duration-200`}
    >
      <span className="text-label-md text-[var(--color-text-subtle)] w-6 text-center shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      <button
        type="button"
        onClick={onPlay}
        className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
          isPlaying
            ? variant === 'emergency'
              ? 'bg-[var(--color-state-danger)] text-white'
              : 'bg-[var(--color-action-primary)] text-white'
            : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
        }`}
        aria-label={isPlaying ? 'Playing' : 'Play'}
      >
        {isPlaying ? <IconPlayerStop size={14} /> : <IconPlayerPlay size={14} />}
      </button>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <HStack gap={2} align="center">
          <span className="text-label-md text-[var(--color-text-default)] truncate">
            {sound.name}
          </span>
          {isPlaying && (
            <Badge variant={variant === 'emergency' ? 'danger' : 'info'} size="sm">
              Playing
            </Badge>
          )}
        </HStack>
        <span className="text-body-sm text-[var(--color-text-subtle)]">{sound.description}</span>
      </div>
    </div>
  );
}

export function NotificationSoundDraftsPage() {
  const [activeTab, setActiveTab] = useState('normal');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playSound = useCallback(
    (sound: SoundDefinition) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const ctx = getCtx();
      sound.play(ctx);
      setPlayingId(sound.id);
      const duration = sound.id.startsWith('emergency') ? 3500 : 1500;
      timerRef.current = setTimeout(() => setPlayingId(null), duration);
    },
    [getCtx]
  );

  const renderSoundList = (sounds: SoundDefinition[], variant: 'normal' | 'emergency') => (
    <VStack gap={2}>
      {sounds.map((sound, i) => (
        <SoundCard
          key={sound.id}
          sound={sound}
          index={i}
          variant={variant}
          isPlaying={playingId === sound.id}
          onPlay={() => playSound(sound)}
        />
      ))}
    </VStack>
  );

  return (
    <VStack gap={8}>
      <VStack gap={3}>
        <HStack gap={3} align="center">
          <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] flex items-center justify-center">
            <IconVolume size={20} stroke={1.5} className="text-[var(--color-text-muted)]" />
          </div>
          <VStack gap={0.5}>
            <h1 className="text-heading-h3 text-[var(--color-text-default)]">
              Notification Sound Drafts
            </h1>
            <p className="text-body-md text-[var(--color-text-muted)]">
              알림센터에서 사용할 알림음 시안입니다. Web Audio API로 실시간 합성되며, 각 사운드를
              재생하여 비교한 후 최종 선택합니다.
            </p>
          </VStack>
        </HStack>
      </VStack>

      <div className="flex gap-4 px-4 py-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]">
        <VStack gap={1} className="flex-1">
          <span className="text-label-sm text-[var(--color-text-subtle)]">일반 알림음</span>
          <span className="text-heading-h4 text-[var(--color-text-default)]">
            {normalSoundDefs.length}
          </span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            메시지 수신, 작업 완료 등
          </span>
        </VStack>
        <div className="w-px bg-[var(--color-border-default)]" />
        <VStack gap={1} className="flex-1">
          <span className="text-label-sm text-[var(--color-text-subtle)]">이머전시 알림음</span>
          <span className="text-heading-h4 text-[var(--color-state-danger)]">
            {emergencySoundDefs.length}
          </span>
          <span className="text-body-xs text-[var(--color-text-subtle)]">
            크리티컬 에러, 장애 알림 등
          </span>
        </VStack>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
        <TabList>
          <Tab value="normal">
            <HStack gap={1.5} align="center">
              <span>Normal</span>
              <Badge variant="info" size="sm">
                {normalSoundDefs.length}
              </Badge>
            </HStack>
          </Tab>
          <Tab value="emergency">
            <HStack gap={1.5} align="center">
              <span>Emergency</span>
              <Badge variant="danger" size="sm">
                {emergencySoundDefs.length}
              </Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanel value="normal" className="pt-4">
          <VStack gap={4}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                일반 메시지 알림음
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                일반적인 메시지 수신, 작업 완료/성공 등의 상황에서 사용되는 알림음입니다. 부드럽고
                방해되지 않는 톤을 지향합니다.
              </span>
            </VStack>
            {renderSoundList(normalSoundDefs, 'normal')}
          </VStack>
        </TabPanel>

        <TabPanel value="emergency" className="pt-4">
          <VStack gap={4}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                이머전시 알림음
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                크리티컬 에러, 시스템 장애, 모니터링 경고 등 긴급 상황을 인지할 수 있도록 설계된
                알림음입니다. 주의를 끌 수 있는 강한 패턴을 사용합니다.
              </span>
            </VStack>
            {renderSoundList(emergencySoundDefs, 'emergency')}
          </VStack>
        </TabPanel>
      </Tabs>
    </VStack>
  );
}

export default NotificationSoundDraftsPage;
