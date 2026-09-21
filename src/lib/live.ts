/**
 * 一个很小的「活代理」工具
 * ========================
 *
 * 背景：模块顶层导出的常量只求值一次，语言切了引用不会变。
 * 页面代码又已经写成了 `routes.map(...)` / `NAV_ITEMS.forEach(...)` 这种形式，
 * 全改成函数调用动静太大。
 *
 * `live(read)` 包出来的代理长得跟原对象一模一样，但每次访问属性时
 * 才去 `read()` 取当前语言的数据。于是：
 *
 *   const NAV_ITEMS = live(() => RAW.map((x) => ({ ...x, label: tr(x.label) })))
 *   NAV_ITEMS.map(...)   // 永远拿到当前语言
 *
 * 实现上 target 必须是空壳（空数组 / 空对象），且除 `length` 外所有属性
 * 都对外声明为可配置 —— 否则会撞上 Proxy 的不变量检查。
 */

export function live<T extends object>(read: () => T): T {
  const target: object = Array.isArray(read()) ? [] : {}
  return new Proxy(target, {
    get(_t, p) {
      const real = read() as Record<string | symbol, unknown>
      const v = real[p]
      return typeof v === 'function'
        ? (v as (...a: unknown[]) => unknown).bind(real)
        : v
    },
    has(_t, p) {
      return p in (read() as object)
    },
    ownKeys() {
      return Reflect.ownKeys(read() as object)
    },
    getOwnPropertyDescriptor(_t, p) {
      const d = Reflect.getOwnPropertyDescriptor(read() as object, p)
      if (!d) return undefined
      return p === 'length' ? d : { ...d, configurable: true }
    },
  }) as T
}
