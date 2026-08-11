"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
} from "lucide-react";

import {
  Conversation,
  getConversations,
  getConversation,
  createConversation,
  deleteConversation,
} from "@/lib/conversations";

import { useChatStore } from "@/stores/chatStore";


export default function Sidebar() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const setConversationId = useChatStore(
    (state) => state.setConversationId
  );

  const setMessages = useChatStore(
    (state) => state.setMessages
  );


  const loadConversations = async () => {
    try {
      const data = await getConversations();

      setConversations(data);
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadConversations();
  }, []);


  const handleNewChat = async () => {
    try {
      const conversation =
        await createConversation();

      setConversations((prev) => [
        conversation,
        ...prev,
      ]);

      setConversationId(conversation.id);
      setMessages([]);
    } catch (error) {
      console.error(
        "Failed to create conversation:",
        error
      );
    }
  };


  const handleOpenConversation = async (
    id: string
  ) => {
    try {
      const conversation =
        await getConversation(id);

      setConversationId(conversation.id);

      setMessages(conversation.messages);
    } catch (error) {
      console.error(
        "Failed to open conversation:",
        error
      );
    }
  };


  const handleDelete = async (
    id: string
  ) => {
    try {
      await deleteConversation(id);

      setConversations((prev) =>
        prev.filter(
          (conversation) =>
            conversation.id !== id
        )
      );

      const currentId =
        useChatStore.getState().conversationId;

      if (currentId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Failed to delete conversation:",
        error
      );
    }
  };


  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-800 bg-black text-white">

      {/* New Chat */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>


      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3">

        <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Conversations
        </h2>


        {loading ? (
          <p className="px-2 text-sm text-zinc-500">
            Loading...
          </p>
        ) : conversations.length === 0 ? (
          <p className="px-2 text-sm text-zinc-500">
            No conversations yet
          </p>
        ) : (
          <div className="space-y-1">

            {conversations.map(
              (conversation) => (
                <div
                  key={conversation.id}
                  className="group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-zinc-900"
                >

                  <MessageSquare className="h-4 w-4 shrink-0 text-zinc-500" />


                  <button
                    onClick={() =>
                      handleOpenConversation(
                        conversation.id
                      )
                    }
                    className="min-w-0 flex-1 truncate text-left text-sm text-zinc-300"
                  >
                    {conversation.title}
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(
                        conversation.id
                      )
                    }
                    className="hidden text-zinc-500 hover:text-red-400 group-hover:block"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </div>
    </aside>
  );
}