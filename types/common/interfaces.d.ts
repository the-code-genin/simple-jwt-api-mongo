// Declare interfaces

interface ApiResponse {
    success: boolean,
    payload?: {
        [key: string]: any
    },
    error?: {
        code: number,
        type: string,
        message: string
    }
}

interface ResponsePayload<T> {
    data?: T|T[],
    total?: number,
    per_page?: number,
    current_page?: number,
    prev_page?: number|null,
    next_page?: number|null,
    from?: number,
    to?: number,
    [key: string]: any
}