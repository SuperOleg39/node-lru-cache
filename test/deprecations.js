const t = require('tap')
const LRU = require('../')

process.noDeprecation = false
const warnings = []
process.emitWarning = (...w) => warnings.push(w)

t.test('warns exactly once for a given deprecation', t => {
  const c = new LRU({
    max: 100,
    maxSize: 100,
    maxAge: 1000,
    stale: true,
    length: n => 1,
  })
  c.reset()
  t.equal(c.length, 0)
  t.equal(c.prune, c.purgeStale)
  t.equal(c.reset, c.clear)
  t.equal(c.del, c.delete)

  t.matchSnapshot(warnings)

  warnings.length = 0
  const d = new LRU({
    max: 100,
    maxSize: 100,
    maxAge: 1000,
    stale: true,
    length: n => 1,
  })
  d.reset()

  t.equal(d.length, 0)
  t.equal(d.prune, d.purgeStale)
  t.equal(d.reset, d.clear)
  t.strictSame(warnings, [], 'only warn once')

  warnings.length = 0
  t.end()
})

t.test('does not do deprecation warning without process object', t => {
  // set process to null (emulate a browser)
  const proc = process
  t.teardown(() => global.process = proc)
  global.process = null

  const c = new LRU({
    max: 100,
    maxSize: 100,
    maxAge: 1000,
    stale: true,
    length: n => 1,
  })
  c.reset()
  t.equal(c.length, 0)
  t.equal(c.prune, c.purgeStale)
  t.equal(c.reset, c.clear)
  t.equal(c.del, c.delete)

  t.strictSame(warnings, [], 'no process exists')

  t.end()
})
