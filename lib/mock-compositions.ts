const basePool = [
  `Hayatimda okudugum en etkileyici kitap belki de bir cocuklugumda rastladigim basit bir hikaye kitabiydi. Kapagindaki renkli resimler beni hemen icine cekmis, sayfalari cevirdikce kendimi masal diyarinda bulmustum. Hikayedeki kahramanin karsilastigi zorluklar, onun azmi ve dogruluktan yana tavri beni derinden etkilemis, hatta anneme "Ben de onun gibi adil bir insan olacagim" diye soz vermistim. Yillar gecse de o kitapta ogrendigim degerler hayatimin her aninda yanimda duruyor; ne zaman zor bir kararla karsi karsiya kalsam, o kahramanin yuzunu ve onun "dogru olan her zaman gucludur" sozunu hatirliyorum. Bu yuzden kitaplarin sadece sayfadan ibaret olmadigini, iclerinde birer yasam rehberi barindirdigini dusunuyorum.`,

  `Bir sehir yasami icinde unuttugumuz en seylerden biri de dogayla kurdugumuz iliskidir. Hafta sonu kactigim kucuk bir dag yuruyusu bana bunu tekrar hatirlatti. Sabahin erken saatlerinde cikan gunesin isiklari arasindan gecen yapraklar, derdimi ucu ucuna degen kus sesleri ve topragin kokusu... Butun bunlar bana "gercek huzur" dedigimiz seyin aslinda cok basit seylerde oldugunu gosterdi. Telefonumu uzagima koydugum o saatler icinde ne bildirimler ne de bitmek bilmeyen mesajlar vardi; sadece ben ve etrafimdaki canli tablo. Sehre donunce hayat benzer sekilde akmaya devam etti ama icimde bir huzur kaldi; her gun 10 dakika bile olsa pencereden disari bakip dogaya "selam" demek artik benim icin bir aliskanlik haline geldi.`,

  `Arkadaslik kurmak bazen soylenildigi kadar kolay degildir; gercek bir arkadaslik icin zaman, anlayis ve karsilikli guven gerekir. Lisede tanistigim ve yillar gecmesine ragmen en guvendiğim bir arkadasim var; onunla aramizda hic anlatmadan birbirimizi anladigimiz anlar olur. Zor gunumde yanima gelip sadece ellerimi siktigi, kotu bir durumdayken sessizce benimle oturdugu anlari unutamam. "Arkadaslik sozlerle degil, davranislarla olur" diyen biriydi ve bunu bana her seferinde kanitladi. Bazen farkli sehirlerde yasasak da, gorusme sikligimiz azalsa da, gordugumde ayni samimiyetle karsilasan bir yuz oldugunu bilmek hayatimin en buyuk guclendiricilerinden biri.`,

  `Basariya giden yolun en onemli taslarindan biri de "pes etmemek"tir. Ilk okudugumuzda basaramayacagimizi dusundugumuz bir isin, defalarca denedikten sonra elimizde olmasi inanilmaz bir his verir. Universitede bir proje icin haftalarca ugrastigim bir donem aklimda; her denemede farkli bir hata cikiyordu, arkadaslarim vazgecmeni oneriyordu. "Birak, diger seylere odaklan" derken ben bir seyi hissediyordum: basarisizligin ardindaki o tek basarili deneme. Sonunda o an geldi ve proje sergide en begenilenlerden biri oldu. O gunden beri her zor isin onune dustugumde "bir kere daha dene" diyen kendi sesimi duyuyorum; cunku pes etmek en kolay secenektir, ama gercek kazanlar pes etmeyenlerdir.`,

  `Gunluk yasamda yaptigimiz kucuk degisiklikler, uzun vadede hayatin kalitesini belirler. Gecen yil bir karar alip her sabah 15 dakika erken kalkmaya basladim; ilk gunler zor olsa da aliskanlik haline gelmesiyle gunumun cok daha verimli gectigini fark ettim. Erken kalkip bir bardak sicak cay icmek, pencereden gunden ilk isiklari izlemek bana o gunun kontrolunu elimde aldigimi hissettiriyordu. Bununla birlikte yatmadan once 5 dakika gunu degerlendirmek, hangi isleri yapip hangilerini erteledigimi yazmak da bir sonraki gunumu duzenlememi sagladi. Bu kucuk adimlar, once onemsiz gibi dursa da bir yil sonra beni daha mutlu, daha duzenli ve daha huzurlu bir hale getirdi. Unutmamaliyiz ki buyuk degisiklikler kucuk adimlarla baslar.`,

  `Aile, hayatimizin en temel tasidir ve onun bize sagladigi destek hicbirseyle degismez. Cocuk oldugumuzda annemizin yemeklerine, babamizin tavsiyelerine karsilik vermedigimiz olur; buyuyunce ne kadar degerli olduklarini daha iyi anlariz. Bir isten ayrildigimda yanimda ailemden baskasi yoktu. Annem beni uzerinden almak icin her gun benimle ilgilendi, babam ise sessizce "Biliyorsun yeniden baslayabilirsin" dedi. Bu sozler beni ayağa kaldirdi. Ailemizin bize olan sevgisi kosulsuzdur; basarilarimizda bizimle sevinen, basarisizliklarimizda bizleri dusuren bir yapi vardir onlarda. Bu yuzden her firsatta ailemize sevgimizi gostermeli, onlarla gecirecegimiz zamani degerlendirmeliyiz.`,

  `Yaratıcılık, bazen sadece bir dusunce bicimidir. "Bu ise yaramaz" diye cöp kutusuna attigimiz fikirler, aslinda en guzel eserlerin tohumlari olabilir. Boyama yapmayi seven biri olarak, basta begenmedigim tuvallerin zamanla en cok sevdiklerim arsina girmesi beni sasirtti. Yanlis renk secimleri, bozuk cizgiler... Butun bunlar birlesip ortaya farkli bir eser cikartiyordu. Yaratıcılıkta "yanlis" diye bir sey yoktur; sadece olasi bir deneme vardır. Edebiyattan mimariye, muzikten bilime kadar her alanda bunu gorebiliriz: En buyuk buluslar, defalarca "yanlis" denemeler sonunda ortaya cikmistir. O yuzden aklimiza gelen fikirleri hemen reddetmemeli, uzerine dusunmeli ve ona sans vermeliyiz.`,

  `Zaman kavrami, cogu zaman bizim kontrolumuzde degil gibi gorunur ama aslinda zamanin kullanma bicimimiz hayatimizi belirler. Bir sene icinde neler yapabilecegimizi dusundugumuzda, zamanin nasil akip gittigini sasirtici buluyorum. Bugun yaptigim kucuk secimler - bir kitap okumak, bir arkadasla sohbet etmek, yeni bir sey ogrenmek - bir yil sonra bana yeni bir yetenek olarak geri donuyor. Zaman sadece gecen bir degil, birikim yapan bir seydir. Her animizi degerli kilmak icin zamanimizi bilincli kullanmaliyiz.`,

  `Sosyal medya dunyasinda hayatimiza giren degisiklikler sasirtici boyutta. Eskiden arkadaslarla bulusmak icin belirli bir yer ve zaman gerekirken, simdi bir bildirimle her an iletisim kurabiliyoruz. Ancak bu kolaylik bazen sariyorlar; sanal ortamda yakin hissettigimiz insanlarla gercek hayatta ne kadar tanisik oldugumuzu soruyorum kendime. Denge onemli - teknoloji bize baglanti kolayligi sagliyor ama gercek yakinliklar yuz yuze kurulan iliskilerden besleniyor. Sanal ve gercek dunya arasinda saglikli bir denge kurmak gerekli.`,

  `Dil ve iletişim, insanlar arasindaki en guclu baglardan biri. Farkli dilleri konusan insanlarla sohbet ettigimde, kelimelerin otesinde bir anlayis oldugunu fark ediyorum. Beden dili, ses tonu, goz teması... Butun bunlar kelimelerden daha cok sey soyluyor. Bir toplumda anlayisli iletişim, catisalari azaltir ve yakinlari artirir. Dinlemeyi ogrenmek, anlatilan degil anlatilmak isteneni anlamak, iletisimin en temel unsurlari. Iletisim sadece konusmak degil, anlamak ve anlasilmaktir.`,

  `Gelecek tasvirlemek insana guc verir ama ayri zamanda kaygi da yaratabilir. Genclikte kendimize koydugumuz hedefler, yillar icinde ne kadar degisebildigini gorumek beni sasirtiyor. Hayatta "tam istedigim gibi gitmedi" ama "belki daha iyi oldu" diyen durumlari bolca yasadim. Esneklik ve uyum yetenegi, bugunun dunyasında en onemli yeteneklerden biri. Gelecek belirsiz olabilir ama onu korkuyla degil, hazirlikla karsilayabiliriz. Her turlu senaryoya hazir olmak, en buyuk guvence olur.`,

  `Muzik, dunyadaki evrensel dillerden biri. Turkiyede dinledigim bir sarkinin, ABD'de de ayni duygulari uyandirdigini gordugumde muzigin gucunu daha iyi anladim. Cok farkli kulturlerin muzikleri arasinda benzerlikler var - ritim, melodi, harmoni... Bunlar insan ruhuna dokunan evrensel elementler. Muzik sadece eglence degil, bir duygu ifade bicimi. Zor zamanlarda bizi teselli eden, mutlu zamanlarda kutlama hissini artiran, duygularimizi ifade etmemize yardimci olan bir guc.`,

  `Bilim ve teknoloji, insan hayatini degistiren en buyuk guclerden biri. Cep telefonu icin cok basit bir uygulama gelistirmeye calisirken teknolojinin buyuklugunu fark ettim. Binlerce yil icinde edilmis tum bilgiler, internet uzerinden saniyeler icinde erisilebilir hale geldi. Ancak bu guc sorumluluk gerektiriyor. Teknolojiyi insan yararina kullanmak, ahlaki ve etik degerlerden uzaklastirmamak onemli. Bilim ve teknoloji, insanligin ilerlemesi icin gerekli ama insani degerleri gozetmeden ilerlemek tehlikeli olabilir.`,
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickMockCompositions(count: number, topic: string, memberNames: string[]): string[] {
  // Konuya göre daha alakalı temaları seç
  const topicLower = topic.toLowerCase();
  let relevantPool = basePool;
  
  // Basit anahtar kelime eşleştirmesi
  if (topicLower.includes('teknoloji') || topicLower.includes('bilgisayar') || topicLower.includes('internet')) {
    relevantPool = basePool.filter(text => 
      text.includes('teknoloji') || text.includes('bilim') || text.includes('zaman')
    );
  } else if (topicLower.includes('arkadaş') || topicLower.includes('iletişim') || topicLower.includes('sosyal')) {
    relevantPool = basePool.filter(text => 
      text.includes('arkadaş') || text.includes('iletişim') || text.includes('sosyal')
    );
  } else if (topicLower.includes('aile') || topicLower.includes('anne') || topicLower.includes('baba')) {
    relevantPool = basePool.filter(text => 
      text.includes('aile') || text.includes('anne') || text.includes('baba')
    );
  } else if (topicLower.includes('kitap') || topicLower.includes('okuma') || topicLower.includes('yazı')) {
    relevantPool = basePool.filter(text => 
      text.includes('kitap') || text.includes('okumak') || text.includes('yaratıcı')
    );
  }
  
  // Eğer yeterli ilgili tema yoksa, tüm havuzu kullan
  if (relevantPool.length < 2) {
    relevantPool = basePool;
  }
  
  const pool = shuffle(relevantPool);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length];
    const name = memberNames[i] || "Arkadas";
    const topicHeader = `"${topic}" konusu uzerine ${name} icin ozgun bir kompozisyon:\n\n`;
    
    // Her kişi için farklı kapanış cümlesi
    const closingOptions = [
      `\n\nBu konuyu calisirken kendi deneyimlerimden yola cikmak, bana konuyu daha samimi bir dille anlatma firsatti. Umuyorum ki bu yazdıklarım, konuyu daha iyi anlamana yardimci olur.`,
      `\n\nSonuc olarak, her konunun birden fazla bakis acisi vardir; ben bu yazida kendi penceremden aktardim. Sen de kendi yorumunla bunu zenginlestirebilirsin.`,
      `\n\nYazarken farkli perspektifleri de goz onune aldim. Umarim bu bakis acisi, konuyu daha genis bir cercevede anlamana yardimci olur.`,
      `\n\nBu yaziyi hazirlarken hem teorik bilgilerimi hem de kendi goruslerimi kullanmaya calistim. Gercek bir deneyim oldugunu umuyorum.`
    ];
    
    const fillerExtra = closingOptions[i % closingOptions.length];
    result.push((topicHeader + base + fillerExtra).trim());
  }
  return result;
}

