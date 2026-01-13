const CONFIG = {
  app: {
    statementsToShow: 5,
    loadingSeconds: 4,
  },
  copy: {
    heroHeadline: "Discover your<br/>marketing destiny!",
    heroSubline: "The oracle already knows your type. Do you?",
    heroCta: "FIND OUT",
    resultHeadline: "Your marketing type is...",
    resultCta: "Grab your surprise!",
  },
  types: [
    {
      id: "TYPE_GROWTH_GREMLIN",
      name: "CAPY ON A MISSON",
      description: "You move fast, test early, and learn on the go.",
      bridgeLine: "The trick is keeping that momentum without burning budget. Sovendus can help you with that. Grab your gift and let's chat.",
      image: "capy on a misson.png",
    },
    {
      id: "TYPE_KPI_MONK",
      name: "THE KPI MONK",
      description: "Clear goals. Clean numbers.\nIf it doesn’t perform, it doesn’t matter.",
      bridgeLine: "You care about results you can actually prove. Sovendus can help you with that! Grab your gift and let's chat!",
      image: "kpi monk.png",
    },
    {
      id: "TYPE_BRAND_SPARK",
      name: "THE BRAND SPARK",
      description: "Strong ideas. Good instincts.\nNot everything needs a spreadsheet.",
      bridgeLine: "The challenge is turning great brand moments into real impact. Sovendus can help you with that! Grab your gift and let's chat!",
      image: "brand spark.png",
    },
  ],
  statements: [
    {
      id: "S1",
      text: "Speed matters more than perfection.",
      dimensionOnYes: "momentum",
      dimensionOnNo: "precision",
    },
    {
      id: "S2",
      text: "I’d rather launch and learn than wait and plan.",
      dimensionOnYes: "experiment",
      dimensionOnNo: "proof",
    },
    {
      id: "S3",
      text: "Marketing should drive revenue, not just attention.",
      dimensionOnYes: "business",
      dimensionOnNo: "buzz",
    },
    {
      id: "S4",
      text: "I trust KPIs more than gut feeling.",
      dimensionOnYes: "precision",
      dimensionOnNo: "creativity",
    },
    {
      id: "S5",
      text: "A strong idea can outperform a perfect setup.",
      dimensionOnYes: "creativity",
      dimensionOnNo: "structure",
    },
  ],
};

const appRoot = document.getElementById("app");
const statements = CONFIG.statements.slice(0, CONFIG.app.statementsToShow);
const dimensions = {
  momentum: 0,
  precision: 0,
  experiment: 0,
  proof: 0,
  business: 0,
  buzz: 0,
  creativity: 0,
  structure: 0,
};
let state = "HERO";
let statementIndex = 0;
let loadingTimer = null;
let loadingLineTimer = null;
const loadingLines = [
  "Aligning the stars.. ⭐️",
  "Consulting the oracle.. 🔮",
  "Revealing your marketing type.. 👀",
];
const loadingLineDurations = [800, 800, 800];
const loadingFinalPauseMs = 1000;
const UI_SCALE_MIN = 0.6;
const UI_SCALE_MAX = 0.85;

const screenFactory = {
  HERO: () => {
    const wrapper = document.createElement("div");
    wrapper.className = "screen hero";
    wrapper.innerHTML = `
      <div class="hero-oracle">
        <div class="noise" aria-hidden="true"></div>
        <div class="hero-start">
          <section class="oracle-card" role="region" aria-label="Marketing Oracle start screen">
            <div class="oracle-content">
              <div class="orbStage" aria-hidden="true">
                <div class="orbGlow"></div>
                <div class="orb-ground-shadow"></div>
                <img class="orbFloat" src="Bubble.png" alt="" />
              </div>

              <h1 class="oracle-title">${CONFIG.copy.heroHeadline}</h1>
              <p class="oracle-subline">${CONFIG.copy.heroSubline}</p>
            </div>
          </section>

          <button class="start-button" type="button" data-action="start">
            ${CONFIG.copy.heroCta}
          </button>
        </div>
      </div>
    `;
    return wrapper;
  },
  STATEMENT: () => {
    const wrapper = document.createElement("div");
    wrapper.className = "screen statement";
    const statement = statements[statementIndex];
    wrapper.innerHTML = `
      <div class="statement-stack">
        <div class="panel card" data-statement="${statement.id}">
          <p class="eyebrow">Statement ${statementIndex + 1} / ${statements.length}</p>
          <h2>${statement.text}</h2>
        </div>
        <div class="choice-bar">
          <button class="choice nope" data-choice="nope" aria-label="Nope">
            <span>❌</span>
          </button>
          <button class="choice match" data-choice="match" aria-label="Match">
            <span>💚</span>
          </button>
        </div>
      </div>
    `;
    return wrapper;
  },
  LOADING: () => {
    const wrapper = document.createElement("div");
    wrapper.className = "screen loading";
    wrapper.innerHTML = `
      <div class="panel">
        <p class="loading-headline">${CONFIG.copy.resultHeadline}</p>
        <p class="loading-subline" data-loading-line></p>
      </div>
    `;
    return wrapper;
  },
  RESULT: () => {
    const winner = computeResult();
    const wrapper = document.createElement("div");
    wrapper.className = "screen result";
    wrapper.innerHTML = `
      <div class="result-stack">
        <div class="panel">
        <div class="result-type-stage">
          <div class="result-type-shadow" aria-hidden="true"></div>
          <img class="result-type-image" src="${winner.image}" alt="${winner.name}" />
        </div>
        <h2><span class="accent">${winner.name}</span></h2>
        <p class="description">${winner.description.replace(/\n/g, "<br>")}</p>
        <p class="description">${winner.bridgeLine}</p>
      </div>
        <div class="result-actions">
          <button class="restart-button" data-action="reset">RESTART</button>
        </div>
      </div>
    `;
    return wrapper;
  },
};

