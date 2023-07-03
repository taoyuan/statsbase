import byteView from './view';

export default class Stats {
  public M: number;

  private readonly _mi: Float64Array;
  private readonly _mij: Float64Array[];

  /**
   * @param {Float64Array|number} [bufferOrSize] number of random variables or a view of a memory block
   */
  constructor(bufferOrSize: number | Float64Array = 1) {
    let size: number | undefined;
    let buffer: Float64Array | undefined;
    if (typeof bufferOrSize === 'number') {
      size = bufferOrSize;
    } else {
      buffer = bufferOrSize;
    }

    this.M = buffer ? Math.floor((Math.sqrt(buffer.byteLength + 1) - 3) / 2) : size!;
    const N = ((this.M + 1) * (this.M + 2)) / 2;
    const memory = buffer ? new Float64Array(buffer.buffer, buffer.byteOffset, N) : new Float64Array(N);
    this._mi = memory; // averages, ...fullMemory
    this._mij = Array(this.M); // M(M+1)/2 central products: [[A'A'],[A'B',B'B''],[A'C',B'C',C'C']]
    this._mij[0] = new Float64Array(memory.buffer, memory.byteOffset + memory.BYTES_PER_ELEMENT * this.M, 1);
    for (let i = 1; i < this.M; ++i) {
      this._mij[i] = byteView(this._mij[i - 1], Float64Array, i + 1);
    }
  }

  get N() {
    return this._mi[this._mi.length - 1];
  } //last byte in memory

  set N(count) {
    this._mi[this._mi.length - 1] = count;
  }

  reset() {
    this._mi.fill(0);
    return this;
  }

  // for transfers and copies
  get data() {
    return this._mi;
  }

  push(values: number[]): number;
  push(...values: number[]): number;
  /**
   * Welford-style online single pass variance and covariance
   * https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance
   * Add a set of values
   * @param {number|Array<number>} [values]
   * @returns {number} - number of samples
   */
  push(...values: number[] | [number[]]): number {
    const args = Array.isArray(values[0]) ? values[0] : values;
    if (args.length !== this.M) throw Error(`Expected ${this.M} value(s)`);

    const delta = [],
      N = ++this.N;
    for (let i = 0; i < this.M; ++i) {
      delta[i] = (+args[i] - this._mi[i]) / N;
      this._mi[i] += delta[i];
      for (let j = 0; j <= i; ++j) {
        this._mij[i][j] += (N - 1) * delta[i] * delta[j] - this._mij[i][j] / N;
      }
    }
    return N;
  }

  /**
   * All averages of the set
   * @return {number} all averages
   */
  ave(): number[];

  /**
   * Average of a set
   * @param index The index of the set
   */
  ave(index: number): number;
  ave(index?: number): number | number[] {
    if (typeof index === 'number') {
      return this._mi[index];
    }
    return Array(this.M)
      .fill(0)
      .map((_, i) => this._mi[i]);
  }

  /**
   * Covariance between 2 sets
   * @param {number} a index
   * @param {number} b index
   * @return {number} covariance
   */
  cov(a: number, b: number) {
    const N = this.N;
    if (N < 2) return NaN;
    return (N / (N - 1)) * (a < b ? this._mij[b][a] : this._mij[a][b]);
  }

  /**
   * All covariances
   * @return all variances
   */
  var(): number[];
  /**
   * Variance of a set
   * @param index The index of the set
   */
  var(index: number): number;
  var(index?: number): number | number[] {
    if (typeof index === 'number') {
      return this.cov(index, index);
    }

    return Array(this.M)
      .fill(0)
      .map((_, i) => this.cov(i, i));
  }

  /**
   * All standard deviations
   * @return all standard deviations
   */
  dev(): number[];
  /**
   * standard deviation of a set
   * @param {number} [index] index
   * @return {number} standard deviation
   */
  dev(index: number): number;
  dev(index?: number): number | number[] {
    if (typeof index === 'number') {
      return Math.sqrt(this.cov(index, index));
    }

    return Array(this.M)
      .fill(0)
      .map((_, i) => Math.sqrt(this.cov(i, i)));
  }

  /**
   * correlation between 2 sets
   * @param {number} a index
   * @param {number} b index
   * @return {number} correlation
   */
  cor(a: number, b: number) {
    return this.cov(a, b) / Math.sqrt(this.cov(a, a) * this.cov(b, b));
  }

  /**
   * slope between 2 sets dy/dx
   * @param {number} y index of the dependent set
   * @param {number} x index
   * @return {number} slope
   */
  slope(y: number, x: number) {
    return this.cov(y, x) / this.cov(x, x);
  }

  /**
   * intercept of the linear regression between 2 sets
   * @param {number} y index of the dependent set
   * @param {number} x index
   * @return {number} intercept
   */
  intercept(y: number, x: number) {
    return this.ave(y) - this.slope(y, x) * this.ave(x);
  }
}
