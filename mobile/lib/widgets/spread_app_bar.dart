import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class SpreadAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback? onMenuTap;
  final VoidCallback? onActionTap;
  final IconData actionIcon;

  const SpreadAppBar({
    super.key,
    this.onMenuTap,
    this.onActionTap,
    this.actionIcon = Icons.sensors,
  });

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      decoration: const BoxDecoration(
        color: AppColors.tertiaryFixed,
        border: Border(bottom: BorderSide(color: AppColors.primary, width: 2)),
        boxShadow: [BoxShadow(color: AppColors.primary, offset: Offset(0, 3), blurRadius: 0)],
      ),
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.gutterMobile),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.sensors, color: AppColors.primary),
            onPressed: onMenuTap,
          ),
          Text('SPREAD', style: AppText.headlineMd.copyWith(letterSpacing: -0.5)),
          IconButton(
            icon: Icon(actionIcon, color: AppColors.primary),
            onPressed: onActionTap,
          ),
        ],
      ),
    );
  }
}
