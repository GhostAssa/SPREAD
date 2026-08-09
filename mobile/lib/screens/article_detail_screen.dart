import 'package:flutter/material.dart';
import '../models/article.dart';
import '../services/bookmarks_service.dart';
import '../services/content_service.dart';
import '../theme/app_theme.dart';
import '../widgets/verified_stamp.dart';
import '../widgets/wavy_divider.dart';

class ArticleDetailScreen extends StatefulWidget {
  final String slug;
  const ArticleDetailScreen({super.key, required this.slug});

  @override
  State<ArticleDetailScreen> createState() => _ArticleDetailScreenState();
}

class _ArticleDetailScreenState extends State<ArticleDetailScreen> {
  late Future<Article?> _future;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _future = ContentService.instance.getArticle(widget.slug);
    BookmarksService.instance.isSaved(widget.slug).then((v) {
      if (mounted) setState(() => _saved = v);
    });
  }

  Future<void> _toggleSaved() async {
    await BookmarksService.instance.toggle(widget.slug);
    setState(() => _saved = !_saved);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        leading: const BackButton(color: AppColors.primary),
        title: Text('SPREAD', style: AppText.headlineMd),
        centerTitle: false,
        actions: [
          IconButton(
            icon: Icon(_saved ? Icons.bookmark : Icons.bookmark_border, color: AppColors.primary),
            onPressed: _toggleSaved,
          ),
        ],
      ),
      body: FutureBuilder<Article?>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }
          final article = snapshot.data;
          if (article == null) {
            return const Center(child: Text('Story not found.'));
          }

          final stamp = article.isCommunity
              ? StampKind.aiScreened
              : (article.verified ? StampKind.verified : StampKind.pending);

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.marginMobile),
            children: [
              if (article.heroImageUrl != null)
                Container(
                  decoration: BoxDecoration(border: Border.all(color: AppColors.primary, width: 2)),
                  padding: const EdgeInsets.all(4),
                  margin: const EdgeInsets.only(bottom: AppSpacing.stackLg),
                  child: Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: Image.network(
                          article.heroImageUrl!,
                          height: 260,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(bottom: 12, left: 12, child: VerifiedStamp(kind: stamp)),
                    ],
                  ),
                )
              else
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.stackMd),
                  child: VerifiedStamp(kind: stamp),
                ),

              Text(article.title, style: AppText.display.copyWith(fontSize: 30, height: 1.15)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [
                  Text('By ${article.authorName}',
                      style: AppText.labelSm.copyWith(color: AppColors.outline)),
                  Text('•', style: AppText.labelSm.copyWith(color: AppColors.outline)),
                  Text(article.publishedAtLabel,
                      style: AppText.labelSm.copyWith(color: AppColors.outline)),
                ],
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: AppSpacing.stackMd),
                child: Divider(color: AppColors.primary, thickness: 2),
              ),

              if (article.breakdown.isNotEmpty)
                Container(
                  margin: const EdgeInsets.only(bottom: AppSpacing.stackLg),
                  padding: const EdgeInsets.all(AppSpacing.stackMd),
                  decoration: BoxDecoration(
                    color: AppColors.sand,
                    border: Border.all(color: AppColors.primary, width: 2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('The Breakdown', style: AppText.headlineSm),
                      const SizedBox(height: 12),
                      for (final point in article.breakdown)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.campaign, size: 18, color: AppColors.primary),
                              const SizedBox(width: 8),
                              Expanded(child: Text(point, style: AppText.bodyMd)),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),

              for (final block in article.body) _buildBlock(block),

              const Padding(
                padding: EdgeInsets.symmetric(vertical: AppSpacing.stackLg),
                child: WavyDivider(),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildBlock(ArticleBlock block) {
    switch (block.type) {
      case 'lead':
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.stackMd),
          child: Text(
            block.text,
            style: AppText.bodyLg.copyWith(fontWeight: FontWeight.w700, height: 1.5),
          ),
        );
      case 'heading':
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.stackSm),
          child: Text(block.text, style: AppText.headlineSm),
        );
      case 'quote':
        return Container(
          margin: const EdgeInsets.symmetric(vertical: AppSpacing.stackMd),
          padding: const EdgeInsets.all(AppSpacing.stackMd),
          decoration: const BoxDecoration(
            border: Border(left: BorderSide(color: AppColors.primary, width: 4)),
            color: AppColors.surface,
          ),
          child: Text(
            block.attribution != null ? '"${block.text}" — ${block.attribution}' : '"${block.text}"',
            style: AppText.headlineSm.copyWith(fontStyle: FontStyle.italic),
          ),
        );
      default:
        return Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.stackMd),
          child: Text(block.text, style: AppText.bodyLg.copyWith(height: 1.5)),
        );
    }
  }
}
