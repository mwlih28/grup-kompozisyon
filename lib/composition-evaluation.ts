export interface CompositionEvaluation {
  structure: number; // 0-100
  originality: number; // 0-100
  relevance: number; // 0-100
  languageQuality: number; // 0-100
  readability: number; // 0-100
  overallScore: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface CompositionAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  avgWordLength: number;
  uniqueWords: number;
  vocabularyRichness: number; // uniqueWords / wordCount
  readingTime: number; // minutes
}

export function analyzeComposition(text: string): CompositionAnalysis {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;
  
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const avgWordLength = wordCount > 0 ? words.reduce((sum, w) => sum + w.length, 0) / wordCount : 0;
  
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const vocabularyRichness = wordCount > 0 ? uniqueWords / wordCount : 0;
  
  const readingTime = wordCount / 200; // 200 words per minute average
  
  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgSentenceLength,
    avgWordLength,
    uniqueWords,
    vocabularyRichness,
    readingTime
  };
}

export function evaluateComposition(text: string, topic: string): CompositionEvaluation {
  const analysis = analyzeComposition(text);
  
  // Yapı puanı
  let structure = 50;
  if (analysis.paragraphCount >= 3) structure += 20;
  if (analysis.paragraphCount >= 5) structure += 10;
  if (analysis.avgSentenceLength >= 10 && analysis.avgSentenceLength <= 25) structure += 10;
  if (analysis.sentenceCount >= 5) structure += 10;
  
  // Orijinalite puanı
  let originality = 70;
  if (analysis.vocabularyRichness > 0.6) originality += 15;
  if (analysis.vocabularyRichness > 0.7) originality += 15;
  
  // İlgililik puanı
  let relevance = 80;
  const topicLower = topic.toLowerCase();
  const textLower = text.toLowerCase();
  const topicWords = topicLower.split(/\s+/);
  const matchedWords = topicWords.filter(word => textLower.includes(word));
  if (matchedWords.length > 0) relevance += 10;
  if (matchedWords.length > 1) relevance += 10;
  
  // Dil kalitesi puanı
  let languageQuality = 75;
  if (analysis.avgWordLength >= 4 && analysis.avgWordLength <= 6) languageQuality += 15;
  if (analysis.uniqueWords > 50) languageQuality += 10;
  
  // Okunabilirlik puanı
  let readability = 70;
  if (analysis.avgSentenceLength >= 10 && analysis.avgSentenceLength <= 20) readability += 20;
  if (analysis.paragraphCount >= 3) readability += 10;
  
  // Genel puan
  const overallScore = Math.round(
    (structure * 0.25 + originality * 0.2 + relevance * 0.25 + languageQuality * 0.15 + readability * 0.15)
  );
  
  // Geri bildirim oluştur
  const feedback = generateFeedback(overallScore, analysis);
  
  // Güçlü yönler
  const strengths: string[] = [];
  if (structure >= 80) strengths.push("İyi yapılandırılmış kompozisyon");
  if (originality >= 80) strengths.push("Yaratıcı ve özgün ifade");
  if (relevance >= 80) strengths.push("Konuya uygun içerik");
  if (languageQuality >= 80) strengths.push("İyi dil kullanımı");
  if (readability >= 80) strengths.push("Akıcı ve anlaşılır");
  
  // İyileştirme önerileri
  const improvements: string[] = [];
  if (structure < 70) improvements.push("Kompozisyon yapısını güçlendirin");
  if (originality < 70) improvements.push("Daha özgün ifadeler kullanın");
  if (relevance < 70) improvements.push("Konuya daha fazla odaklanın");
  if (languageQuality < 70) improvements.push("Dil kalitesini artırın");
  if (readability < 70) improvements.push("Okunabilirliği iyileştirin");
  if (analysis.wordCount < 100) improvements.push("Kompozisyonu uzatın");
  
  return {
    structure: Math.min(100, structure),
    originality: Math.min(100, originality),
    relevance: Math.min(100, relevance),
    languageQuality: Math.min(100, languageQuality),
    readability: Math.min(100, readability),
    overallScore,
    feedback,
    strengths,
    improvements
  };
}

function generateFeedback(score: number, analysis: CompositionAnalysis): string {
  if (score >= 90) {
    return "Mükemmel bir kompozisyon! Yapı, içerik ve dil kalitesi açısından çok başarılı.";
  } else if (score >= 80) {
    return "Çok iyi bir kompozisyon. Küçük iyileştirmelerle daha da mükemmel olabilir.";
  } else if (score >= 70) {
    return "İyi bir kompozisyon. Bazı alanlarda gelişme potansiyeli var.";
  } else if (score >= 60) {
    return "Orta seviye bir kompozisyon. İyileştirme önerilerine dikkat edin.";
  } else {
    return "Kompozisyon geliştirilmeye ihtiyaç duyuyor. Yapı ve içerik üzerinde çalışın.";
  }
}