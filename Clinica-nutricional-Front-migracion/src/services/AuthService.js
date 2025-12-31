class AuthService {
  static getToken() {
    return localStorage.getItem("token") || "";
  }

  static parseToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      const base = decodeURIComponent(
        Array.prototype.map
          .call(atob(payload), function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(base);
    } catch (e) {
      console.error("Error al parsear token", e);
      return null;
    }
  }

  static getUserRole() {
    const parsed = this.parseToken();
    return parsed?.rols?.[0]?.rol || null;
  }

  static getRut() {
    const parsed = this.parseToken();
    return parsed?.rut || null;
  }
}

export default AuthService;
