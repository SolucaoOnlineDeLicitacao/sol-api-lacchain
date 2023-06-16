export type MutableObject<t> = {
  -readonly [key in keyof t]: t[key];
}