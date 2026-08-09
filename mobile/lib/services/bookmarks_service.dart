import 'package:shared_preferences/shared_preferences.dart';

/// On-device bookmarks. There's no bookmarking backend on the web app (it
/// was never built there either), so this keeps saved articles local to
/// the device rather than inventing a new server feature the web app
/// doesn't have.
class BookmarksService {
  BookmarksService._();
  static final BookmarksService instance = BookmarksService._();

  static const _key = 'spread_saved_articles';

  Future<List<String>> getSlugs() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_key) ?? [];
  }

  Future<bool> isSaved(String slug) async => (await getSlugs()).contains(slug);

  Future<void> toggle(String slug) async {
    final prefs = await SharedPreferences.getInstance();
    final slugs = prefs.getStringList(_key) ?? [];
    if (slugs.contains(slug)) {
      slugs.remove(slug);
    } else {
      slugs.add(slug);
    }
    await prefs.setStringList(_key, slugs);
  }
}
