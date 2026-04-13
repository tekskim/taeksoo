#!/usr/bin/env node
/**
 * Daily Report — My Daily 자동 생성/업데이트 (Notion 비공식 API)
 *
 * GitHub Actions 실행 버전 — NOTION_TOKEN 환경변수 필수
 *
 * Phase 1: 오늘 항목 존재 확인 → 없으면 My Daily 생성
 * Phase 2: 어제 My Daily의 "오늘 업무 계획" + ThakiCloud 팀스페이스 작성/수정 문서 수집
 * Phase 4: My Daily 업데이트 (지난 업무 내용 채움, 오늘 업무 계획은 수동 입력)
 */

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// ─── 설정 ────────────────────────────────────────────────────────────────────

// --date-override=YYYY-MM-DD 로 "오늘" 날짜를 강제 지정 (테스트용)
const dateOverrideArg = process.argv.find((a) => a.startsWith("--date-override="));
const DATE_OVERRIDE = dateOverrideArg ? dateOverrideArg.split("=")[1] : null;

const CONFIG = {
  baseURL: "https://www.notion.so/api/v3",
  token: process.env.NOTION_TOKEN,
  spaceId: "c429eddc-34e6-8175-9f86-0003edff3a7a",
  userId: "278d872b-594c-81b9-bed4-0002e6878c17",

  myDaily: {
    collectionId: "2789eddc-34e6-80b8-ba09-000bddce03bd",
    viewId: "2789eddc-34e6-804f-8267-000c87d377a1",
    props: {
      title: "title",
      before: "<V~i",   // 지난 업무 내용
      todo: "SpbN",     // 오늘 업무 계획
      date: "dbSd",     // 날짜
      status: ">aYT",   // 상태
      person: "}^kw",   // 사람
    },
  },

  workProgress: {
    collectionId: "2559eddc-34e6-8183-b550-000b0669ce43",
    viewId: "2559eddc-34e6-8150-bdd6-000cd16e09d6",
    props: {
      title: "title",
      before: "kJx[",   // 지난 업무 내용
      todo: "?D[E",     // 오늘 업무 계획
      date: "F=Hs",     // 날짜
      person: "Mmm@",   // 사람
      scope: ";]:|",    // 작업 범위
    },
  },

  dryRun: process.argv.includes("--dry-run"),
};

// ─── 유틸리티 ────────────────────────────────────────────────────────────────

function log(msg) {
  const ts = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  console.log(`[${ts}] ${msg}`);
}

/** KST 기준 오늘/어제 날짜 계산. 월요일이면 어제 = 지난 금요일 */
function getDates() {
  const now = DATE_OVERRIDE ? new Date(`${DATE_OVERRIDE}T09:00:00+09:00`) : new Date();
  const kst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const todayDate = new Date(kst);
  const yesterdayDate = new Date(kst);
  const dayOfWeek = kst.getDay(); // 0=Sun, 1=Mon ... 6=Sat

  if (dayOfWeek === 1) {
    yesterdayDate.setDate(yesterdayDate.getDate() - 3); // 월 → 금
  } else if (dayOfWeek === 0) {
    yesterdayDate.setDate(yesterdayDate.getDate() - 2); // 일 → 금
  } else {
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  }

  return { today: fmt(todayDate), yesterday: fmt(yesterdayDate) };
}

function createApi() {
  return axios.create({
    baseURL: CONFIG.baseURL,
    headers: {
      "Content-Type": "application/json",
      Cookie: `token_v2=${CONFIG.token}`,
    },
    timeout: 30000,
  });
}

function textProp(text) {
  if (!text || text.trim() === "") return [[""]];
  return [[text]];
}

function dateProp(dateStr) {
  return [["‣", [["d", { type: "date", start_date: dateStr }]]]];
}

function personProp(userIds) {
  if (!userIds || userIds.length === 0) return null;
  return userIds.map((uid) => ["‣", [["u", uid]]]);
}

function extractText(richTextArr) {
  if (!richTextArr) return "";
  return richTextArr.map((chunk) => (Array.isArray(chunk) ? chunk[0] || "" : "")).join("");
}

function extractPersonIds(personPropVal) {
  if (!personPropVal) return [];
  return personPropVal
    .filter((chunk) => Array.isArray(chunk) && chunk[1])
    .flatMap((chunk) =>
      chunk[1]
        .filter((ann) => Array.isArray(ann) && ann[0] === "u")
        .map((ann) => ann[1])
    );
}

// ─── Notion API 함수 ─────────────────────────────────────────────────────────

