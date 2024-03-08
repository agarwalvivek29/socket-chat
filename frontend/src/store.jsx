import { atom } from 'recoil';

export const messagesAtom = atom({
    key : "messagesAtom",
    default : []
});

export const socketIdAtom = atom({
    key : 'socketIdAtom',
    default : ''
});

export const usersAtom = atom({
    key : 'usersAtom',
    default : []
})

export const userAtom = atom({
    key : 'userAtom',
    default : null
});

export const chatsAtom = atom({
    key : 'chatsAtom',
    default : []
});

export const registerAtom = atom({
    key : "registerAtom",
    default : false
});

export const currentChatAtom = atom({
    key : "currentChatAtom",
    default : null
})

export const updateChatAtom = atom({
    key : 'updateChatAtom',
    default : false
});