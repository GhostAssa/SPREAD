import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Standardized 4-tab bottom nav. The design file's mockups actually
/// disagreed with each other screen-to-screen on what the 4 tabs were
/// (News/Confirmed/Drop-Tip/Profile on most screens, News/Tips/Saved/Profile
/// on the Profile screen's own nav) — this settles on one consistent set
/// used everywhere: News, Confirmed, Earn, Profile. Saved articles are
/// reachable from the Profile screen instead of a 5th/alternate tab.
enum SpreadTab { news, confirmed, earn, profile }

class SpreadBottomNav extends StatelessWidget {
  final SpreadTab active;
  final ValueChanged<SpreadTab> onTap;

  const SpreadBottomNav({super.key, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.secondaryFixed,
        border: Border(top: BorderSide(color: AppColors.primary, width: 2)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _item(SpreadTab.news, Icons.newspaper, 'News'),
            _item(SpreadTab.confirmed, Icons.verified, 'Confirmed'),
            _item(SpreadTab.earn, Icons.campaign, 'Earn'),
            _item(SpreadTab.profile, Icons.person, 'Profile'),
          ],
        ),
      ),
    );
  }

  Widget _item(SpreadTab tab, IconData icon, String label) {
    final isActive = tab == active;
    return GestureDetector(
      onTap: () => onTap(tab),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: isActive
            ? BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppRadius.full),
                boxShadow: brutalShadow(dx: 2, dy: 2),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: isActive ? AppColors.onPrimary : AppColors.onSurfaceVariant, size: 22),
            const SizedBox(height: 2),
            Text(
              label,
              style: AppText.labelSm.copyWith(
                color: isActive ? AppColors.onPrimary : AppColors.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
