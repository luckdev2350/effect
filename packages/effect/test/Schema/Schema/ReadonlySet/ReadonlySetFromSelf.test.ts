import * as P from "effect/ParseResult"
import * as Pretty from "effect/Pretty"
import * as S from "effect/Schema"
import * as Util from "effect/test/Schema/TestUtils"
import { describe, expect, it } from "vitest"

describe("ReadonlySetFromSelf", () => {
  it("test roundtrip consistency", () => {
    Util.assertions.testRoundtripConsistency(S.ReadonlySetFromSelf(S.Number))
  })

  it("decoding", async () => {
    const schema = S.ReadonlySetFromSelf(S.NumberFromString)
    await Util.assertions.decoding.succeed(schema, new Set(), new Set())
    await Util.assertions.decoding.succeed(schema, new Set(["1", "2", "3"]), new Set([1, 2, 3]))

    await Util.assertions.decoding.fail(
      schema,
      null,
      `Expected ReadonlySet<NumberFromString>, actual null`
    )
    await Util.assertions.decoding.fail(
      schema,
      new Set(["1", "a", "3"]),
      `ReadonlySet<NumberFromString>
└─ ReadonlyArray<NumberFromString>
   └─ [1]
      └─ NumberFromString
         └─ Transformation process failure
            └─ Unable to decode "a" into a number`
    )
  })

  it("encoding", async () => {
    const schema = S.ReadonlySetFromSelf(S.NumberFromString)
    await Util.assertions.encoding.succeed(schema, new Set(), new Set())
    await Util.assertions.encoding.succeed(schema, new Set([1, 2, 3]), new Set(["1", "2", "3"]))
  })

  it("is", () => {
    const schema = S.ReadonlySetFromSelf(S.String)
    const is = P.is(schema)
    expect(is(new Set())).toEqual(true)
    expect(is(new Set(["a", "b", "c"]))).toEqual(true)

    expect(is(new Set(["a", "b", 1]))).toEqual(false)
    expect(is(null)).toEqual(false)
    expect(is(undefined)).toEqual(false)
  })

  it("pretty", () => {
    const schema = S.ReadonlySetFromSelf(S.String)
    const pretty = Pretty.make(schema)
    expect(pretty(new Set())).toEqual("new Set([])")
    expect(pretty(new Set(["a", "b"]))).toEqual(
      `new Set(["a", "b"])`
    )
  })
})
