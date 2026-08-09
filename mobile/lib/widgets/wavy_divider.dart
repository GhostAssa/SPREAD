import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// The repeating hand-drawn wave line used as a section separator throughout
/// the design (originally a CSS repeating SVG background-image).
class WavyDivider extends StatelessWidget {
  final double height;
  final double opacity;

  const WavyDivider({super.key, this.height = 12, this.opacity = 1});

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: opacity,
      child: SizedBox(
        height: height,
        width: double.infinity,
        child: CustomPaint(painter: _WavePainter()),
      ),
    );
  }
}

class _WavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    const waveWidth = 20.0;
    final path = Path()..moveTo(0, size.height / 2);
    var x = 0.0;
    var up = true;
    while (x < size.width) {
      path.quadraticBezierTo(
        x + waveWidth / 2,
        up ? 0 : size.height,
        x + waveWidth,
        size.height / 2,
      );
      x += waveWidth;
      up = !up;
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
