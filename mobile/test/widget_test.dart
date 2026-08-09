// Basic smoke test — confirms the app boots and renders its shell without
// throwing, even with no backend reachable (network calls will just show
// their loading/error states, which is fine for this test).

import 'package:flutter_test/flutter_test.dart';

import 'package:spread/main.dart';

void main() {
  testWidgets('SpreadApp boots and shows the News tab by default', (WidgetTester tester) async {
    await tester.pumpWidget(const SpreadApp());
    await tester.pump();

    expect(find.text('SPREAD'), findsOneWidget);
    expect(find.text('News'), findsOneWidget);
  });
}
