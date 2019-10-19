export interface Tweet {
    _id: string;
    text: string;
    userId: string;
    username: string;
    postDate: string;
    avatarUrl: string;
}

export interface TweetToSend extends Tweet {
    starredByMe: boolean;
    stars: number;
}

export interface TweetText {
    text: string;
}

