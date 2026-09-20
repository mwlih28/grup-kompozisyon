"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, Users, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { GradientBackground } from "@/components/gradient-background";
import { getApiUrl } from "@/lib/api-config";

export default function JoinPage({ params }: { params: { inviteCode: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
           const res = await fetch(getApiUrl(`/api/groups/lookup?inviteCode=${encodeURIComponent(params.inviteCode)}`));
        if (res.ok) {
          const data = await res.json();
          setGroupName(data.name || null);
        } else {
          setInvalid(true);
        }
      } catch {
        setInvalid(true);
      } finally {
        setChecking(false);
      }
    })();
  }, [params.inviteCode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Adınız en az 2 karakter olmalı";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) errs.email = "Geçerli e-posta giriniz";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/members"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: params.inviteCode,
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bir hata oluştu");
      toast({ title: "Gruba katıldın!", description: "Kompozisyonları görmek için panel yönlendiriliyorsun.", variant: "success" });
      router.push(`/groups/${data.groupId}`);
    } catch (err: any) {
      toast({ title: "Hata", description: err.message || "Katılım sağlanamadı.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackground intensity="medium" showFooter>
      <div className="container mx-auto max-w-xl px-4 py-8 sm:py-10 md:py-12 flex-1 flex items-center justify-center">
        <Link
          href="/"
          className="mb-5 sm:mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" /> Ana sayfaya dön
        </Link>

        {checking ? (
          <Card className="glass-card-dark border-0 shadow-2xl rounded-2xl w-full">
            <CardContent className="py-10 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 text-white animate-pulse-glow">
                  <Sparkles className="h-8 w-8" />
                </div>
                <p className="text-white/70">Davet bağlantısı kontrol ediliyor...</p>
                <Skeleton className="h-2 w-48 bg-white/10" />
              </div>
            </CardContent>
          </Card>
        ) : invalid ? (
          <Card className="glass-card-dark border-0 shadow-2xl rounded-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-red-300">
                <AlertCircle className="h-5 w-5 shrink-0" /> Geçersiz Davet Bağlantısı
              </CardTitle>
              <CardDescription className="text-white/70 leading-relaxed">
                Bu davet kodu kayıtlı bir grupla eşleşmiyor. Linkin doğru olduğundan emin ol.
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
        ) : (
          <Card className="glass-card-dark border-0 shadow-2xl rounded-2xl w-full hover:shadow-soft-2xl transition-all hover:-translate-y-1">
            <CardHeader className="bg-white/5 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl text-white">Gruba Katıl</CardTitle>
              </div>
              <CardDescription className="text-white/80 leading-relaxed text-base">
                {groupName ? (
                  <><strong className="text-white">{groupName}</strong> grubuna katılmak için bilgilerini gir.</>
                ) : (
                  "Bilgilerini girerek gruba katıl."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-white/90">Adın Soyadın</Label>
                  <Input
                    id="name"
                    placeholder="Örnek: Mehmet Kaya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    autoComplete="name"
                    className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-foreground placeholder:text-white/40 focus:border-blue-400"
                  />
                  {errors.name && <p className="text-sm text-red-300 leading-tight pt-0.5">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-white/90">E-postan</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    inputMode="email"
                    className="h-12 text-base rounded-xl bg-white/10 border-white/20 text-foreground placeholder:text-white/40 focus:border-blue-400"
                  />
                  {errors.email && <p className="text-sm text-red-300 leading-tight pt-0.5">{errors.email}</p>}
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-14 text-base font-semibold rounded-xl"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Katılıyor...
                    </>
                  ) : "Gruba Katıl"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </GradientBackground>
  );
}
