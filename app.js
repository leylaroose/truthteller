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
      name: "THE GROWTH GREMLIN",
      description: "Fast decisions. Big momentum.\nYou’d rather move than overthink.",
      bridgeLine: "The trick is scaling fast without burning budget. Sovendus can help you with that! Grab your gift and let's chat!",
    },
    {
      id: "TYPE_KPI_MONK",
      name: "THE KPI MONK",
      description: "Clear goals. Clean numbers.\nIf it doesn’t perform, it doesn’t matter.",
      bridgeLine: "You care about results you can actually prove. Sovendus can help you with that! Grab your gift and let's chat!",
    },
    {
      id: "TYPE_BRAND_SPARK",
      name: "THE BRAND SPARK",
      description: "Strong ideas. Good instincts.\nNot everything needs a spreadsheet.",
      bridgeLine: "The challenge is turning great brand moments into real impact. Sovendus can help you with that! Grab your gift and let's chat!",
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
  "Aligning the stars... ✨",
  "Consulting the oracle... 🔮",
  "Revealing your marketing type... 👀",
];
const loadingCycleMs = 2200;
const loadingFinalPauseMs = 1000;

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
  });
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
      (loadingLines.length - 1) * loadingCycleMs + loadingFinalPauseMs,
    );
    if (loadingLine) {
      let index = 0;
      loadingLine.textContent = loadingLines[index];
      clearInterval(loadingLineTimer);
      loadingLineTimer = window.setInterval(() => {
        if (index < loadingLines.length - 1) {
          index += 1;
          loadingLine.classList.add("is-fading");
          window.setTimeout(() => {
            loadingLine.textContent = loadingLines[index];
            loadingLine.classList.remove("is-fading");
          }, 220);
        }
      }, loadingCycleMs);
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

render();
