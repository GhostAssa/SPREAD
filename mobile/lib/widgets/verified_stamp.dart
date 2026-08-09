import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum StampKind { verified, aiScreened, debunked, pending }

class VerifiedStamp extends StatelessWidget {
  final StampKind kind;

  const VerifiedStamp({super.key, required this.kind});

  @override
  Widget build(BuildContext context) {
    final (label, color, icon) = switch (kind) {
      StampKind.verified => ('HUMAN VERIFIED', AppColors.amber, Icons.verified),
      StampKind.aiScreened => ('AI-SCREENED', AppColors.moss, Icons.verified_user),
      StampKind.debunked => ('DEBUNKED', AppColors.error, Icons.cancel),
      StampKind.pending => ('PENDING VERIFICATION', AppColors.outline, Icons.hourglass_top),
    };

    return Transform.rotate(
      angle: kind == StampKind.debunked ? 0.05 : -0.08,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.surface.withValues(alpha: 0.92),
          border: Border.all(color: color, width: 2),
          borderRadius: BorderRadius.circular(999),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 4),
            Text(
              label,
              style: AppText.labelSm.copyWith(color: color, fontWeight: FontWeight.w900),
            ),
          ],
        ),
      ),
    );
  }
}
