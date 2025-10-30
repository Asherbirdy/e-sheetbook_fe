interface Config {
  apiUrl: string
  baseUrl: string
  test: {
    email: string
    password: string
  }
}

export const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL,
  baseUrl: import.meta.env.VITE_BASE,
  test: {
    email: import.meta.env.VITE_TEST_EMAIL,
    password: import.meta.env.VITE_TEST_PASSWORD,
  },
}
