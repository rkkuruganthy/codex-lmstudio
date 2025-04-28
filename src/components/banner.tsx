// Location: src/components/banner.tsx

import React from "react";
import { Box, Text } from "ink";

export const Banner: React.FC = () => {
  return (
    <Box
      borderStyle="round"
      borderColor="cyanBright"
      paddingX={2}
      paddingY={1}
      flexDirection="column"
      marginBottom={1}
    >
      <Text color="cyanBright">🚀 CodeAssist (Local Codex CLI)</Text>
      
      <Text color="gray">Built with ❤️ by Ravi using LMStudio & Qwen2.5!</Text>
    </Box>
  );
};
