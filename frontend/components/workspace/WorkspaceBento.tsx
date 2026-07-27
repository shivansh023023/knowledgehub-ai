import { BentoCard } from "@/components/reactbits/MagicBento";

import UploadCard from "./cards/UploadCard";
import ChatCard from "./cards/ChatCard";
import KnowledgeBaseCard from "./cards/KnowledgeBaseCard";
import SearchCard from "./cards/SearchCard";
import ModelCard from "./cards/ModelCard";
import FutureCard from "./cards/FutureCard";

export const workspaceCards: BentoCard[] = [
  {
    id: "upload-documents",
    size: "large",
    content: <UploadCard />,
  },

  {
    id: "ai-chat",
    size: "large",
    content: <ChatCard />,
  },

  {
    id: "knowledge-base",
    size: "medium",
    content: <KnowledgeBaseCard />,
  },

  {
    id: "semantic-search",
    size: "medium",
    content: <SearchCard />,
  },

  {
    id: "groq",
    size: "small",
    content: <ModelCard />,
  },

  {
    id: "graphrag",
    size: "small",
    content: <FutureCard />,
  },
];