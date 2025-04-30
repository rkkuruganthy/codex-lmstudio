#!/bin/bash

echo "🔧 Setting up 'CodeAssist' CLI shortcut..."

ALIAS_COMMAND="alias CodeAssist=\"$(pwd)/bin/codex-local.sh\""
ZSHRC="$HOME/.zshrc"

if ! grep -q "alias CodeAssist=" "$ZSHRC"; then
  echo "$ALIAS_COMMAND" >> "$ZSHRC"
  echo "✅ Alias 'CodeAssist' added to $ZSHRC"
else
  echo "✅ Alias 'CodeAssist' already exists in $ZSHRC"
fi

echo "🔄 Reloading shell configuration..."

# Check if current shell is zsh, then source properly
if [ -n "$ZSH_VERSION" ]; then
  source "$ZSHRC"
else
  echo "⚠️ You're not in a zsh session. Please run: source ~/.zshrc manually."
fi

echo "🎉 You can now run CodeAssist from any terminal!"