function computeResult() {
  const growthGremlin =
    dimensions.momentum + dimensions.experiment > dimensions.precision + dimensions.proof;
  if (growthGremlin) {
    return CONFIG.types.find((type) => type.id === "TYPE_GROWTH_GREMLIN");
  }
  const kpiMonk =
    dimensions.precision + dimensions.business + dimensions.structure >
    dimensions.creativity + dimensions.buzz;
  if (kpiMonk) {
    return CONFIG.types.find((type) => type.id === "TYPE_KPI_MONK");
  }
  return CONFIG.types.find((type) => type.id === "TYPE_BRAND_SPARK");
}

function resetGame() {
  state = "HERO";
  statementIndex = 0;
  Object.keys(dimensions).forEach((key) => {
    dimensions[key] = 0;
  });
  clearTimeout(loadingTimer);
  clearInterval(loadingLineTimer);
  loadingTimer = null;
  loadingLineTimer = null;
  render();
}

function render() {
  appRoot.innerHTML = "";
  appRoot.className = `app state-${state.toLowerCase()}`;
  const screen = screenFactory[state]();
  appRoot.appendChild(screen);
  requestAnimationFrame(() => {
    screen.classList.add("enter");
    updateUiScale();
  });
}

function updateUiScale() {
  if (window.innerWidth <= 700) {
    document.documentElement.style.setProperty("--ui-scale", "1");
    return;
  }
  document.documentElement.style.setProperty("--ui-scale", "1");
  const screen = appRoot.querySelector(".screen");
  const content = appRoot.querySelector(
    ".hero-start, .statement-stack, .result-stack, .loading .panel",
  );
  if (!content || !screen) return;

  const styles = window.getComputedStyle(screen);
  const paddingX =
    parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const paddingY =
    parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const availableWidth = Math.max(window.innerWidth - paddingX - 24, 0);
  const availableHeight = Math.max(window.innerHeight - paddingY - 24, 0);
  const contentWidth = Math.max(content.scrollWidth, 1);
  const contentHeight = Math.max(content.scrollHeight, 1);
  const scale = Math.min(
    availableWidth / contentWidth,
    availableHeight / contentHeight,
    UI_SCALE_MAX,
  );

  const nextScale = Math.max(scale, UI_SCALE_MIN);
  document.documentElement.style.setProperty("--ui-scale", nextScale.toFixed(3));
}

function nextStatement() {
  if (statementIndex < statements.length - 1) {
    statementIndex += 1;
    state = "STATEMENT";
  } else {
    state = "LOADING";
    render();
    const loadingLine = document.querySelector("[data-loading-line]");
    const totalLoadingMs = Math.max(
      CONFIG.app.loadingSeconds * 1000,
      loadingLineDurations.reduce((sum, duration) => sum + duration, 0) +
        loadingFinalPauseMs,
    );
    if (loadingLine) {
      let index = 0;
      loadingLine.textContent = loadingLines[index];
      clearInterval(loadingLineTimer);
      const scheduleNextLine = () => {
        if (index >= loadingLines.length - 1) {
          return;
        }
        const delay = loadingLineDurations[index];
        clearTimeout(loadingLineTimer);
        loadingLineTimer = window.setTimeout(() => {
          index += 1;
          loadingLine.classList.add("is-fading");
          window.setTimeout(() => {
            loadingLine.textContent = loadingLines[index];
            loadingLine.classList.remove("is-fading");
            scheduleNextLine();
          }, 220);
        }, delay);
      };
      scheduleNextLine();
    }
    loadingTimer = window.setTimeout(() => {
      clearInterval(loadingLineTimer);
      loadingLineTimer = null;
      state = "RESULT";
      render();
    }, totalLoadingMs);
    return;
  }
  render();
}

function handleChoice(choice) {
  const statement = statements[statementIndex];
  if (statement) {
    const dimension =
      choice === "match" ? statement.dimensionOnYes : statement.dimensionOnNo;
    if (dimension && Object.prototype.hasOwnProperty.call(dimensions, dimension)) {
      dimensions[dimension] += 1;
    }
  }
  const card = document.querySelector(".card");
  if (card) {
    card.classList.add(choice === "match" ? "exit-right" : "exit-left");
    setTimeout(nextStatement, 250);
  } else {
    nextStatement();
  }
}

function handleAction(action) {
  if (action === "start") {
    state = "STATEMENT";
    render();
    return;
  }
  if (action === "reset") {
    resetGame();
  }
}

appRoot.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const choiceButton = target.closest("[data-choice]");
  if (choiceButton) {
    handleChoice(choiceButton.getAttribute("data-choice"));
    return;
  }

  const actionButton = target.closest("[data-action]");
  if (actionButton) {
    handleAction(actionButton.getAttribute("data-action"));
  }
});

appRoot.addEventListener("touchstart", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const choiceButton = target.closest("[data-choice]");
  if (choiceButton) {
    event.preventDefault();
    handleChoice(choiceButton.getAttribute("data-choice"));
  }
});

window.addEventListener("resize", updateUiScale);

render();
