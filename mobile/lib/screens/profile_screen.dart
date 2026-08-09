import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/submission.dart';
import '../services/auth_provider.dart';
import '../services/submission_service.dart';
import '../theme/app_theme.dart';
import '../widgets/spread_app_bar.dart';
import '../widgets/wavy_divider.dart';
import '../utils/currency.dart';
import 'login_screen.dart';
import 'saved_articles_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Future<List<SubmissionHistoryItem>>? _history;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (auth.loading) {
      return const Scaffold(
        appBar: SpreadAppBar(),
        body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
      );
    }

    if (!auth.isLoggedIn) {
      return Scaffold(
        appBar: const SpreadAppBar(),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.marginMobile),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.person_outline, size: 48, color: AppColors.primary),
                const SizedBox(height: AppSpacing.stackMd),
                Text('Not logged in', style: AppText.headlineMd),
                const SizedBox(height: AppSpacing.stackLg),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  ),
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  ),
                  child: Text('Log In / Sign Up', style: AppText.labelLg.copyWith(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      );
    }

    _history ??= SubmissionService.instance.history();
    final user = auth.user!;

    return Scaffold(
      appBar: const SpreadAppBar(),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.marginMobile),
        children: [
          Center(
            child: Column(
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerHigh,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.primary, width: 2),
                  ),
                  child: const Icon(Icons.person, size: 48, color: AppColors.primary),
                ),
                const SizedBox(height: AppSpacing.stackSm),
                Text(user.name, style: AppText.headlineLg),
                Text(user.email, style: AppText.bodyMd.copyWith(color: AppColors.onSurfaceVariant)),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: AppSpacing.stackLg),
            child: WavyDivider(),
          ),
          Text('Earnings', style: AppText.headlineSm),
          const SizedBox(height: AppSpacing.stackMd),
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  value: formatNaira(user.walletBalanceNaira),
                  label: 'Wallet Balance',
                  dark: true,
                ),
              ),
              const SizedBox(width: AppSpacing.unit),
              Expanded(
                child: _StatCard(
                  value: user.subscribed ? 'Active' : 'Inactive',
                  label: 'Verification Package',
                  dark: false,
                  valueColor: user.subscribed ? AppColors.moss : AppColors.error,
                ),
              ),
            ],
          ),
          if (!user.subscribed)
            Padding(
              padding: const EdgeInsets.only(top: AppSpacing.stackSm),
              child: Text(
                'Online payment isn\'t live yet — contact the newsroom to get your '
                '₦3,500/month package activated.',
                style: AppText.labelSm.copyWith(color: AppColors.outline),
              ),
            ),
          const SizedBox(height: AppSpacing.stackLg),
          Text('Your Submissions', style: AppText.headlineSm),
          const SizedBox(height: AppSpacing.stackMd),
          FutureBuilder<List<SubmissionHistoryItem>>(
            future: _history,
            builder: (context, snapshot) {
              if (!snapshot.hasData) {
                return const Center(child: CircularProgressIndicator(color: AppColors.primary));
              }
              final items = snapshot.data!;
              if (items.isEmpty) {
                return Text('Nothing submitted yet.',
                    style: AppText.bodyMd.copyWith(color: AppColors.onSurfaceVariant));
              }
              return Column(
                children: [
                  for (final item in items)
                    Container(
                      margin: const EdgeInsets.only(bottom: AppSpacing.stackSm),
                      padding: const EdgeInsets.all(AppSpacing.stackMd),
                      decoration: BoxDecoration(border: Border.all(color: AppColors.primary, width: 2)),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item.title, style: AppText.labelLg),
                                const SizedBox(height: 4),
                                Text(item.aiReason,
                                    style: AppText.labelSm.copyWith(color: AppColors.outline),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis),
                              ],
                            ),
                          ),
                          Text(
                            item.isVerified ? '+${formatNaira(item.payoutNaira)}' : 'Rejected',
                            style: AppText.labelSm.copyWith(
                              color: item.isVerified ? AppColors.moss : AppColors.error,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              );
            },
          ),
          const SizedBox(height: AppSpacing.stackLg),
          Text('Settings', style: AppText.headlineSm),
          const SizedBox(height: AppSpacing.stackMd),
          Container(
            decoration: BoxDecoration(border: Border.all(color: AppColors.primary, width: 2)),
            child: Column(
              children: [
                _settingsRow(
                  icon: Icons.bookmark_outline,
                  title: 'Saved Articles',
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const SavedArticlesScreen()),
                  ),
                ),
                const Divider(height: 1, color: AppColors.primary),
                _settingsRow(
                  icon: Icons.logout,
                  title: 'Log Out',
                  isDestructive: true,
                  onTap: () => auth.logout(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _settingsRow({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.stackMd),
        child: Row(
          children: [
            Icon(icon, color: isDestructive ? AppColors.error : AppColors.primary),
            const SizedBox(width: AppSpacing.stackMd),
            Expanded(
              child: Text(
                title,
                style: AppText.labelLg.copyWith(color: isDestructive ? AppColors.error : AppColors.primary),
              ),
            ),
            if (!isDestructive) const Icon(Icons.arrow_forward, color: AppColors.outline),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final bool dark;
  final Color? valueColor;

  const _StatCard({required this.value, required this.label, required this.dark, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.stackMd),
      decoration: BoxDecoration(
        color: dark ? AppColors.primary : AppColors.surface,
        border: Border.all(color: AppColors.primary, width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: AppText.display.copyWith(
              fontSize: 24,
              color: valueColor ?? (dark ? Colors.white : AppColors.primary),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label.toUpperCase(),
            style: AppText.labelSm.copyWith(color: dark ? Colors.white70 : AppColors.onSurfaceVariant),
          ),
        ],
      ),
    );
  }
}
