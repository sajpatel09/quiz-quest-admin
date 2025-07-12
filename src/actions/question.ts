import api from "../lib/axios";

export const fetchQuestion = ({search, quiz, page, limit}: { search: string, quiz: string, page?: number, limit?: number }) => api.get("/question", {
    params: {
        search,
        quiz: quiz || undefined,
        page,
        limit
    }
}).then(({data}) => data);

export const createQuestion = (data: {
    question: string,
    quiz: string,
    options: any
}) => api.post("/question", data).then(({data}) => data);

export const updateQuestion = (data: {
    id: string,
    question: string,
    quiz: string,
    options: any
}) => api.patch(`/question/`, data).then(({data}) => data);

export const deleteQuestion = (id: string) => api.delete(`/question/${id}`).then(({data}) => data);
