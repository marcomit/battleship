export class Cookie {
  private static createCookieObject(): Record<string, string> {
    const obj: Record<string, string> = {};
    document.cookie.split(";").forEach((item) => {
      const [key, value] = item.split("=");
      obj[key] = value;
    });
    return obj;
  }
  private static saveCookie(obj: any) {
    var cookies = "";
    for (const key in obj) {
      cookies += `${key}=${obj[key]};`;
    }
    document.cookie = cookies;
    return cookies;
  }
  static getItem(name: string): string | undefined {
    var cookies = this.createCookieObject();
    return cookies[name];
  }
  static setItem(name: string, value: string) {
    const obj = this.createCookieObject();
    obj[name] = value;
    console.log(obj);
    this.saveCookie(obj);
  }
}
