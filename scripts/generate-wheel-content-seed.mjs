import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const categoriesPath = path.join(
  rootDir,
  "src/shared/config/wheel-categories.json"
);
const tasksPath = path.join(rootDir, "src/shared/config/wheel-tasks.json");
const choiceOptionsPath = path.join(
  rootDir,
  "src/shared/config/wheel-choice-options.json"
);
const outputPath = path.join(rootDir, "supabase/seed_wheel_content.sql");

const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
const tasksSource = JSON.parse(fs.readFileSync(tasksPath, "utf8"));
const choiceOptionsByTaskKey = JSON.parse(
  fs.readFileSync(choiceOptionsPath, "utf8")
);
const tasks = tasksSource.map((task) => {
  const choiceOptions = choiceOptionsByTaskKey[task.taskKey];

  if (!choiceOptions) {
    return task;
  }

  return {
    ...task,
    responseMode: "choice",
    choiceOptions,
  };
});

const expectedInteractionTotals = {
  confirm: 76,
  text_input: 68,
  timer: 18,
  async_task: 18,
};

const categoriesWithoutTimer = new Set([
  "kind-speech",
  "fact-check",
  "joyful-dilemma",
  "similarity-test",
  "genius-or-not",
  "in-their-style",
]);

const categoriesWithoutDeferred = new Set([
  "fact-check",
  "joyful-dilemma",
  "similarity-test",
  "genius-or-not",
  "in-their-style",
]);

const supportedResponseModes = new Set(["confirm", "text_input", "choice"]);
const supportedExecutionModes = new Set(["instant", "timed", "deferred"]);
const supportedPhysicalContactLevels = new Set([
  "none",
  "handshake",
  "high_five",
  "hug",
]);

const baseXpByDifficulty = {
  gentle: 12,
  warm: 18,
  bold: 26,
};

const promiseXpByExecutionMode = {
  instant: {
    gentle: 0,
    warm: 0,
    bold: 0,
  },
  timed: {
    gentle: 0,
    warm: 0,
    bold: 0,
  },
  deferred: {
    gentle: 6,
    warm: 8,
    bold: 10,
  },
};

const skipPenaltyXpByDifficulty = {
  gentle: -6,
  warm: -6,
  bold: -8,
};

const timeoutPenaltyXpByDifficulty = {
  gentle: -4,
  warm: -4,
  bold: -6,
};

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function deriveInteractionType(task) {
  if (task.executionMode === "timed") {
    return "timer";
  }

  if (task.executionMode === "deferred") {
    return "async_task";
  }

  if (task.responseMode === "text_input") {
    return "text_input";
  }

  return "confirm";
}

