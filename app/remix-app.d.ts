
declare global {
    interface Window {
        ENV: {
            SUPABASE_URL: string,
            SUPABASE_KEY: string

        },
    }
}

export {}
