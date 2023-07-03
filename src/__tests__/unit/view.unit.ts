import {byteView} from '../../view';

describe('byteView', () => {
  const buffer = new ArrayBuffer(16);
  const array = new Uint16Array(buffer);
  const view0 = new DataView(buffer, 0, 0);

  it('should work', () => {
    // fromBuffer, first view
    const a1 = byteView(buffer, Uint16Array, 2);
    a1.fill(1);
    expect(a1).toBeInstanceOf(Uint16Array);
    expect(a1).toHaveLength(2);
    expect(array[0]).toBe(1);
    expect(array[1]).toBe(1);

    // from TypedArray, 2rd view
    const a2 = byteView(a1, Uint16Array, 2);
    a2.fill(2);
    expect(a2).toBeInstanceOf(Uint16Array);
    expect(a2).toHaveLength(2);
    expect(array[2]).toBe(2);
    expect(array[3]).toBe(2);

    // from DataView, 3rd view
    const a3 = byteView(a2);
    a3.fill(3);
    expect(a3).toBeInstanceOf(Uint16Array);
    expect(a3).toHaveLength(4);
    expect(array[4]).toBe(3);
    expect(array[7]).toBe(3);

    // from DataView, 4th view
    const b1 = byteView(view0, Uint16Array, 2);
    b1.fill(4);
    expect(b1).toBeInstanceOf(Uint16Array);
    expect(b1).toHaveLength(2);
    expect(array[0]).toBe(4);
    expect(array[1]).toBe(4);
  });
});
