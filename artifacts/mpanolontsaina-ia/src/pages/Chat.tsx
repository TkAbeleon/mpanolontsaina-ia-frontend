import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/use-auth";
import {
  chatApi,
  getOrCreateVisitorSessionId,
  ChatMessage,
  ApiRequestError,
  UserProfile,
} from "@/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle, Book, Info, X, MessageSquare } from "lucide-react";
import { useRoute, useLocation, Link } from "wouter";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chat() {
  const { t, lang } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const [, params] = useRoute("/chat/:id");
  const conversationId = params?.id;
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(!isAuthenticated);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initializedId = useRef<string | null>(null);

  useEffect(() => {
    setShowBanner(!isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      conversationId &&
      isAuthenticated &&
      initializedId.current !== conversationId
    ) {
      initializedId.current = conversationId;
      chatApi
        .getConversation(conversationId)
        .then((res) => setMessages(res.messages || []))
        .catch((err) => {
          if (err instanceof ApiRequestError && err.status === 401) {
            toast({ variant: "destructive", title: t("chat.unauthorized") });
            setLocation("/login");
          } else {
            toast({ variant: "destructive", title: t("chat.errorGeneric") });
          }
        });
    } else if (!conversationId) {
      setMessages([]);
      initializedId.current = null;
    }
  }, [conversationId, isAuthenticated, toast, t, setLocation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isAuthenticated) {
        if (conversationId) {
          const res = await chatApi.sendMessage(conversationId, content);
          setMessages((prev) => [...prev, res.assistant_message]);
        } else {
          const title =
            content.length > 30 ? content.slice(0, 30) + "..." : content;
          const conv = await chatApi.createConversation(title);
          const res = await chatApi.sendMessage(conv.id, content);
          setMessages((prev) => [...prev, res.assistant_message]);
          setLocation(`/chat/${conv.id}`);
        }
      } else {
        const sessionId = getOrCreateVisitorSessionId();
        const history = messages.map((m) => ({ role: m.role, content: m.content }));
        const res = await chatApi.sendVisitorMessage(sessionId, content, lang, history);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: res.answer,
            sources: res.sources,
            agent_source: res.agent_source,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      const err = error as ApiRequestError;
      if (err.status === 429) toast({ variant: "destructive", title: t("chat.rateLimited") });
      else if (err.status === 401) { toast({ variant: "destructive", title: t("chat.unauthorized") }); setLocation("/login"); }
      else toast({ variant: "destructive", title: t("chat.errorGeneric") });
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setInput(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    /*
     * Outer shell: fills the flex-1 <main> from AppLayout, full viewport height
     * minus navbar, no overflow — scrolling is handled only by the message feed.
     */
    <div className="flex-1 flex flex-col w-full overflow-hidden">
      {/*
       * Inner column: centred, max-width-bounded. Everything — banner, messages,
       * input — lives here so they all share the same horizontal alignment.
       */}
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto min-h-0 px-4">

        {/* ── Guest banner ─────────────────────────────────────────────────── */}
        {showBanner && !isAuthenticated && (
          <div className="mt-4 flex-shrink-0 bg-accent/10 border border-accent/20 px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 min-w-0">
              <Info className="w-4 h-4 text-accent flex-shrink-0" />
              <p className="text-sm text-foreground/80 truncate">{t("chat.visitorBanner")}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-accent/30 hover:bg-accent/10 transition-all duration-200"
                asChild
              >
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-200"
                onClick={() => setShowBanner(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Message feed ─────────────────────────────────────────────────── */}
        {/*
         * min-h-0 is required so this flex child can shrink below its intrinsic
         * height and let overflow-y-auto create the actual scrollable region.
         */}
        <div className="flex-1 overflow-y-auto min-h-0 py-6 space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 animate-in fade-in duration-500">
              <MessageSquare className="w-14 h-14 text-muted-foreground" />
              <p className="text-base font-medium text-muted-foreground max-w-sm">
                {t("chat.placeholder")}
              </p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <MessageBubble key={m.id} message={m} t={t} index={idx} user={user} />
            ))
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 message-bubble-enter">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-[11px] font-bold">IA</span>
              </div>
              <div className="bg-card border border-border shadow-sm rounded-2xl rounded-tl-md px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/50 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary/50 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary/50 typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Input area ───────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 pb-4 pt-2">
          <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden transition-shadow duration-200 focus-within:shadow-lg focus-within:border-primary/40">
            <form onSubmit={handleSubmit} className="flex items-end gap-2 p-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chat.placeholder")}
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] leading-relaxed placeholder:text-muted-foreground/60 min-h-[44px] max-h-[160px] py-2.5 px-2"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 flex-shrink-0 self-end mb-0.5"
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">{t("chat.send")}</span>
              </Button>
            </form>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/60 text-center">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {t("chat.disclaimer")}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

function userInitials(user: UserProfile | null): string {
  if (!user) return "Vo";
  const name = user.full_name || user.email || "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function MessageBubble({
  message,
  t,
  index,
  user,
}: {
  message: ChatMessage;
  t: (k: string) => string;
  index: number;
  user: UserProfile | null;
}) {
  const isUser = message.role === "user";

  /*
   * Flat layout — avatar + bubble in the same flex row, no nested columns.
   * This ensures max-w-[70%] resolves against the full row width (not an
   * intermediate wrapper), which prevents words from being split mid-character.
   *
   * User row  : [bubble · · · · · · ][avatar]   (flex-row-reverse)
   * Agent row : [avatar][bubble · · · · · · ]   (flex-row)
   */
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 w-full message-bubble-enter",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      style={{ animationDelay: `${Math.min(index * 0.08, 0.4)}s` }}
    >
      {/* Avatar — always present on both sides */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-[11px] font-bold select-none",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/15 text-primary"
        )}
      >
        {isUser ? userInitials(user) : "IA"}
      </div>

      {/* Bubble + sources */}
      <div className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start", "min-w-0 flex-1")}>
        <div
          className={cn(
            "text-[15px] shadow-sm",
            isUser
              ? [
                  "bg-primary text-primary-foreground",
                  "px-4 py-3 rounded-2xl rounded-tr-md",
                  // max-w expressed here, on the bubble itself (direct child of flex-1 column)
                  "max-w-[80%]",
                ].join(" ")
              : [
                  "bg-card border border-border text-foreground",
                  "px-5 py-4 rounded-2xl rounded-tl-md",
                  "max-w-full",
                ].join(" ")
          )}
        >
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap overflow-wrap-anywhere">
              {message.content}
            </p>
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Legal sources (agent only) */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div
            className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: "0.2s" }}
          >
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Book className="w-3.5 h-3.5" />
              {t("chat.sourcesTitle")}
            </h4>
            <div className="flex flex-col gap-2">
              {message.sources.map((src, i) => (
                <div
                  key={i}
                  className="bg-muted/40 border border-border/50 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 hover:bg-muted/60 hover:border-border"
                >
                  <div className="font-medium text-foreground mb-1">
                    {src.code} — {src.article}
                  </div>
                  {src.excerpt_summary && (
                    <div className="text-muted-foreground text-xs leading-relaxed italic border-l-2 border-primary/30 pl-2 mt-1">
                      "{src.excerpt_summary}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
