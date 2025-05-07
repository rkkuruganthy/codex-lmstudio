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
  5. Structure output in **pure Gherkin syntax** – suitable for generating automated test scripts or writing user stories.
  6. Include at least **2–3 unique scenarios** covering positive, negative, and edge cases.
  7. Begin with a clear and meaningful \`Feature:\` title.
  8. Do not include any code explanations or implementation notes in the output.
  
  Now analyze and generate Gherkin scenarios for the following file:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    review: {
      title: "Review My Code",
      description: "Provide a professional code review.",
      template: `You are an experienced Senior Software Engineer and Code Reviewer.
  
  Your task is to conduct a detailed review of the provided code and highlight the following:
  
  📌 Expectations:
  1. **Code Quality**
  2. **Best Practices**
  3. **Readability & Maintainability**
  4. **Edge Cases**
  5. **Testability**
  
  Now review the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    optimize: {
      title: "Optimize This Algorithm",
      description: "Improve the performance and efficiency of code.",
      template: `You are a performance optimization expert.
  
  Your task is to analyze the given function or code block and suggest how to **optimize it for performance, efficiency, and scalability**.
  
  📌 Optimization Focus Areas:
  1. **Time Complexity**
  2. **Space Usage**
  3. **Avoid Redundancy**
  4. **Language-Specific Enhancements**
  5. **Concurrency / Parallelism**
  
  Now optimize the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    suggest: {
      title: "Suggest Improvements",
      description: "Identify code enhancements for structure, clarity, and reusability.",
      template: `You are a software architect and mentor.
  
  Your task is to analyze the code and suggest general **improvements to structure, clarity, modularity, and reusability**.
  
  📌 Consider:
  1. Readability and complexity
  2. Function/class decomposition
  3. Modular design
  4. Use of design patterns
  5. Logging and error handling
  
  Now suggest improvements for the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    explain: {
      title: "Explain This Code",
      description: "Break down the code in simple, easy-to-understand terms.",
      template: `You are a technical instructor.
  
  Your job is to explain the following code **line by line or block by block** in **simple, non-technical language**.
  
  📌 Guidelines:
  1. Describe each section or function
  2. Use analogies when helpful
  3. Avoid jargon
  4. Conclude with a one-paragraph summary
  
  Now explain the following code in simple terms:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    docs: {
      title: "Write Documentation",
      description: "Generate markdown-style documentation for the given code.",
      template: `You are a documentation writer and developer advocate.
  
  Your task is to write complete and professional documentation for the following code.
  
  📌 Include:
  1. Description
  2. Parameters
  3. Return values
  4. Usage example
  5. Notes or limitations
  
  Format in markdown or structured text.
  
  Now document the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    security: {
      title: "Find Security Vulnerabilities",
      description: "Perform a security audit of the code.",
      template: `You are a senior application security expert.
  
  Your task is to analyze the following code and identify any **security vulnerabilities or risks**, based on OWASP and secure coding guidelines.
  
  📌 Check for:
  1. Input validation issues
  2. Hardcoded secrets
  3. Injection risks
  4. Insecure libraries
  5. Logging and error handling flaws
  
  Now perform a security audit on the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    summarize: {
      title: "Summarize the Code",
      description: "Generate a concise overview of the code.",
      template: `You are an engineering productivity assistant.
  
  Your task is to generate a concise and clear **summary of what the code does**.
  
  📌 Summary format:
  1. Main purpose
  2. Key functions/components
  3. Inputs/outputs
  4. External libraries
  5. Keep it under 5 bullet points
  
  Now summarize the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    dependencies: {
      title: "Extract Dependencies",
      description: "List internal and external libraries and modules used by the code.",
      template: `You are a software analysis tool.
  
  Your task is to parse the code and extract a list of **internal and external dependencies**, libraries, and modules it uses.
  
  📌 Output format:
  - Library name
  - Import path
  - Usage context (if visible)
  
  Now extract dependencies from the following code:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    },
    architecture: {
      title: "Generate Architecture Diagram",
      description: "Describe the high-level architecture and flow of the repo.",
      template: `You are a Senior Solution Architect.
  
  Your task is to analyze the entire codebase (or specified file/module) and generate a **high-level architecture diagram description** using plain text and labeled components.
  
  📌 Your output should:
  1. Identify key layers (e.g., API, Service, DB, Messaging, Frontend)
  2. Describe the main components and their responsibilities
  3. Indicate how they interact (e.g., arrows, calls, data flows)
  4. Be structured in a way that can be easily converted to a **Mermaid.js flowchart**
  5. Include any external systems or services integrated with this application
  
  Now describe the architecture for the following codebase:
  <INSERT_REPO_STRUCTURE_AND_SAMPLE_CONTENT_HERE>`
    },
    repo: {
      title: "Repo Structure Overview",
      description: "Visualize the folder and file layout of the codebase.",
      template: `You are a software repository visualizer.
  
  Your task is to analyze the following codebase structure and generate a **clean, tree-style directory view** of all files and folders.
  
  📌 Your output should:
  1. Show hierarchical indentation for folders and files
  2. Group files under their appropriate parent folders
  3. Display only the path, not the content
  4. Be readable as a CLI-friendly ASCII tree or markdown list
  
  Now generate the directory structure for this codebase:
  <INSERT_FILE_NAME_AND_CONTENT_HERE>`
    }
  };
  