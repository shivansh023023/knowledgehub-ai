import { BentoCard } from "@/components/reactbits/MagicBento";

import UploadCard from "./cards/UploadCard";
import ChatCard from "./cards/ChatCard";
import KnowledgeBaseCard from "./cards/KnowledgeBaseCard";
import SearchCard from "./cards/SearchCard";

import FutureCard from "./cards/FutureCard";

export const workspaceCards: BentoCard[] = [
  {
    id: "chat",
    area: "chat",
    content: <ChatCard />,
  },

  {
    id: "upload",
    area: "upload",
    content: <UploadCard />,
  },

  {
    id: "knowledge",
    area: "knowledge",
    content: <KnowledgeBaseCard />,
  },



  {
    id: "graph",
    area: "graph",
    content: <FutureCard />,
  },

  {
    id: "search",
    area: "search",
    content: <SearchCard />,
  },
];