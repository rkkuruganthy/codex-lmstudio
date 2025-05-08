const { spawn } = require('child_process');

const commands = [
  '/repo ./tests', // Make sure you have a small test repo available
  '/gherkin',
  '/review',
  '/optimize',
  '/suggest',
  '/explain',
  '/docs',
  '/security',
  '/summarize',
  '/dependencies',
  '/architecture',
  '/files',
  '/businessFlows'
];

function runSmokeTest() {
  //const cli = spawn('node', ['src/index.js'], { stdio: ['pipe', 'pipe', 'pipe'] }); // Adjust entry point as needed
  const cli = spawn('node', ['dist/cli.mjs'], { stdio: ['pipe', 'pipe', 'pipe'] });


  let current = 0;
  let buffer = '';

  cli.stdout.on('data', data => {
    buffer += data.toString();

    if (buffer.includes('Assistant Response:') || buffer.includes('❌')) {
      console.log(`\n[${commands[current]}] Response received.`);
      if (buffer.includes('❌')) {
        console.log(`[FAIL] ${commands[current]} - Error detected in response.`);
      } else {
        console.log(`[PASS] ${commands[current]}`);
      }
      buffer = '';
      current++;
      if (current < commands.length) {
        setTimeout(() => cli.stdin.write(commands[current] + '\n'), 500);
      } else {
        cli.stdin.end();
        cli.kill();
        console.log('\nSmoke test complete.');
      }
    }
  });

  cli.stderr.on('data', data => {
    console.error('[STDERR]', data.toString());
  });

  cli.on('exit', code => {
    if (current < commands.length) {
      console.log('\n[FAIL] CLI exited before all commands were tested.');
    }
  });

  // Start with the first command
  setTimeout(() => cli.stdin.write(commands[current] + '\n'), 1000);
}

runSmokeTest();
