class NewsSubmissionResult {
  final String status; // verified | rejected
  final String reason;
  final int payoutNaira;
  final String? articleSlug;

  NewsSubmissionResult({
    required this.status,
    required this.reason,
    required this.payoutNaira,
    this.articleSlug,
  });

  bool get isVerified => status == 'verified';

  factory NewsSubmissionResult.fromJson(Map<String, dynamic> json) {
    return NewsSubmissionResult(
      status: json['status'] as String,
      reason: json['reason'] as String,
      payoutNaira: json['payoutNaira'] as int? ?? 0,
      articleSlug: json['articleSlug'] as String?,
    );
  }
}

class SubmissionHistoryItem {
  final String id;
  final String title;
  final String status;
  final String aiReason;
  final int payoutNaira;
  final String submittedAt;
  final String? articleSlug;

  SubmissionHistoryItem({
    required this.id,
    required this.title,
    required this.status,
    required this.aiReason,
    required this.payoutNaira,
    required this.submittedAt,
    this.articleSlug,
  });

  bool get isVerified => status == 'verified';

  factory SubmissionHistoryItem.fromJson(Map<String, dynamic> json) {
    return SubmissionHistoryItem(
      id: json['id'] as String,
      title: json['title'] as String,
      status: json['status'] as String,
      aiReason: json['aiReason'] as String,
      payoutNaira: json['payoutNaira'] as int? ?? 0,
      submittedAt: json['submittedAt'] as String,
      articleSlug: json['articleSlug'] as String?,
    );
  }
}
