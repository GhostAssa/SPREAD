class SpreadUser {
  final String id;
  final String name;
  final String email;
  final String? matricNumber;
  final int walletBalanceNaira;
  final bool subscribed;

  SpreadUser({
    required this.id,
    required this.name,
    required this.email,
    this.matricNumber,
    required this.walletBalanceNaira,
    required this.subscribed,
  });

  factory SpreadUser.fromJson(Map<String, dynamic> json) {
    return SpreadUser(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      matricNumber: json['matricNumber'] as String?,
      walletBalanceNaira: json['walletBalanceNaira'] as int? ?? 0,
      subscribed: json['subscribed'] as bool? ?? false,
    );
  }
}
