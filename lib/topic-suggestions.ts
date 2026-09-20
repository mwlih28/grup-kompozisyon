// Kompozisyon konu önerileri
export const topicSuggestions = [
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
      "Okul disi eğitim",
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
]

export function getRandomTopic(): string {
  const randomCategory = topicSuggestions[Math.floor(Math.random() * topicSuggestions.length)];
  const randomTopic = randomCategory.topics[Math.floor(Math.random() * randomCategory.topics.length)];
  return randomTopic;
}

export function getTopicsByCategory(category: string): string[] {
  const found = topicSuggestions.find(s => s.category === category);
  return found?.topics || [];
}

export function getAllCategories(): string[] {
  return topicSuggestions.map(s => s.category);
}

export function getAllTopics(): string[] {
  return topicSuggestions.flatMap(s => s.topics);
}