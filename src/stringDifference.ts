// Returns the Levenshtein distance between 2 strings to give a rough approximation
// of similarity of strings. The higher the distance, the less likely they're the same
function stringDifference(s, t) {
  if (!s || !t) return 100;
  // The code
  if (s == t) return 0;
  if (s.length == 0) return t.length;
  if (t.length == 0) return s.length;

  var v0 = [];
  var v1 = [];
  var i;
  var j;
  var cost;

  for (i = 0; i < t.length + 1; i++) {
    v0[i] = i;
  }

  for (i = 0; i < s.length; i++) {
    v1[0] = i + 1;
    for (j = 0; j < t.length; j++) {
      if (s[i] == t[j]) {
        cost = 0;
      } else {
        cost = 1;
      }
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (j = 0; j < t.length + 1; j++) {
      v0[j] = v1[j];
    }
  }
  return v1[t.length];
}
