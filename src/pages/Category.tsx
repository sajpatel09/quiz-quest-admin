import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import Swal from 'sweetalert2';
import {createCategory, deleteCategory, fetchCategories, updateCategory} from "../actions/category";
import {useQuery} from "@tanstack/react-query";
import {formatDateTime} from "../lib/date";
import Pagination from "../components/Pagination";

const Category = () => {

    const [state, setState] = useState<any>({
        page: 1,
        limit: 10,
    });
    const [search, setSearch] = useState<any>('');

    const {isPending, data, refetch} = useQuery({
        queryKey: ['category-list', `search-${search}`, `page-${state.page}`, `limit-${state.limit}`],
        queryFn: () => fetchCategories({search, page: state.page, limit: state.limit}),
    })

    const [addCategoryModal, setAddCategoryModal] = useState<any>(false);

    const [params, setParams] = useState<any>({
        id: null,
        name: '',
        image: ''
    });

    const changeValue = (e: any) => {
        const {value, id} = e.target;
        setParams({...params, [id]: value});
    };

    const saveCategory = async () => {
        try {
            if (!params.name) {
                showMessage('Category Name is required.', 'error');
                return true;
            }

            if (!params.image) {
                showMessage('Category Image is required.', 'error');
                return true;
            }

            if (params.id) {
                await updateCategory({id: params.id, name: params.name, image: params.image})
            } else {
                await createCategory({name: params.name, image: params.image})
            }

            showMessage('Category has been saved successfully.');
        } catch (error) {
            showMessage('Something went wrong.', 'error');
        } finally {
            await refetch()
        }
        setAddCategoryModal(false);
    };

    const editCategory = (category: any = null) => {
        setParams({
            id: category?._id,
            name: category?.name,
            image: category?.image
        });
        setAddCategoryModal(true);
    };

    const deleteCategoryHandler = async (id: string) => {
        try {
            await deleteCategory(id)
            showMessage('Category has been deleted successfully.');
        } catch (error) {
            showMessage('Something went wrong.', 'error');
        } finally {
            await refetch();
        }
    };

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!validFormats.includes(file.type)) {
                showMessage('Invalid image format. Please upload PNG, JPG, JPEG, or WEBP.', 'error');
                return;
            }

            if (file.size > 51200) { // 50KB
                showMessage('Image size should not exceed 50KB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setParams({...params, image: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('imageInput')?.click();
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: {container: 'toast'},
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Category</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="relative">
                        <input type="text" placeholder="Search Category"
                               className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search}
                               onChange={(e) => {
                                   setSearch(e.target.value)
                                   setState({...state, page: 1})
                               }}/>
                        <button type="button"
                                className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5"
                                        opacity="0.5"></circle>
                                <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5"
                                      strokeLinecap="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editCategory()}>
                                <svg className="ltr:mr-2 rtl:ml-2" width="20" height="20" viewBox="0 0 24 24"
                                     fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                                    <path
                                        opacity="0.5"
                                        d="M18 17.5C18 19.9853 18 22 10 22C2 22 2 19.9853 2 17.5C2 15.0147 5.58172 13 10 13C14.4183 13 18 15.0147 18 17.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12" stroke="currentColor"
                                          strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 panel p-0 border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                        <tr>
                            <th>Index</th>
                            <th className={"w-1/2"}>Name</th>
                            <th>Created At</th>
                            <th className="!text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            isPending ?
                                <tr className="!text-center">
                                    <td colSpan={4} className={"!py-28 !text-center"}>
                                        <span
                                            className="animate-spin border-4 border-transparent border-l-primary rounded-full w-10 h-10 inline-block align-middle m-auto mb-10"></span>
                                    </td>
                                </tr> :
                                data?.categories?.length ?
                                    data?.categories?.map((category: any, index: number) => {
                                        return (
                                            <tr key={category._id}>
                                                <td>{
                                                    ((state.page - 1) * state.limit) + (index + 1)
                                                }
                                                </td>
                                                <td>
                                                    <div className="flex gap-4 items-center w-max">
                                                        <img
                                                            src={category.image}
                                                            alt="Preview"
                                                            className="w-8 h-8 object-cover rounded-md"/>
                                                        <div>{category.name}</div>
                                                    </div>
                                                </td>
                                                <td className={"whitespace-nowrap"}>{category.createdAt ? formatDateTime(category.createdAt) : <></>}</td>
                                                <td>
                                                    <div className="flex gap-4 items-center justify-center">
                                                        <button type="button"
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => editCategory(category)}>
                                                            Edit
                                                        </button>
                                                        <button type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => deleteCategoryHandler(category?._id)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })

                                    : <tr className="!text-center">
                                        <td colSpan={4} className={"!py-28 !text-center"}>
                                            No Data Found
                                        </td>
                                    </tr>

                        }
                        </tbody>
                    </table>
                </div>
            </div>
            {data?.total ?
                <Pagination currentPage={state.page} onPageChange={(page) => setState({...state, page})}
                            recordsPerPage={state.limit} totalRecords={data?.total || 0}/>
                : <></>}

            <Transition appear show={addCategoryModal} as={Fragment}>
                <Dialog as="div" open={addCategoryModal} onClose={() => setAddCategoryModal(false)}
                        className="relative z-[51]">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0"
                                      enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100"
                                      leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60"/>
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddCategoryModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div
                                        className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {params.id ? 'Edit Category' : 'Add Category'}
                                    </div>
                                    <div className="p-5">
                                        <div>
                                            <div className="mb-5">
                                                <label htmlFor="name">Name</label>
                                                <input id="name" type="text" placeholder="Category Name"
                                                       className="form-input" value={params.name}
                                                       onChange={(e) => changeValue(e)}/>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="image">
                                                    Image
                                                </label>
                                                <div className="flex flex-col gap-2 mt-2">
                                                    {params.image && (
                                                        <img
                                                            src={params.image}
                                                            alt="Preview"
                                                            className="ml-4 w-24 h-24 object-cover rounded-md border"
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={triggerFileInput}
                                                        className="px-4 py-2 max-w-[200px] bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                                                    >
                                                        {
                                                            params.image ? 'Change Image' : 'Upload Image'
                                                        }
                                                    </button>

                                                </div>
                                                <input
                                                    type="file"
                                                    id="imageInput"
                                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => setAddCategoryModal(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                    onClick={saveCategory}>
                                                {params.id ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Category;
