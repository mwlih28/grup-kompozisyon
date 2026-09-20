import { NextRequest, NextResponse } from 'next/server';
import { getRandomTopic, getAllTopics, getAllCategories } from '@/lib/topic-suggestions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const count = parseInt(searchParams.get('count') || '5');

  try {
    if (category) {
      const topics = category === 'all' 
        ? getAllTopics()
        : getAllCategories().includes(category)
          ? getTopicsByCategory(category)
          : [];
      
      const shuffled = topics.sort(() => Math.random() - 0.5);
      return NextResponse.json({
        success: true,
        category,
        topics: shuffled.slice(0, count)
      });
    }

    // Rastgele tek konu döndür
    const randomTopic = getRandomTopic();
    return NextResponse.json({
      success: true,
      topic: randomTopic
    });
  } catch (error) {
    console.error('Topic suggestion error:', error);
    return NextResponse.json(
      { success: false, error: 'Konu önerisi alınamadı' },
      { status: 500 }
    );
  }
}

// Topic suggestions helper
function getTopicsByCategory(category: string): string[] {
  const topicSuggestions = [
    {
      category: "Teknoloji",
      topics: [
        "Yapay zeka ve insanlık",
        "Sosyal medyanın etkileri",
        "İnternet güvenliği",
        "Teknoloji bağımlılığı",
        "Oyun dünyası",
        "Uzay teknolojileri"
      ]
    },
    {
      category: "Eğitim",
      topics: [
        "Okumanın önemi",
        "Öğretmenlerin rolü",
        "Öğrenme yöntemleri",
        "Okul dışı eğitim",
        "Kariyer planlama"
      ]
    },
    {
      category: "İletişim",
      topics: [
        "Arkadaşlık ilişkileri",
        "Aile içi iletişim",
        "Sosyal medya iletişimi",
        "Dil ve kültür",
        "Empati kurmak"
      ]
    },
    {
      category: "Sağlık",
      topics: [
        "Fiziksel egzersiz",
        "Mental sağlık",
        "Dengeli beslenme",
        "Uyku düzeni",
        "Stres yönetimi"
      ]
    },
    {
      category: "Çevre",
      topics: [
        "Doğa koruma",
        "İklim değişikliği",
        "Geri dönüşüm",
        "Sürdürülebilirlik",
        "Yeşil enerji"
      ]
    },
    {
      category: "Kültür",
      topics: [
        "Sanat ve yaratıcılık",
        "Müzik ve sanat",
        "Edebiyat dünyası",
        "Kültürel miras",
        "Modern sanat"
      ]
    },
    {
      category: "Toplum",
      topics: [
        "Sosyal adalet",
        "Gönüllülük",
        "Toplumsal sorumluluk",
        "Kültürel çeşitlilik",
        "İnsan hakları"
      ]
    },
    {
      category: "Gelecek",
      topics: [
        "Gelecek tahminleri",
        "Kariyer hedefleri",
        "Teknolojik gelişmeler",
        "Dünya değişimleri",
        "Kişisel gelişim"
      ]
    }
  ];

  const found = topicSuggestions.find(s => s.category === category);
  return found?.topics || [];
}