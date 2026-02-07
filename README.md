# TrueThat

**Describe what you want. Get code that's mathematically proven correct.**

TrueThat turns plain English into formally verified [Dafny](https://dafny.org/) programs. You describe the behavior you need, and TrueThat generates both the specification and the implementation — complete with preconditions, postconditions, and loop invariants — then verifies every assertion automatically.

No more hoping your code is correct. *Know* it is.

---

## The Problem

Testing can show the presence of bugs, but never their absence. Even with 100% code coverage, edge cases slip through. In safety-critical systems — finance, aerospace, medical devices — "probably works" isn't good enough.

Formal verification solves this: a mathematical proof that your code does exactly what it claims, for *every* possible input. But writing verified code by hand requires deep expertise in formal methods, and it's painfully slow.

## The Solution

TrueThat bridges the gap. Write what you mean in plain English:

> *"Write a binary search method that finds the index of a target value in a sorted array. Return -1 if not found."*

Get back a verified Dafny program with a machine-checked proof of correctness:

```dafny
method BinarySearch(a: array<int>, key: int) returns (index: int)
  requires forall i, j :: 0 <= i < j < a.Length ==> a[i] <= a[j]
  ensures 0 <= index < a.Length ==> a[index] == key
  ensures index == -1 ==> forall k :: 0 <= k < a.Length ==> a[k] != key
{
  var lo, hi := 0, a.Length;

  while lo < hi
    invariant 0 <= lo <= hi <= a.Length
    invariant forall k :: 0 <= k < lo ==> a[k] < key
    invariant forall k :: hi <= k < a.Length ==> a[k] > key
    decreases hi - lo
  {
    var mid := lo + (hi - lo) / 2;
    if a[mid] < key {
      lo := mid + 1;
    } else if a[mid] > key {
      hi := mid;
    } else {
      index := mid;
      return;
    }
  }
  index := -1;
}
```

Every `requires`, `ensures`, and `invariant` has been verified. The code is correct by construction.

---

## How It Works

```
  You describe         TrueThat            Dafny verifier
  the behavior   --->  generates spec  --->  proves it     ---> Verified code
  in English          + implementation       correct              you can trust
```

1. **Describe** the program you want in natural language
2. **Generate** — TrueThat produces a formal specification and a verified implementation in Dafny
3. **Verify** — every assertion is checked by the Dafny verifier. Green means proven correct.

---

## Features

- **Natural language input** — No formal methods expertise required. Describe what you want like you'd explain it to a colleague.
- **Specification + implementation** — See the formal contract separately from the code, or view the full verified program.
- **One-click verification status** — Instantly see whether all assertions pass.
- **Copy to clipboard** — Grab the generated Dafny code and drop it into your project.
- **Example prompts** — Try binary search, array reversal, max element, and more with a single click.
- **Dark mode** — Automatic system preference detection with manual toggle.
- **Syntax highlighting** — VS Code-quality rendering powered by Shiki.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/truethat.git
cd truethat

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and start generating verified code.

The app ships with a built-in mock backend so you can explore the full experience immediately — no server setup required.

---

## Connecting a Backend

TrueThat is designed so that backend integration is a one-line configuration change.

Create a `.env` file in the project root:

```env
VITE_USE_MOCK=false
VITE_API_URL=https://your-api.example.com
```

The backend should expose a single endpoint:

```
POST /api/generate
Content-Type: application/json

{
  "prompt": "Write a method that returns the max of an array"
}
```

Response:

```json
{
  "specification": "method MaxArray(...) requires ... ensures ...",
  "implementation": "method MaxArray(...) { ... }",
  "verified": true,
  "verificationMessage": "All 3 assertions verified successfully."
}
```

No frontend code changes needed. Restart the dev server and you're live.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Syntax highlighting | Shiki (via react-shiki) |
| Notifications | Sonner |
| Icons | Lucide React |
| Package manager | pnpm |

---

## Project Structure

```
src/
  components/
    layout/         Header, theme toggle
    prompt/         Text input, example chips, generate button
    output/         Tabbed code display, verification badge, loading state
    ui/             shadcn/ui primitives
  hooks/
    useGenerate.ts  API call state management
    useTheme.ts     Dark/light mode persistence
  lib/
    api.ts          Backend integration point (mock + real)
    types.ts        Request/response contracts
    examples.ts     Example prompts
```

---

## Why Dafny?

[Dafny](https://dafny.org/) is a verification-aware programming language developed at Microsoft Research. It lets you write code alongside mathematical specifications, then automatically proves your code satisfies those specifications. It's used in production at AWS (for key parts of their infrastructure) and in academic research worldwide.

TrueThat makes Dafny accessible to developers who have never written a loop invariant in their lives.

---

## License

MIT
