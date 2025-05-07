// tests/codexchat.smoketest.cjs
const React = require('react');
const { render, act } = require('ink-testing-library');
const fs = require('fs');
const path = require('path');
const { CodexChat } = require('../dist/components/codex-chat');

// Prepare mock repo path
const tempRepoPath = path.join(__dirname, '__mocks__', 'sample-repo');
const contextFile = path.join(tempRepoPath, '.repo-context.json');

if (!fs.existsSync(tempRepoPath)) {
  fs.mkdirSync(tempRepoPath, { recursive: true });
  fs.writeFileSync(path.join(tempRepoPath, 'index.ts'), 'export const x = 1;');
}

const mockConfig = {
  apiBaseUrl: 'http://localhost:1234/v1',
  apiKey: '',
  defaultRepo: tempRepoPath,
  defaultModel: 'qwen2.5',
  defaultPath: tempRepoPath,
};

const { stdin, lastFrame } = render(
  React.createElement(CodexChat, {
    initialPrompt: `/repo ${tempRepoPath}`,
    model: 'qwen2.5',
    config: mockConfig
  })
);

act(() => {
  stdin.write(`/repo ${tempRepoPath}\r`);
});

setTimeout(() => {
  act(() => {
    stdin.write(`/files\r`);
  });
}, 1500);

setTimeout(() => {
  console.log('Smoke Test Output:\n', lastFrame());
}, 3000);
