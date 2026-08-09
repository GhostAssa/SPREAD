import 'package:flutter/foundation.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthProvider extends ChangeNotifier {
  final _api = ApiService.instance;

  SpreadUser? _user;
  bool _loading = true;

  SpreadUser? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get loading => _loading;

  Future<void> refresh() async {
    _loading = true;
    notifyListeners();
    try {
      final data = await _api.get('/api/auth/me');
      _user = data['user'] != null ? SpreadUser.fromJson(data['user'] as Map<String, dynamic>) : null;
    } catch (_) {
      _user = null;
    }
    _loading = false;
    notifyListeners();
  }

  /// Returns null on success, or an error message.
  Future<String?> signup({
    required String name,
    required String email,
    required String password,
    String? matricNumber,
  }) async {
    final data = await _api.post('/api/auth/signup', {
      'name': name,
      'email': email,
      'password': password,
      if (matricNumber != null && matricNumber.isNotEmpty) 'matricNumber': matricNumber,
    });
    if (data['_statusCode'] != 200) return data['error'] as String? ?? 'Something went wrong.';
    _user = SpreadUser.fromJson(data['user'] as Map<String, dynamic>);
    notifyListeners();
    return null;
  }

  Future<String?> login({required String email, required String password}) async {
    final data = await _api.post('/api/auth/login', {'email': email, 'password': password});
    if (data['_statusCode'] != 200) return data['error'] as String? ?? 'Something went wrong.';
    _user = SpreadUser.fromJson(data['user'] as Map<String, dynamic>);
    notifyListeners();
    return null;
  }

  Future<void> logout() async {
    await _api.post('/api/auth/logout', {});
    await _api.clearCookie();
    _user = null;
    notifyListeners();
  }
}
