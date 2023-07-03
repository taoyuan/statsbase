# statsbase

> An average, variance, covariance and correlation calculator written in TypeScript
>
> [lazy-stats](https://www.npmjs.com/package/lazy-stats) TypeScript version initially.

• [Example](#example) • [Features](#features) • [Limitations](#limitations) • [API](#api) • [License](#license)

## Example

```ts
import Stats from 'statsbase';

const stat = new Stats(3); // for 3 random variables

stat.push(2, 1, 0);
stat.push([1, 1, 1]);
stat.push(0, 1, 2);

const average0 = stat.ave(0);
const average1 = stat.ave(1);
const variance2 = stat.var(2);
const covariance12 = stat.cov(1, 2);
const correlation20 = stat.cor(2, 0);
```

## Features

- very small code and footprint for large number of instances
- only stores the summary values (average and covariances)
- uses
  [Welford-style online single pass variance and covariance algorithm](https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance)
- less than 100 sloc, no dependencies

## Limitations

- all variables must have the same number of samples, pushed at the same time
- no skew and kurtosis

## API

## Properties

- `.N` number: total samples received
- `.data` Float64Array: transferable memory `copy = new Stats( main.data )`

## Methods

- `.push(number0, number1, ...) => {number} sampleSize` - add sample value(s) and returns the sample size
- `.push([number0, number1, ...]) => {number} sampleSize` - add array of sample value(s) and returns the sample size
- `.ave(index) => {number}` - average of a given dataset. `index` is optional, if not provided, returns an array of all
  averages
- `.var(index) => {number}` - variance of a given dataset. `index` is optional, if not provided, returns an array of all
  variances
- `.dev(index) => {number}` - standard deviation of a given dataset. `index` is optional, if not provided, returns an
  array of all standard deviations
- `.cov(j, i) => {number}` - covariance between two datasets
- `.cor(j, i) => {number}` - correlation between two datasets
- `.slope(j, i) => {number}` - slope for `y=set[j]` and `x=set[i]`
- `.intercept(j, i) => {number}` - intercept for `y=set[j]` and `x=set[i]`
- `.reset() => {object} this` - clears all sums and counts back to 0

# Creds

- [lazy-stats](https://www.npmjs.com/package/lazy-stats) The original repo.

# License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
