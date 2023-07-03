export type ArrayBufferOrView = ArrayBufferView | ArrayBuffer;

export type ViewConstructor<T> = new (buffer: ArrayBufferLike, byteOffset?: number, length?: number) => T;

/**
 * @param {{buffer: ArrayBuffer, constructor}|ArrayBuffer} lastSibling
 * @param {DataView|TypedArray} [View]
 * @param {number} [length]
 * @return {DataView|TypedArray}
 */
export default function <T extends ArrayBufferOrView, K = T, R = K extends never ? T : K>(
  lastSibling: T,
  View?: ViewConstructor<K>,
  length?: number,
): R {
  const {constructor, byteLength, byteOffset, buffer} = lastSibling as ArrayBufferView;
  const ctor = (View || constructor) as ViewConstructor<R>;
  if (!ctor) {
    throw Error('Missing view constructor');
  }
  return new ctor(buffer ?? lastSibling, buffer ? byteOffset + byteLength : 0, length);
}
