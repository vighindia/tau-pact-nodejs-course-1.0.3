jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000

beforeAll(() => provider.setup())

afterAll(() => provider.finalize())
