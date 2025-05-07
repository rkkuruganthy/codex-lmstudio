// src/prompts/promptCatalog.ts

export const promptCatalog = {
  gherkin: {
    title: "Generate Gherkin Scenarios",
    description: "Convert code logic into Gherkin-style acceptance tests.",
    template: `You are an expert Software Quality Engineer and Business Analyst.

Your task is to analyze the provided code (or function) and generate **Gherkin-style acceptance criteria** that clearly describe the functional behavior **from the user's perspective**.

📌 Rules:
1. Use the **Given / When / Then** syntax.
2. Include **preconditions (Given)**, **user actions (When)**, and **expected outcomes (Then)**.
3. Use **non-technical**, domain-specific language understandable by Product Owners, QA Analysts, and Automation Engineers.
4. Focus on **observable, testable behavior**, not implementation or code details.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  review: {
    title: "Code Review",
    description: "Review the code for quality, maintainability, and style.",
    template: `You are a senior software engineer. Review the following code for quality, maintainability, and style. Suggest improvements.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  optimize: {
    title: "Optimize Code",
    description: "Optimize the code for performance and readability.",
    template: `You are a performance expert. Optimize the following code for efficiency and readability. Explain your changes.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  suggest: {
    title: "Suggest Improvements",
    description: "Suggest improvements or refactoring for the code.",
    template: `You are a code quality expert. Suggest improvements or refactoring for the following code.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  explain: {
    title: "Explain Code",
    description: "Explain what the code does in simple terms.",
    template: `You are a technical writer. Explain what the following code does in simple, non-technical terms.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  docs: {
    title: "Generate Documentation",
    description: "Generate documentation for the code.",
    template: `You are a documentation specialist. Generate clear, concise documentation for the following code.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  security: {
    title: "Security Audit",
    description: "Audit the code for security vulnerabilities.",
    template: `You are a security expert. Audit the following code for security vulnerabilities and suggest fixes.

---
<INSERT_FILE_NAME_AND_CONTENT_HERE>
`
  },

  summarize: {
    title: "Summarize Codebase",
    description: "Summarize the purpose and main flows of the codebase.",
    template: `You are a software architect. Summarize the overall purpose, main modules, and key flows of this codebase in clear, non-technical language for business stakeholders.

---
<INSERT_REPO_STRUCTURE_AND_SAMPLE_CONTENT_HERE>
`
  },

  dependencies: {
    title: "List Dependencies",
    description: "List and explain the dependencies in the codebase.",
    template: `You are a dependency analyst. List and explain the dependencies used in this codebase.

---
<INSERT_REPO_STRUCTURE_AND_SAMPLE_CONTENT_HERE>
`
  },

  architecture: {
    title: "Describe Architecture",
    description: "Describe the architecture and major components of the codebase.",
    template: `You are a software architect. Describe the architecture and major components of this codebase. Use diagrams if appropriate.

---
<INSERT_REPO_STRUCTURE_AND_SAMPLE_CONTENT_HERE>
`
  },

  repo: {
    title: "Set Repository Context",
    description: "Set or change the repository context for analysis.",
    template: `Set the repository context to the specified path or URL.`
  },

  businessFlows: {
    title: "Generate Business Flows",
    description: "Extract and describe business flows and user journeys from the codebase.",
    template: `You are a senior business analyst.

1. Identify and list the main business entities and their relationships.
2. Describe the core business workflows and user journeys in bullet points.
3. Highlight decision points, business rules, and data flow between components.
4. Use Markdown headers and bullet points for clarity.

---
<INSERT_REPO_STRUCTURE_AND_SAMPLE_CONTENT_HERE>
`
  },

  files: {
    title: "List Files",
    description: "List all files in the repository context.",
    template: `List all files in the repository context.`
  }
};
