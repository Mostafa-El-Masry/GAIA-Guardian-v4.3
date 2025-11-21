import {
  StudyDescription,
  QuizConfig,
  PracticePrompt,
  PracticeCheckResult,
} from "../lessonTypes";

export function getCssStudy(lessonCode: string): StudyDescription | null {
  switch (lessonCode) {
    case "3.1":
      return {
        title: "CSS Foundations: Selectors and Properties",
        paragraphs: [
          "CSS is how you tell the browser what your HTML should look like: colors, spacing, fonts, and layout.",
          "You write rules that target elements using selectors (like h1, .class-name, #id) and then apply properties (like color, background, font-size).",
          "In this lesson, you focus on writing a few simple rules to style headings and paragraphs so they feel more like GAIA, not a default plain page.",
          "Do not worry about layout yet — just get comfortable with the shape: selector { property: value; }.",
        ],
      };
    case "3.2":
      return {
        title: "Box Model: Margin, Padding, and Border",
        paragraphs: [
          "Every element on the page is treated like a box. Understanding that box is the key to controlling spacing.",
          "The content sits in the middle. Padding is the space between the content and the border. Border is the line around the box. Margin is the space outside the border, pushing other elements away.",
          "In this lesson, you will practice styling a simple card-like box with padding, border, and margin so it feels like a GAIA panel instead of text stuck to the edges.",
        ],
      };
    case "3.3":
      return {
        title: "Flexbox Basics: Aligning Items in a Row",
        paragraphs: [
          "Flexbox is a layout system that makes it much easier to line items up in a row or column and control how they grow or shrink.",
          "You turn a container into a flex container with display: flex, then use properties like justify-content and align-items to control alignment.",
          "In this lesson, you will build a simple horizontal navigation bar using flexbox, similar to how GAIA might lay out small pill buttons or tabs.",
        ],
      };
    default:
      return null;
  }
}

export function getCssQuiz(lessonCode: string): QuizConfig | null {
  switch (lessonCode) {
    case "3.1":
      return {
        id: "quiz-3-1",
        title: "Check your understanding of selectors and properties",
        questions: [
          {
            id: "q1",
            prompt: "Which of these is a valid CSS rule targeting all <p> elements?",
            options: [
              { id: "q1-a", label: "p = { color: red; }" },
              { id: "q1-b", label: "p { color: red; }" },
              { id: "q1-c", label: "<p> color: red; </p>" },
              { id: "q1-d", label: "p: color = red" },
            ],
            correctOptionId: "q1-b",
            explanation:
              "CSS rules use the pattern: selector { property: value; }. For example: p { color: red; }",
          },
          {
            id: "q2",
            prompt: "What does this rule do? .important { font-weight: bold; }",
            options: [
              {
                id: "q2-a",
                label: "It makes all elements in the document bold.",
              },
              {
                id: "q2-b",
                label: "It makes elements with class=\"important\" bold.",
              },
              {
                id: "q2-c",
                label: "It makes elements with id=\"important\" bold.",
              },
              {
                id: "q2-d",
                label: "It does nothing; the syntax is invalid.",
              },
            ],
            correctOptionId: "q2-b",
            explanation:
              "A dot (.) in CSS selects by class. So .important targets any element with class=\"important\".",
          },
          {
            id: "q3",
            prompt: "Which property controls the text color of an element?",
            options: [
              { id: "q3-a", label: "font-size" },
              { id: "q3-b", label: "background" },
              { id: "q3-c", label: "color" },
              { id: "q3-d", label: "border" },
            ],
            correctOptionId: "q3-c",
            explanation:
              "The color property controls the color of the text itself. Background controls the color behind it.",
          },
        ],
      };
    case "3.2":
      return {
        id: "quiz-3-2",
        title: "Check your understanding of the box model",
        questions: [
          {
            id: "q1",
            prompt:
              "Which option best describes the order from inside to outside of the box model?",
            options: [
              { id: "q1-a", label: "Margin → Border → Padding → Content" },
              { id: "q1-b", label: "Content → Padding → Border → Margin" },
              { id: "q1-c", label: "Padding → Content → Border → Margin" },
              { id: "q1-d", label: "Content → Border → Padding → Margin" },
            ],
            correctOptionId: "q1-b",
            explanation:
              "From the center outwards: content, padding, border, margin.",
          },
          {
            id: "q2",
            prompt: "Which property adds space inside the element around its content?",
            options: [
              { id: "q2-a", label: "margin" },
              { id: "q2-b", label: "padding" },
              { id: "q2-c", label: "border" },
              { id: "q2-d", label: "gap" },
            ],
            correctOptionId: "q2-b",
            explanation:
              "Padding is the space between the content and the border. Margin is outside the border.",
          },
          {
            id: "q3",
            prompt:
              "You want to separate two cards so they are not stuck together. Which property do you change?",
            options: [
              { id: "q3-a", label: "padding on the card" },
              { id: "q3-b", label: "border-radius on the card" },
              { id: "q3-c", label: "margin around the card" },
              { id: "q3-d", label: "font-weight of the text" },
            ],
            correctOptionId: "q3-c",
            explanation:
              "Margin controls the space outside the element, so increasing margin separates the cards from each other.",
          },
        ],
      };
    case "3.3":
      return {
        id: "quiz-3-3",
        title: "Check your understanding of flexbox basics",
        questions: [
          {
            id: "q1",
            prompt: "Which CSS declaration turns a container into a flex container?",
            options: [
              { id: "q1-a", label: "display: block;" },
              { id: "q1-b", label: "display: flex;" },
              { id: "q1-c", label: "position: flex;" },
              { id: "q1-d", label: "flex: container;" },
            ],
            correctOptionId: "q1-b",
            explanation:
              "display: flex; activates flex behavior for the direct children of that element.",
          },
          {
            id: "q2",
            prompt:
              "Which property controls horizontal alignment of items in a row flex container?",
            options: [
              { id: "q2-a", label: "align-items" },
              { id: "q2-b", label: "justify-content" },
              { id: "q2-c", label: "flex-direction" },
              { id: "q2-d", label: "text-align" },
            ],
            correctOptionId: "q2-b",
            explanation:
              "For a row flex container, justify-content controls horizontal alignment, and align-items controls vertical alignment.",
          },
          {
            id: "q3",
            prompt:
              "Which property sets whether the main axis of a flex container is horizontal or vertical?",
            options: [
              { id: "q3-a", label: "flex-flow" },
              { id: "q3-b", label: "flex-wrap" },
              { id: "q3-c", label: "flex-direction" },
              { id: "q3-d", label: "align-content" },
            ],
            correctOptionId: "q3-c",
            explanation:
              "flex-direction: row makes items line up horizontally; column makes them stack vertically.",
          },
        ],
      };
    default:
      return null;
  }
}

