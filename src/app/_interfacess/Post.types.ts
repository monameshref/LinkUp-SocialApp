
export type PostType = {
    message: string;
    _id: string;
    body: string;
    image: string;
    user: UserType;
    createdAt: string;
    comments: CommentType[];
    id: string;
};

export type UserType = {
    _id: string;
    name: string;
    email: string;
    photo: string;
    dateOfBirth: string;
    gender: string;
};

export type CommentType = {
    _id: string;
    content: string;
    commentCreator: UserType
    post: string;
    createdAt: string;
};