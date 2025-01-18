export const handleError = (err: any): { success: boolean; message: string, data?: any } => {
    if (err.message === 'Validation error') {
        return { success: false, message: err.errors[0].message, data: null };
    } else {
        console.log(err);
        return { success: false, message: err.message, data: null };
    }
};