export function getCssPractice(lessonCode: string): PracticePrompt | null {
  switch (lessonCode) {
    case "3.1":
      return {
        title: "Write basic CSS for headings and paragraphs",
        description:
          "Here you will write a few CSS rules to style headings and paragraphs so they feel more like GAIA than a default browser page.",
        instructions: [
          "In the practice box below, write CSS rules that style h1 and p elements.",
          "Make h1 larger and bolder, and choose a text color for h1 and p (for example a soft green or off-white).",
          "When you are done, click \"Check practice & mark lesson\". GAIA will check that you used selectors and some common properties.",
        ],
      };
    case "3.2":
      return {
        title: "Style a simple GAIA card with box model properties",
        description:
          "You will write CSS for a .card class that feels like a GAIA panel: some internal padding, a border, and space around it.",
        instructions: [
          "In the practice box below, write CSS that targets a class called .card.",
          "Give it padding, a visible border, and some margin so it does not touch the edges or other cards.",
          "When you are done, click \"Check practice & mark lesson\". GAIA will check that you used margin, padding, and border.",
        ],
      };
    case "3.3":
      return {
        title: "CSS mini project: GAIA navigation bar",
        description:
          "This is the wrap-up mini project for the CSS arc. You will combine selectors, box model, and flexbox to style a simple GAIA-style navigation bar.",
        instructions: [
          "Write CSS for a .nav-bar container that uses display: flex to lay out its items in a row. Use justify-content and align-items to center or space the items.",
          "Style the links or buttons inside the navigation bar with padding, some margin between them, and maybe a subtle border-radius to feel like GAIA pills.",
          "Give the bar a background color and some padding so it feels like a real part of an app header.",
          "Project pattern A (solo): First, try to style this nav bar without asking AI. Only use docs if you forget a property name.",
          "Project pattern B (with AI): Later, you can ask AI to help you refactor this CSS into Tailwind utility classes or improve the design details.",
        ],
      };
    default:
      return null;
  }
}

export function validateCssPractice(
  lessonCode: string,
  content: string
): PracticeCheckResult | null {
  const src = content.toLowerCase();

  if (lessonCode === "3.1") {
    const required = ["h1", "p", "color", "font-size"];
    const missing = required.filter((snippet) => !src.includes(snippet));
    if (missing.length > 0) {
      return {
        ok: false,
        message:
          "Your CSS for headings and paragraphs is missing some pieces: " +
          missing.join(", "),
      };
    }
    return { ok: true };
  }

  if (lessonCode === "3.2") {
    const required = [".card", "margin", "padding", "border"];
    const missing = required.filter((snippet) => !src.includes(snippet));
    if (missing.length > 0) {
      return {
        ok: false,
        message:
          "Your .card style is missing some box model pieces: " +
          missing.join(", "),
      };
    }
    return { ok: true };
  }

  if (lessonCode === "3.3") {
    const required = [".nav-bar", "display", "flex", "justify-content"];
    const missing = required.filter((snippet) => !src.includes(snippet));
    if (missing.length > 0) {
      return {
        ok: false,
        message:
          "Your flexbox navigation is missing some key pieces (display: flex and alignment). Missing: " +
          missing.join(", "),
      };
    }
    return { ok: true };
  }

  return null;
}
