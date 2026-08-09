class Fact {
  final String id;
  final String status; // verified | debunked
  final String category;
  final String chipColor;
  final String title;
  final String body;
  final List<String> sources;

  Fact({
    required this.id,
    required this.status,
    required this.category,
    required this.chipColor,
    required this.title,
    required this.body,
    required this.sources,
  });

  bool get isVerified => status == 'verified';

  factory Fact.fromJson(Map<String, dynamic> json) {
    return Fact(
      id: json['id'] as String,
      status: json['status'] as String,
      category: json['category'] as String,
      chipColor: json['chipColor'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      sources: (json['sources'] as List<dynamic>? ?? []).cast<String>(),
    );
  }
}
