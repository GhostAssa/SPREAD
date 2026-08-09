import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/auth_provider.dart';
import 'theme/app_theme.dart';
import 'widgets/spread_bottom_nav.dart';
import 'screens/home_screen.dart';
import 'screens/confirmed_facts_screen.dart';
import 'screens/submit_news_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(const SpreadApp());
}

class SpreadApp extends StatelessWidget {
  const SpreadApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider()..refresh(),
      child: MaterialApp(
        title: 'Spread',
        debugShowCheckedModeBanner: false,
        theme: buildAppTheme(),
        home: const RootShell(),
      ),
    );
  }
}

/// Hosts the four main tabs behind the persistent bottom nav. Individual
/// screens (article detail, login, etc.) push on top via Navigator.push.
class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  SpreadTab _tab = SpreadTab.news;

  @override
  Widget build(BuildContext context) {
    final screen = switch (_tab) {
      SpreadTab.news => const HomeScreen(),
      SpreadTab.confirmed => const ConfirmedFactsScreen(),
      SpreadTab.earn => const SubmitNewsScreen(),
      SpreadTab.profile => const ProfileScreen(),
    };

    return Scaffold(
      body: screen,
      bottomNavigationBar: SpreadBottomNav(
        active: _tab,
        onTap: (tab) => setState(() => _tab = tab),
      ),
    );
  }
}
