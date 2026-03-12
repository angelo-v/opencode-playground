import { tool } from "@opencode-ai/plugin"
import path from "node:path"
import fs from "node:fs"

const DEFAULT_STORE_FILE = ".opencode/store/rdflib.nq"

export const fetch = tool({
  description:
    "Fetch RDF data from a URI and load it into the local rdflib store (persisted as N-Quads on disk). " +
    "The store accumulates data across calls within a session. " +
    "Returns a summary of triples loaded and the total store size.",
  args: {
    uri: tool.schema
      .string()
      .describe("The URI of the RDF resource to fetch (http/https/file)"),
    store_path: tool.schema
      .string()
      .optional()
      .describe(
        `Path to the N-Quads store file, relative to the project worktree. Defaults to ${DEFAULT_STORE_FILE}`
      ),
  },
  async execute(args, context) {
    const { graph, fetcher, serialize, parse } = await import("rdflib")

    const storePath = path.join(
      context.worktree,
      args.store_path ?? DEFAULT_STORE_FILE
    )

    // Ensure the store directory exists
    fs.mkdirSync(path.dirname(storePath), { recursive: true })

    // Create a new in-memory store and load existing on-disk data into it
    const store = graph()

    if (fs.existsSync(storePath)) {
      const existing = fs.readFileSync(storePath, "utf-8")
      if (existing.trim().length > 0) {
        await new Promise<void>((resolve, reject) => {
          parse(existing, store, storePath, "application/n-quads", (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
      }
    }

    const triplesBefore = store.length

    // Fetch the URI into the store
    const f = fetcher(store, {})
    try {
      await f.load(args.uri)
    } catch (err) {
      throw new Error(
        `Failed to fetch <${args.uri}>: ${err instanceof Error ? err.message : String(err)}`
      )
    }

    const triplesAfter = store.length
    const newTriples = Math.max(0, triplesAfter - triplesBefore)

    // Serialize the updated store back to disk as N-Quads (fastest format)
    const nquads: string = await new Promise((resolve, reject) => {
      serialize(null, store, undefined, "application/n-quads", (err, result) => {
        if (err) reject(err)
        else if (result == null) reject(new Error("serialize returned no output"))
        else resolve(result)
      })
    })

    fs.writeFileSync(storePath, nquads, "utf-8")

    return [
      `Fetched: ${args.uri}`,
      `New triples loaded: ${newTriples}`,
      `Total triples in store: ${triplesAfter}`,
      `Store written to: ${storePath}`,
    ].join("\n")
  },
})

export const match = tool({
  description:
    "Match statements in the local rdflib store using a triple pattern. " +
    "Omit any of subject, predicate, objectUri, objectLiteral, or graph to use it as a wildcard. " +
    "Returns matching statements as an array of {subject, predicate, object, graph} objects.",
  args: {
    subject: tool.schema
      .string()
      .optional()
      .describe("Subject URI to match, or omit for wildcard"),
    predicate: tool.schema
      .string()
      .optional()
      .describe("Predicate URI to match, or omit for wildcard"),
    objectUri: tool.schema
      .string()
      .optional()
      .describe("Object as a URI to match, or omit for wildcard. Use objectLiteral for literal values."),
    objectLiteral: tool.schema
      .string()
      .optional()
      .describe("Object as a plain string literal to match, or omit for wildcard. Use objectUri for URIs."),
    graph: tool.schema
      .string()
      .optional()
      .describe("Graph URI to match, or omit for wildcard"),
    limit: tool.schema
      .number()
      .optional()
      .default(20)
      .describe("Maximum number of results to return. Defaults to 20."),
    store_path: tool.schema
      .string()
      .optional()
      .describe(
        `Path to the N-Quads store file, relative to the project worktree. Defaults to ${DEFAULT_STORE_FILE}`
      ),
  },
  async execute(args, context) {
    const { graph, parse, sym, lit } = await import("rdflib")

    const storePath = path.join(
      context.worktree,
      args.store_path ?? DEFAULT_STORE_FILE
    )

    if (!fs.existsSync(storePath)) {
      return "Store file not found. Use rdflib_fetch to load data first."
    }

    const store = graph()
    const data = fs.readFileSync(storePath, "utf-8")

    await new Promise<void>((resolve, reject) => {
      parse(data, store, storePath, "application/n-quads", (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    const toUri = (val: string | undefined) => val ? sym(val) : null
    const objectNode = args.objectUri
      ? sym(args.objectUri)
      : args.objectLiteral !== undefined
        ? lit(args.objectLiteral)
        : null

    const statements = store.statementsMatching(
      toUri(args.subject),
      toUri(args.predicate),
      objectNode,
      toUri(args.graph),
      false // justOne=false: return all matches
    )

    const limit = args.limit ?? 20
    const results = statements.slice(0, limit).map((st) => ({
      subject: st.subject.value,
      predicate: st.predicate.value,
      object: st.object.value,
      graph: st.graph.value,
    }))

    return JSON.stringify(
      {
        total: statements.length,
        returned: results.length,
        statements: results,
      },
      null,
      2
    )
  },
})