async function queryCollectionForDate(api, collectionId, viewId, datePropId, dateStr) {
  const res = await api.post("/queryCollection", {
    source: { type: "collection", id: collectionId, spaceId: CONFIG.spaceId },
    collectionView: { id: viewId, spaceId: CONFIG.spaceId },
    loader: {
      reducers: { results: { type: "results", limit: 10 } },
      sort: [{ property: datePropId, direction: "descending" }],
      filter: {
        operator: "and",
        filters: [
          {
            filter: {
              value: { type: "exact", value: { type: "date", start_date: dateStr } },
              operator: "date_is",
            },
            property: datePropId,
          },
        ],
      },
      searchQuery: "",
      userTimeZone: "Asia/Seoul",
    },
  });

  const blockIds = res.data?.result?.reducerResults?.results?.blockIds || [];
  const blocks = res.data?.recordMap?.block || {};
  const results = [];

  for (const blockId of blockIds) {
    const blockFromMap = blocks[blockId]?.value;
    const hasProps = blockFromMap && Object.keys(blockFromMap.properties || {}).length > 0;

    if (hasProps) {
      results.push({ ...blockFromMap, id: blockId });
    } else {
      try {
        const fetched = await getBlockData(api, blockId);
        if (fetched) results.push({ ...fetched, id: blockId });
      } catch (_) {}
    }
  }
  return results;
}

async function getBlockData(api, blockId) {
  const res = await api.post("/getRecordValues", {
    requests: [{ table: "block", id: blockId }],
  });
  return res.data?.results?.[0]?.value;
}

/**
 * ThakiCloud 팀스페이스에서 어제 작성/수정한 문서 수집
 * 전략: getRecentPageVisits → 어제 방문 페이지 추출 → getRecordValues로 실제 편집 여부 확인
 */
