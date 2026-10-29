import { el, empty, setText } from "./elements.js";

/**
 * @typedef {"start" | "question" | "results"} Screen
 */

/**
 * Allir mögulegir skjáir.
 * @type {Screen[]}
 */
const SCREENS = ["start", "question", "results"];

/**
 * Sýnir skjá `name` og felur aðra.
 * @param {Screen} name Skjár sem á að sýna
 * @returns {void}
 */
export function showScreen(name) {
  for (const screen of SCREENS) {
    const section = document.querySelector(`section.${screen}`);

    if (!section) {
      console.warn("section is null");
      continue;
    }

    section.classList.add("hidden");
  }

  const targetScreen = document.querySelector(`section.${name}`);

  if (targetScreen) {
    targetScreen.classList.remove("hidden");
  }
}

/**
 * Birtir tölfræði á upphafsskjá.
 * @param {import("./quiz.js").Stats} stats Tölfræði
 * @returns {void}
 */
export function renderStats(stats) {
  setText(".stats-played", stats.played.toString());
  setText(".stats-correct", stats.correct.toString());
  setText(".stats-incorrect", stats.incorrect.toString());
}

/**
 * Birtir spurningu, tæmir svarreit og setur fókus á hann.
 * @param {import("./quiz.js").Question} question Spurning
 * @param {number} num Númer spurningar, byrjar á 1
 * @param {number} total Heildarfjöldi spurninga
 * @returns {void}
 */
export function renderQuestion(question, num, total) {
  const categoryElement = document.querySelector(".title .category");

  if (!categoryElement) {
    console.warn("category element not found");
    return;
  }

  categoryElement.textContent = question.category;

  const questionElement = document.querySelector(".title .question-text");
  const currentElement = document.querySelector(".progress .current");
  const totalElement = document.querySelector(".progress .total");
  const answerInput = document.querySelector("#answer");

  if (questionElement) {
    questionElement.textContent = question.question;
  } else {
    console.error("fann ekki question element");
  }

  if (currentElement) {
    currentElement.textContent = num.toString();
  }

  if (totalElement) {
    totalElement.textContent = total.toString();
  }

  if (answerInput instanceof HTMLInputElement) {
    answerInput.value = "";
    answerInput.focus();
  }
}

/**
 * Birtir niðurstöður leiks.
 * @param {import("./quiz.js").Result[]} results Niðurstöður
 * @param {number} correctCount Fjöldi réttra svara
 * @returns {void}
 */
export function renderResults(results, correctCount) {
  const list = document.querySelector(".results-list");

  if (!list) {
    console.error("fann ekki niðurstöðulista");
    return;
  }

  empty(list);
  setText(".results-summary .correct-count", correctCount.toString());
  setText(".results-summary .total", results.length.toString());

  for (const result of results) {
    const resultElement = el(
      "li",
      { class: result.correct ? "result correct" : "result incorrect" },
      el("p", { class: "result-category" }, result.category),
      el("p", { class: "result-question" }, result.question),
      el(
        "p",
        {},
        "Þitt svar: ",
        el(
          "span",
          { class: "result-answer" },
          result.answer.trim() === "" ? "Ekkert svar" : result.answer,
        ),
      ),
      el(
        "p",
        {},
        "Rétt svar: ",
        el("span", { class: "result-correct" }, result.correctAnswer),
      ),
    );

    list.appendChild(resultElement);
  }
}
