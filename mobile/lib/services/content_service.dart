import '../models/article.dart';
import '../models/fact.dart';
import '../models/campus_event.dart';
import 'api_service.dart';

class ContentService {
  ContentService._();
  static final ContentService instance = ContentService._();

  final _api = ApiService.instance;

  Future<List<Article>> getArticles() async {
    final data = await _api.get('/api/articles');
    final list = (data['articles'] as List<dynamic>? ?? []);
    return list.map((a) => Article.fromJson(a as Map<String, dynamic>)).toList();
  }

  Future<Article?> getArticle(String slug) async {
    final data = await _api.get('/api/articles/$slug');
    if (data['article'] == null) return null;
    return Article.fromJson(data['article'] as Map<String, dynamic>);
  }

  Future<List<Fact>> getFacts() async {
    final data = await _api.get('/api/facts');
    final list = (data['facts'] as List<dynamic>? ?? []);
    return list.map((f) => Fact.fromJson(f as Map<String, dynamic>)).toList();
  }

  Future<List<CampusEvent>> getEvents() async {
    final data = await _api.get('/api/events');
    final list = (data['events'] as List<dynamic>? ?? []);
    return list.map((e) => CampusEvent.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<String>> getTickerItems() async {
    final data = await _api.get('/api/settings');
    return (data['tickerItems'] as List<dynamic>? ?? []).cast<String>();
  }
}
