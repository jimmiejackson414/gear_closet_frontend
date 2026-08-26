import { vi } from 'vitest';

export type QueryResult<T = unknown> = {
  data: T;
  error: { message?: string; code?: string } | null;
};

/**
 * Chainable thenable that mimics a Supabase query builder ending in await.
 */
export function createThenableQuery<T = unknown> (
  result: QueryResult<T> | (() => QueryResult<T> | Promise<QueryResult<T>>),
) {
  const resolveResult = () =>
    typeof result === 'function' ? Promise.resolve(result()) : Promise.resolve(result);

  const api: Record<string, unknown> = {};
  const chain = () => api;

  for (const method of [
    'select',
    'insert',
    'update',
    'upsert',
    'delete',
    'eq',
    'neq',
    'order',
    'limit',
    'range',
    'single',
    'maybeSingle',
    'match',
    'in',
    'is',
    'filter',
    'or',
    'not',
    'ilike',
    'gte',
    'lte',
    'gt',
    'lt',
  ]) {
    api[method] = vi.fn(chain);
  }

  api.then = (
    onFulfilled?: ((value: QueryResult<T>) => unknown) | null,
    onRejected?: ((reason: unknown) => unknown) | null,
  ) => resolveResult()
    .then(onFulfilled as any, onRejected as any);

  return api;
}

export type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

export function createDeferred<T = QueryResult> (): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, reject, resolve };
}

type FromHandler = (table: string) => ReturnType<typeof createThenableQuery> | Record<string, unknown>;
type RpcHandler = (
  fn: string,
  args?: Record<string, unknown>,
) => Promise<QueryResult> | QueryResult | ReturnType<typeof createThenableQuery>;

export type SupabaseMockOptions = {
  from?: FromHandler;
  rpc?: RpcHandler;
  /** Default result when `from` is not provided. */
  defaultFromResult?: QueryResult;
};

/**
 * Minimal Supabase client mock for Pinia store unit tests.
 */
export function createSupabaseMock (options: SupabaseMockOptions = {}) {
  const channels: Array<{
    on: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
    unsubscribe: ReturnType<typeof vi.fn>;
  }> = [];

  const removeChannel = vi.fn(async () => 'ok');

  const client = {
    _channels: channels,
    channel: vi.fn((_name: string) => {
      const channel = {
        on: vi.fn()
          .mockReturnThis(),
        subscribe: vi.fn()
          .mockReturnThis(),
        unsubscribe: vi.fn(),
      };
      channels.push(channel);
      return channel;
    }),
    from: vi.fn((table: string) => {
      if (options.from) return options.from(table);
      return createThenableQuery(options.defaultFromResult ?? { data: null, error: null });
    }),
    removeChannel,
    rpc: vi.fn((fn: string, args?: Record<string, unknown>) => {
      if (options.rpc) {
        const result = options.rpc(fn, args);
        return result;
      }
      return Promise.resolve({ data: null, error: null });
    }),
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: (url: string, _options?: unknown) => ({ data: { publicUrl: url } }),
        list: vi.fn()
          .mockResolvedValue({ data: [], error: null }),
        remove: vi.fn()
          .mockResolvedValue({ data: [], error: null }),
        upload: vi.fn()
          .mockResolvedValue({ data: { path: 'x' }, error: null }),
      })),
    },
  };

  return client;
}
