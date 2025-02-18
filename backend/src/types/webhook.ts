export interface WebhookHeaders {
  host: string;
  'cdn-loop': string;
  'cf-ipcountry': string;
  'accept-encoding': string;
  'x-forwarded-for': string;
  'cf-ray': string;
  'content-length': string;
  'x-forwarded-proto': string;
  'cf-visitor': {
    scheme: string;
  };
  'content-type': string;
  'user-agent': string;
  'x-bubble-depth': string;
  traceparent: string;
  baggage: string;
  'cf-connecting-ip': string;
  'x-envoy-external-address': string;
  'x-request-id': string;
  'x-envoy-attempt-count': string;
  'x-forwarded-client-cert': string;
  'x-b3-traceid': string;
  'x-b3-spanid': string;
  'x-b3-parentspanid': string;
  'x-b3-sampled': string;
}

export interface CallWebhookPayload {
  call_id: string;
  contact_id: string;
  disconnection_reason: string;
  user_sentiment: 'Positive' | 'Negative' | 'Neutral';
  call_summary: string;
  call_completion: string;
  call_completion_reason: string;
  assistant_task_completion: string;
  recording_url: string;
  call_time_ms: string;
  full_transcript: string;
  headers: WebhookHeaders;
}

export interface CallMetrics {
  totalCalls: number;
  answeredCalls: number;
  noAnswers: number;
  didNotConnect: number;
  transfers: number;
  appointments: number;
  totalMinutes: number;
  cost: number;
} 