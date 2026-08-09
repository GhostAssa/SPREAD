import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/submission.dart';
import '../services/auth_provider.dart';
import '../services/submission_service.dart';
import '../theme/app_theme.dart';
import '../widgets/spread_app_bar.dart';
import '../widgets/wavy_divider.dart';
import '../utils/currency.dart';
import 'article_detail_screen.dart';
import 'login_screen.dart';

/// The "Drop a Tip" screen from the design file was framed as "Encrypted &
/// Anonymous — your identity is stripped before submission." That directly
/// contradicted the Spread & Earn model: a submission has to be tied to a
/// real, paying, logged-in account so the AI can credit the right wallet and
/// the published story can byline the right person. This rebuilds the
/// screen around what that actually requires, keeping the brutalist form
/// language but dropping the anonymity framing and adding the earning story.
class SubmitNewsScreen extends StatefulWidget {
  const SubmitNewsScreen({super.key});

  @override
  State<SubmitNewsScreen> createState() => _SubmitNewsScreenState();
}

class _SubmitNewsScreenState extends State<SubmitNewsScreen> {
  final _titleController = TextEditingController();
  final _bodyController = TextEditingController();
  final _evidenceController = TextEditingController();
  bool _submitting = false;
  String? _error;
  NewsSubmissionResult? _result;

  @override
  void dispose() {
    _titleController.dispose();
    _bodyController.dispose();
    _evidenceController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_titleController.text.trim().isEmpty || _bodyController.text.trim().length < 80) {
      setState(() => _error = 'Please provide a headline and at least 80 characters of story detail.');
      return;
    }
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final result = await SubmissionService.instance.submit(
        title: _titleController.text.trim(),
        body: _bodyController.text.trim(),
        evidenceNote: _evidenceController.text.trim(),
      );
      setState(() => _result = result);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _submitting = false);
    }
  }

  void _reset() {
    setState(() {
      _result = null;
      _error = null;
      _titleController.clear();
      _bodyController.clear();
      _evidenceController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: const SpreadAppBar(),
      body: SafeArea(
        child: auth.loading
            ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
            : !auth.isLoggedIn
                ? _GatePrompt(
                    icon: Icons.lock_outline,
                    title: 'Log In to Earn',
                    message: 'Create a Spread account to submit news and get paid when it\'s verified.',
                    ctaLabel: 'Log In / Sign Up',
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                    ),
                  )
                : !auth.user!.subscribed
                    ? const _GatePrompt(
                        icon: Icons.workspace_premium_outlined,
                        title: 'Activate Your Verification Package',
                        message: 'Submitting news requires an active ₦3,500/month verification '
                            'package. Online payment isn\'t live yet — contact the newsroom to get '
                            'activated for now.',
                      )
                    : _result != null
                        ? _ResultView(result: _result!, onReset: _reset)
                        : _buildForm(),
      ),
    );
  }

  Widget _buildForm() {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.marginMobile),
      children: [
        Container(
          alignment: Alignment.centerLeft,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(border: Border.all(color: AppColors.primary, width: 2)),
          child: Text('SPREAD & EARN', style: AppText.labelLg),
        ),
        Text('Submit News', style: AppText.display),
        const SizedBox(height: 8),
        Text(
          'Our AI screens every submission for coherence, evidence, and originality before it '
          'publishes. Verified stories go live instantly and earn you a payout.',
          style: AppText.bodyMd.copyWith(color: AppColors.onSurfaceVariant),
        ),
        const Padding(padding: EdgeInsets.symmetric(vertical: AppSpacing.stackMd), child: WavyDivider()),
        _label('Headline'),
        _textField(_titleController, maxLength: 140),
        const SizedBox(height: AppSpacing.stackMd),
        _label('The Story'),
        _textField(
          _bodyController,
          maxLines: 8,
          hint: 'Be specific — who, what, where, when. Vague submissions get rejected.',
        ),
        const SizedBox(height: AppSpacing.stackMd),
        _label('Evidence / Sourcing'),
        _textField(
          _evidenceController,
          maxLines: 3,
          hint: 'Who or what backs this up? A named source, a document, something you witnessed...',
        ),
        if (_error != null)
          Padding(
            padding: const EdgeInsets.only(top: AppSpacing.stackMd),
            child: Text(_error!, style: AppText.labelSm.copyWith(color: AppColors.error)),
          ),
        const SizedBox(height: AppSpacing.stackLg),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
            ),
            onPressed: _submitting ? null : _submit,
            child: Text(
              _submitting ? 'SCREENING...' : 'SUBMIT FOR SCREENING',
              style: AppText.headlineSm.copyWith(color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 6),
        child: Text(text, style: AppText.labelLg),
      );

  Widget _textField(TextEditingController controller, {int maxLines = 1, int? maxLength, String? hint}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      maxLength: maxLength,
      style: AppText.bodyLg,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: AppColors.sand,
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: BorderSide(color: AppColors.primary, width: 2),
        ),
        enabledBorder: const OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: BorderSide(color: AppColors.primary, width: 2),
        ),
        focusedBorder: const OutlineInputBorder(
          borderRadius: BorderRadius.zero,
          borderSide: BorderSide(color: AppColors.primary, width: 3),
        ),
      ),
    );
  }
}

class _GatePrompt extends StatelessWidget {
  final IconData icon;
  final String title;
  final String message;
  final String? ctaLabel;
  final VoidCallback? onTap;

  const _GatePrompt({
    required this.icon,
    required this.title,
    required this.message,
    this.ctaLabel,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.marginMobile),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: AppColors.primary),
            const SizedBox(height: AppSpacing.stackMd),
            Text(title, style: AppText.headlineMd, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text(message, style: AppText.bodyMd, textAlign: TextAlign.center),
            if (ctaLabel != null) ...[
              const SizedBox(height: AppSpacing.stackLg),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                ),
                onPressed: onTap,
                child: Text(ctaLabel!, style: AppText.labelLg.copyWith(color: Colors.white)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ResultView extends StatelessWidget {
  final NewsSubmissionResult result;
  final VoidCallback onReset;

  const _ResultView({required this.result, required this.onReset});

  @override
  Widget build(BuildContext context) {
    final verified = result.isVerified;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.marginMobile),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              verified ? Icons.check_circle : Icons.cancel,
              size: 56,
              color: verified ? AppColors.moss : AppColors.error,
            ),
            const SizedBox(height: AppSpacing.stackMd),
            Text(
              verified
                  ? 'Verified — ${formatNaira(result.payoutNaira)} added to your wallet'
                  : 'Not verified',
              style: AppText.headlineMd,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(result.reason, style: AppText.bodyMd, textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.stackLg),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (result.articleSlug != null)
                  Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                      ),
                      onPressed: () => Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => ArticleDetailScreen(slug: result.articleSlug!),
                        ),
                      ),
                      child: const Text('View Story'),
                    ),
                  ),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary, width: 2),
                    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                  ),
                  onPressed: onReset,
                  child: const Text('Submit Another', style: TextStyle(color: AppColors.primary)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
