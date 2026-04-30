/**
 * wireframe-create/scripts/figma-build.cjs
 *
 * 캡처 결과를 Figma 화면기획서 프레임으로 빌드하는 헬퍼.
 *
 * 이 파일은 use_figma MCP 호출 시 사용할 JavaScript 코드 스니펫을 출력한다.
 * 에이전트는 이 스니펫을 use_figma의 code 파라미터로 전달한다.
 *
 * 사용법 (에이전트):
 *   1. capture.cjs 실행 완료 후 /tmp/wf_captures/rects.json 존재
 *   2. upload_assets로 각 스크린샷 업로드 → imageHash 수집
 *   3. generateBuildScript()의 출력을 use_figma에 전달
 *
 * generateBuildScript(screenConfig, imageHash, rects) 파라미터:
 *   - screenConfig: 매니페스트의 screens[n] 객체
 *   - imageHash: upload_assets 응답의 imageHash
 *   - rects: rects.json의 screens[n].rects 객체
 *   - templateFrameId: 매니페스트의 figma.templateFrameId
 */

/**
 * Figma use_figma 코드 스니펫 생성기.
 * 에이전트가 이 함수의 출력을 use_figma code로 사용한다.
 */
function generateBuildScript(screenConfig, imageHash, rects, templateFrameId) {
  const { id, name, path: screenPath, description } = screenConfig;

  // description 객체를 직렬화
  const descEntries = Object.entries(description || {});

  // annotation 배열 생성
  const annotations = screenConfig.annotations || [];

  return `
// ─── wireframe-build: ${id} ───────────────────────────────────────────────
// 자동 생성된 코드 — wireframe-create/scripts/figma-build.cjs

await figma.loadFontAsync({ family: 'SF Pro', style: 'Regular' });
await figma.loadFontAsync({ family: 'SF Pro', style: 'Semibold' });
await figma.loadFontAsync({ family: 'SF Pro', style: 'Bold' });

const targetPage = figma.root.children.find(p => p.name === '${screenConfig._targetPage}');
if (!targetPage) return { error: 'Target page not found' };
await figma.setCurrentPageAsync(targetPage);

// ─── 결정론적 ID: 기존 프레임 재사용 or 새로 clone ─────────────────────
let frame = targetPage.findOne(n => n.name === '${id}' && n.type === 'FRAME');
if (!frame) {
  // template page에서 clone
  const templatePage = figma.root.children.find(p => p.name === '${screenConfig._templatePage}');
  if (!templatePage) return { error: 'Template page not found' };
  await figma.setCurrentPageAsync(templatePage);
  const templateFrame = templatePage.findOne(n => n.id === '${templateFrameId}' && n.type === 'FRAME');
  if (!templateFrame) return { error: 'Template frame not found' };
  frame = templateFrame.clone();
  frame.name = '${id}';
  await figma.setCurrentPageAsync(targetPage);
  targetPage.appendChild(frame);
}

// ─── 이미지 교체 ─────────────────────────────────────────────────────────
const imageRect = frame.findOne(n => n.name === 'image 1');
if (imageRect) {
  imageRect.fills = [{ type: 'IMAGE', scaleMode: 'FIT', imageHash: '${imageHash}' }];
}

// ─── 헤더 텍스트 업데이트 ────────────────────────────────────────────────
async function setHeaderRow(rowName, label, value) {
  const row = frame.findOne(n => n.name === rowName);
  if (!row) return;
  const texts = row.findAll(n => n.type === 'TEXT');
  // 라벨 텍스트가 하나만 있으면 값 텍스트 추가
  if (texts.length === 1) {
    await figma.loadFontAsync({ family: 'SF Pro', style: 'Regular' });
    const newTxt = figma.createText();
    newTxt.fontName = { family: 'SF Pro', style: 'Regular' };
    newTxt.fontSize = 15;
    newTxt.fills = [{ type: 'SOLID', color: { r:0, g:0, b:0 } }];
    newTxt.characters = value;
    newTxt.x = 106;
    newTxt.y = 11;
    newTxt.textAutoResize = 'WIDTH_AND_HEIGHT';
    row.appendChild(newTxt);
  } else if (texts.length >= 2) {
    texts[0].characters = label;
    texts[1].characters = value;
  }
}

await setHeaderRow('Frame 40', '화면명', '${name.replace(/'/g, "\\'")}');
await setHeaderRow('Frame 41', '화면ID', '${id}');
await setHeaderRow('Frame 42', '화면 경로', '${(screenPath || '').replace(/'/g, "\\'")}');

// ─── 설명 패널 업데이트 ──────────────────────────────────────────────────
const dp = frame.findOne(n => n.name === 'Frame 46');
if (dp) {
  // 작성자
  const f43 = dp.findOne(n => n.name === 'Frame 43');
  if (f43) {
    const t = f43.findAll(n => n.type === 'TEXT');
    if (t.length >= 2) t[1].characters = '기획팀 / 디자인팀';
  }

  const rowNames = ['Frame 45','Frame 47','Frame 53','Frame 54','Frame 48','Frame 50','Frame 51','Frame 55','Frame 56'];
  const descItems = ${JSON.stringify(descEntries)};

  for (let i = 0; i < Math.min(descItems.length, rowNames.length); i++) {
    const [num, text] = descItems[i];
    const row = dp.findOne(n => n.name === rowNames[i]);
    if (!row) continue;
    const txts = row.findAll(n => n.type === 'TEXT');
    const numTxt = txts.find(t => t.characters.length <= 3 && /^[0-9A-Z]/.test(t.characters));
    const bodyTxt = txts.find(t => t !== numTxt && t.characters.length > 3);
    if (numTxt) numTxt.characters = num;
    if (bodyTxt) bodyTxt.characters = text.trim();
  }

  // 사용하지 않는 desc 행 숨김
  for (let i = descItems.length; i < rowNames.length; i++) {
    const row = dp.findOne(n => n.name === rowNames[i]);
    if (row) row.visible = false;
  }
}

// ─── 어노테이션 배치 ─────────────────────────────────────────────────────
const annData = ${JSON.stringify(
    annotations.map((ann, i) => ({
      index: i,
      label: ann.label,
      figmaPos: rects[ann.label]?.figma || null,
    })).filter(a => a.figmaPos)
  )};

const annoInstances = frame.findAll(n => n.type === 'INSTANCE' && n.name === 'Annotation_number');

for (const ann of annData) {
  const inst = annoInstances[ann.index];
  if (!inst || !ann.figmaPos) continue;
  inst.x = ann.figmaPos.x - inst.width / 2;
  inst.y = ann.figmaPos.y - inst.height / 2;
  const numTexts = inst.findAll(n => n.type === 'TEXT');
  if (numTexts.length > 0) {
    try {
      await figma.loadFontAsync(numTexts[0].fontName);
      numTexts[0].characters = ann.label;
    } catch (e) {}
  }
  inst.visible = true;
}

// 사용하지 않는 annotation 숨김
for (let i = annData.length; i < annoInstances.length; i++) {
  annoInstances[i].visible = false;
}

return { status: '${id} built', frameId: frame.id, frameX: frame.x, frameY: frame.y };
`.trim();
}

// CLI로 직접 실행 시 테스트 출력
if (require.main === module) {
  const testScreen = {
    id: 'HOME01',
    name: '홈 화면 (도메인 사용자)',
    path: '로그인 → 홈 화면 (도메인 사용자)',
    _targetPage: '(1.0v)Desktop',
    _templatePage: 'v0.7',
    annotations: [{ label: 'A' }, { label: '1' }],
    description: { '00': 'Desktop Home 설명', '01': 'App Launcher 설명' },
  };
  const testRects = {
    A:   { figma: { x: 42, y: 133 } },
    '1': { figma: { x: 331, y: 120 } },
  };
  console.log(generateBuildScript(testScreen, 'test-hash', testRects, '4:1449'));
}

module.exports = { generateBuildScript };
