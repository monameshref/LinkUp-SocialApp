export type FormValuesLoginType = {
    email: string;
    password: string;
};

export type LoginResponseType = {
    token: string;
    message: string;
}

export type FormValuesChangePasswordType = {
        password: string,
        newPassword: string
};