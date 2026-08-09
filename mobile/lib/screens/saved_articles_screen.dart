import 'package:flutter/material.dart';
import '../models/article.dart';
import '../services/bookmarks_service.dart';
import '../services/content_service.dart';
import '../theme/app_theme.dart';
import 'article_detail_screen.dart';

class SavedArticlesScreen extends StatefulWidget {
  const SavedArticlesScreen({super.key});

  @override
  State<SavedArticlesScreen> createState() => _SavedArticlesScreenState();
}

class _SavedArticlesScreenState extends State<SavedArticlesScreen> {
  late Future<List<Article>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<Article>> _load() async {
    final slugs = await BookmarksService.instance.getSlugs();
    final all = await ContentService.instance.getArticles();
    return all.where((a) => slugs.contains(a.slug)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text('Saved Articles', style: AppText.headlineMd),
      ),
      body: FutureBuilder<List<Article>>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }
          final articles = snapshot.data!;
          if (articles.isEmpty) {
            return Center(
              child: Text('Nothing saved yet — tap the bookmark icon on any story.',
                  style: AppText.bodyMd, textAlign: TextAlign.center),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.marginMobile),
            itemCount: articles.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.stackMd),
            itemBuilder: (context, i) {
              final article = articles[i];
              return GestureDetector(
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => ArticleDetailScreen(slug: article.slug)),
                ),
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.stackMd),
                  decoration: BoxDecoration(border: Border.all(color: AppColors.primary, width: 2)),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${article.category} · ${article.timeAgoLabel}',
                                style: AppText.labelSm.copyWith(color: AppColors.outline)),
                            const SizedBox(height: 4),
                            Text(article.title, style: AppText.headlineSm),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right, color: AppColors.primary),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
