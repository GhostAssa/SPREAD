import 'package:intl/intl.dart';

final _nairaFormat = NumberFormat.decimalPattern('en_US');

String formatNaira(int amountNaira) => '₦${_nairaFormat.format(amountNaira)}';
