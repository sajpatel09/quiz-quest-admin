import api from "../lib/axios";

export const fetchCategories = ({search, page, limit}: {
    search: string,
    page?: number,
    limit?: number
}) => api.get("/category", {
    params: {
        search,
        page: page || undefined,
        limit: limit || undefined
    }
}).then(({data}) => data);

export const createCategory = ({name, image}: {
    name: string,
    image: string
}) => api.post("/category", {name, image}).then(({data}) => data);

export const updateCategory = ({id, name, image}: {
    id: string,
    name: string,
    image: string
}) => api.patch(`/category/`, {id, name, image}).then(({data}) => data);

export const deleteCategory = (id: string) => api.delete(`/category/${id}`).then(({data}) => data);
