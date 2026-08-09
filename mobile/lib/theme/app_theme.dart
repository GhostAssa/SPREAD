import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// "Modern Brutalist" mobile design tokens, ported from the Stitch design
/// file (app design). Deliberately stark black/cream/white — distinct from
/// the web app's warmer amber/teal/pink palette, but same brutalist DNA:
/// hard borders, hard shadows, TV-frame motifs, Bricolage Grotesque type.
class AppColors {
  AppColors._();

  static const primary = Color(0xFF000000); // ink — borders, headlines, primary actions
  static const onPrimary = Color(0xFFFFFFFF);
  static const surface = Color(0xFFFAF9F9);
  static const surfaceContainerHigh = Color(0xFFE9E8E8);
  static const cream = Color(0xFFE8E2D2);
  static const sand = Color(0xFFF5F2E9);
  static const secondaryFixed = Color(0xFFE5E2DA); // pale card background
  static const tertiaryFixed = Color(0xFFE8E2D2); // header bar background
  static const onSurfaceVariant = Color(0xFF444748);
  static const outline = Color(0xFF747878);
  static const outlineVariant = Color(0xFFC4C7C7);
  static const error = Color(0xFFBA1A1A);
  static const errorContainer = Color(0xFFFFDAD6);
  static const onErrorContainer = Color(0xFF93000A);
  static const amber = Color(0xFFFBBF24); // verified stamp
  static const moss = Color(0xFF3F6212); // earnings / success green
}

class AppSpacing {
  AppSpacing._();

  static const unit = 4.0;
  static const stackSm = 8.0;
  static const stackMd = 16.0;
  static const stackLg = 32.0;
  static const marginMobile = 16.0;
  static const gutterMobile = 12.0;
  static const touchTargetMin = 44.0;
}

class AppRadius {
  AppRadius._();

  static const tv = 8.0;
  static const full = 999.0;
}

/// Hard-edged "brutal shadow" — no blur, offset box shadow like the web app's ink shadows.
List<BoxShadow> brutalShadow({double dx = 3, double dy = 3, Color color = AppColors.primary}) {
  return [BoxShadow(color: color, offset: Offset(dx, dy), blurRadius: 0)];
}

BoxDecoration brutalCard({
  Color background = AppColors.surface,
  double borderWidth = 2,
  double radius = 0,
  List<BoxShadow>? shadow,
}) {
  return BoxDecoration(
    color: background,
    border: Border.all(color: AppColors.primary, width: borderWidth),
    borderRadius: BorderRadius.circular(radius),
    boxShadow: shadow ?? brutalShadow(),
  );
}

class AppText {
  AppText._();

  static TextStyle get _base => GoogleFonts.bricolageGrotesque();

  static TextStyle display = _base.copyWith(
    fontSize: 40,
    height: 44 / 40,
    letterSpacing: -0.02 * 40,
    fontWeight: FontWeight.w800,
    color: AppColors.primary,
  );
  static TextStyle headlineLg = _base.copyWith(
    fontSize: 32,
    height: 36 / 32,
    letterSpacing: -0.01 * 32,
    fontWeight: FontWeight.w700,
    color: AppColors.primary,
  );
  static TextStyle headlineMd = _base.copyWith(
    fontSize: 24,
    height: 28 / 24,
    fontWeight: FontWeight.w700,
    color: AppColors.primary,
  );
  static TextStyle headlineSm = _base.copyWith(
    fontSize: 20,
    height: 24 / 20,
    fontWeight: FontWeight.w600,
    color: AppColors.primary,
  );
  static TextStyle bodyLg = _base.copyWith(fontSize: 18, height: 26 / 18, fontWeight: FontWeight.w400);
  static TextStyle bodyMd = _base.copyWith(fontSize: 16, height: 24 / 16, fontWeight: FontWeight.w400);
  static TextStyle labelLg = _base.copyWith(fontSize: 14, height: 16 / 14, fontWeight: FontWeight.w600);
  static TextStyle labelSm = _base.copyWith(fontSize: 12, height: 14 / 12, fontWeight: FontWeight.w500);
}

ThemeData buildAppTheme() {
  return ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: AppColors.surface,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.primary,
      surface: AppColors.surface,
      error: AppColors.error,
    ),
    fontFamily: GoogleFonts.bricolageGrotesque().fontFamily,
    textTheme: TextTheme(
      displayLarge: AppText.display,
      headlineLarge: AppText.headlineLg,
      headlineMedium: AppText.headlineMd,
      headlineSmall: AppText.headlineSm,
      bodyLarge: AppText.bodyLg,
      bodyMedium: AppText.bodyMd,
      labelLarge: AppText.labelLg,
      labelSmall: AppText.labelSm,
    ),
  );
}
