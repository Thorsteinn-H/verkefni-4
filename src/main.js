import { questions } from "./lib/questions.js";
import {
  countCorrect,
  createResults,
  pickQuestions,
  updateStats,
} from "./lib/quiz.js";
import {
  renderQuestion,
  renderResults,
  renderStats,
  showScreen,
} from "./lib/ui.js";

/** Fasti sem segir til um hversu margar spurningar við sýnum. */
const NUMBER_OF_QUESTIONS = 4;

/**
 * Staða leiks, heldur utanum tölfræði, spurningar í núverandi leik,
 * svör notanda í núverandi leik og á hvaða spurningu við erum.
 * @type {{
 *   stats: import("./lib/quiz.js").Stats,
 *   questions: import("./lib/quiz.js").Question[],
 *   answers: string[],
 *   current: number,
 * }}
 */
const state = {
  stats: { played: 0, correct: 0, incorrect: 0 },
  questions: [],
  answers: [],
  current: 0,
};

/**
 * Byrjar nýjan leik og sýnir fyrstu spurningu.
 * @returns {void}
 */
function start() {
  state.questions = pickQuestions(questions, NUMBER_OF_QUESTIONS);
  state.current = 0;
  state.answers = [];

  showScreen("question");
  renderQuestion(state.questions[state.current], state.current + 1, state.questions.length);
}

/**
 * Klárar leik, uppfærir tölfræði og sýnir niðurstöður.
 * @returns {void}
 */
function finish() {
  const results = createResults(state.questions, state.answers);
  state.stats = updateStats(state.stats, results);
  renderResults(results, countCorrect(results));
  showScreen("results");
}

/**
 * Vistar svar við núverandi spurningu og sýnir næstu, eða niðurstöður ef
 * öllum spurningum hefur verið svarað.
 * @param answer {string}
 * @returns {void}
 */
function submitAnswer(answer) {
  state.answers.push(answer);

  if (state.current === state.questions.length - 1) {
    finish();
  } else {
    state.current += 1;
    renderQuestion(
      state.questions[state.current],
      state.current + 1,
      state.questions.length,
    );
  }
}

/**
 * Fer aftur á upphafsskjá með uppfærðri tölfræði.
 * @returns {void}
 */
function restart() {
  renderStats(state.stats);
  showScreen("start");
}

function initialize() {
  renderStats(state.stats);
  showScreen("start");

  const startButton = document.querySelector(".start-button");
  if (startButton) {
    startButton.addEventListener("click", start);
  } else {
    console.error("fann ekki start button");
  }

  const form = document.querySelector(".answer-form");
  if (form instanceof HTMLFormElement) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const answerInput = form.querySelector("#answer");

      if (!(answerInput instanceof HTMLInputElement)) {
        console.error("fann ekki svarreit");
        return;
      }

      submitAnswer(answerInput.value);
    });
  } else {
    console.error("form not found");
  }

  const restartButton = document.querySelector("button.restart-button");

  if (restartButton) {
    restartButton.addEventListener("click", restart);
  } else {
    console.error("fann ekki restart button");
  }
}

initialize();