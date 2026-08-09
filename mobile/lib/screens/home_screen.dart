import 'package:flutter/material.dart';
import '../models/article.dart';
import '../models/fact.dart';
import '../services/content_service.dart';
import '../theme/app_theme.dart';
import '../widgets/spread_app_bar.dart';
import '../widgets/marquee_ticker.dart';
import '../widgets/wavy_divider.dart';
import '../widgets/verified_stamp.dart';
import '../widgets/chip_badge.dart';
import 'article_detail_screen.dart';
import 'submit_news_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<_HomeData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_HomeData> _load() async {
    final content = ContentService.instance;
    final results = await Future.wait([
      content.getArticles(),
      content.getFacts(),
      content.getTickerItems(),
    ]);
    return _HomeData(
      articles: results[0] as List<Article>,
      facts: results[1] as List<Fact>,
      ticker: results[2] as List<String>,
    );
  }

  Future<void> _refresh() async {
    setState(() => _future = _load());
    await _future;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const SpreadAppBar(),
      body: FutureBuilder<_HomeData>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Text(
                    "Couldn't reach Spread. Check kApiBaseUrl in api_service.dart matches your backend.",
                    style: AppText.bodyMd,
                    textAlign: TextAlign.center,
                  ),
                ),
              );
            }
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }

          final data = snapshot.data!;
          final verifiedCount = data.facts.where((f) => f.isVerified).length +
              data.articles.where((a) => a.verified).length;

          return RefreshIndicator(
            color: AppColors.primary,
            onRefresh: _refresh,
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: AppSpacing.stackSm),
              children: [
                if (data.ticker.isNotEmpty) MarqueeTicker(items: data.ticker),
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.marginMobile,
                    AppSpacing.stackLg,
                    AppSpacing.marginMobile,
                    0,
                  ),
                  child: _HeroCard(verifiedCount: verifiedCount),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: AppSpacing.stackMd),
                  child: WavyDivider(),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.marginMobile),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(children: [
                            const Icon(Icons.tv, color: AppColors.primary),
                            const SizedBox(width: 8),
                            Text('ON AIR', style: AppText.headlineSm),
                          ]),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceContainerHigh,
                              border: Border.all(color: AppColors.primary, width: 2),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text('University of Ibadan', style: AppText.labelSm),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.stackMd),
                      for (final article in data.articles)
                        Padding(
                          padding: const EdgeInsets.only(bottom: AppSpacing.stackMd),
                          child: _OnAirCard(article: article),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _HomeData {
  final List<Article> articles;
  final List<Fact> facts;
  final List<String> ticker;
  _HomeData({required this.articles, required this.facts, required this.ticker});
}

class _HeroCard extends StatelessWidget {
  final int verifiedCount;
  const _HeroCard({required this.verifiedCount});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.secondaryFixed,
        border: Border.all(color: AppColors.primary, width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Total Verified Stories', style: AppText.headlineSm),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text('$verifiedCount', style: AppText.display),
              const SizedBox(width: 8),
              Text('and counting', style: AppText.labelLg.copyWith(color: AppColors.onSurfaceVariant)),
            ],
          ),
          const SizedBox(height: AppSpacing.stackMd),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.cream,
              border: Border.all(color: AppColors.primary, width: 1.5),
            ),
            child: Text(
              'Spread & Earn: got news worth sharing? Submit it for AI screening — verified '
              'stories publish instantly and earn you a real payout. Starting right here at UI, '
              'before it spreads everywhere else.',
              style: AppText.bodyMd,
            ),
          ),
          const SizedBox(height: AppSpacing.stackMd),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: const RoundedRectangleBorder(
                  side: BorderSide(color: AppColors.primary, width: 2),
                  borderRadius: BorderRadius.zero,
                ),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const SubmitNewsScreen()),
              ),
              child: Text('SUBMIT NEWS & EARN', style: AppText.labelLg.copyWith(color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }
}

class _OnAirCard extends StatelessWidget {
  final Article article;
  const _OnAirCard({required this.article});

  @override
  Widget build(BuildContext context) {
    final stamp = article.isCommunity
        ? StampKind.aiScreened
        : (article.verified ? StampKind.verified : StampKind.pending);

    return GestureDetector(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => ArticleDetailScreen(slug: article.slug)),
      ),
      child: Container(
        decoration: BoxDecoration(border: Border.all(color: AppColors.primary, width: 2)),
        padding: const EdgeInsets.all(6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.tv),
              child: Stack(
                children: [
                  SizedBox(
                    height: 180,
                    width: double.infinity,
                    child: article.heroImageUrl != null
                        ? Image.network(article.heroImageUrl!, fit: BoxFit.cover)
                        : Container(
                            color: AppColors.primary,
                            child: Center(
                              child: ChipBadge(label: article.category, chipColor: article.chipColor),
                            ),
                          ),
                  ),
                  Positioned(top: 8, left: 8, child: VerifiedStamp(kind: stamp)),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(article.title, style: AppText.headlineSm.copyWith(fontSize: 17)),
                  const SizedBox(height: 4),
                  Text(
                    article.excerpt,
                    style: AppText.bodyMd.copyWith(color: AppColors.onSurfaceVariant),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
