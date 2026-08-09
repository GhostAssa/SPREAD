import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_provider.dart';
import '../theme/app_theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isSignup = false;
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _matricController = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _matricController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final auth = context.read<AuthProvider>();
    final error = _isSignup
        ? await auth.signup(
            name: _nameController.text.trim(),
            email: _emailController.text.trim(),
            password: _passwordController.text,
            matricNumber: _matricController.text.trim(),
          )
        : await auth.login(
            email: _emailController.text.trim(),
            password: _passwordController.text,
          );

    if (!mounted) return;
    setState(() {
      _loading = false;
      _error = error;
    });
    if (error == null) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.marginMobile),
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.stackLg),
              decoration: BoxDecoration(
                color: AppColors.surface,
                border: Border.all(color: AppColors.primary, width: 3),
                boxShadow: brutalShadow(dx: 6, dy: 6),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Column(
                      children: [
                        Text('SPREAD & EARN', style: AppText.labelLg.copyWith(color: AppColors.outline)),
                        const SizedBox(height: 4),
                        Text(_isSignup ? 'Create Account' : 'Log In', style: AppText.headlineLg),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSpacing.stackLg),
                  if (_isSignup) ...[
                    _field('Full Name', _nameController),
                    const SizedBox(height: AppSpacing.stackMd),
                  ],
                  _field('Email', _emailController, keyboardType: TextInputType.emailAddress),
                  const SizedBox(height: AppSpacing.stackMd),
                  if (_isSignup) ...[
                    _field('Matric Number (optional)', _matricController),
                    const SizedBox(height: AppSpacing.stackMd),
                  ],
                  _field('Password', _passwordController, obscure: true),
                  if (_error != null)
                    Padding(
                      padding: const EdgeInsets.only(top: AppSpacing.stackMd),
                      child: Text(_error!, style: AppText.labelSm.copyWith(color: AppColors.error)),
                    ),
                  const SizedBox(height: AppSpacing.stackLg),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                    ),
                    onPressed: _loading ? null : _submit,
                    child: Text(
                      _loading ? '...' : (_isSignup ? 'CREATE ACCOUNT' : 'LOG IN'),
                      style: AppText.labelLg.copyWith(color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.stackMd),
                  Center(
                    child: TextButton(
                      onPressed: () => setState(() => _isSignup = !_isSignup),
                      child: Text(
                        _isSignup ? 'Already have an account? Log in' : "New here? Create an account",
                        style: AppText.labelSm.copyWith(color: AppColors.primary),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _field(String label, TextEditingController controller,
      {bool obscure = false, TextInputType? keyboardType}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppText.labelLg),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          obscureText: obscure,
          keyboardType: keyboardType,
          decoration: const InputDecoration(
            filled: true,
            fillColor: AppColors.sand,
            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.zero,
              borderSide: BorderSide(color: AppColors.primary, width: 2),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.zero,
              borderSide: BorderSide(color: AppColors.primary, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
