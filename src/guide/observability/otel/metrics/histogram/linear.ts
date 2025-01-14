import { Effect, Metric, MetricBoundaries, Random } from "effect"

// Metric<Histogram, number, Histogram>
const latencyHistogram = Metric.histogram(
  "request_latency",
  MetricBoundaries.linear({ start: 0, width: 10, count: 11 })
)

const program = latencyHistogram(Random.nextIntBetween(1, 120)).pipe(
  Effect.repeatN(99)
)

Effect.runPromise(
  program.pipe(Effect.flatMap(() => Metric.value(latencyHistogram)))
).then((histogramState) => console.log("%o", histogramState))
/*
Output:
HistogramState {
  buckets: {
    _id: 'Chunk',
    values: [
      [ 0, 0 ],
      [ 10, 7 ],
      [ 20, 11 ],
      [ 30, 20 ],
      [ 40, 27 ],
      [ 50, 38 ],
      [ 60, 53 ],
      [ 70, 64 ],
      [ 80, 73 ],
      [ 90, 84 ],
      [ Infinity, 100 ],
      [length]: 11
    ]
  },
  count: 100,
  min: 1,
  max: 119,
  sum: 5980,
  ...
}
*/
