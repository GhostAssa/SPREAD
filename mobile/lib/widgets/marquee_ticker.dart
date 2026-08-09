import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Scrolling breaking-news ticker, ported from the CSS `.marquee` keyframe
/// animation in the design file.
class MarqueeTicker extends StatefulWidget {
  final List<String> items;
  final Color background;
  final Color textColor;

  const MarqueeTicker({
    super.key,
    required this.items,
    this.background = AppColors.primary,
    this.textColor = Colors.white,
  });

  @override
  State<MarqueeTicker> createState() => _MarqueeTickerState();
}

class _MarqueeTickerState extends State<MarqueeTicker> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 20))
      ..addListener(_tick)
      ..repeat();
  }

  void _tick() {
    if (!_scrollController.hasClients) return;
    final max = _scrollController.position.maxScrollExtent;
    if (max <= 0) return;
    final offset = _controller.value * max;
    _scrollController.jumpTo(offset);
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final text = widget.items.isEmpty ? '' : '${widget.items.join('   •   ')}     ';
    return Container(
      color: widget.background,
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 12),
            child: Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 18),
          ),
          Expanded(
            child: SingleChildScrollView(
              controller: _scrollController,
              scrollDirection: Axis.horizontal,
              physics: const NeverScrollableScrollPhysics(),
              child: Text(
                text + text,
                maxLines: 1,
                style: AppText.labelLg.copyWith(
                  color: widget.textColor,
                  letterSpacing: 1,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
