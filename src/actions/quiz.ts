import api from "../lib/axios";

export const fetchQuiz = ({search, category, page, limit}: {
    search: string,
    category: string,
    page?: number,
    limit?: number
}) => api.get("/quiz", {
    params: {
        search,
        category: category || undefined,
        page,
        limit,
    }
}).then(({data}) => data);

export const createQuiz = (data: {
    title: string,
    category: string,
    entryFee: number,
    prize: number
}) => api.post("/quiz", data).then(({data}) => data);

export const updateQuiz = (data: {
    id: string,
    title: string,
    category: string,
    entryFee: number,
    prize: number
}) => api.patch(`/quiz/`, data).then(({data}) => data);

export const deleteQuiz = (id: string) => api.delete(`/quiz/${id}`).then(({data}) => data);