function validateContent() {
  assert(Array.isArray(categories), "Categories payload must be an array.");
  assert(Array.isArray(tasks), "Tasks payload must be an array.");
  assert(categories.length === 9, `Expected 9 categories, got ${categories.length}.`);
  assert(tasks.length === 180, `Expected 180 tasks, got ${tasks.length}.`);

  const categorySlugs = new Set();
  for (const category of categories) {
    assert(category.slug, "Every category must have a slug.");
    assert(!categorySlugs.has(category.slug), `Duplicate category slug: ${category.slug}`);
    categorySlugs.add(category.slug);
  }

  const taskKeys = new Set();
  for (const task of tasks) {
    assert(task.taskKey, "Every task must have a taskKey.");
    assert(!taskKeys.has(task.taskKey), `Duplicate taskKey: ${task.taskKey}`);
    taskKeys.add(task.taskKey);
    assert(categorySlugs.has(task.categorySlug), `Unknown categorySlug: ${task.categorySlug}`);
    assert(
      Object.hasOwn(expectedInteractionTotals, task.interactionType),
      `Unknown interactionType for ${task.taskKey}: ${task.interactionType}`
    );
    assert(
      Object.hasOwn(baseXpByDifficulty, task.difficulty),
      `Unknown difficulty for ${task.taskKey}: ${task.difficulty}`
    );
    assert(
      supportedResponseModes.has(task.responseMode),
      `Unknown responseMode for ${task.taskKey}: ${task.responseMode}`
    );
    assert(
      supportedExecutionModes.has(task.executionMode),
      `Unknown executionMode for ${task.taskKey}: ${task.executionMode}`
    );
    assert(
      typeof task.allowPromise === "boolean",
      `Task ${task.taskKey} must declare allowPromise explicitly.`
    );
    assert(
      typeof task.allowEarlyCompletion === "boolean",
      `Task ${task.taskKey} must declare allowEarlyCompletion explicitly.`
    );
    assert(
      typeof task.feedSafe === "boolean",
      `Task ${task.taskKey} must declare feedSafe explicitly.`
    );
    assert(
      typeof task.requiresOtherGuest === "boolean",
      `Task ${task.taskKey} must declare requiresOtherGuest explicitly.`
    );
    assert(
      typeof task.phoneAllowed === "boolean",
      `Task ${task.taskKey} must declare phoneAllowed explicitly.`
    );
    assert(
      typeof task.publicSpeaking === "boolean",
      `Task ${task.taskKey} must declare publicSpeaking explicitly.`
    );
    assert(
      typeof task.coupleCentric === "boolean",
      `Task ${task.taskKey} must declare coupleCentric explicitly.`
    );
    assert(
      supportedPhysicalContactLevels.has(task.physicalContactLevel),
      `Task ${task.taskKey} has invalid physicalContactLevel: ${task.physicalContactLevel}`
    );
    assert(
      task.interactionType === deriveInteractionType(task),
      `Task ${task.taskKey} has inconsistent interactionType.`
    );
    assert(
      task.allowPromise === (task.executionMode === "deferred"),
      `Task ${task.taskKey} has invalid allowPromise for executionMode ${task.executionMode}.`
    );
    assert(
      task.allowEarlyCompletion === (task.executionMode === "timed"),
      `Task ${task.taskKey} has invalid allowEarlyCompletion for executionMode ${task.executionMode}.`
    );

    if (task.executionMode === "timed") {
      assert(
        typeof task.timerSeconds === "number" && task.timerSeconds > 0,
        `Timer task ${task.taskKey} must include a positive timerSeconds value.`
      );
    } else {
      assert(
        typeof task.timerSeconds === "undefined",
        `Non-timed task ${task.taskKey} must not include timerSeconds.`
      );
    }

    if (task.responseMode === "text_input") {
      assert(
        task.feedSafe === true,
        `Text-input task ${task.taskKey} must be feed-safe by design.`
      );
    }

    if (task.responseMode === "choice") {
      assert(
        Array.isArray(task.choiceOptions) && task.choiceOptions.length >= 2,
        `Choice task ${task.taskKey} must include at least two choice options.`
      );

      for (const [choiceIndex, choiceOption] of task.choiceOptions.entries()) {
        assert(
          typeof choiceOption?.uk === "string" && choiceOption.uk.trim().length > 0,
          `Choice option ${choiceIndex + 1} for ${task.taskKey} must include uk text.`
        );
        assert(
          typeof choiceOption?.en === "string" && choiceOption.en.trim().length > 0,
          `Choice option ${choiceIndex + 1} for ${task.taskKey} must include en text.`
        );
      }
    }
  }

  const interactionTotals = {
    confirm: 0,
    text_input: 0,
    timer: 0,
    async_task: 0,
  };

  for (const category of categories) {
    const categoryTasks = tasks.filter(
      (task) => task.categorySlug === category.slug
    );
    assert(
      categoryTasks.length === 20,
      `Category ${category.slug} must have 20 tasks, got ${categoryTasks.length}.`
    );

    for (const task of categoryTasks) {
      interactionTotals[task.interactionType] += 1;
    }

    if (categoriesWithoutTimer.has(category.slug)) {
      assert(
        categoryTasks.every((task) => task.executionMode !== "timed"),
        `Category ${category.slug} must not contain timed tasks.`
      );
    }

    if (categoriesWithoutDeferred.has(category.slug)) {
      assert(
        categoryTasks.every((task) => task.executionMode !== "deferred"),
        `Category ${category.slug} must not contain deferred tasks.`
      );
    }
  }

  for (const [interactionType, expectedCount] of Object.entries(
    expectedInteractionTotals
  )) {
    assert(
      interactionTotals[interactionType] === expectedCount,
      `Expected ${expectedCount} ${interactionType} tasks globally, got ${interactionTotals[interactionType]}.`
    );
  }
}

function getTaskXpConfig(task) {
  return {
    baseXp: baseXpByDifficulty[task.difficulty],
    promiseXp: task.allowPromise
      ? promiseXpByExecutionMode[task.executionMode][task.difficulty]
      : 0,
    skipPenaltyXp: skipPenaltyXpByDifficulty[task.difficulty],
    timeoutPenaltyXp: timeoutPenaltyXpByDifficulty[task.difficulty],
  };
}

