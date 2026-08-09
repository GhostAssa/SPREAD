import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Base URL for the Spread Next.js backend.
///
/// - Android emulator reaching your dev machine: http://10.0.2.2:3000
/// - iOS simulator reaching your dev machine: http://localhost:3000
/// - Physical device: http://<your-computer's-LAN-IP>:3000
/// - Production: your deployed domain, e.g. https://spread.ng
///
/// Change this once you know which one applies to you.
const String kApiBaseUrl = 'http://10.244.134.85:3000';

const _cookieKey = 'spread_session_cookie';

/// Thin HTTP client that persists the session cookie Next.js sets on
/// login/signup (httpOnly, so it can't be read from JS — but Flutter's http
/// client can read the Set-Cookie response header directly) and replays it
/// on every subsequent request.
class ApiService {
  ApiService._();
  static final ApiService instance = ApiService._();

  Future<String?> _getCookie() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_cookieKey);
  }

  Future<void> _saveCookieFromResponse(http.Response response) async {
    final setCookie = response.headers['set-cookie'];
    if (setCookie == null) return;
    // Only the name=value pair is needed on the way back out, not the
    // Path/HttpOnly/SameSite attributes.
    final cookiePair = setCookie.split(';').first;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_cookieKey, cookiePair);
  }

  Future<void> clearCookie() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cookieKey);
  }

  Future<Map<String, String>> _headers({bool json = true}) async {
    final cookie = await _getCookie();
    return {
      if (json) 'Content-Type': 'application/json',
      if (cookie != null) 'Cookie': cookie,
    };
  }

  Uri _uri(String path) => Uri.parse('$kApiBaseUrl$path');

  Future<Map<String, dynamic>> get(String path) async {
    final res = await http.get(_uri(path), headers: await _headers());
    return _decode(res);
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final res = await http.post(_uri(path), headers: await _headers(), body: jsonEncode(body));
    await _saveCookieFromResponse(res);
    return _decode(res);
  }

  Future<Map<String, dynamic>> patch(String path, Map<String, dynamic> body) async {
    final res = await http.patch(_uri(path), headers: await _headers(), body: jsonEncode(body));
    return _decode(res);
  }

  Map<String, dynamic> _decode(http.Response res) {
    final Map<String, dynamic> data =
        res.body.isEmpty ? {} : jsonDecode(res.body) as Map<String, dynamic>;
    data['_statusCode'] = res.statusCode;
    return data;
  }
}
