import type { GenerateRequest, GenerateResponse } from "./types";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const mockResponses: Record<string, GenerateResponse> = {
  default: {
    specification: `method MaxArray(a: array<int>) returns (max: int)
  requires a.Length > 0
  ensures forall k :: 0 <= k < a.Length ==> max >= a[k]
  ensures exists k :: 0 <= k < a.Length && max == a[k]`,
    implementation: `method MaxArray(a: array<int>) returns (max: int)
  requires a.Length > 0
  ensures forall k :: 0 <= k < a.Length ==> max >= a[k]
  ensures exists k :: 0 <= k < a.Length && max == a[k]
{
  max := a[0];
  var i := 1;
  while i < a.Length
    invariant 1 <= i <= a.Length
    invariant forall k :: 0 <= k < i ==> max >= a[k]
    invariant exists k :: 0 <= k < i && max == a[k]
  {
    if a[i] > max {
      max := a[i];
    }
    i := i + 1;
  }
}`,
    verified: true,
    verificationMessage: "All 3 assertions verified successfully.",
  },
  binary: {
    specification: `method BinarySearch(a: array<int>, key: int) returns (index: int)
  requires forall i:nat, j:nat :: 0 <= i < j < a.Length ==> a[i] <= a[j]
  ensures 0 <= index < a.Length ==> a[index] == key
  ensures index == -1 ==> forall k :: 0 <= k < a.Length ==> a[k] != key`,
    implementation: `method BinarySearch(a: array<int>, key: int) returns (index: int)
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
}`,
    verified: true,
    verificationMessage: "All 5 assertions verified successfully.",
  },
  reverse: {
    specification: `method Reverse(a: array<int>)
  modifies a
  ensures forall k :: 0 <= k < a.Length ==> a[k] == old(a[a.Length - 1 - k])`,
    implementation: `method Reverse(a: array<int>)
  modifies a
  ensures forall k :: 0 <= k < a.Length ==> a[k] == old(a[a.Length - 1 - k])
{
  var i := 0;
  var j := a.Length - 1;
  while i < j
    invariant 0 <= i <= j + 1 <= a.Length
    invariant forall k :: 0 <= k < i ==> a[k] == old(a[a.Length - 1 - k])
    invariant forall k :: j < k < a.Length ==> a[k] == old(a[a.Length - 1 - k])
    invariant forall k :: i <= k <= j ==> a[k] == old(a[k])
  {
    a[i], a[j] := a[j], a[i];
    i := i + 1;
    j := j - 1;
  }
}`,
    verified: true,
    verificationMessage: "All 4 assertions verified successfully.",
  },
  sum: {
    specification: `function SumSeq(s: seq<int>): int
{
  if |s| == 0 then 0
  else s[0] + SumSeq(s[1..])
}

method SumArray(a: array<int>) returns (sum: int)
  ensures sum == SumSeq(a[..])`,
    implementation: `function SumSeq(s: seq<int>): int
{
  if |s| == 0 then 0
  else s[0] + SumSeq(s[1..])
}

method SumArray(a: array<int>) returns (sum: int)
  ensures sum == SumSeq(a[..])
{
  sum := 0;
  var i := 0;
  while i < a.Length
    invariant 0 <= i <= a.Length
    invariant sum == SumSeq(a[..i])
  {
    sum := sum + a[i];
    i := i + 1;
  }
}`,
    verified: true,
    verificationMessage: "All 2 assertions verified successfully.",
  },
  sorted: {
    specification: `predicate IsSorted(a: array<int>)
  reads a
{
  forall i, j :: 0 <= i < j < a.Length ==> a[i] <= a[j]
}

method CheckSorted(a: array<int>) returns (result: bool)
  ensures result == IsSorted(a)`,
    implementation: `predicate IsSorted(a: array<int>)
  reads a
{
  forall i, j :: 0 <= i < j < a.Length ==> a[i] <= a[j]
}

method CheckSorted(a: array<int>) returns (result: bool)
  ensures result == IsSorted(a)
{
  if a.Length <= 1 {
    result := true;
    return;
  }
  var i := 0;
  while i < a.Length - 1
    invariant 0 <= i <= a.Length - 1
    invariant forall k, l :: 0 <= k < l <= i ==> a[k] <= a[l]
  {
    if a[i] > a[i + 1] {
      result := false;
      return;
    }
    i := i + 1;
  }
  result := true;
}`,
    verified: true,
    verificationMessage: "All 3 assertions verified successfully.",
  },
};

function getMockResponse(prompt: string): GenerateResponse {
  const lower = prompt.toLowerCase();
  if (lower.includes("binary") || lower.includes("search")) return mockResponses.binary;
  if (lower.includes("reverse")) return mockResponses.reverse;
  if (lower.includes("sum")) return mockResponses.sum;
  if (lower.includes("sorted") || lower.includes("sort")) return mockResponses.sorted;
  return mockResponses.default;
}

async function mockGenerate(request: GenerateRequest): Promise<GenerateResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return getMockResponse(request.prompt);
}

async function realGenerate(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function generate(request: GenerateRequest): Promise<GenerateResponse> {
  return USE_MOCK ? mockGenerate(request) : realGenerate(request);
}
