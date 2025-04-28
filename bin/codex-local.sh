#!/bin/bash

export PROVIDER=lmstudio
export OPENAI_API_BASE_URL=http://localhost:1234/v1
export LMSTUDIO_API_KEY=sk-local

node ./dist/cli.js "$@"

