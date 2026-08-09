import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Maps the web app's ChipColor tokens (teal/clay/plum/moss/indigo/pink) to
/// concrete colors, so category chips read the same on mobile as on web.
const Map<String, Color> kChipColors = {
  'teal': Color(0xFF106969),
  'clay': Color(0xFFC0522E),
  'plum': Color(0xFF7C3055),
  'moss': Color(0xFF5E7A3A),
  'indigo': Color(0xFF2A3D8F),
  'pink': Color(0xFFD92974),
};

class ChipBadge extends StatelessWidget {
  final String label;
  final String chipColor;

  const ChipBadge({super.key, required this.label, required this.chipColor});

  @override
  Widget build(BuildContext context) {
    final color = kChipColors[chipColor] ?? AppColors.primary;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: AppColors.primary, width: 1.5),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label.toUpperCase(),
        style: AppText.labelSm.copyWith(color: Colors.white, fontWeight: FontWeight.w700),
      ),
    );
  }
}