export async function generateWithLLM(
  topic: string,
  memberName: string,
  otherMembers: string[]
): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!groqKey && !openaiKey) {
    return pickMockCompositions(1, topic, [memberName])[0];
  }

  const othersList = otherMembers.slice(0, 5).map((n, i) => `${i + 1}. ${n}`).join("\n");
  const system = `Sen yardimci bir Turkce kompozisyon yazarisin. Kullaniciya verilen konu uzerine, 250-400 kelime arasi, akici, ozgun ve duygusal bir kompozisyon yaz. Kompozisyon giriş-gelişme-sonuc yapisinda olsun. Baska gruptaki arkadaslarina yazilacak metinlerle tamamen farkli olmasi icin farkli bir giris, farkli ornekler ve farkli bir sonuc kullan. Konuya her zaman giris paragrafiyla basla, akici bir dille yaz. Daha cok ozgun ve yaratici olmak icin degisik bakis acilarinden yararlan, guncel ornekler ver ve kisisel dokunuşlarla destekle.`;
  const user = `Konusu: ${topic}\nKompozisyonu okuyacak kisi: ${memberName}\nGruptaki diger kisiler (onlarin kompozisyonlari senden farkli olacak):\n${othersList || "(yok)"}\n\nBu konuda bu kisi icin ozgun bir Turkce kompozisyon uret. Guncel olaylardan, guncel teknolojilerden veya gunumuz dunyasindan ornekler kullanarak daha ilgi cekici hale getir.`;

  const providers = groqKey
    ? [
        {
          name: "groq",
          url: "https://api.groq.com/openai/v1/chat/completions",
          key: groqKey,
          model: "qwen/qwen3.8-27b",
        },
      ]
    : [];

  if (openaiKey) {
    providers.push({
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: "gpt-4o-mini",
    });
  }

  for (const provider of providers) {
    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.key}`,
        },
        body: JSON.stringify({
          model: provider.model,
          temperature: 0.95,
          max_tokens: 800,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) {
        console.warn(`[${provider.name}] LLM request failed: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.length > 50) return content.trim();
      console.warn(`[${provider.name}] LLM empty response`);
    } catch (e) {
      console.warn(`[${provider.name}] LLM hatasi:`, e);
    }
  }

  return pickMockCompositions(1, topic, [memberName])[0];
}

export { basePool };