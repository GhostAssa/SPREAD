import 'package:flutter/material.dart';
import '../models/fact.dart';
import '../services/content_service.dart';
import '../theme/app_theme.dart';
import '../widgets/spread_app_bar.dart';
import '../widgets/chip_badge.dart';
import '../widgets/wavy_divider.dart';

class ConfirmedFactsScreen extends StatefulWidget {
  const ConfirmedFactsScreen({super.key});

  @override
  State<ConfirmedFactsScreen> createState() => _ConfirmedFactsScreenState();
}

class _ConfirmedFactsScreenState extends State<ConfirmedFactsScreen> {
  late Future<List<Fact>> _future;
  String _query = '';
  String _filter = 'All';

  @override
  void initState() {
    super.initState();
    _future = ContentService.instance.getFacts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const SpreadAppBar(),
      body: FutureBuilder<List<Fact>>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator(color: AppColors.primary));
          }
          final facts = snapshot.data!;
          final categories = <String>{'All', ...facts.map((f) => f.category)}.toList();
          final filtered = facts.where((f) {
            final matchesFilter = _filter == 'All' || f.category == _filter;
            final matchesQuery = _query.isEmpty ||
                f.title.toLowerCase().contains(_query.toLowerCase()) ||
                f.body.toLowerCase().contains(_query.toLowerCase());
            return matchesFilter && matchesQuery;
          }).toList();

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.marginMobile),
            children: [
              TextField(
                onChanged: (v) => setState(() => _query = v),
                decoration: const InputDecoration(
                  hintText: 'Search verified facts...',
                  prefixIcon: Icon(Icons.search, color: AppColors.primary),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: AppColors.primary, width: 2),
                  ),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: AppColors.primary, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.stackMd),
              SizedBox(
                height: 44,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, i) {
                    final cat = categories[i];
                    final active = cat == _filter;
                    return GestureDetector(
                      onTap: () => setState(() => _filter = cat),
                      child: Container(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: active ? AppColors.primary : AppColors.tertiaryFixed,
                          border: Border.all(color: AppColors.primary, width: 2),
                        ),
                        child: Text(
                          cat,
                          style: AppText.labelLg.copyWith(
                            color: active ? Colors.white : AppColors.primary,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: AppSpacing.stackMd),
                child: WavyDivider(),
              ),
              for (final fact in filtered)
                Padding(
                  padding: const EdgeInsets.only(bottom: AppSpacing.stackMd),
                  child: _FactCard(fact: fact),
                ),
              if (filtered.isEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 40),
                  child: Text(
                    'No facts match that search yet.',
                    style: AppText.bodyMd,
                    textAlign: TextAlign.center,
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}

class _FactCard extends StatelessWidget {
  final Fact fact;
  const _FactCard({required this.fact});

  @override
  Widget build(BuildContext context) {
    final stampColor = fact.isVerified ? AppColors.amber : AppColors.error;
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.primary, width: 2),
        boxShadow: brutalShadow(),
      ),
      padding: const EdgeInsets.all(AppSpacing.unit),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            height: 110,
            decoration: BoxDecoration(
              color: AppColors.primary,
              border: Border.all(color: AppColors.primary, width: 2),
              borderRadius: BorderRadius.circular(AppRadius.tv),
            ),
            child: Stack(
              children: [
                Center(child: ChipBadge(label: fact.category, chipColor: fact.chipColor)),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.surface.withValues(alpha: 0.9),
                      border: Border.all(color: stampColor, width: 2),
                    ),
                    child: Text(
                      fact.isVerified ? 'VERIFIED' : 'DEBUNKED',
                      style: AppText.labelSm.copyWith(color: stampColor, fontWeight: FontWeight.w900),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 12, 4, 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(fact.title, style: AppText.headlineSm),
                const SizedBox(height: 4),
                Text(
                  fact.body,
                  style: AppText.bodyMd.copyWith(color: AppColors.onSurfaceVariant),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  'ID: ${fact.id} · Sources: ${fact.sources.join(", ")}',
                  style: AppText.labelSm.copyWith(color: AppColors.outline),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
