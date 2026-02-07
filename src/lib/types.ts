export interface GenerateRequest {
  prompt: string;
}

export interface GenerateResponse {
  specification: string;
  implementation: string;
  verified: boolean;
  verificationMessage?: string;
}
