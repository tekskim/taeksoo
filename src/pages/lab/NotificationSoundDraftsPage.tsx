import { useState, useRef, useCallback } from 'react';
import { VStack, HStack, Badge, Tabs, TabList, Tab, TabPanel } from '@/design-system';
import { IconPlayerPlay, IconPlayerStop, IconVolume, IconDownload } from '@tabler/icons-react';
import { normalSoundDefs, emergencySoundDefs } from './notificationSoundSynth';
import type { SoundDefinition } from './notificationSoundSynth';

function renderToWav(sound: SoundDefinition, durationSec: number): Promise<Blob> {
  const sampleRate = 44100;
  const length = sampleRate * durationSec;
  const offline = new OfflineAudioContext(1, length, sampleRate);
  sound.play(offline as unknown as AudioContext);
  return offline.startRendering().then((buffer) => {
    const pcm = buffer.getChannelData(0);
    const wavBuffer = new ArrayBuffer(44 + pcm.length * 2);
    const view = new DataView(wavBuffer);
    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + pcm.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, pcm.length * 2, true);
    for (let i = 0; i < pcm.length; i++) {
      const s = Math.max(-1, Math.min(1, pcm[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([wavBuffer], { type: 'audio/wav' });
  });
}

function SoundCard({
  sound,
  index,
  isPlaying,
  onPlay,
  onDownload,
  variant,
}: {
  sound: SoundDefinition;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onDownload: () => void;
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

      <button
        type="button"
        onClick={onDownload}
        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
        aria-label={`Download ${sound.name}`}
      >
        <IconDownload size={14} />
      </button>
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

  const downloadSound = useCallback((sound: SoundDefinition) => {
    const duration = sound.id.startsWith('emergency') ? 4 : 2;
    renderToWav(sound, duration).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sound.id}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

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
          onDownload={() => downloadSound(sound)}
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

      {/* Sound Matching Policy */}
      <VStack gap={3}>
        <span className="text-label-md text-[var(--color-text-default)]">
          메시지 유형별 사운드 매칭
        </span>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden">
          <table className="w-full text-body-md">
            <thead>
              <tr className="bg-[var(--color-surface-subtle)]">
                <th className="text-left text-label-sm text-[var(--color-text-subtle)] px-4 py-2.5 font-medium">
                  메시지 유형
                </th>
                <th className="text-left text-label-sm text-[var(--color-text-subtle)] px-4 py-2.5 font-medium">
                  사운드
                </th>
                <th className="text-left text-label-sm text-[var(--color-text-subtle)] px-4 py-2.5 font-medium">
                  카테고리
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[var(--color-border-default)]">
                <td className="px-4 py-2.5 text-[var(--color-text-default)]">
                  <HStack gap={1.5} align="center">
                    <Badge variant="error" size="sm">
                      Critical
                    </Badge>
                    <span>Alert앱 Critical 알림</span>
                  </HStack>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-default)] font-medium">
                  Urgent Square
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="error" size="sm">
                    Emergency
                  </Badge>
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border-default)]">
                <td className="px-4 py-2.5 text-[var(--color-text-default)]">
                  <HStack gap={1.5} align="center">
                    <Badge variant="warning" size="sm">
                      Warning
                    </Badge>
                    <span>Alert앱 Warning 알림</span>
                  </HStack>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-default)] font-medium">
                  Alarm Pulse
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="error" size="sm">
                    Emergency
                  </Badge>
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border-default)]">
                <td className="px-4 py-2.5 text-[var(--color-text-default)]">
                  <HStack gap={1.5} align="center">
                    <Badge variant="success" size="sm">
                      Success
                    </Badge>
                    <span>비동기 액션 Success 알림</span>
                  </HStack>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-default)] font-medium">
                  Tri-tone
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="info" size="sm">
                    Normal
                  </Badge>
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border-default)]">
                <td className="px-4 py-2.5 text-[var(--color-text-default)]">
                  <HStack gap={1.5} align="center">
                    <Badge variant="error" size="sm">
                      Failed
                    </Badge>
                    <span>비동기 액션 Failed 알림</span>
                  </HStack>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-default)] font-medium">
                  Descending Duo
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="info" size="sm">
                    Normal
                  </Badge>
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                <td
                  colSpan={3}
                  className="px-4 py-1.5 text-label-sm text-[var(--color-text-subtle)]"
                >
                  또는 (대안 세트)
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border-default)]">
                <td className="px-4 py-2.5 text-[var(--color-text-default)]">
                  <HStack gap={1.5} align="center">
                    <Badge variant="success" size="sm">
                      Success
                    </Badge>
                    <span>비동기 액션 Success 알림</span>
                  </HStack>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-default)] font-medium">
                  Triple Chime
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="info" size="sm">
                    Normal
                  </Badge>
                </td>
              </tr>
              <tr className="border-t border-[var(--color-border-default)]">
                <td className="px-4 py-2.5 text-[var(--color-text-default)]">
                  <HStack gap={1.5} align="center">
                    <Badge variant="error" size="sm">
                      Failed
                    </Badge>
                    <span>비동기 액션 Failed 알림</span>
                  </HStack>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-default)] font-medium">
                  Broken Chime
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant="info" size="sm">
                    Normal
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VStack>

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
              <Badge variant="error" size="sm">
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
