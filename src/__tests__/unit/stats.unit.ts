import {Stats} from '../../stats';

describe('Stats Library', () => {
  it('single set', () => {
    const stat = new Stats(1);
    expect(stat.push(3)).toBe(1);
    expect(stat.ave(0)).toBe(3);
    expect(isNaN(stat.var(0))).toBe(true);
    expect(stat.push(1)).toBe(2);
    expect(stat.N).toBe(2);
    expect(stat.ave(0)).toBe(2);
    expect(stat.ave()).toEqual([2]);
    expect(stat.var(0)).toBe(2);
    expect(stat.var()).toEqual([2]);
  });

  it('2 dimensions...', () => {
    const stat = new Stats(2);
    expect(stat.push(1, 2)).toBe(1);
    expect(stat.push([2, 1])).toBe(2);
    expect(stat.ave(0)).toBe(3 / 2);
    expect(stat.ave(1)).toBe(3 / 2);
    expect(stat.ave()).toEqual([3 / 2, 3 / 2]);
    expect(stat.var(1)).toBe(1 / 2);
    expect(stat.cor(0, 1)).toBe(-1);
    expect(stat.cor(0, 0)).toBe(1);
  });

  it('3 dimensions...', () => {
    const stat = new Stats(3);
    expect(stat.push(2, 1, 0)).toBe(1);
    expect(stat.push([1, 1, 1])).toBe(2);
    expect(stat.push(0, 1, 2)).toBe(3);
    expect(stat.ave(0)).toBe(1);
    expect(stat.ave(1)).toBe(1);
    expect(stat.ave(2)).toBe(1);
    expect(stat.cov(0, 0)).toBe(1);
    expect(stat.cov(1, 0)).toBe(0);
    expect(stat.cov(1, 2)).toBe(0);
  });

  it('stress it', () => {
    const stat = new Stats(4);
    for (let i = 1; i < 1001; ++i) {
      stat.push(i, -i, i / 2, 1);
    }
    expect(stat.ave(0)).toBe(1001 / 2);
    expect(stat.ave(1)).toBe(-1001 / 2);
    expect(stat.ave(2)).toBe(1001 / 4);
    expect(stat.ave(3)).toBe(1);

    expect(stat.cor(0, 0)).toBe(1);
    expect(stat.cor(1, 0)).toBe(-1);
    expect(stat.cor(1, 2)).toBe(-1);

    expect(stat.cov(2, 3)).toBe(0);
  });

  it('transfer', () => {
    const src = new Stats(4);
    for (let i = 1; i < 1001; ++i) {
      src.push(i, -i, i / 2, 1);
    }
    const stat = new Stats(src.data);
    expect(stat.N).toBe(src.N);
    expect(stat.M).toBe(src.M);
    expect(stat.ave(0)).toBe(1001 / 2);
    expect(stat.ave(1)).toBe(-1001 / 2);
    expect(stat.ave(2)).toBe(1001 / 4);
    expect(stat.ave(3)).toBe(1);

    expect(stat.cor(0, 0)).toBe(1);
    expect(stat.cor(1, 0)).toBe(-1);
    expect(stat.cor(1, 2)).toBe(-1);

    expect(stat.cov(2, 3)).toBe(0);
    src.reset();
    expect(src.N).toBe(0);
    expect(stat.N).toBe(0);
  });

  it('slope and intercept', () => {
    const stat = new Stats(2);
    const y = (x: number) => 2 * x + 3;
    for (let x = -10; x < 10; ++x) stat.push(y(x), x);
    expect(stat.slope(0, 1)).toBe(2);
    expect(stat.intercept(0, 1)).toBe(3);
  });
});
