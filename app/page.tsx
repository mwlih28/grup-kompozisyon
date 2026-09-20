"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, PenTool, Sparkles, Rocket, Loader2, ArrowRight, FileText, Send, Quote } from "lucide-react";
import { GradientBackground } from "@/components/gradient-background";
import { getApiUrl } from "@/lib/api-config";

export default function HomePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (groupName.trim().length < 2) errs.groupName = "Grup adı en az 2 karakter olmalı";
    if (adminName.trim().length < 2) errs.adminName = "Adınız en az 2 karakter olmalı";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(adminEmail.trim())) errs.adminEmail = "Geçerli e-posta giriniz";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/groups"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName.trim(),
          adminName: adminName.trim(),
          adminEmail: adminEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
      toast({ title: "Grup oluşturuldu!", description: "Arkadaşlarını davet etmeye hazırırsın.", variant: "success" });
      window.location.href = `/groups/${data.groupId}`;
    } catch (err: any) {
      console.error("Form submission error:", err);
      toast({ title: "Hata", description: err.message || "Grup oluşturulamadı.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackground intensity="medium" showFooter>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 md:py-12 relative z-10 flex-1">
        <div className="text-center mb-10 sm:mb-12">
          <div className="mb-5 sm:mb-6 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white shadow-2xl animate-pulse-glow">
            <Quote className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3 sm:mb-4">
            Grup Kompozisyon
          </h1>
          <p className="mx-auto max-w-xl text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
            Arkadaşlarınla birlikte, yapay zeka ile özgün kompozisyonlar yaz.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 lg:gap-10 md:grid-cols-2 items-start">
          <div className="space-y-5 sm:space-y-6 order-1 md:order-none animate-slide-in-left animate-delay-300">
            <Card className="glass-card-dark border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-white/5 pb-6 border-b border-white/10">
                <CardTitle className="flex items-center gap-3 text-2xl text-white">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-white shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  Grubunu Kur
                </CardTitle>
                <CardDescription className="text-white/80 text-base">
                  Yönetici olarak grup oluştur, arkadaşlarını davet et
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="groupName" className="text-base font-semibold text-white/90">Grup Adı</Label>
                    <Input
                      id="groupName"
                      placeholder="Örnek: 9-A Sınıfı Kompozisyon Grubu"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      disabled={loading}
                      autoComplete="off"
                      className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-foreground placeholder:text-white/40 focus:border-blue-400"
                    />
                    {errors.groupName && (
                      <p className="text-sm text-red-300 leading-tight pt-0.5">{errors.groupName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminName" className="text-base font-semibold text-white/90">Adın Soyadın</Label>
                    <Input
                      id="adminName"
                      placeholder="Örnek: Ayşe Yılmaz"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      disabled={loading}
                      autoComplete="name"
                      className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-foreground placeholder:text-white/40 focus:border-blue-400"
                    />
                    {errors.adminName && (
                      <p className="text-sm text-red-300 leading-tight pt-0.5">{errors.adminName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail" className="text-base font-semibold text-white/90">E-postan</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="ornek@email.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      disabled={loading}
                      autoComplete="email"
                      inputMode="email"
                      className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-foreground placeholder:text-white/40 focus:border-blue-400"
                    />
                    {errors.adminEmail && (
                      <p className="text-sm text-red-300 leading-tight pt-0.5">{errors.adminEmail}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full h-14 text-base font-semibold rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        Grubu Kur
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 order-2 md:order-none animate-slide-in-right animate-delay-500">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <Card className="glass-card-dark border-0 shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-default">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-white shadow-lg">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-white">Özgün İçerik</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Yapay zeka her üye için aynı konuda birbirinden farklı, özgün kompozisyonlar üretir.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card-dark border-0 shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-default">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-white shadow-lg">
                      <Send className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-white">Kolay Davet</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Tek tıkla kopyalanan davet linki ile arkadaşlarını e-posta, WhatsApp veya istediğin kanaldan davet et.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="glass-card-dark border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-white shadow-lg">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white">Nasıl Çalışır?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/80">
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-sm font-bold text-white shadow-lg">1</div>
                  <span className="pt-2 text-base">Grup kur ve bilgilerini gir.</span>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-sm font-bold text-white shadow-lg">2</div>
                  <span className="pt-2 text-base">Davet linkini arkadaşlarına gönder.</span>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-sm font-bold text-white shadow-lg">3</div>
                  <span className="pt-2 text-base">Bir konu belirle ve kompozisyonları üret.</span>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-sm font-bold text-white shadow-lg">4</div>
                  <span className="pt-2 text-base">Herkes kendi kompozisyonunu görür.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}
