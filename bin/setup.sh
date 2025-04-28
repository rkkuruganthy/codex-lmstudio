#!/bin/bash

# Location: bin/setup.sh

echo "🔵 Setting up CodeAssist CLI shortcut..."

# Make codex-local.sh executable
if [ -f "./bin/codex-local.sh" ]; then
  chmod +x ./bin/codex-local.sh
else
  echo "❌ Error: codex-local.sh not found in ./bin/"
  exit 1
fi

# Define full path
CODEASSIST_PATH="$(pwd)/bin/codex-local.sh"

# Determine user's shell config
SHELL_CONFIG=""

if [ -f "$HOME/.zshrc" ]; then
  SHELL_CONFIG="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
  SHELL_CONFIG="$HOME/.bashrc"
else
  echo "⚠️ Warning: Could not find .zshrc or .bashrc automatically."
  echo "Please manually add the alias manually to your shell config:"
  echo "alias CodeAssist=\"$CODEASSIST_PATH\""
  exit 1
fi

# Add alias if not already present
if grep -q "alias CodeAssist=" "$SHELL_CONFIG"; then
  echo "✅ Alias 'CodeAssist' already exists in $SHELL_CONFIG"
else
  echo "" >> "$SHELL_CONFIG"
  echo "# Alias added by CodeAssist setup" >> "$SHELL_CONFIG"
  echo "alias CodeAssist=\"$CODEASSIST_PATH\"" >> "$SHELL_CONFIG"
  echo "✅ Alias 'CodeAssist' added to $SHELL_CONFIG"
fi

# Reload shell configuration
echo "🔵 Reloading your shell configuration from $SHELL_CONFIG..."
source "$SHELL_CONFIG"

echo ""
echo "✅ Setup complete! You can now run 'CodeAssist' from anywhere 🎯"
echo ""