function buildCategorySeedSql() {
  const valueRows = categories.map((category, index) => `  (
    ${sqlString(category.slug)},
    ${index + 1},
    1,
    ${sqlJson(category.title)},
    ${sqlJson(category.description)},
    true
  )`);

  const activeCategorySlugs = categories
    .map((category) => sqlString(category.slug))
    .join(", ");

  return `with stale_categories as (
  select
    id,
    row_number() over (order by slug asc) as stale_rank
  from public.wheel_categories
  where slug not in (${activeCategorySlugs})
)
update public.wheel_categories as categories
set
  is_active = false,
  sort_order = 1000 + stale_categories.stale_rank
from stale_categories
where categories.id = stale_categories.id;

insert into public.wheel_categories (
  slug,
  sort_order,
  weight,
  title_i18n,
  description_i18n,
  is_active
)
values
${valueRows.join(",\n")}
on conflict (slug) do update
set
  sort_order = excluded.sort_order,
  weight = excluded.weight,
  title_i18n = excluded.title_i18n,
  description_i18n = excluded.description_i18n,
  is_active = excluded.is_active;

update public.wheel_categories
set is_active = false
where slug not in (${activeCategorySlugs});
`;
}

function buildTaskSeedSql() {
  const valueRows = tasks.map((task) => {
    const xp = getTaskXpConfig(task);
    const details = task.details ?? { uk: "", en: "" };
    const timerSeconds =
      typeof task.timerSeconds === "number" ? String(task.timerSeconds) : "null";

    return `  (
    (select id from public.wheel_categories where slug = ${sqlString(task.categorySlug)}),
    ${sqlString(task.taskKey)},
    ${sqlString(task.interactionType)},
    ${sqlString(task.responseMode)},
    ${sqlString(task.executionMode)},
    ${task.allowPromise},
    ${task.allowEarlyCompletion},
    ${sqlString(task.difficulty)},
    ${sqlJson(task.prompt)},
    ${sqlJson(details)},
    ${xp.baseXp},
    ${xp.promiseXp},
    ${xp.skipPenaltyXp},
    ${xp.timeoutPenaltyXp},
    ${timerSeconds},
    ${task.feedSafe},
    ${task.requiresOtherGuest},
    ${task.phoneAllowed},
    ${task.publicSpeaking},
    ${sqlString(task.physicalContactLevel)},
    ${task.coupleCentric},
    true,
      ${sqlJson({
        categorySlug: task.categorySlug,
        source: "wheel-content-seed",
        taskContractVersion: 4,
        ...(task.responseMode === "choice"
          ? { choiceOptions: task.choiceOptions }
          : {}),
      })}
  )`;
  });

  return `insert into public.wheel_tasks (
  category_id,
  task_key,
  interaction_type,
  response_mode,
  execution_mode,
  allow_promise,
  allow_early_completion,
  difficulty,
  prompt_i18n,
  details_i18n,
  base_xp,
  promise_xp,
  skip_penalty_xp,
  timeout_penalty_xp,
  timer_seconds,
  feed_safe,
  requires_other_guest,
  phone_allowed,
  public_speaking,
  physical_contact_level,
  couple_centric,
  is_active,
  metadata
)
values
${valueRows.join(",\n")}
on conflict (task_key) do update
  set
  category_id = excluded.category_id,
  interaction_type = excluded.interaction_type,
  response_mode = excluded.response_mode,
  execution_mode = excluded.execution_mode,
  allow_promise = excluded.allow_promise,
  allow_early_completion = excluded.allow_early_completion,
  difficulty = excluded.difficulty,
  prompt_i18n = excluded.prompt_i18n,
  details_i18n = excluded.details_i18n,
  base_xp = excluded.base_xp,
  promise_xp = excluded.promise_xp,
  skip_penalty_xp = excluded.skip_penalty_xp,
  timeout_penalty_xp = excluded.timeout_penalty_xp,
  timer_seconds = excluded.timer_seconds,
  feed_safe = excluded.feed_safe,
  requires_other_guest = excluded.requires_other_guest,
  phone_allowed = excluded.phone_allowed,
  public_speaking = excluded.public_speaking,
  physical_contact_level = excluded.physical_contact_level,
  couple_centric = excluded.couple_centric,
  is_active = excluded.is_active,
  metadata = excluded.metadata;

update public.wheel_tasks
set
  is_active = false,
  metadata = jsonb_set(
    coalesce(metadata, '{}'::jsonb),
    '{deactivatedBySeedVersion}',
    '4'::jsonb,
    true
  )
where
  coalesce(metadata->>'source', 'wheel-content-seed') = 'wheel-content-seed'
  and task_key not in (${tasks.map((task) => sqlString(task.taskKey)).join(", ")});
`;
}

validateContent();

const sql = `-- Generated by scripts/generate-wheel-content-seed.mjs
-- Do not edit manually. Update the JSON sources instead.

${buildCategorySeedSql()}

${buildTaskSeedSql()}
`;

fs.writeFileSync(outputPath, sql);

console.log(`Generated ${outputPath}`);
console.log(`Categories: ${categories.length}`);
console.log(`Tasks: ${tasks.length}`);
