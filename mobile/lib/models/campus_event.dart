class CampusEvent {
  final String slug;
  final String title;
  final String date;
  final String location;
  final String category;
  final String chipColor;
  final String description;

  CampusEvent({
    required this.slug,
    required this.title,
    required this.date,
    required this.location,
    required this.category,
    required this.chipColor,
    required this.description,
  });

  factory CampusEvent.fromJson(Map<String, dynamic> json) {
    return CampusEvent(
      slug: json['slug'] as String,
      title: json['title'] as String,
      date: json['date'] as String,
      location: json['location'] as String,
      category: json['category'] as String,
      chipColor: json['chipColor'] as String,
      description: json['description'] as String,
    );
  }
}
