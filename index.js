// index.js
const fs = require("fs");

/**
 * Compute constant term C = f(0) using Lagrange interpolation
 */
function constantTermFromJson(data) {
  const k = Number(data.keys.k);

  // Parse (x, y) pairs:
  const points = Object.entries(data)
    .filter(([key]) => key !== "keys")
    .map(([key, obj]) => {
      const x = Number(key);
      const base = Number(obj.base);
      const y = parseInt(obj.value, base); // convert from base to decimal
      return { x, y };
    })
    .sort((a, b) => a.x - b.x)
    .slice(0, k);

  // Lagrange interpolation at x = 0
  let c = 0;
  for (let i = 0; i < points.length; i++) {
    const { x: xi, y: yi } = points[i];
    let Li_at_0 = 1;
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const xj = points[j].x;
      Li_at_0 *= (0 - xj) / (xi - xj);
    }
    c += yi * Li_at_0;
  }

  // Round if close to integer
  const rounded = Math.round(c);
  return Math.abs(c - rounded) < 1e-9 ? rounded : c;
}

// ----------- MAIN -----------

const raw = fs.readFileSync("input.json", "utf8");
const testcases = JSON.parse(raw);

const results = testcases.map((tc, idx) => {
  const C = constantTermFromJson(tc);
  console.log(`Case #${idx + 1}: C = ${C}`);
  return { case: idx + 1, C };
});

// Save results into output.json
fs.writeFileSync("output.json", JSON.stringify(results, null, 2), "utf8");
console.log("✅ Results saved to output.json");
