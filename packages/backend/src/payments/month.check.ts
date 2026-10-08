import assert from 'node:assert';
import { currentMonth } from './payments.service';
// 23:30 UTC on Oct 31 is already Nov 1 in Lagos (UTC+1)
assert.equal(currentMonth(new Date('2026-10-31T23:30:00Z')), '2026-11');
assert.equal(currentMonth(new Date('2026-10-31T22:59:00Z')), '2026-10');
assert.equal(currentMonth(new Date('2026-01-01T00:00:00Z')), '2026-01');
console.log('ok');
