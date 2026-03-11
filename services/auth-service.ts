import { account, ID } from "@/lib/appwrite";

class AuthService {
  /**
   * Lấy user hiện tại (session-based)
   * -> null nếu chưa login
   */
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }

  /**
   * Login bằng email/password
   */
  async login(email: string, password: string) {
    await account.createEmailPasswordSession({
      email,
      password,
    });

    return this.getCurrentUser();
  }

  /**
   * Logout (xoá session hiện tại)
   */
  async logout() {
    await account.deleteSession({ sessionId: "current" });
  }
}

export default new AuthService();