async function getThakiCloudActivity(api, yesterdayStr) {
  try {
    const visitsRes = await api.post("/getRecentPageVisits", {
      limit: 100,
      userId: CONFIG.userId,
      spaceId: CONFIG.spaceId,
    });

    const pages = visitsRes.data?.pages || [];
    const pad = (n) => String(n).padStart(2, "0");
    const toKstDate = (ms) => {
      const kst = new Date(new Date(ms).toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      return `${kst.getFullYear()}-${pad(kst.getMonth() + 1)}-${pad(kst.getDate())}`;
    };

    const seenIds = new Set();
    const yesterdayPageIds = [];
    for (const p of pages) {
      if (!p.id || seenIds.has(p.id)) continue;
      if (toKstDate(p.visitedAt) === yesterdayStr) {
        seenIds.add(p.id);
        yesterdayPageIds.push(p.id);
      }
    }

    if (yesterdayPageIds.length === 0) {
      log("  ℹ️  어제 방문한 페이지 없음");
      return [];
    }

    log(`  🔍 어제 방문 페이지 ${yesterdayPageIds.length}개 확인 중...`);

    const recordRes = await api.post("/getRecordValues", {
      requests: yesterdayPageIds.map((id) => ({ table: "block", id })),
    });

    const results = recordRes.data?.results || [];
    const activity = [];
    const parentIds = new Set();

    for (const r of results) {
      const v = r?.value;
      if (!v || v.type !== "page" || v.alive === false) continue;

      const title = extractText(v.properties?.title).trim();
      if (!title || /^\d{4}-\d{2}-\d{2}$/.test(title) || title === "-") continue;

      const parentId = v.parent_id || "";
      if (
        parentId === CONFIG.myDaily.collectionId ||
        parentId === CONFIG.workProgress.collectionId
      )
        continue;

      const crDate = toKstDate(v.created_time || 0);
      const leDate = toKstDate(v.last_edited_time || 0);
      const crBy = v.created_by_id || "";
      const leBy = v.last_edited_by_id || "";

      let action = null;
      if (crBy === CONFIG.userId && crDate === yesterdayStr) {
        action = "작성";
      } else if (leBy === CONFIG.userId && leDate === yesterdayStr) {
        action = "수정";
      }

      if (action) {
        const timestamp = action === "작성" ? (v.created_time || 0) : (v.last_edited_time || 0);
        const parentTable = v.parent_table || "";
        activity.push({ id: v.id, title, action, parentId, parentTable, timestamp });
        if (parentId && parentTable === "block") {
          parentIds.add(parentId);
        }
      }
    }

    if (parentIds.size > 0) {
      try {
        const parentRes = await api.post("/getRecordValues", {
          requests: [...parentIds].map((id) => ({ table: "block", id })),
        });
        const parentMap = {};
        for (const r of parentRes.data?.results || []) {
          const v = r?.value;
          if (!v?.id) continue;
          parentMap[v.id] = extractText(v.properties?.title).trim();
        }
        for (const item of activity) {
          if (parentMap[item.parentId]) {
            item.parentTitle = parentMap[item.parentId];
          }
        }
      } catch (_) {}
    }

    // 자식 페이지 생성 부작용으로 인한 조상 "수정" 항목 제거 (2분 윈도우)
    const BEFORE_CHILD_WINDOW_MS = 2 * 60 * 1000;
    const createdItems = activity.filter((d) => d.action === "작성");

    const filtered = activity.filter((d) => {
      if (d.action !== "수정") return true;
      const causedByChildCreation = createdItems.some(
        (c) => c.timestamp > d.timestamp && c.timestamp - d.timestamp <= BEFORE_CHILD_WINDOW_MS
      );
      return !causedByChildCreation;
    });

    return filtered;
  } catch (err) {
    log(`⚠️  ThakiCloud 활동 수집 실패 (무시): ${err.message}`);
    return [];
  }
}

/** My Daily에 오늘 항목 생성 */
async function createMyDailyRecord(api, today, fields) {
  const newPageId = uuidv4();
  const props = (myDaily) => ({
    [myDaily.props.title]: textProp(today),
    [myDaily.props.date]: dateProp(today),
    [myDaily.props.status]: [["시작 전"]],
    [myDaily.props.before]: fields.beforeRichText || textProp(fields.before),
    [myDaily.props.todo]: textProp(fields.todo),
    ...(fields.personIds?.length
      ? { [myDaily.props.person]: personProp(fields.personIds) }
      : {}),
  });

  if (CONFIG.dryRun) {
    log(`🔍 [DRY RUN] My Daily 생성: ${today}`);
    return { id: "dry-run", url: "https://notion.so/dry-run" };
  }

  const now = Date.now();
  await api.post("/submitTransaction", {
    requestId: uuidv4(),
    transactions: [
      {
        id: uuidv4(),
        spaceId: CONFIG.spaceId,
        operations: [
          {
            pointer: { table: "block", id: newPageId, spaceId: CONFIG.spaceId },
            command: "set",
            path: [],
            args: {
              type: "page",
              id: newPageId,
              parent_id: CONFIG.myDaily.collectionId,
              parent_table: "collection",
              alive: true,
              version: 1,
              created_time: now,
              last_edited_time: now,
              created_by_table: "notion_user",
              created_by_id: CONFIG.userId,
              last_edited_by_table: "notion_user",
              last_edited_by_id: CONFIG.userId,
            },
          },
          {
            pointer: { table: "block", id: newPageId, spaceId: CONFIG.spaceId },
            command: "update",
            path: ["properties"],
            args: props(CONFIG.myDaily),
          },
        ],
      },
    ],
  });

  return { id: newPageId, url: `https://www.notion.so/${newPageId.replace(/-/g, "")}` };
}

/** 기존 항목 업데이트 — 지난 업무 내용만 업데이트, 오늘 업무 계획은 수동 입력 보존 */
async function updateRecord(api, pageId, dbProps, fields) {
  const properties = {
    [dbProps.before]: fields.beforeRichText || textProp(fields.before),
  };
  if (fields.personIds?.length) {
    properties[dbProps.person] = personProp(fields.personIds);
  }

  if (CONFIG.dryRun) {
    log(`🔍 [DRY RUN] 업데이트: ${pageId}`);
    return;
  }

  await api.post("/submitTransaction", {
    requestId: uuidv4(),
    transactions: [
      {
        id: uuidv4(),
        spaceId: CONFIG.spaceId,
        operations: [
          {
            pointer: { table: "block", id: pageId, spaceId: CONFIG.spaceId },
            command: "update",
            path: ["properties"],
            args: properties,
          },
        ],
      },
    ],
  });
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

async function main() {
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log("🌅 Daily Report 자동 생성 시작");
  if (CONFIG.dryRun) log("🔍 DRY RUN 모드");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (!DATE_OVERRIDE) {
    const now = new Date();
    const kst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const dayOfWeek = kst.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      log(`⏭️  오늘은 주말(${["일","월","화","수","목","금","토"][dayOfWeek]}요일)이라 건너뜁니다.`);
      process.exit(0);
    }
  } else {
    log(`🧪 날짜 오버라이드 모드: 오늘 = ${DATE_OVERRIDE}`);
  }

  if (!CONFIG.token) {
    log("❌ NOTION_TOKEN 환경변수 없음 → GitHub Secrets에 NOTION_TOKEN 등록 필요");
    process.exit(1);
  }

  const api = createApi();
  const { today, yesterday } = getDates();
  log(`📅 오늘: ${today}  /  어제(기준): ${yesterday}`);

  try {
    log("\n📂 Phase 2: 어제 활동 수집");

    log("  🔍 어제 My Daily 조회...");
    const yesterdayMyDaily = await queryCollectionForDate(
      api,
      CONFIG.myDaily.collectionId,
      CONFIG.myDaily.viewId,
      CONFIG.myDaily.props.date,
      yesterday
    );

    let yesterdayTodo = "";
    let personIds = [CONFIG.userId];

    if (yesterdayMyDaily.length > 0) {
      const yProps = yesterdayMyDaily[0].properties || {};
      yesterdayTodo = extractText(yProps[CONFIG.myDaily.props.todo]);
      const yPersonIds = extractPersonIds(yProps[CONFIG.myDaily.props.person]);
      if (yPersonIds.length > 0) personIds = yPersonIds;
      log(`  ✅ 어제 "오늘 업무 계획" 발견 (${yesterdayTodo.length}자)`);
    } else {
      log(`  ⚠️  어제 My Daily 항목 없음 → 건너뜀`);
    }

    log("  🔍 ThakiCloud 팀스페이스 작성/수정 문서 수집...");
    const thakiActivity = await getThakiCloudActivity(api, yesterday);
    log(`  📄 작성/수정 문서: ${thakiActivity.length}개`);
    if (thakiActivity.length > 0) {
      for (const item of thakiActivity) {
        const parentInfo = item.parentTitle ? ` (${item.parentTitle})` : "";
        log(`    - [${item.action}] ${item.title}${parentInfo}`);
      }
    }

    // 지난 업무 내용 조합
    let beforeContent = yesterdayTodo || "";
    const beforeRichText = [];
    if (yesterdayTodo) {
      beforeRichText.push([yesterdayTodo]);
    }

    if (thakiActivity.length > 0) {
      const created = thakiActivity.filter((d) => d.action === "작성");
      const createdTitles = new Set(created.map((d) => d.title));
      // 작성과 수정이 동시에 잡힌 문서는 작성으로 통합
      const edited = thakiActivity.filter((d) => d.action === "수정" && !createdTitles.has(d.title));
      const docItems = [
        ...created.map((d) => ({ ...d, label: "문서 작성" })),
        ...edited.map((d) => ({ ...d, label: "문서 수정" })),
      ];

      const lines = docItems.map((d) => {
        const ctx = d.parentTitle ? ` (${d.parentTitle})` : "";
        return `- ${d.label}: ${d.title}${ctx}`;
      });
      const docsSection = `[기타]\n${lines.join("\n")}`;
      beforeContent = beforeContent
        ? `${beforeContent}\n\n${docsSection}`
        : docsSection;

      // Notion 저장용 rich text (문서 제목에 하이퍼링크 포함)
      if (beforeRichText.length > 0) beforeRichText.push(["\n\n"]);
      beforeRichText.push(["[기타]\n"]);
      for (let i = 0; i < docItems.length; i++) {
        const d = docItems[i];
        const ctx = d.parentTitle ? ` (${d.parentTitle})` : "";
        const url = `https://www.notion.so/${d.id.replace(/-/g, "")}`;
        const suffix = ctx + (i < docItems.length - 1 ? "\n" : "");
        beforeRichText.push([`- ${d.label}: `]);
        beforeRichText.push([d.title, [["a", url]]]);
        if (suffix) beforeRichText.push([suffix]);
      }
    }

    if (beforeRichText.length === 0) beforeRichText.push([""]);

    const todoContent = "";

    log(`\n📝 지난 업무 내용 (${beforeContent.length}자):`);
    if (beforeContent) log(`   ${beforeContent.slice(0, 100)}${beforeContent.length > 100 ? "..." : ""}`);
    log(`📝 오늘 업무 계획: 수동 입력 예정 (빈칸 유지)`);

    const fields = { before: beforeContent, beforeRichText, todo: todoContent, personIds };

    log("\n📂 Phase 1+4: My Daily 처리");
    const todayMyDaily = await queryCollectionForDate(
      api,
      CONFIG.myDaily.collectionId,
      CONFIG.myDaily.viewId,
      CONFIG.myDaily.props.date,
      today
    );

    let myDailyUrl = "";
    if (todayMyDaily.length > 0) {
      log(`  ⚠️  오늘 항목 이미 존재 (${todayMyDaily[0].id}) → 업데이트`);
      await updateRecord(api, todayMyDaily[0].id, CONFIG.myDaily.props, fields);
      myDailyUrl = `https://www.notion.so/${todayMyDaily[0].id.replace(/-/g, "")}`;
      log("  ✅ My Daily 업데이트 완료");
    } else {
      log("  📝 오늘 항목 없음 → 새로 생성");
      const result = await createMyDailyRecord(api, today, fields);
      myDailyUrl = result.url;
      log(`  ✅ My Daily 생성 완료`);
    }

    log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    log("✅ 업데이트 완료!");
    log(`📝 My Daily: ${myDailyUrl}`);
    log("오늘도 좋은 하루 되세요! 💪");
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (err) {
    log(`❌ 오류: ${err.message}`);
    if (err.response) {
      log(`   HTTP ${err.response.status}: ${JSON.stringify(err.response.data).slice(0, 300)}`);
    }
    process.exit(1);
  }
}

main();
