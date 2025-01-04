import { createRoute } from "@hono/zod-openapi";
export const contentType = {
    applicationJson: "application/json",
    multipartFormData: "multipart/form-data",
}

// Utility function to generate GET routes
const commonResponses = {
    200: {
        description: "Success",
    },
};

export const Get = (data: { path: string, query?: any, tags: string[], middleware?: any[], summary?: string }) => {
    return createRoute({
        tags: data.tags,
        method: "get",
        path: data.path,
        request: {
            query: data.query
        },
        summary: data.summary,
        middleware: data.middleware,
        responses: commonResponses
    });
};

export const Post = (data: { path: string, tags: string[], middleware?: any[], schema: any, summary?: string, type?: string }) => {
    return createRoute({
        tags: data.tags,
        method: "post",
        path: data.path,
        middleware: data.middleware,
        request: {
            body: {
                content: {
                    [data.type || contentType.applicationJson]: {
                        schema: data.schema
                    }
                }
            }
        },
        summary: data.summary,
        responses: commonResponses
    });
};


export const Patch = (data: { path: string, query?: any, tags: string[], middleware?: any[], schema: any, type?: string }) => {
    return createRoute({
        tags: data.tags,
        method: "patch",
        path: data.path,
        middleware: data.middleware,
        request: {
            query: data.query,
            body: {
                content: {
                    [data.type || contentType.applicationJson]: {
                        schema: data.schema
                    }
                }
            }
        },
        responses: commonResponses
    });
};

export const Delete = (data: { path: string, params?: any, query?: any, tags: string[], middleware: any[] }) => {
    return createRoute({
        tags: data.tags,
        method: "delete",
        path: data.path,
        request: {
            query: data.query
        },
        middleware: data.middleware,
        responses: commonResponses
    });
};