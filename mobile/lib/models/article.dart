class ArticleBlock {
  final String type; // lead | paragraph | heading | quote
  final String text;
  final String? attribution;

  ArticleBlock({required this.type, required this.text, this.attribution});

  factory ArticleBlock.fromJson(Map<String, dynamic> json) {
    return ArticleBlock(
      type: json['type'] as String,
      text: json['text'] as String,
      attribution: json['attribution'] as String?,
    );
  }
}

class Article {
  final String slug;
  final String size; // feature | compact
  final String theme; // light | dark
  final String category;
  final String chipColor;
  final bool verified;
  final String title;
  final String excerpt;
  final String authorName;
  final String authorAvatarUrl;
  final String publishedAtLabel;
  final String timeAgoLabel;
  final String? heroImageUrl;
  final String heroImageAlt;
  final List<ArticleBlock> body;
  final List<String> breakdown;
  final String? relatedSlug;
  final String source; // editorial | community

  Article({
    required this.slug,
    required this.size,
    required this.theme,
    required this.category,
    required this.chipColor,
    required this.verified,
    required this.title,
    required this.excerpt,
    required this.authorName,
    required this.authorAvatarUrl,
    required this.publishedAtLabel,
    required this.timeAgoLabel,
    this.heroImageUrl,
    required this.heroImageAlt,
    required this.body,
    required this.breakdown,
    this.relatedSlug,
    required this.source,
  });

  bool get isCommunity => source == 'community';

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      slug: json['slug'] as String,
      size: json['size'] as String,
      theme: json['theme'] as String,
      category: json['category'] as String,
      chipColor: json['chipColor'] as String,
      verified: json['verified'] as bool? ?? false,
      title: json['title'] as String,
      excerpt: json['excerpt'] as String,
      authorName: json['authorName'] as String,
      authorAvatarUrl: json['authorAvatarUrl'] as String? ?? '',
      publishedAtLabel: json['publishedAtLabel'] as String,
      timeAgoLabel: json['timeAgoLabel'] as String,
      heroImageUrl: json['heroImageUrl'] as String?,
      heroImageAlt: json['heroImageAlt'] as String? ?? '',
      body: (json['body'] as List<dynamic>? ?? [])
          .map((b) => ArticleBlock.fromJson(b as Map<String, dynamic>))
          .toList(),
      breakdown: (json['breakdown'] as List<dynamic>? ?? []).cast<String>(),
      relatedSlug: json['relatedSlug'] as String?,
      source: json['source'] as String? ?? 'editorial',
    );
  }
}
