import '../models/submission.dart';
import 'api_service.dart';

class SubmissionService {
  SubmissionService._();
  static final SubmissionService instance = SubmissionService._();

  final _api = ApiService.instance;

  /// Returns the result on success, or throws a String error message.
  Future<NewsSubmissionResult> submit({
    required String title,
    required String body,
    required String evidenceNote,
  }) async {
    final data = await _api.post('/api/submissions', {
      'title': title,
      'body': body,
      'evidenceNote': evidenceNote,
    });
    if (data['_statusCode'] != 200) {
      throw (data['error'] as String? ?? 'Something went wrong.');
    }
    return NewsSubmissionResult.fromJson(data);
  }

  Future<List<SubmissionHistoryItem>> history() async {
    final data = await _api.get('/api/submissions');
    if (data['_statusCode'] != 200) return [];
    final list = (data['submissions'] as List<dynamic>? ?? []);
    return list.map((s) => SubmissionHistoryItem.fromJson(s as Map<String, dynamic>)).toList();
  }
}
