"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientBackground } from "@/components/gradient-background";
import { getApiUrl } from "@/lib/api-config";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  Crown,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
  FileText,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Copy,
  Send,
  Calendar,
  Clock,
} from "lucide-react";

interface MemberView {
  id: string;
  name: string;
  email: string | null;
  role: "admin" | "member";
  joined_at: string;
}

interface CompView {
  id: string;
  member_id: string;
  topic_id: string;
  content: string;
  updated_at: string;
}

interface GroupData {
  group: { id: string; name: string; invite_code: string | null };
  members: MemberView[];
  topic: { id: string; title: string; updated_at?: string } | null;
  compositions: CompView[];
  viewer: { member_id: string; role: "admin" | "member" } | null;
}

export default function GroupPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<GroupData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [topicText, setTopicText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/groups/${params.id}`));
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      const json = await res.json();
      setData(json);
      if (json.topic?.title) setTopicText(json.topic.title);
    } catch (e) {
      toast({
        title: "Bağlantı hatası",
        description: "Grup bilgileri alınamadı.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const isAdmin = data?.viewer?.role === "admin";
  const viewerMemberId = data?.viewer?.member_id;

  const inviteUrl = useMemo(() => {
    if (!data?.group?.invite_code) return null;
    if (typeof window === "undefined") return `/join/${data.group.invite_code}`;
    const origin = window.location.origin;
    return `${origin}/join/${data.group.invite_code}`;
  }, [data?.group?.invite_code]);

  async function copyInvite() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({ title: "Kopyalandı!", description: "Davet linki panoya kopyalandı.", variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Kopyalanamadı", description: "Linki manuel olarak seçip kopyalayabilirsin.", variant: "destructive" });
    }
  }

  async function generateCompositions() {
    if (!isAdmin) return;
    if (topicText.trim().length < 3) {
      toast({ title: "Konu giriniz", description: "Kompozisyon konusu en az 3 karakter olmalı.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch(getApiUrl("/api/compositions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: params.id, topicText: topicText.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Üretim başarısız");
      toast({
        title: `${json.generatedCount} kompozisyon üretildi!`,
        description: "Herkese özel metinler hazır.",
        variant: "success",
      });
      await load();
    } catch (e: any) {
      toast({
        title: "Üretim başarısız",
        description: e?.message || "Kompozisyonlar üretilemedi.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  async function loadTopicSuggestions() {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(getApiUrl("/api/topics/suggestions?category=all&count=8"));
      const json = await res.json();
      if (json.success) {
        setSuggestions(json.topics || []);
      }
    } catch (e) {
      console.error("Failed to load suggestions:", e);
    } finally {
      setLoadingSuggestions(false);
    }
  }

  async function selectSuggestion(topic: string) {
    setTopicText(topic);
    setShowSuggestions(false);
  }

  async function evaluateComposition(text: string) {
    if (!topicText.trim()) {
      toast({ title: "Konu gerekli", description: "Önce bir konu belirleyin.", variant: "destructive" });
      return;
    }
    setEvaluating(true);
    try {
      const res = await fetch(getApiUrl("/api/compositions/evaluate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, topic: topicText.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setEvaluation(json);
      }
    } catch (e) {
      console.error("Evaluation failed:", e);
    } finally {
      setEvaluating(false);
    }
  }

  const compByMember = useMemo(() => {
    const map: Record<string, CompView> = {};
    data?.compositions?.forEach((c) => {
      map[c.member_id] = c;
    });
    return map;
  }, [data?.compositions]);

  if (loading) {
    return (
      <GradientBackground intensity="medium">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 md:py-16 flex-1">
          <Link
            href="/"
            className="mb-5 sm:mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-opacity"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" /> Ana sayfaya dön
          </Link>
          <div className="flex flex-col items-center gap-8 pt-8 sm:pt-12">
            <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
            <div className="space-y-3 w-full max-w-md">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </div>
          </div>
        </div>
      </GradientBackground>
    );
  }

  if (notFound) {
    return (
      <GradientBackground intensity="medium">
        <div className="container mx-auto max-w-xl px-4 py-8 sm:py-12 md:py-16 flex-1 flex items-center justify-center">
          <Card className="glass-card-dark border-0 shadow-2xl rounded-2xl w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Grup Bulunamadı</CardTitle>
              <CardDescription className="text-white/70">
                Bu gruba erişim için önce davet linki ile katılmalısın ya da yönetici olmalısın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button variant="outline" className="w-full rounded-xl border-white/30 text-white hover:bg-white/10">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  if (!data?.viewer) {
    return (
      <GradientBackground intensity="medium">
        <div className="container mx-auto max-w-xl px-4 py-8 sm:py-12 md:py-16 flex-1 flex items-center justify-center">
          <Card className="glass-card-dark border-0 shadow-2xl rounded-2xl w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Giriş Gerekli</CardTitle>
              <CardDescription className="text-white/70">
                Bu gruba ait bir davet linki ile giriş yapınız ya da yönetici olarak oturum açınız.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button variant="outline" className="w-full rounded-xl border-white/30 text-white hover:bg-white/10">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  const memberCount = data.members.length;
  const hasTopic = !!data.topic;
  const generatedCount = Object.keys(compByMember).length;

  return (
    <TooltipProvider>
      <GradientBackground intensity="medium" showFooter>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 flex-1">
          <Link
            href="/"
            className="mb-5 sm:mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" /> Ana sayfaya dön
          </Link>

          <header className="mb-6 sm:mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-words text-white">
                  {data.group.name}
                </h1>
                {data.group.name && (
                  <div className="inline-flex items-center gap-1.5">
                    {hasTopic ? (
                      <Badge variant="info" className="border-0 bg-white/15 text-white">
                        <Calendar className="h-3 w-3 mr-1 shrink-0" />
                        {new Date(data.topic!.updated_at || data.topic!.id).toLocaleDateString("tr-TR")}
                      </Badge>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="gap-1 border-white/30 bg-white/10 text-white">
                  <Users className="h-3 w-3 shrink-0" /> {memberCount} Üye
                </Badge>
                {hasTopic ? (
                  <Badge variant="outline" className="border-white/30 bg-white/10 text-white max-w-[200px] truncate">
                    Konu: {data.topic!.title}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-0 bg-white/5 text-white/50">
                    Konu belirlenmedi
                  </Badge>
                )}
                {generatedCount > 0 && (
                  <Badge variant="success" className="gap-1 border-0">
                    <CheckCircle2 className="h-3 w-3 shrink-0" /> {generatedCount} Hazır
                  </Badge>
                )}
              </div>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                {isAdmin
                  ? "Grubunun yöneticisi olarak arkadaşlarını davet edebilir, konu belirleyebilir ve kompozisyonları üretebilirsin."
                  : "Grubun bir üyesisin. Yönetici bir konu belirleyip kompozisyonları ürettikten sonra kendi kompozisyonunu burada göreceksin."}
              </p>
            </div>

            {isAdmin && inviteUrl && (
              <Card className="glass-card-dark border-0 shadow-2xl rounded-2xl w-full md:w-auto md:min-w-[400px] shrink-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <ClipboardCopy className="h-5 w-5 shrink-0" /> Davet Linki
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Bu linki paylaşarak arkadaşlarını grubuna davet et.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 overflow-hidden rounded-xl bg-blue-50/10 px-4 py-3 text-sm font-mono text-white break-all border border-white/10">
                      {inviteUrl}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 shrink-0 rounded-xl text-white hover:bg-white/10"
                          onClick={copyInvite}
                        >
                          {copied ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Kopyala</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Linki arkadaşlarına e-posta, WhatsApp veya istediğin kanaldan göndererek grubuna katılmalarını sağlayabilirsin.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-1 rounded-xl text-xs text-white hover:bg-white/10"
                      onClick={() => {
                        const textarea = document.createElement("textarea");
                        textarea.value = `${data.group.name} grubuna davetlisin: ${inviteUrl}`;
                        document.body.appendChild(textarea);
                        textarea.select();
                        textarea.remove();
                      }}
                    >
                      <Send className="h-3 w-3" /> Davet Mesajı Kopyala
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </header>

          <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
            <div className="space-y-5 sm:space-y-6 lg:col-span-1 order-2 lg:order-1">
              {evaluation && (
                <Card className="glass-card-dark border-0 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-white">
                      <BarChart3 className="h-5 w-5 shrink-0" /> Değerlendirme Sonucu
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Kompozisyonun detaylı analizi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-5xl font-bold text-white mb-1">
                        {evaluation.evaluation?.overallScore || 0}
                      </div>
                      <div className="text-sm text-white/60">Genel Puan</div>
                    </div>
                    <Separator className="border-white/10" />
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details">
                        <AccordionTrigger className="text-white hover:text-white/80">Detaylı Puanlar</AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-white/80">
                              <span>Yapı</span>
                              <span className="font-medium text-white">{evaluation.evaluation?.structure || 0}/100</span>
                            </div>
                            <Progress value={evaluation.evaluation?.structure || 0} className="h-2 bg-white/10" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-white/80">
                              <span>Orijinalite</span>
                              <span className="font-medium text-white">{evaluation.evaluation?.originality || 0}/100</span>
                            </div>
                            <Progress value={evaluation.evaluation?.originality || 0} className="h-2 bg-white/10" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-white/80">
                              <span>İlgililik</span>
                              <span className="font-medium text-white">{evaluation.evaluation?.relevance || 0}/100</span>
                            </div>
                            <Progress value={evaluation.evaluation?.relevance || 0} className="h-2 bg-white/10" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-white/80">
                              <span>Dil Kalitesi</span>
                              <span className="font-medium text-white">{evaluation.evaluation?.languageQuality || 0}/100</span>
                            </div>
                            <Progress value={evaluation.evaluation?.languageQuality || 0} className="h-2 bg-white/10" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-white/80">
                              <span>Okunabilirlik</span>
                              <span className="font-medium text-white">{evaluation.evaluation?.readability || 0}/100</span>
                            </div>
                            <Progress value={evaluation.evaluation?.readability || 0} className="h-2 bg-white/10" />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="analysis">
                        <AccordionTrigger className="text-white hover:text-white/80">Analiz</AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm text-white/80">
                          <div className="flex justify-between">
                            <span>Kelime Sayısı:</span>
                            <span className="font-medium text-white">{evaluation.analysis?.wordCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cümle Sayısı:</span>
                            <span className="font-medium text-white">{evaluation.analysis?.sentenceCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Paragraf Sayısı:</span>
                            <span className="font-medium text-white">{evaluation.analysis?.paragraphCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Okuma Süresi:</span>
                            <span className="font-medium text-white">{Math.round(evaluation.analysis?.readingTime || 0)} dk</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="feedback">
                        <AccordionTrigger className="text-white hover:text-white/80">Geri Bildirim</AccordionTrigger>
                        <AccordionContent className="space-y-3">
                          <p className="text-sm text-white/80">{evaluation.evaluation?.feedback || ""}</p>
                          {evaluation.evaluation?.strengths?.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2 text-white">Güçlü Yönler:</div>
                              <ul className="text-sm space-y-1 list-disc list-inside text-white/80">
                                {evaluation.evaluation.strengths.map((s: string, i: number) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {evaluation.evaluation?.improvements?.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2 text-white">İyileştirme Önerileri:</div>
                              <ul className="text-sm space-y-1 list-disc list-inside text-white/80">
                                {evaluation.evaluation.improvements.map((s: string, i: number) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              <Card className="glass-card-dark border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Users className="h-5 w-5 shrink-0" /> Üyeler
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {memberCount > 0
                      ? "Grubun üye listesi ve rolleri."
                      : "Henüz üye yok. Davet linkini paylaş."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.members.map((m) => {
                    const isMe = m.id === viewerMemberId;
                    const hasComp = !!compByMember[m.id];
                    const initials = m.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    return (
                      <Tooltip key={m.id}>
                        <TooltipTrigger asChild>
                          <div
                            className="rounded-xl border border-white/10 p-4 cursor-pointer hover:bg-white/5 transition-all"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white/20">
                                  <AvatarFallback className="text-sm font-medium">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold truncate text-white">
                                      {m.name} {isMe && <span className="text-xs text-white/50 whitespace-nowrap">(Sen)</span>}
                                    </span>
                                  </div>
                                  {m.email && (
                                    <div className="text-xs text-white/50 truncate">{m.email}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex shrink-0 items-center gap-1.5 flex-wrap justify-end">
                                {m.role === "admin" ? (
                                  <Badge variant="info" className="gap-1 text-[10px] border-0 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                                    <Crown className="h-3 w-3 shrink-0" /> Yönetici
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] border-white/20 bg-white/5 text-white">Üye</Badge>
                                )}
                                {hasComp && (
                                  <Badge variant="success" className="text-[10px] border-0">
                                    <FileText className="h-3 w-3 mr-1 shrink-0" /> Hazır
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{m.name} - {m.role === 'admin' ? 'Yönetici' : 'Üye'}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </CardContent>
              </Card>

              {isAdmin && (
                <Card className="glass-card-dark border-0 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-white">
                      <Sparkles className="h-5 w-5 shrink-0" /> Kompozisyon Konusu
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Bir konu gir ve butona bas; yapay zeka her üye için farklı bir kompozisyon üretecek.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="topic" className="text-base font-semibold text-white/90">Konu</Label>
                        <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs gap-1 rounded-xl border-white/30 text-white hover:bg-white/10"
                              onClick={() => {
                                loadTopicSuggestions();
                              }}
                            >
                              <Lightbulb className="h-3 w-3" /> Konu Önerileri
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card-dark border-0 rounded-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Konu Önerileri</DialogTitle>
                              <DialogDescription className="text-white/70">
                                Bu konulardan birini seç veya kendi konunu yaz.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-2 max-h-96 overflow-y-auto">
                              {loadingSuggestions ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="h-6 w-6 animate-spin text-white/50" />
                                </div>
                              ) : (
                                suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    className="justify-start text-left h-auto py-3 px-4 rounded-xl border-white/20 text-white hover:bg-white/10"
                                    onClick={() => selectSuggestion(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Textarea
                        id="topic"
                        placeholder="Örnek: 'Sonbaharın insan üzerindeki etkisi' ya da 'Teknoloji ve çocukluk'"
                        value={topicText}
                        onChange={(e) => setTopicText(e.target.value)}
                        rows={4}
                        disabled={generating}
                        className="rounded-xl border-2 border-white/20 bg-white/10 text-foreground placeholder:text-white/40 focus:border-blue-400"
                      />
                    </div>
                    <Button
                      variant="gradient"
                      onClick={generateCompositions}
                      disabled={generating}
                      className="w-full gap-2 h-12 rounded-xl"
                      size="lg"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" /> Kompozisyonlar üretiliyor...
                        </>
                      ) : generatedCount > 0 ? (
                        <>
                          <RefreshCw className="h-4 w-4 shrink-0" /> Tekrar Üret
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 shrink-0" /> Kompozisyonları Üret
                        </>
                      )}
                    </Button>
                    {generating && (
                      <div className="space-y-2">
                        <Progress value={33} className="h-2 bg-white/10" />
                        <p className="text-xs text-white/60 text-center">Yapay zeka çalışıyor...</p>
                      </div>
                    )}
                    <p className="text-xs text-white/60 leading-relaxed">
                      Üretilen her kompozisyon birbirinden farklı ve özgündür. İstediğin kadar tekrar üretebilirsin.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-5 sm:space-y-6 lg:col-span-2 order-1 lg:order-2">
              <Card className="glass-card-dark border-0 shadow-xl rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <FileText className="h-5 w-5 shrink-0" /> Kompozisyonlar
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {isAdmin
                      ? "Tüm üyelerin kompozisyonlarını görebilirsin. Her bir metin özgündür."
                      : "Sadece kendine ait olan kompozisyonunu görebilirsin."}
                  </CardDescription>
                </CardHeader>
                <Separator className="border-white/10" />
                <CardContent className="pt-4 sm:pt-5">
                  {generatedCount === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-white/20 p-8 sm:p-12 text-center bg-white/5">
                      <FileText className="mx-auto h-12 w-12 sm:h-14 sm:w-14 text-blue-400/50 mb-4" />
                      {isAdmin ? (
                        <>
                          <p className="font-semibold mb-2 text-base sm:text-lg text-white">Henüz kompozisyon üretilmedi</p>
                          <p className="text-sm text-white/60 leading-relaxed">
                            Üstteki panelden bir konu gir ve "Kompozisyonları Üret" butonuna bas.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold mb-2 text-base sm:text-lg text-white">Kompozisyonun henüz hazır değil</p>
                          <p className="text-sm text-white/60 leading-relaxed">
                            Yönetici bir konu belirleyip kompozisyonları ürettikten sonra burada görünecek.
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-5">
                      {isAdmin ? (
                        data.members.map((m) => {
                          const comp = compByMember[m.id];
                          if (!comp) return null;
                          return (
                            <div key={m.id} className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 shrink-0 ring-2 ring-white/20">
                                    <AvatarFallback className="text-xs font-medium">
                                      {m.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-semibold text-base text-white">{m.name}</span>
                                </div>
                                {m.role === "admin" ? (
                                  <Badge variant="info" className="text-[10px] gap-1 border-0 bg-gradient-to-r from-blue-400 to-indigo-400 text-white">
                                    <Crown className="h-3 w-3 shrink-0" /> Yönetici
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] border-white/20 bg-white/5 text-white">Üye</Badge>
                                )}
                                {m.email && (
                                  <span className="text-xs text-white/50 truncate max-w-[180px]">{m.email}</span>
                                )}
                                <span className="w-full sm:w-auto sm:ml-auto text-xs text-white/50 order-last sm:order-none flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(comp.updated_at).toLocaleString("tr-TR")}
                                </span>
                              </div>
                              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground shadow-sm">
                                {comp.content}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-xs rounded-xl border-white/20 text-white hover:bg-white/10"
                                onClick={() => evaluateComposition(comp.content)}
                                disabled={evaluating}
                              >
                                <TrendingUp className="h-3 w-3" /> Değerlendir
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        (() => {
                          const mine = viewerMemberId ? compByMember[viewerMemberId] : null;
                          if (!mine) {
                            return (
                              <div className="rounded-2xl border-2 border-dashed border-white/20 p-8 sm:p-12 text-center bg-white/5">
                                <p className="font-semibold mb-2 text-base sm:text-lg text-white">Kompozisyonun henüz hazır değil</p>
                                <p className="text-sm text-white/60 leading-relaxed">
                                  Yönetici yeni bir üretim yaptığında burada görünecek.
                                </p>
                              </div>
                            );
                          }
                          const me = data.members.find((m) => m.id === viewerMemberId);
                          return (
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8 shrink-0 ring-2 ring-blue-400/30">
                                    <AvatarFallback className="text-xs font-medium">
                                      {me?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-semibold text-base text-white">Sizin Kompozisyonunuz</span>
                                </div>
                                {me && (
                                  <span className="text-sm text-white/60">({me.name})</span>
                                )}
                                <span className="w-full sm:w-auto sm:ml-auto text-xs text-white/50 order-last sm:order-none flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(mine.updated_at).toLocaleString("tr-TR")}
                                </span>
                              </div>
                              <div className="rounded-2xl border-2 border-blue-400/30 bg-blue-500/10 p-5 sm:p-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground shadow-sm">
                                {mine.content}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-xs rounded-xl border-white/20 text-white hover:bg-white/10"
                                onClick={() => evaluateComposition(mine.content)}
                                disabled={evaluating}
                              >
                                <TrendingUp className="h-3 w-3" /> Değerlendir
                              </Button>
                              <p className="text-xs text-white/50 pt-1 leading-relaxed">
                                Not: Diğer üyelerin kompozisyonlarını sadece yönetici görebilir.
                              </p>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </GradientBackground>
    </TooltipProvider>
  );
}
