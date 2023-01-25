## [Updates](#updates)

### v0.0.18 - Bundle and Singleton

New content was added:
- Add `LazySingleton` class.
- A bundle for portability.

### v0.0.17 - Topological sort

New content was added:
- Add `LazyCounter` class.
- Add `LazySort` class.

### v0.0.13 - New rules

New content was added:
- Add `simpleKeys` to `LazyRule`.
- Add `parseString` to `LazyRule`.
- Add `regex` to `LazyRule`.

New modifications were introduced:
- Introduction of an override of `patternSet` and `IsPatternEnd` in `simpleCharbox` for new rules in nested content.
- Add `exp` parse for numbers.
- Patch the wrong return type of `combinationArrayNRNO` in `LazyMath`.

### v0.0.10 - Charbox failing

New modifications were introduced:
- Correction of `simpleCharbox` from `LazyRule` not using it's end pattern and the spacing.
- Patch `LazyParser` spacing.

### v0.0.5 - Parsing rules

New content was added:
- Add `variable`, `keyword` and `any` static functions to `LazyRule`.
- Add `toStringDebug` static function to `LazyParsing`.

New modifications were introduced:
- Change the `parse` return value to a `PatternFound[]`. Previously, it was `any[]`.

### v0.0.3 - Parsing fury

New content was added:
- Add `LazyParsing` class.
- Add `LazyPattern` class.
- Add `LazyRule` class.
- Add `LazyText` class.

### v0.0.2 - Lazy Mapping

New content was added:
- Add `LazyMapper` class for data filtering.
- Add `LazyDataGraph` class for tangential analysis of graphs.
- Add `combinationArrayNRNO` function to `LazyMath`.

### v0.0.0 - Initial commit

