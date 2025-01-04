export const handleError = (err: any): { success: boolean; message: string } => {
    if (err.message === 'Validation error') {
        return { success: false, message: err.errors[0].message };
    } else {
        console.log(err);
        return { success: false, message: err.message };
    }
};